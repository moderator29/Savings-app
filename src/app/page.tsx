"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo";
import { useEcokripto } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const user = useEcokripto((s) => s.user);
  const hydrated = useEcokripto((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [hydrated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <LogoMark className="h-14 w-14" />
      </motion.div>
    </div>
  );
}
