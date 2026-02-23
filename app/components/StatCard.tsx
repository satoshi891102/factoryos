"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "gold" | "success" | "fail" | "running";
}

const colorMap = {
  gold: "text-gold bg-gold/10 border-gold/20",
  success: "text-success bg-success/10 border-success/20",
  fail: "text-fail bg-fail/10 border-fail/20",
  running: "text-running bg-running/10 border-running/20",
};

export function StatCard({ label, value, icon: Icon, trend, color = "gold" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card border border-border rounded-xl p-5 hover:border-border-active transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm">{label}</p>
          <p className="text-2xl font-semibold mt-1 font-mono animate-count-up">{value}</p>
          {trend && <p className="text-xs text-text-muted mt-1">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
