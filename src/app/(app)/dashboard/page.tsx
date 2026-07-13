"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  Calendar,
  Eye,
  EyeOff,
  Gift,
  Lock,
  Percent,
  PiggyBank,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { AnnouncementBanner } from "@/components/dashboard/announcement-banner";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCurrency } from "@/components/ui/animated-number";
import { StatCard } from "@/components/shared/stat-card";
import { TransactionRow } from "@/components/shared/transaction-row";
import { seedHistory, SEED_APY } from "@/lib/seed";
import { selectApyEarned, selectLockedTotal, useVerith } from "@/lib/store";
import { cn, firstName, formatCurrency } from "@/lib/utils";

const quickActions = [
  { label: "Deposit", href: "/deposit", icon: ArrowDownToLine },
  { label: "Withdraw", href: "/withdraw", icon: ArrowUpFromLine },
  { label: "Save", href: "/goals", icon: PiggyBank },
  { label: "Lock Funds", href: "/locked-savings", icon: Lock },
  { label: "Rewards", href: "/rewards", icon: Gift },
];

export default function DashboardPage() {
  const user = useVerith((s) => s.user);
  const balance = useVerith((s) => s.balance);
  const transactions = useVerith((s) => s.transactions);
  const goals = useVerith((s) => s.goals);
  const lockedTotal = useVerith(selectLockedTotal);
  const apyEarned = useVerith(selectApyEarned);
  const [hidden, setHidden] = useState(false);

  const history = seedHistory();

  return (
    <div className="space-y-6">
      <div className="lg:hidden">
        <p className="text-xs font-medium text-ink-400">Welcome back,</p>
        <h1 className="text-xl font-extrabold tracking-tight text-ink-900">
          {user ? firstName(user.name) : ""} 👋
        </h1>
      </div>

      {/* Swipeable announcement banner — sits directly below the greeting */}
      <AnnouncementBanner />

      {/* Balance hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-deep rounded-4xl p-6 text-white shadow-float-lg sm:p-8"
      >
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-medium text-brand-200">Total Balance</p>
              <button
                onClick={() => setHidden((h) => !h)}
                className="rounded-full bg-white/10 p-1.5 text-brand-100 transition-colors hover:bg-white/20 cursor-pointer"
                aria-label="Toggle balance visibility"
              >
                {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand-100">
                DEMO
              </span>
            </div>
            {hidden ? (
              <p className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                ••••••
              </p>
            ) : (
              <AnimatedCurrency
                value={balance}
                className="mt-2 block text-4xl font-extrabold tracking-tight sm:text-5xl"
              />
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-brand-400/25 px-3 py-1.5 text-xs font-bold text-brand-100">
                <TrendingUp className="h-3.5 w-3.5" /> +4.8% this month
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand-200">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
                Your wealth is growing
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-80">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-brand-200">Current APY</p>
                <Percent className="h-3.5 w-3.5 text-brand-200" />
              </div>
              <p className="mt-1.5 text-xl font-extrabold">{SEED_APY}%</p>
              <p className="text-[10px] text-brand-200/80">Annual Percentage Yield</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-brand-200">Next Payout</p>
                <Calendar className="h-3.5 w-3.5 text-brand-200" />
              </div>
              <p className="mt-1.5 text-xl font-extrabold">$86.90</p>
              <p className="text-[10px] text-brand-200/80">In 3 days</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick actions */}
      <section className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {quickActions.map((a, i) => (
          <motion.div
            key={a.href}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
            className="min-w-fit flex-1"
          >
            <Link
              href={a.href}
              className="glass flex items-center justify-center gap-2.5 rounded-3xl px-5 py-3.5 shadow-float transition-all hover:-translate-y-0.5 hover:shadow-float-lg"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl text-white",
                  "bg-gradient-to-b from-brand-500 to-brand-700"
                )}
              >
                <a.icon className="h-4 w-4" />
              </span>
              <span className="whitespace-nowrap text-sm font-bold text-ink-900">
                {a.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Account summary */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-ink-900">
            Account Summary
          </h2>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Available Balance" value={balance} icon={Wallet} trend={4.8} delay={0.05} />
          <StatCard label="Locked Savings" value={lockedTotal} icon={Lock} trendLabel="2 active plans" delay={0.1} />
          <StatCard label="APY Earned (YTD)" value={apyEarned} icon={Percent} trend={2.1} trendLabel="this year" delay={0.15} />
          <StatCard label="Active Goals" value={goals.length} icon={Target} format="number" delay={0.2} />
        </div>
      </section>

      {/* Chart + recent activity */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <GlassCard delay={0.15} hover={false} className="p-6 xl:col-span-3">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="text-base font-extrabold text-ink-900">Savings Growth</h3>
              <p className="text-xs text-ink-400">Last 12 months · simulated</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
              <TrendingUp className="h-3.5 w-3.5" /> +150%
            </span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 12, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#24a878" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#24a878" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#7d918a" }}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  cursor={{ stroke: "#24a878", strokeDasharray: "4 4" }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(36,168,120,0.15)",
                    boxShadow: "0 8px 30px -6px rgb(6 40 30 / 0.12)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  formatter={(v) => [formatCurrency(Number(v)), "Balance"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#168860"
                  strokeWidth={2.5}
                  fill="url(#growth)"
                  animationDuration={1400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} hover={false} className="p-4 xl:col-span-2">
          <div className="mb-2 flex items-center justify-between px-2 pt-2">
            <h3 className="text-base font-extrabold text-ink-900">Recent Activity</h3>
            <Link
              href="/transactions"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all
            </Link>
          </div>
          <div>
            {transactions.slice(0, 5).map((tx, i) => (
              <TransactionRow key={tx.id} tx={tx} index={i} />
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Goals preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-ink-900">
            Savings Goals
          </h2>
          <Link
            href="/goals"
            className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Manage <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.slice(0, 3).map((g, i) => {
            const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
            return (
              <GlassCard key={g.id} delay={0.1 + i * 0.07} className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl">
                    {g.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-900">{g.name}</p>
                    <p className="text-xs text-ink-400">
                      {formatCurrency(g.saved)} of {formatCurrency(g.target)}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-brand-600">{pct}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-100/70">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>
    </div>
  );
}
