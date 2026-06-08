"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  orderId: string;
  currentStatus: string;
};

const STATUS_OPTIONS = [
  {
    value: "new",
    label: "Nouvelle",
  },
  {
    value: "contacted",
    label: "Contacté",
  },
  {
    value: "quoted",
    label: "Devis envoyé",
  },
  {
    value: "paid",
    label: "Payée",
  },
  {
    value: "delivered",
    label: "Livrée",
  },
  {
    value: "cancelled",
    label: "Annulée",
  },
];

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const nextStatus = event.target.value;

    setStatus(nextStatus);
    setError(null);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le statut.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);

      setStatus(currentStatus);
      setError("Erreur lors de la mise à jour.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="order-status"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500"
      >
        Statut
      </label>

      <select
        id="order-status"
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className="min-w-[220px] rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#181512] outline-none transition focus:border-[#9c7b4f]"
      >
        {STATUS_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : null}

      {isPending ? (
        <p className="text-xs text-neutral-500">
          Mise à jour...
        </p>
      ) : null}
    </div>
  );
}