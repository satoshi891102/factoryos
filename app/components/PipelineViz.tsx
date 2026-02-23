"use client";

import { motion } from "framer-motion";
import { Search, Palette, Code2, Shield, Rocket, Megaphone } from "lucide-react";

const stages = [
  { key: "discovery", label: "Discovery", icon: Search, threshold: 28, max: 40 },
  { key: "design", label: "Design", icon: Palette, threshold: 70, max: 100 },
  { key: "code", label: "Code", icon: Code2, threshold: 60, max: 80 },
  { key: "qa", label: "QA", icon: Shield, threshold: 50, max: 70 },
  { key: "deploy", label: "Deploy", icon: Rocket, threshold: 30, max: 40 },
  { key: "marketing", label: "Marketing", icon: Megaphone, threshold: 20, max: 30 },
];

type StageStatus = "passed" | "failed" | "running" | "pending";

interface PipelineProps {
  scores: Record<string, number | null>;
  running: Record<string, boolean>;
  compact?: boolean;
}

function getStatus(key: string, scores: Record<string, number | null>, running: Record<string, boolean>): StageStatus {
  if (scores[key] !== null && scores[key] !== undefined) {
    const stage = stages.find((s) => s.key === key)!;
    return scores[key]! >= stage.threshold ? "passed" : "failed";
  }
  if (running[key]) return "running";
  return "pending";
}

const statusColors: Record<StageStatus, string> = {
  passed: "bg-success border-success",
  failed: "bg-fail border-fail",
  running: "bg-running border-running animate-pulse-running",
  pending: "bg-pending border-pending",
};

const statusTextColors: Record<StageStatus, string> = {
  passed: "text-success",
  failed: "text-fail",
  running: "text-running",
  pending: "text-text-muted",
};

export function PipelineViz({ scores, running, compact = false }: PipelineProps) {
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => {
        const status = getStatus(stage.key, scores, running);
        const Icon = stage.icon;
        const score = scores[stage.key];

        return (
          <div key={stage.key} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center group relative"
            >
              {/* Dot */}
              <div
                className={`${compact ? "w-8 h-8" : "w-10 h-10"} rounded-full border-2 flex items-center justify-center ${statusColors[status]}`}
                style={{ borderWidth: "2px" }}
              >
                <Icon className={`${compact ? "w-3.5 h-3.5" : "w-4 h-4"} ${status === "pending" ? "text-text-muted" : "text-bg-primary"}`} />
              </div>
              
              {/* Label + Score */}
              {!compact && (
                <div className="mt-1.5 text-center">
                  <p className={`text-[10px] font-medium ${statusTextColors[status]}`}>
                    {stage.label}
                  </p>
                  {score !== null && score !== undefined && (
                    <p className="text-[10px] font-mono text-text-muted">
                      {score}/{stage.max}
                    </p>
                  )}
                </div>
              )}

              {/* Tooltip on compact */}
              {compact && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-bg-card border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap">
                    <span className={statusTextColors[status]}>{stage.label}</span>
                    {score !== null && score !== undefined && (
                      <span className="text-text-muted ml-1">{score}/{stage.max}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Connector line */}
            {i < stages.length - 1 && (
              <div
                className={`${compact ? "w-3" : "w-6"} h-0.5 ${
                  status === "passed" ? "bg-success" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
