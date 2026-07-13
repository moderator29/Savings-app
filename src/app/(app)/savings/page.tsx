"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarCheck,
  Percent,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AnimatedCurrency } from "@/components/ui/animated-number";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { TransactionRow } from "@/components/shared/transaction-row";
import { EmptyState } from "@/components/shared/empty-state";
import { selectApyEarned, useVerith } from "@/lib/store";
import { SEED_APY } from "@/lib/seed";
import type { Transaction } from "@/lib/types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function SavingsPage() {
  const router = useRouter();
  const balance = useVerith((s) => s.balance);
  const transactions = useVerith((s) => s.transactions);
  const apyEarned = useVerith(selectApyEarned);

  const cutoff = Date.now() - THIRTY_DAYS_MS;
  const monthSaved = transactions
    .filter(
      (t: Transaction) =>
        t.type === "deposit" && t.amount > 0 && new Date(t.date).getTime() >= cutoff
    )
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const activity = transactions
    .filter((t: Transaction) => t.type === "deposit" || t.type === "apy" || t.type === "withdraw")
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings"
        subtitle="Your flexible balance, earning every day — demo funds only."
      />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-deep rounded-4xl p-6 text-white shadow-float-lg sm:p-8"
      >
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-200">
              Flexible Savings
            </p>
            <AnimatedCurrency
              value={balance}
              className="mt-2 block text-4xl font-extrabold tracking-tight sm:text-5xl"
            />
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-brand-100">
              <Percent className="h-3.5 w-3.5" />
              {SEED_APY}% APY · compounds daily — demo
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => router.push("/deposit")}>
              <ArrowDownToLine className="h-4 w-4" /> Deposit
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white/10 text-white shadow-none backdrop-blur-sm hover:bg-white/20"
              onClick={() => router.push("/withdraw")}
            >
              <ArrowUpFromLine className="h-4 w-4" /> Withdraw
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="This month saved"
          value={monthSaved}
          icon={PiggyBank}
          trendLabel="last 30 days"
          delay={0.1}
        />
        <StatCard
          label="APY earned"
          value={apyEarned}
          icon={Sparkles}
          trend={2.1}
          trendLabel="this year"
          delay={0.16}
        />
        <StatCard
          label="Auto-save"
          value={350}
          icon={CalendarCheck}
          trendLabel="to Dream Home"
          trend={0}
          delay={0.22}
        />
      </section>

      {/* Activity */}
      <GlassCard delay={0.25} hover={false} className="p-5 sm:p-6">
        <h2 className="mb-2 text-base font-extrabold tracking-tight text-ink-900">
          Savings activity
        </h2>
        {activity.length === 0 ? (
          <EmptyState
            icon={PiggyBank}
            title="No savings activity yet"
            body="Deposits, withdrawals and daily interest will show up here."
          />
        ) : (
          <div>
            {activity.map((tx: Transaction, i: number) => (
              <TransactionRow key={tx.id} tx={tx} index={i} />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
