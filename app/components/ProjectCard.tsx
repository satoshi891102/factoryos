"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PipelineViz } from "./PipelineViz";
import { ExternalLink, Clock, ArrowRight } from "lucide-react";

interface Project {
  slug: string;
  idea: string;
  started: string;
  scores: Record<string, number | null>;
  running: Record<string, boolean>;
  deployUrl: string | null;
  stagesCompleted: number;
}

export function ProjectCard({ project }: { project: Project }) {
  const completionPct = Math.round((project.stagesCompleted / 6) * 100);
  const isComplete = project.stagesCompleted === 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-bg-card border border-border rounded-xl p-5 hover:border-border-active transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary truncate">{project.slug}</h3>
            {isComplete && (
              <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium rounded-full bg-success/10 text-success border border-success/20">
                SHIPPED
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted mt-1 line-clamp-2">{project.idea}</p>
        </div>
        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 ml-3 w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center hover:bg-gold/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </a>
        )}
      </div>

      {/* Pipeline */}
      <div className="mb-4">
        <PipelineViz scores={project.scores} running={project.running} compact />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Clock className="w-3 h-3" />
          <span>{project.started}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-text-muted">{completionPct}%</span>
          <Link
            href={`/project/${project.slug}`}
            className="flex items-center gap-1 text-xs text-gold hover:text-gold-dim transition-colors"
          >
            Details <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
