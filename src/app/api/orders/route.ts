// src/app/api/orders/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  imageUrl?: string | null;
  quantity: number;
  options?: Record<string, string | number | boolean | null>;
};

type CustomerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  billingAddress?: string;
  billingPostalCode?: string;
  billingCity?: string;
  billingCountry?: string;

  shippingSameAsBilling?: boolean;
  shippingAddress?: string;
  shippingPostalCode?: string;
  shippingCity?: string;
  shippingCountry?: string;

  // Compatibilité avec l’ancien checkout
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;

  message?: string;
};

type OrderPayload = {
  customer: CustomerPayload;
  items: CartItem[];
};

function normalizeString(value?: string | null) {
  return value?.trim() || "";
}

function normalizeNullableString(value?: string | null) {
  const normalizedValue = normalizeString(value);

  return normalizedValue || null;
}

function normalizeEmail(value?: string | null) {
  return normalizeString(value).toLowerCase();
}

function validateCustomer(customer: CustomerPayload) {
  return Boolean(
    normalizeString(customer?.firstName) &&
      normalizeString(customer?.lastName) &&
      normalizeEmail(customer?.email) &&
      normalizeString(customer?.phone)
  );
}

function normalizePrice(value: number) {
  const price = Number(value);

  if (Number.isNaN(price) || price < 0) {
    return 0;
  }

  return price;
}

function normalizeQuantity(value: number) {
  const quantity = Number(value);

  if (Number.isNaN(quantity) || quantity < 1) {
    return 1;
  }

  return Math.floor(quantity);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;

    if (!payload.customer || !Array.isArray(payload.items)) {
      return NextResponse.json(
        { error: "Données de commande invalides." },
        { status: 400 }
      );
    }

    if (!validateCustomer(payload.customer)) {
      return NextResponse.json(
        { error: "Merci de compléter vos informations client." },
        { status: 400 }
      );
    }

    if (!payload.items.length) {
      return NextResponse.json(
        { error: "Votre panier est vide." },
        { status: 400 }
      );
    }

    const validItems = payload.items
      .filter((item) => {
        return normalizeString(item.name) && normalizeString(item.slug);
      })
      .map((item) => {
        const unitPrice = normalizePrice(item.price);
        const quantity = normalizeQuantity(item.quantity);

        return {
          ...item,
          name: normalizeString(item.name),
          slug: normalizeString(item.slug),
          price: unitPrice,
          quantity,
          total: unitPrice * quantity,
        };
      });

    if (!validItems.length) {
      return NextResponse.json(
        { error: "Aucun produit valide dans le panier." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const billingAddress = normalizeNullableString(
      payload.customer.billingAddress ?? payload.customer.address
    );

    const billingPostalCode = normalizeNullableString(
      payload.customer.billingPostalCode ?? payload.customer.postalCode
    );

    const billingCity = normalizeNullableString(
      payload.customer.billingCity ?? payload.customer.city
    );

    const billingCountry =
      normalizeString(
        payload.customer.billingCountry ?? payload.customer.country
      ) || "France";

    const shippingSameAsBilling =
      payload.customer.shippingSameAsBilling !== false;

    const shippingAddress = shippingSameAsBilling
      ? billingAddress
      : normalizeNullableString(payload.customer.shippingAddress);

    const shippingPostalCode = shippingSameAsBilling
      ? billingPostalCode
      : normalizeNullableString(payload.customer.shippingPostalCode);

    const shippingCity = shippingSameAsBilling
      ? billingCity
      : normalizeNullableString(payload.customer.shippingCity);

    const shippingCountry = shippingSameAsBilling
      ? billingCountry
      : normalizeString(payload.customer.shippingCountry) || "France";

    const customer = {
      firstName: normalizeString(payload.customer.firstName),
      lastName: normalizeString(payload.customer.lastName),
      email: normalizeEmail(payload.customer.email),
      phone: normalizeString(payload.customer.phone),

      billingAddress,
      billingPostalCode,
      billingCity,
      billingCountry,

      shippingSameAsBilling,
      shippingAddress,
      shippingPostalCode,
      shippingCity,
      shippingCountry,

      message: normalizeNullableString(payload.customer.message),
    };

    const subtotal = validItems.reduce((total, item) => {
      return total + item.total;
    }, 0);

    const deliveryPrice = 0;
    const total = subtotal + deliveryPrice;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,

        customer_first_name: customer.firstName,
        customer_last_name: customer.lastName,
        customer_email: customer.email,
        customer_phone: customer.phone,

        // Champs historiques utilisés par l’admin actuel
        customer_address: customer.billingAddress,
        customer_postal_code: customer.billingPostalCode,
        customer_city: customer.billingCity,
        customer_country: customer.billingCountry,

        // Nouveaux champs facturation
        billing_address: customer.billingAddress,
        billing_postal_code: customer.billingPostalCode,
        billing_city: customer.billingCity,
        billing_country: customer.billingCountry,

        // Nouveaux champs livraison
        shipping_same_as_billing: customer.shippingSameAsBilling,
        shipping_address: customer.shippingAddress,
        shipping_postal_code: customer.shippingPostalCode,
        shipping_city: customer.shippingCity,
        shipping_country: customer.shippingCountry,

        customer_message: customer.message,

        subtotal,
        delivery_price: deliveryPrice,
        total,
        status: "new",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Erreur création commande:", orderError);

      return NextResponse.json(
        { error: "Impossible de créer la commande." },
        { status: 500 }
      );
    }

    const orderItems = validItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId || item.id || null,
      product_name: item.name,
      product_slug: item.slug,
      product_image: item.image || item.imageUrl || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.total,
      options: item.options || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Erreur création lignes commande:", itemsError);

      await supabaseAdmin.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        { error: "Impossible d'ajouter les produits à la commande." },
        { status: 500 }
      );
    }

    if (user?.id) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            user_id: user.id,
            first_name: customer.firstName,
            last_name: customer.lastName,
            email: customer.email || user.email || null,
            phone: customer.phone,
            address: customer.billingAddress,
            postal_code: customer.billingPostalCode,
            city: customer.billingCity,
            country: customer.billingCountry,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (profileError) {
        console.error("Erreur sauvegarde profil client:", profileError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Erreur API orders:", error);

    return NextResponse.json(
      { error: "Erreur serveur lors de la commande." },
      { status: 500 }
    );
  }
}