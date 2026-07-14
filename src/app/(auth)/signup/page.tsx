"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useEcokripto } from "@/lib/store";

export default function SignUpPage() {
  const router = useRouter();
  const user = useEcokripto((s) => s.user);
  const hydrated = useEcokripto((s) => s.hydrated);
  const signUp = useEcokripto((s) => s.signUp);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace("/dashboard");
  }, [hydrated, user, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    signUp(name.trim(), email.trim().toLowerCase());
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
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Start your savings journey in seconds — no paperwork, no waiting.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Morgan"
              autoComplete="name"
            />
          </Field>
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
              autoComplete="new-password"
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
            <Sparkles className="h-4 w-4" />
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
