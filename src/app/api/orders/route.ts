// src/app/api/orders/route.ts

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
  options?: Record<string, string>;
};

type OrderPayload = {
  customer: {
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
  items: CartItem[];
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;

    if (!payload.customer || !payload.items?.length) {
      return NextResponse.json(
        { error: "Données de commande invalides." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const subtotal = payload.items.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);

    const deliveryPrice = 0;
    const total = subtotal + deliveryPrice;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_first_name: payload.customer.firstName,
        customer_last_name: payload.customer.lastName,
        customer_email: payload.customer.email,
        customer_phone: payload.customer.phone,
        customer_address: payload.customer.address || null,
        customer_postal_code: payload.customer.postalCode || null,
        customer_city: payload.customer.city || null,
        customer_country: payload.customer.country || "France",
        customer_message: payload.customer.message || null,
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

    const orderItems = payload.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId || null,
      product_name: item.name,
      product_slug: item.slug,
      product_image: item.image || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      options: item.options || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Erreur création lignes commande:", itemsError);

      return NextResponse.json(
        { error: "Commande créée, mais erreur sur les produits." },
        { status: 500 }
      );
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