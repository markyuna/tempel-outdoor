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

function validateCustomer(customer: CustomerPayload) {
  return Boolean(
    customer?.firstName &&
      customer?.lastName &&
      customer?.email &&
      customer?.phone
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
      .filter((item) => item.name && item.slug)
      .map((item) => {
        const unitPrice = normalizePrice(item.price);
        const quantity = normalizeQuantity(item.quantity);

        return {
          ...item,
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

    const subtotal = validItems.reduce((total, item) => {
      return total + item.total;
    }, 0);

    const deliveryPrice = 0;
    const total = subtotal + deliveryPrice;

    const customer = payload.customer;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_first_name: customer.firstName,
        customer_last_name: customer.lastName,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address || null,
        customer_postal_code: customer.postalCode || null,
        customer_city: customer.city || null,
        customer_country: customer.country || "France",
        customer_message: customer.message || null,
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
      const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
        {
          user_id: user.id,
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address || null,
          postal_code: customer.postalCode || null,
          city: customer.city || null,
          country: customer.country || "France",
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