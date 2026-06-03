import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">
        Nouveau produit
      </h1>

      <div className="mt-10">
        <ProductForm />
      </div>
    </div>
  );
}