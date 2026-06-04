"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-border bg-bg-secondary p-6">
        <h1 className="text-2xl font-bold text-text-primary">Admin Login</h1>
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-border bg-bg-primary px-3 py-2"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent-light"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
