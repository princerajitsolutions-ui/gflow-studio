import { execFile } from "node:child_process";
import { FFMPEG_HINT } from "./platform.js";
import { promisify } from "node:util";

const run = promisify(execFile);
const FFMPEG = process.env.FLOW_MCP_FFMPEG ?? "ffmpeg";

// Saves the final frame of a clip as a lossless PNG so the next scene starts with zero compression degradation.
export async function extractLastFrame(video: string): Promise<string> {
  const out = video.replace(/\.\w+$/, "") + "-lastframe.png";
  try {
    await run(FFMPEG, ["-y", "-sseof", "-0.08", "-i", video, "-frames:v", "1", "-update", "1", out]);
  } catch (err) {
    const reason = (err as NodeJS.ErrnoException).code === "ENOENT" ? `ffmpeg is not installed (${FFMPEG_HINT})` : String(err);
    throw new Error(`chain_previous needs ffmpeg to grab the previous clip's last frame: ${reason}`);
  }
  return out;
}
