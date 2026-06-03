"use client";

export default function ProductForm() {
  return (
    <form className="rounded-3xl border bg-white p-8">
      <div className="grid gap-6">
        <input
          placeholder="Nom du produit"
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Prix"
          className="rounded-xl border p-3"
        />

        <textarea
          placeholder="Description"
          rows={6}
          className="rounded-xl border p-3"
        />

        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 text-white"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}