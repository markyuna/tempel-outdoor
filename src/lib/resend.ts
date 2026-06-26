// src/lib/resend.ts

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Until the domain is verified, Resend only allows sending to the address
// registered in your Resend account. Change both values once tempel-outdoor.fr
// is verified in the Resend dashboard.
const FROM = "Tempel Outdoor <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "";

export type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  options?: Record<string, string | number | boolean | null> | null;
};

export type OrderNotificationData = {
  orderId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  billingAddress?: string | null;
  billingCity?: string | null;
  billingPostalCode?: string | null;
  billingCountry?: string | null;
  message?: string | null;
  subtotal: number;
  total: number;
};

export async function sendOrderNotification(
  data: OrderNotificationData
): Promise<void> {
  if (!ADMIN_EMAIL) {
    console.warn("ADMIN_NOTIFICATION_EMAIL not set — skipping order email");
    return;
  }

  const ref = data.orderId.slice(0, 8).toUpperCase();
  const fullName = `${data.customer.firstName} ${data.customer.lastName}`;

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(n);

  const itemsHtml = data.items
    .map((item) => {
      const optionsText =
        item.options && Object.keys(item.options).length > 0
          ? Object.entries(item.options)
              .map(([k, v]) => `${k} : ${v}`)
              .join(", ")
          : null;

      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;">
          <p style="margin:0;font-size:14px;font-weight:600;color:#181512;">${item.name}</p>
          ${optionsText ? `<p style="margin:4px 0 0;font-size:12px;color:#8a8178;">${optionsText}</p>` : ""}
          <p style="margin:4px 0 0;font-size:12px;color:#8a8178;">Qté : ${item.quantity} × ${formatPrice(item.unitPrice)}</p>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;text-align:right;vertical-align:top;">
          <p style="margin:0;font-size:14px;font-weight:700;color:#181512;">${formatPrice(item.total)}</p>
        </td>
      </tr>`;
    })
    .join("");

  const addressLines = [
    data.billingAddress,
    [data.billingPostalCode, data.billingCity].filter(Boolean).join(" "),
    data.billingCountry,
  ]
    .filter(Boolean)
    .join("<br/>");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f7f4ee;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ee;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6ded1;">

        <!-- Header -->
        <tr>
          <td style="background:#181512;padding:32px 40px;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:#d7b86e;">
              Tempel Outdoor
            </p>
            <h1 style="margin:12px 0 0;font-size:22px;font-weight:600;color:#fff;">
              Nouvelle commande
            </h1>
            <p style="margin:8px 0 0;font-size:13px;color:#d7b86e;">Réf. ${ref}</p>
          </td>
        </tr>

        <!-- Customer -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Client</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f0ebe4;">
                  <p style="margin:0;font-size:15px;font-weight:600;color:#181512;">${fullName}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid #f0ebe4;">
                  <a href="mailto:${data.customer.email}" style="font-size:14px;color:#b87932;text-decoration:none;">${data.customer.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;${addressLines ? "border-bottom:1px solid #f0ebe4;" : ""}">
                  <a href="tel:${data.customer.phone}" style="font-size:14px;color:#b87932;text-decoration:none;">${data.customer.phone}</a>
                </td>
              </tr>
              ${
                addressLines
                  ? `<tr>
                <td style="padding:8px 0;">
                  <p style="margin:0;font-size:13px;color:#5f5a54;line-height:1.6;">${addressLines}</p>
                </td>
              </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:28px 40px 0;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Produits commandés</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemsHtml}
            </table>
          </td>
        </tr>

        <!-- Total -->
        <tr>
          <td style="padding:20px 40px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-top:2px solid #181512;">
                  <p style="margin:0;font-size:16px;font-weight:700;color:#181512;">Total estimé</p>
                </td>
                <td style="padding:12px 0;border-top:2px solid #181512;text-align:right;">
                  <p style="margin:0;font-size:18px;font-weight:700;color:#181512;">${formatPrice(data.total)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${
          data.message
            ? `<!-- Message -->
        <tr>
          <td style="padding:0 40px 28px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Message du client</p>
            <p style="margin:0;font-size:14px;color:#181512;line-height:1.7;white-space:pre-wrap;background:#f7f4ee;border-radius:12px;padding:16px;">${data.message}</p>
          </td>
        </tr>`
            : ""
        }

        <!-- Footer -->
        <tr>
          <td style="background:#f7f4ee;padding:20px 40px;border-top:1px solid #e6ded1;">
            <p style="margin:0;font-size:12px;color:#8a8178;">
              Réf. commande : <code style="font-size:11px;color:#5f5a54;">${data.orderId}</code>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `Nouvelle commande ${ref} — ${fullName} (${formatPrice(data.total)})`,
    html,
  });

  if (error) {
    console.error("Resend order email error:", error);
  }
}

export type ContactNotificationData = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  source: string;
  requestId: string;
};

export async function sendContactNotification(
  data: ContactNotificationData
): Promise<void> {
  if (!ADMIN_EMAIL) {
    console.warn("ADMIN_NOTIFICATION_EMAIL not set — skipping email");
    return;
  }

  const sourceLabel =
    data.source === "chatbot" ? "Assistant chatbot" : "Page Contact";

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f7f4ee;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ee;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6ded1;">

        <!-- Header -->
        <tr>
          <td style="background:#181512;padding:32px 40px;">
            <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:#d7b86e;">
              Tempel Outdoor
            </p>
            <h1 style="margin:12px 0 0;font-size:22px;font-weight:600;color:#fff;">
              Nouvelle demande de contact
            </h1>
          </td>
        </tr>

        <!-- Source badge -->
        <tr>
          <td style="padding:24px 40px 0;">
            <span style="display:inline-block;background:#f7f4ee;border:1px solid #e6ded1;border-radius:999px;padding:4px 14px;font-size:12px;font-weight:600;color:#b87932;">
              Via ${sourceLabel}
            </span>
          </td>
        </tr>

        <!-- Fields -->
        <tr>
          <td style="padding:24px 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0ebe4;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Nom</p>
                  <p style="margin:0;font-size:15px;color:#181512;font-weight:600;">${data.name}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0ebe4;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Email</p>
                  <p style="margin:0;font-size:15px;color:#181512;">
                    <a href="mailto:${data.email}" style="color:#b87932;text-decoration:none;">${data.email}</a>
                  </p>
                </td>
              </tr>
              ${
                data.phone
                  ? `<tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0ebe4;">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Téléphone</p>
                  <p style="margin:0;font-size:15px;color:#181512;">
                    <a href="tel:${data.phone}" style="color:#b87932;text-decoration:none;">${data.phone}</a>
                  </p>
                </td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding:12px 0;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#8a8178;">Message</p>
                  <p style="margin:0;font-size:15px;color:#181512;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f7f4ee;padding:20px 40px;border-top:1px solid #e6ded1;">
            <p style="margin:0;font-size:12px;color:#8a8178;">
              Réf. demande : <code style="font-size:11px;color:#5f5a54;">${data.requestId}</code>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: [ADMIN_EMAIL],
    subject: `Nouvelle demande — ${data.name} (${sourceLabel})`,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
  }
}
