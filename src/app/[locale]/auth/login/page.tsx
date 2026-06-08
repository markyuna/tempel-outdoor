import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-20">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-4xl font-semibold">
          Connexion
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}