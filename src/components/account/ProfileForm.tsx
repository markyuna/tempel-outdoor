// src/components/account/ProfileForm.tsx

"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";

type Profile = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
} | null;

type ActionState = {
  success: boolean;
  message: string;
};

type Props = {
  profile: Profile;
  userEmail: string;
  updateProfile: (
    previousState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
};

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function ProfileForm({
  profile,
  userEmail,
  updateProfile,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form action={formAction} className="mt-10 space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Prénom"
          name="firstName"
          defaultValue={profile?.first_name ?? ""}
          required
          autoComplete="given-name"
        />

        <Field
          label="Nom"
          name="lastName"
          defaultValue={profile?.last_name ?? ""}
          required
          autoComplete="family-name"
        />

        <Field
          label="Email"
          name="email"
          type="email"
          defaultValue={profile?.email ?? userEmail}
          required
          autoComplete="email"
        />

        <Field
          label="Téléphone"
          name="phone"
          type="tel"
          defaultValue={profile?.phone ?? ""}
          required
          autoComplete="tel"
        />

        <div className="md:col-span-2">
          <Field
            label="Adresse"
            name="address"
            defaultValue={profile?.address ?? ""}
            autoComplete="street-address"
          />
        </div>

        <Field
          label="Code postal"
          name="postalCode"
          defaultValue={profile?.postal_code ?? ""}
          autoComplete="postal-code"
        />

        <Field
          label="Ville"
          name="city"
          defaultValue={profile?.city ?? ""}
          autoComplete="address-level2"
        />

        <div className="md:col-span-2">
          <Field
            label="Pays"
            name="country"
            defaultValue={profile?.country ?? "France"}
            autoComplete="country-name"
          />
        </div>
      </div>

      {state.message ? (
        <div
          className={`rounded-2xl px-5 py-4 text-sm font-medium ${
            state.success
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {state.success ? <CheckCircle2 className="h-4 w-4" /> : null}
            <span>{state.message}</span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-neutral-500">
          Vos informations restent liées uniquement à votre compte client.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#2b241f] disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#181512]">
        {label}
        {required ? " *" : ""}
      </span>

      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-[#f7f4ee] px-4 py-4 outline-none transition focus:border-black"
      />
    </label>
  );
}