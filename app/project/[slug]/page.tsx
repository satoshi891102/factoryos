"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { PipelineViz } from "../../components/PipelineViz";
import {
  ArrowLeft, ExternalLink, Clock, FileText, Loader2,
  Search, Palette, Code2, Shield, Rocket, Megaphone,
} from "lucide-react";

const stageInfo = [
  { key: "discovery", label: "Discovery", icon: Search, threshold: 28, max: 40, desc: "Market research, validation, competitor analysis, revenue path" },
  { key: "design", label: "Design", icon: Palette, threshold: 70, max: 100, desc: "DESIGN-SPEC.md, DesignKit config, pages, typography, mobile" },
  { key: "code", label: "Code", icon: Code2, threshold: 60, max: 80, desc: "Build passes, no TS errors, routes, design tokens, no placeholders" },
  { key: "qa", label: "QA", icon: Shield, threshold: 50, max: 70, desc: "QA report, grade B+, mobile tested, interactives checked" },
  { key: "deploy", label: "Deploy", icon: Rocket, threshold: 30, max: 40, desc: "Vercel live, HTTP 200, OG tags, GitHub pushed" },
  { key: "marketing", label: "Marketing", icon: Megaphone, threshold: 20, max: 30, desc: "X thread draft, hook, live URL referenced" },
];

interface Project {
  slug: string;
  idea: string;
  started: string;
  scores: Record<string, number | null>;
  running: Record<string, boolean>;
  deployUrl: string | null;
  stagesCompleted: number;
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        const found = data.projects?.find((p: Project) => p.slug === slug);
        setProject(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <p className="text-text-muted mb-4">{slug}</p>
        <Link href="/" className="text-gold hover:text-gold-dim">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{project.slug}</h1>
            <p className="text-text-muted mt-1">{project.idea}</p>
          </div>
          {project.deployUrl && (
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-lg text-gold text-sm hover:bg-gold/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> View Live
            </a>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
          <Clock className="w-3 h-3" />
          Started: {project.started || "Unknown"}
          <span className="mx-2">|</span>
          {project.stagesCompleted}/6 stages complete
        </div>
      </motion.div>

      {/* Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card border border-border rounded-xl p-6 mb-8"
      >
        <h2 className="text-sm font-medium text-text-muted mb-4">Pipeline Status</h2>
        <div className="flex justify-center">
          <PipelineViz scores={project.scores} running={project.running} />
        </div>
      </motion.div>

      {/* Gate Details */}
      <h2 className="text-lg font-semibold mb-4">Gate Breakdown</h2>
      <div className="space-y-3">
        {stageInfo.map((stage, i) => {
          const score = project.scores[stage.key];
          const isRunning = project.running[stage.key];
          const passed = score !== null && score !== undefined && score >= stage.threshold;
          const failed = score !== null && score !== undefined && score < stage.threshold;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-bg-card border rounded-xl p-4 flex items-center gap-4 ${
                passed ? "border-success/30" : failed ? "border-fail/30" : "border-border"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  passed ? "bg-success/10" : failed ? "bg-fail/10" : isRunning ? "bg-running/10" : "bg-bg-card-hover"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    passed ? "text-success" : failed ? "text-fail" : isRunning ? "text-running" : "text-text-muted"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{stage.label}</h3>
                  {passed && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-success/10 text-success">PASSED</span>
                  )}
                  {failed && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-fail/10 text-fail">FAILED</span>
                  )}
                  {isRunning && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-running/10 text-running">RUNNING</span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5">{stage.desc}</p>
              </div>
              <div className="text-right shrink-0">
                {score !== null && score !== undefined ? (
                  <>
                    <p className={`text-lg font-mono font-semibold ${passed ? "text-success" : "text-fail"}`}>
                      {score}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      /{stage.max} (need {stage.threshold})
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-text-muted">--</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
