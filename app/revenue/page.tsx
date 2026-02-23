"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ExternalLink, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { StatCard } from "../components/StatCard";

interface Project {
  slug: string;
  idea: string;
  deployUrl: string | null;
  stagesCompleted: number;
}

const revenueData = [
  { source: "Basirah Playbook", amount: 0, status: "Waitlist live", url: "https://app-five-xi-91.vercel.app" },
  { source: "Cortex Bounty", amount: 0, status: "Awaiting result ($3.1K potential)", url: null },
  { source: "MoMNTum Bounty", amount: 0, status: "Awaiting result ($1K potential)", url: null },
  { source: "SolarHub SA", amount: 0, status: "304 listings, needs outreach", url: "https://solarhub-sa.vercel.app" },
  { source: "SEO Farm (PetGearNerds + DeskNerdHQ)", amount: 0, status: "96 articles, needs domains + affiliate", url: null },
];

export default function RevenuePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects || []))
      .finally(() => setLoading(false));
  }, []);

  const daysOperating = Math.floor((Date.now() - new Date("2026-02-06").getTime()) / 86400000);
  const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
  const deployedApps = projects.filter((p) => p.deployUrl).length;

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
          Revenue <span className="text-gold">Tracker</span>
        </h1>
        <p className="text-text-muted text-sm mb-8">
          All revenue streams and deployed assets
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`$${totalRevenue}`} icon={DollarSign} color={totalRevenue > 0 ? "success" : "fail"} />
        <StatCard label="Days Operating" value={daysOperating} icon={Calendar} color="gold" />
        <StatCard label="$/Day" value={daysOperating > 0 ? `$${(totalRevenue / daysOperating).toFixed(2)}` : "$0"} icon={TrendingUp} color={totalRevenue > 0 ? "success" : "fail"} />
        <StatCard label="Deployed Apps" value={deployedApps} icon={ExternalLink} color="running" />
      </div>

      {/* Revenue Sources */}
      <h2 className="text-lg font-semibold mb-4">Revenue Sources</h2>
      <div className="space-y-3 mb-8">
        {revenueData.map((item, i) => (
          <motion.div
            key={item.source}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-sm">{item.source}</h3>
              <p className="text-xs text-text-muted mt-0.5">{item.status}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono font-semibold ${item.amount > 0 ? "text-success" : "text-text-muted"}`}>
                ${item.amount}
              </span>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-dim">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Factory Deployed Apps */}
      <h2 className="text-lg font-semibold mb-4">Factory-Built Apps</h2>
      {projects.filter((p) => p.deployUrl).length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-text-muted text-sm">No factory apps deployed yet. Run the pipeline to deploy your first app.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.filter((p) => p.deployUrl).map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-card border border-border rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-sm">{project.slug}</h3>
                <p className="text-xs text-text-muted mt-0.5">{project.idea}</p>
              </div>
              <a href={project.deployUrl!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gold text-sm hover:text-gold-dim">
                Visit <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
