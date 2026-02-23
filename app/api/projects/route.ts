import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BUILDS_DIR = process.env.BUILDS_DIR || path.join(process.env.HOME || "/Users/basirah", "builds");

const STAGES = ["discovery", "design", "code", "qa", "deploy", "marketing"] as const;

function readFileOrNull(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8").trim();
  } catch {
    return null;
  }
}

function getProjectData(dirPath: string) {
  const slug = path.basename(dirPath);
  const idea = readFileOrNull(path.join(dirPath, "IDEA.txt")) || slug.replace(/^factory-/, "").replace(/-/g, " ");
  const started = readFileOrNull(path.join(dirPath, ".factory-started")) || "";
  const deployUrl = readFileOrNull(path.join(dirPath, "DEPLOY_URL"));

  const scores: Record<string, number | null> = {};
  const running: Record<string, boolean> = {};
  let stagesCompleted = 0;

  for (const stage of STAGES) {
    const scoreFile = path.join(dirPath, `.${stage}-gate-score`);
    const runningFile = path.join(dirPath, `.${stage}-running`);
    
    const scoreStr = readFileOrNull(scoreFile);
    scores[stage] = scoreStr ? parseInt(scoreStr, 10) : null;
    running[stage] = fs.existsSync(runningFile);
    
    if (scores[stage] !== null) stagesCompleted++;
  }

  return { slug, idea, started, scores, running, deployUrl, stagesCompleted };
}

export async function GET() {
  try {
    const entries = fs.readdirSync(BUILDS_DIR, { withFileTypes: true });
    const projects = entries
      .filter((e) => e.isDirectory() && e.name.startsWith("factory-"))
      .map((e) => getProjectData(path.join(BUILDS_DIR, e.name)))
      .sort((a, b) => b.stagesCompleted - a.stagesCompleted || b.started.localeCompare(a.started));

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ projects: [], error: String(error) }, { status: 500 });
  }
}
