"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Factory, CheckCircle2, Loader2, Clock, Zap } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { ProjectCard } from "./components/ProjectCard";

interface Project {
  slug: string;
  idea: string;
  started: string;
  scores: Record<string, number | null>;
  running: Record<string, boolean>;
  deployUrl: string | null;
  stagesCompleted: number;
}

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  successRate: number;
  gateRuns: number;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, statsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/stats"),
        ]);
        const projData = await projRes.json();
        const statsData = await statsRes.json();
        setProjects(projData.projects || []);
        setStats(statsData);
      } catch (e) {
        console.error("Failed to fetch:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold">
          Factory <span className="text-gold">Dashboard</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Real-time pipeline status for all factory builds
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Builds"
          value={stats?.total ?? 0}
          icon={Factory}
          color="gold"
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          icon={CheckCircle2}
          color="success"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress ?? 0}
          icon={Loader2}
          color="running"
        />
        <StatCard
          label="Gate Runs"
          value={stats?.gateRuns ?? 0}
          icon={Zap}
          trend={`${stats?.successRate ?? 0}% success rate`}
          color="gold"
        />
      </div>

      {/* Projects */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pipelines</h2>
        <span className="text-xs text-text-muted">Auto-refreshes every 10s</span>
      </div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-bg-card border border-border rounded-xl p-12 text-center"
        >
          <Factory className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No factory builds yet</h3>
          <p className="text-text-muted text-sm max-w-md mx-auto">
            Run <code className="font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded">factory.sh run &quot;your idea&quot;</code> to start your first pipeline.
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
