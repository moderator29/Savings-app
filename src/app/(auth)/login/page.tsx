"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useVerith } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const user = useVerith((s) => s.user);
  const hydrated = useVerith((s) => s.hydrated);
  const signUp = useVerith((s) => s.signUp);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace("/dashboard");
  }, [hydrated, user, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    // Demo auth: signing in provisions a fresh local demo account for this email.
    const nameGuess = email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    signUp(nameGuess || "Verith Member", email.trim().toLowerCase());
    router.replace("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass w-full max-w-md rounded-4xl p-8 shadow-float-lg sm:p-10"
      >
        <Logo className="mb-8" />
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Sign in to your Verith account.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" size="lg" className="w-full">
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          New to Verith?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
