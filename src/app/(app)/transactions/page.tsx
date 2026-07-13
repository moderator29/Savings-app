"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ListOrdered } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TransactionRow } from "@/components/shared/transaction-row";
import { useVerith } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import type { Transaction, TransactionType } from "@/lib/types";

type Filter = "all" | TransactionType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdraw", label: "Withdrawals" },
  { key: "apy", label: "Earnings" },
  { key: "reward", label: "Rewards" },
  { key: "goal", label: "Goals" },
  { key: "lock", label: "Locked" },
];

export default function TransactionsPage() {
  const transactions = useVerith((s) => s.transactions);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? transactions
        : transactions.filter((tx: Transaction) => tx.type === filter),
    [transactions, filter]
  );

  const totalIn = useMemo(
    () =>
      filtered.reduce(
        (sum: number, tx: Transaction) => (tx.amount > 0 ? sum + tx.amount : sum),
        0
      ),
    [filtered]
  );

  const totalOut = useMemo(
    () =>
      filtered.reduce(
        (sum: number, tx: Transaction) => (tx.amount < 0 ? sum + Math.abs(tx.amount) : sum),
        0
      ),
    [filtered]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Every movement on your account"
      />

      {/* Filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-float"
                  : "glass text-ink-600 hover:text-ink-900"
              )}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListOrdered}
          title="No transactions"
          body="Nothing here yet."
        />
      ) : (
        <GlassCard className="p-4" delay={0.1}>
          <p className="mb-2 px-3 pt-1 text-xs text-ink-400">
            {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
            {" · "}
            Total in{" "}
            <span className="font-semibold text-brand-600">
              +{formatCurrency(totalIn)}
            </span>
            {" · "}
            Total out{" "}
            <span className="font-semibold text-ink-600">
              -{formatCurrency(totalOut)}
            </span>
          </p>
          <div key={filter} className="flex flex-col">
            {filtered.map((tx: Transaction, index: number) => (
              <TransactionRow key={tx.id} tx={tx} index={Math.min(index, 12)} />
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
