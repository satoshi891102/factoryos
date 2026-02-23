import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BUILDS_DIR = process.env.BUILDS_DIR || path.join(process.env.HOME || "/Users/basirah", "builds");
const STAGES = ["discovery", "design", "code", "qa", "deploy", "marketing"] as const;

function readScore(dirPath: string, stage: string): number | null {
  try {
    const content = fs.readFileSync(path.join(dirPath, `.${stage}-gate-score`), "utf-8").trim();
    return parseInt(content, 10);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const entries = fs.readdirSync(BUILDS_DIR, { withFileTypes: true });
    const factoryDirs = entries
      .filter((e) => e.isDirectory() && e.name.startsWith("factory-"))
      .map((e) => path.join(BUILDS_DIR, e.name));

    const total = factoryDirs.length;
    let completed = 0;
    let inProgress = 0;
    const gateScores: Record<string, number[]> = {};

    for (const stage of STAGES) {
      gateScores[stage] = [];
    }

    for (const dir of factoryDirs) {
      let stagesCompleted = 0;
      for (const stage of STAGES) {
        const score = readScore(dir, stage);
        if (score !== null) {
          stagesCompleted++;
          gateScores[stage].push(score);
        }
      }
      if (stagesCompleted === 6) completed++;
      else if (stagesCompleted > 0) inProgress++;
    }

    const avgScores: Record<string, number | null> = {};
    for (const stage of STAGES) {
      const scores = gateScores[stage];
      avgScores[stage] = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;
    }

    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      total,
      completed,
      inProgress,
      pending: total - completed - inProgress,
      successRate,
      avgScores,
      gateRuns: Object.values(gateScores).reduce((sum, arr) => sum + arr.length, 0),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
