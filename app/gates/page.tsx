"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, Search, Palette, Code2, Shield, Rocket, Megaphone, Loader2 } from "lucide-react";

const gateConfig = [
  { key: "discovery", label: "Discovery", icon: Search, threshold: 28, max: 40, checks: ["VALIDATION.md exists & depth", "Value proposition", "Target audience", "Fatal flaw analysis", "Competitors", "Revenue path", "Niche specificity", "NO-BUILD list"] },
  { key: "design", label: "Design", icon: Palette, threshold: 70, max: 100, checks: ["DESIGN-SPEC.md depth", "Pages/routes (3+)", "DesignKit config", "Color palette", "Typography", "Mobile responsive", "User flow", "Multi-page check"] },
  { key: "code", label: "Code", icon: Code2, threshold: 60, max: 80, checks: ["package.json exists", "node_modules", "Build succeeds", "No TypeScript errors", "Multiple routes", "DesignKit tokens", "No placeholder text", "Git commits", "No secrets"] },
  { key: "qa", label: "QA", icon: Shield, threshold: 50, max: 70, checks: ["QA-REPORT.md exists", "Grade B+", "All pages tested", "Mobile responsive", "No critical bugs", "Interactive elements"] },
  { key: "deploy", label: "Deploy", icon: Rocket, threshold: 30, max: 40, checks: ["Vercel deployed", "HTTP 200", "OG meta tags", "GitHub remote"] },
  { key: "marketing", label: "Marketing", icon: Megaphone, threshold: 20, max: 30, checks: ["X thread draft", "Hook/headline", "Deploy URL in copy"] },
];

interface Stats {
  avgScores: Record<string, number | null>;
  gateRuns: number;
}

export default function GatesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-semibold mb-1">
          Gate <span className="text-gold">Analytics</span>
        </h1>
        <p className="text-text-muted text-sm mb-8">
          What each gate checks, thresholds, and average performance across all builds.
        </p>
      </motion.div>

      <div className="space-y-4">
        {gateConfig.map((gate, i) => {
          const Icon = gate.icon;
          const avg = stats?.avgScores?.[gate.key];
          const pct = avg !== null && avg !== undefined ? Math.round((avg / gate.max) * 100) : 0;

          return (
            <motion.div
              key={gate.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{gate.label} Gate</h3>
                    <div className="text-right">
                      {avg !== null && avg !== undefined ? (
                        <span className="font-mono text-lg font-semibold text-gold">{avg}</span>
                      ) : (
                        <span className="text-text-muted text-sm">No data</span>
                      )}
                      <span className="text-text-muted text-xs ml-1">/ {gate.max}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Threshold: {gate.threshold}/{gate.max} to pass
                  </p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-4">
                <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.8 }}
                    className={`h-full rounded-full ${pct >= (gate.threshold / gate.max) * 100 ? "bg-success" : "bg-fail"}`}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-text-muted">0</span>
                  <span className="text-[10px] text-text-muted">{gate.threshold} (pass)</span>
                  <span className="text-[10px] text-text-muted">{gate.max}</span>
                </div>
              </div>

              {/* Checks */}
              <div className="grid grid-cols-2 gap-1">
                {gate.checks.map((check) => (
                  <div key={check} className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <div className="w-1 h-1 rounded-full bg-text-muted shrink-0" />
                    {check}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
