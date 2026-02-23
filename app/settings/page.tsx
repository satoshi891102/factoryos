"use client";

import { motion } from "framer-motion";
import { Settings, Github, Gauge, Terminal, Info } from "lucide-react";

const gateThresholds = [
  { gate: "Discovery", threshold: "28/40", file: "discovery-gate.sh" },
  { gate: "Design", threshold: "70/100", file: "design-gate.sh" },
  { gate: "Code", threshold: "60/80", file: "code-gate.sh" },
  { gate: "QA", threshold: "50/70", file: "qa-gate.sh" },
  { gate: "Deploy", threshold: "30/40", file: "deploy-gate.sh" },
  { gate: "Marketing", threshold: "20/30", file: "marketing-gate.sh" },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-semibold mb-1">
          Factory <span className="text-gold">Settings</span>
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Configuration, gate thresholds, and system info
        </p>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card border border-border rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Info className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="font-semibold">Basirah App Factory v1</h2>
            <p className="text-xs text-text-muted">Inspired by Kelly&apos;s App Factory (Austen Allred)</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          A 6-stage automated pipeline that takes a one-line idea and produces a fully deployed, 
          QA-tested web app with marketing materials. Each stage has a deterministic shell script 
          quality gate that cannot be hallucinated past. Success is scored, not self-reported.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <a
            href="https://github.com/satoshi891102/app-factory"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gold hover:text-gold-dim transition-colors"
          >
            <Github className="w-4 h-4" /> GitHub
          </a>
        </div>
      </motion.div>

      {/* Gate Thresholds */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-bg-card border border-border rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-semibold">Gate Thresholds</h2>
        </div>
        <div className="space-y-2">
          {gateThresholds.map((g) => (
            <div key={g.gate} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <span className="text-sm font-medium">{g.gate}</span>
                <span className="text-xs text-text-muted ml-2 font-mono">{g.file}</span>
              </div>
              <span className="font-mono text-sm text-gold">{g.threshold}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CLI Reference */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-semibold">CLI Reference</h2>
        </div>
        <div className="space-y-3 font-mono text-sm">
          {[
            { cmd: 'factory.sh run "your app idea"', desc: "Initialize a new pipeline" },
            { cmd: "factory.sh gate discovery ~/builds/project", desc: "Run a specific gate" },
            { cmd: "factory.sh status project-name", desc: "Check pipeline status" },
            { cmd: "factory.sh report", desc: "Show all factory stats" },
          ].map((item) => (
            <div key={item.cmd} className="bg-bg-primary rounded-lg p-3">
              <code className="text-gold text-xs">{item.cmd}</code>
              <p className="text-text-muted text-xs mt-1 font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
