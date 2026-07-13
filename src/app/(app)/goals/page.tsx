"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Target, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useVerith } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import type { Goal } from "@/lib/types";

const EMOJI_OPTIONS = ["🏡", "🚗", "✈️", "💍", "🎓", "🛟", "📱", "🗻"] as const;

export default function GoalsPage() {
  const goals = useVerith((s) => s.goals);
  const balance = useVerith((s) => s.balance);
  const addGoal = useVerith((s) => s.addGoal);
  const contributeToGoal = useVerith((s) => s.contributeToGoal);
  const deleteGoal = useVerith((s) => s.deleteGoal);

  // Create modal state
  const [createOpen, setCreateOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [emoji, setEmoji] = React.useState<string>(EMOJI_OPTIONS[0]);
  const [target, setTarget] = React.useState("");
  const [createError, setCreateError] = React.useState<string | null>(null);

  // Contribute modal state
  const [contributeId, setContributeId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState("");
  const [contributeError, setContributeError] = React.useState<string | null>(null);

  const contributeGoal = goals.find((g: Goal) => g.id === contributeId) ?? null;

  const openCreate = () => {
    setName("");
    setEmoji(EMOJI_OPTIONS[0]);
    setTarget("");
    setCreateError(null);
    setCreateOpen(true);
  };

  const openContribute = (goal: Goal) => {
    setAmount("");
    setContributeError(null);
    setContributeId(goal.id);
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    const targetValue = parseFloat(target);
    if (!trimmed) {
      setCreateError("Give your goal a name.");
      return;
    }
    if (!Number.isFinite(targetValue) || targetValue <= 0) {
      setCreateError("Target amount must be greater than 0.");
      return;
    }
    addGoal(trimmed, emoji, targetValue);
    setCreateOpen(false);
  };

  const handleContribute = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contributeGoal) return;
    const value = parseFloat(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setContributeError("Enter an amount greater than 0.");
      return;
    }
    if (value > balance) {
      setContributeError("Amount exceeds available balance");
      return;
    }
    contributeToGoal(contributeGoal.id, value);
    setContributeId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings Goals"
        subtitle="Put your money to work toward what matters"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        }
      />

      {goals.length === 0 ? (
        <GlassCard hover={false} className="p-6">
          <EmptyState
            icon={Target}
            title="No goals yet"
            body="Create a goal and start putting money toward the things that matter most."
            action={
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" /> Create your first goal
              </Button>
            }
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal: Goal, i: number) => {
            const pct = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
            const reached = pct >= 100;
            return (
              <GlassCard
                key={goal.id}
                delay={Math.min(i * 0.06, 0.3)}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                      {goal.emoji}
                    </div>
                    <div>
                      <h3 className="font-extrabold tracking-tight text-ink-900">
                        {goal.name}
                      </h3>
                      <p className="text-sm text-ink-600">
                        {formatCurrency(goal.saved)}{" "}
                        <span className="text-ink-400">of {formatCurrency(goal.target)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  {reached ? (
                    <div className="flex items-center justify-center rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold text-brand-600">
                      Goal reached 🎉
                    </div>
                  ) : (
                    <>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-50">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 0.8,
                            delay: Math.min(i * 0.06, 0.3) + 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-600">
                          {pct.toFixed(0)}%
                        </span>
                        <span className="text-xs text-ink-400">
                          {formatCurrency(Math.max(0, goal.target - goal.saved))} to go
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openContribute(goal)}
                  >
                    Add funds
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${goal.name}`}
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Create goal modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New goal">
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Goal name">
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="e.g. Dream Home"
              autoFocus
            />
          </Field>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              Pick an emoji
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((option: string) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setEmoji(option)}
                  aria-pressed={emoji === option}
                  className={cn(
                    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-xl transition-all hover:bg-brand-50",
                    emoji === option && "bg-brand-50 ring-2 ring-brand-400"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <Field label="Target amount">
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={target}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTarget(e.target.value)}
              placeholder="5,000"
            />
          </Field>
          {createError && (
            <p className="text-sm font-medium text-red-500">{createError}</p>
          )}
          <Button type="submit" className="w-full">
            Create goal
          </Button>
        </form>
      </Modal>

      {/* Contribute modal */}
      <Modal
        open={contributeGoal !== null}
        onClose={() => setContributeId(null)}
        title={contributeGoal ? `Add funds · ${contributeGoal.name}` : "Add funds"}
      >
        <form onSubmit={handleContribute} className="space-y-4">
          <Field label="Amount">
            <Input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              placeholder="100"
              autoFocus
            />
          </Field>
          <p className="text-xs text-ink-400">
            Moves money from your available balance ({formatCurrency(balance)}).
          </p>
          {contributeError && (
            <p className="text-sm font-medium text-red-500">{contributeError}</p>
          )}
          <Button type="submit" className="w-full">
            Add funds
          </Button>
        </form>
      </Modal>
    </div>
  );
}
