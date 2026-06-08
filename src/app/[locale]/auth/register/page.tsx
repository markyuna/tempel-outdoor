import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-4xl font-semibold">
          Créer un compte
        </h1>

        <RegisterForm />
      </div>
    </main>
  );
}