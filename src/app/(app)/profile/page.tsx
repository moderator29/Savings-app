"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, LogOut, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { useVerith } from "@/lib/store";
import { formatDate, initials } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const user = useVerith((s) => s.user);
  const signOut = useVerith((s) => s.signOut);

  if (!user) return null;

  const details: { label: string; value: string }[] = [
    { label: "Full name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Member since", value: formatDate(user.joinedAt) },
    { label: "Account type", value: "Demo · local only" },
  ];

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Your Verith account" />

      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Identity card */}
        <GlassCard className="p-6" delay={0.05}>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-float"
            >
              <span className="text-2xl font-bold text-white">
                {initials(user.name)}
              </span>
            </motion.div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-2xl font-extrabold tracking-tight text-ink-900">
                {user.name}
              </h2>
              <p className="truncate text-sm text-ink-600">{user.email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-white/70 px-3 py-1 text-xs font-semibold text-ink-600">
                  <CalendarDays className="h-3.5 w-3.5 text-brand-600" />
                  Member since {formatDate(user.joinedAt)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Demo account
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Account details */}
        <GlassCard className="p-6" delay={0.15}>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Account details
          </p>
          <div className="mt-2">
            {details.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-b border-brand-100/60 py-3 last:border-0"
              >
                <span className="text-sm text-ink-600">{row.label}</span>
                <span className="truncate text-sm font-semibold text-ink-900">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Danger zone */}
        <GlassCard className="p-6" delay={0.25}>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Danger zone
          </p>
          <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-600">
              Sign out of your demo account. Your data stays in this browser.
            </p>
            <Button variant="danger" size="md" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
