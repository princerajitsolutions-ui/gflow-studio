import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { promisify } from "node:util";

import { FFMPEG_HINT, IS_WIN, powershell, psQuote } from "./platform.js";

const run = promisify(execFile);
const FFMPEG = process.env.FLOW_MCP_FFMPEG ?? "ffmpeg";
const FFPROBE = process.env.FLOW_MCP_FFPROBE ?? "ffprobe";

export type TransitionType = "none" | "fade" | "fadeblack" | "fadewhite" | "smoothleft" | "smoothright" | "dissolve";

export interface AssembleOptions {
  dir: string;
  clips?: string[];
  music?: string;
  music_volume: number;
  clip_volume?: number;
  voiceover?: string;
  output_name: string;
  hold_last_frame?: boolean;
  transition?: TransitionType;
  transitions?: TransitionType[];
  transition_duration?: number;
  trim_chained_first_frame?: boolean;
  sidechain_ducking?: boolean;
}

interface ClipInfo {
  width: number;
  height: number;
  duration: number;
  hasAudio: boolean;
}

async function probe(file: string): Promise<ClipInfo> {
  // A raw ffprobe dump ("moov atom not found") told the user nothing. Say which file and what to do about it.
  const { stdout } = await run(FFPROBE, ["-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", file]).catch(() => {
    throw new Error(`"${basename(file)}" isn't a playable video - it may be an unfinished download or a ZIP of several clips. Remove it, or pick other clips.`);
  });
  const data = JSON.parse(stdout) as { streams: { codec_type: string; width?: number; height?: number }[]; format: { duration: string } };
  const video = data.streams.find((s) => s.codec_type === "video");
  if (!video?.width || !video.height) throw new Error(`${file} has no video stream.`);
  return {
    width: video.width,
    height: video.height,
    duration: Number(data.format.duration),
    hasAudio: data.streams.some((s) => s.codec_type === "audio"),
  };
}

// Clips are normally scene-NN.mp4, but a film can also be cut from clips pulled out of Flow (clip-NN) or restyled
// ones (edit-NN). Narration takes and previously assembled films are never treated as footage.
function defaultClips(dir: string): string[] {
  if (!existsSync(dir)) {
    throw new Error(`There's no "${basename(dir)}" folder in your films yet. Add clips with "Upload a video" or "From my films", or type the name of a folder that already has clips in it.`);
  }
  const files = readdirSync(dir).filter((f) => /\.mp4$/i.test(f) && !/^narration-/i.test(f));
  const numbered = new Map<string, string>();
  for (const f of files.sort()) {
    const key = f.match(/^((?:scene|clip|edit)-\d+)(-v\d+)?\.mp4$/i)?.[1];
    if (key && !numbered.has(key)) numbered.set(key, join(dir, f));
  }
  if (numbered.size) return [...numbered.values()];
  // Nothing follows the naming scheme: fall back to every other mp4, oldest first, so a hand-named clip still works.
  return files
    .map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => a.t - b.t)
    .map((x) => join(dir, x.f));
}

// Pulls the spoken track out of a generated clip so Flow's voices can be used as narration.
export async function extractAudio(video: string, target: string): Promise<{ output: string; duration: number }> {
  await run(FFMPEG, ["-y", "-i", video, "-vn", "-af", "highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", target]);
  const { stdout } = await run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", target]);
  return { output: target, duration: Number(stdout.trim()) };
}

const SAY = process.env.FLOW_MCP_SAY ?? "say";

export const EDGE_VOICE_MAP: Record<string, string> = {
  charon: "en-US-BrianMultilingualNeural",
  fenrir: "en-US-AndrewMultilingualNeural",
  algenib: "en-US-ChristopherNeural",
  iapetus: "en-US-EricNeural",
  enceladus: "en-US-GuyNeural",
  aoede: "en-US-AvaMultilingualNeural",
  gacrux: "en-US-EmmaMultilingualNeural",
  achernar: "en-US-JennyNeural",
  despina: "en-US-AriaNeural",
  david: "en-US-ChristopherNeural",
  zira: "en-US-AriaNeural",
};

export const EDGE_VOICES = [
  { name: "en-US-BrianMultilingualNeural", description: "male, warm cinematic narrator · Edge Neural, free" },
  { name: "en-US-AndrewMultilingualNeural", description: "male, expressive storyteller · Edge Neural, free" },
  { name: "en-US-ChristopherNeural", description: "male, deep trailer/noir authority · Edge Neural, free" },
  { name: "en-US-AvaMultilingualNeural", description: "female, natural cinematic lead · Edge Neural, free" },
  { name: "en-US-EmmaMultilingualNeural", description: "female, warm mature narrator · Edge Neural, free" },
  { name: "en-US-AriaNeural", description: "female, crisp dramatic delivery · Edge Neural, free" },
];

export async function speakWithEdge(text: string, voice: string, target: string): Promise<{ output: string; duration: number }> {
  const resolvedVoice = /Neural$/i.test(voice) ? voice : (EDGE_VOICE_MAP[voice.toLowerCase()] ?? "en-US-BrianMultilingualNeural");
  const stem = target.replace(/\.\w+$/, "");
  const rawMp3 = `${stem}.edge.mp3`;
  const lineFile = `${stem}.line.txt`;
  writeFileSync(lineFile, text, "utf8");
  try {
    await run("python", ["-m", "edge_tts", "--voice", resolvedVoice, "--file", lineFile, "--write-media", rawMp3], { timeout: 120_000 });
  } finally {
    rmSync(lineFile, { force: true });
  }
  await run(FFMPEG, [
    "-y",
    "-i",
    rawMp3,
    "-af",
    "highpass=f=90,equalizer=f=3200:width_type=h:width=1000:g=3.0,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=11",
    "-ar",
    "48000",
    "-ac",
    "2",
    target,
  ]);
  rmSync(rawMp3, { force: true });
  const { stdout } = await run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", target]);
  return { output: target, duration: Number(stdout.trim()) };
}

export async function localVoices(): Promise<{ name: string; description: string }[]> {
  if (IS_WIN) {
    try {
      const out = powershell(
        "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices() | Where-Object { $_.Enabled } | ForEach-Object { $_.VoiceInfo.Name + '|' + $_.VoiceInfo.Culture.Name }",
      );
      const winVoices = out
        .split(/\r?\n/)
        .map((l) => l.trim().split("|"))
        .filter(([name, culture]) => name && /^en-/i.test(culture ?? ""))
        .map(([name, culture]) => ({ name, description: `${culture} · Windows SAPI, free` }));
      return [...EDGE_VOICES, ...winVoices];
    } catch {
      return EDGE_VOICES;
    }
  }
  const { stdout } = await run(SAY, ["-v", "?"], { maxBuffer: 4 * 1024 * 1024 }).catch(() => ({ stdout: "" }));
  return stdout
    .split("\n")
    .map((line) => line.match(/^(.+?)\s{2,}(\w{2}_\w{2})\s+#\s*(.*)$/))
    .filter((m): m is RegExpMatchArray => Boolean(m) && /^en_/.test(m![2]))
    .map((m) => ({ name: m[1].trim(), description: `${m[2].replace("_", "-")} · macOS, free` }))
    .filter((v) => !/^(Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Albert|Fred|Grandma|Grandpa|Junior|Kathy|Princess|Ralph|Rocko|Shelley|Sandy|Eddy|Flo|Reed|Rishi)/.test(v.name));
}

// Speaks a line with Edge Neural TTS (first choice on Windows) or the computer's built-in SAPI/say fallback.
export async function speakLocally(text: string, voice: string, target: string): Promise<{ output: string; duration: number }> {
  if (IS_WIN && !/^Microsoft\s+/i.test(voice)) {
    try {
      return await speakWithEdge(text, voice, target);
    } catch {
      // Fall back to Windows SAPI if edge-tts is unavailable or offline.
    }
  }
  const stem = target.replace(/\.\w+$/, "");
  const raw = stem + (IS_WIN ? ".wav" : ".aiff");
  if (IS_WIN) {
    const lineFile = stem + ".line.txt";
    writeFileSync(lineFile, text, "utf8");
    try {
      powershell(
        `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $want = ${psQuote(voice)}; $v = ($s.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Name -like "*$want*" } | Select-Object -First 1); if ($v) { $s.SelectVoice($v.VoiceInfo.Name) }; $s.SetOutputToWaveFile(${psQuote(raw)}); $s.Speak([System.IO.File]::ReadAllText(${psQuote(lineFile)}, [System.Text.Encoding]::UTF8)); $s.Dispose()`,
        300_000,
      );
    } finally {
      rmSync(lineFile, { force: true });
    }
  } else {
    await run(SAY, ["-v", voice, "-r", "168", "-o", raw, text]);
  }
  await run(FFMPEG, ["-y", "-i", raw, "-af", "highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", target]);
  rmSync(raw, { force: true });
  const { stdout } = await run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", target]);
  return { output: target, duration: Number(stdout.trim()) };
}

// Joins the scene clips into one film, keeping their own sound and laying music / voiceover on top.
export async function assemble(o: AssembleOptions): Promise<{ output: string; clips: string[]; duration: number; held_last_frame: number }> {
  if (o.clips?.length) mkdirSync(o.dir, { recursive: true });
  const out = join(o.dir, o.output_name.replace(/[^\w.-]+/g, "_").replace(/(\.mp4)?$/, ".mp4"));
  const clips = (o.clips?.length ? o.clips : defaultClips(o.dir)).filter((c) => c !== out);
  if (!clips.length) throw new Error(`No clips found in ${o.dir}. Generate or download a clip first, or pass clips explicitly.`);
  for (const f of [...clips, o.music, o.voiceover]) if (f && !existsSync(f)) throw new Error(`File not found: ${f}`);

  const infos = await Promise.all(clips.map(probe));
  const cutTransitions: TransitionType[] = [];
  for (let i = 0; i < clips.length - 1; i++) {
    cutTransitions.push(o.transitions?.[i] ?? o.transition ?? "none");
  }
  const trimChained = o.trim_chained_first_frame !== false;
  const trimSec = 0.042; // 1 frame at 24fps removed from start of I2V-chained hard-cut clips
  const effectiveDurations = infos.map((info, i) => {
    const trimmed = i > 0 && cutTransitions[i - 1] === "none" && trimChained ? trimSec : 0;
    return Math.max(0.5, info.duration - trimmed);
  });

  const tDur = Math.min(o.transition_duration ?? 0.5, Math.min(...effectiveDurations) * 0.4);
  const xfadeCount = cutTransitions.filter((t) => t !== "none").length;
  const rawTotal = effectiveDurations.reduce((sum, d) => sum + d, 0) - xfadeCount * tDur;

  let hold = 0;
  if (o.hold_last_frame !== false && o.voiceover) {
    const { stdout } = await run(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", o.voiceover]);
    hold = Math.max(0, Number(stdout.trim()) + 0.6 - rawTotal);
  }
  const { width, height } = infos.reduce((a, b) => (b.width * b.height > a.width * a.height ? b : a));
  const args: string[] = ["-y"];
  for (const clip of clips) args.push("-i", clip);
  const filters: string[] = [];
  const clipVolume = Math.min(1, Math.max(0, o.clip_volume ?? 1));
  infos.forEach((info, i) => {
    const doTrim = i > 0 && cutTransitions[i - 1] === "none" && trimChained;
    const vTrim = doTrim ? `trim=start=${trimSec},setpts=PTS-STARTPTS,` : "";
    const aTrim = doTrim ? `atrim=start=${trimSec},asetpts=PTS-STARTPTS,` : "";
    const freeze = hold > 0.05 && i === infos.length - 1 ? `,tpad=stop_mode=clone:stop_duration=${hold.toFixed(2)}` : "";
    filters.push(
      `[${i}:v]${vTrim}scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24,settb=AVTB,format=yuv420p${freeze}[v${i}]`,
    );
    filters.push(
      info.hasAudio
        ? `[${i}:a]${aTrim}aresample=48000,aformat=channel_layouts=stereo,volume=${clipVolume}${hold > 0.05 && i === infos.length - 1 ? `,apad=pad_dur=${hold.toFixed(2)}` : ""}[a${i}]`
        : `anullsrc=r=48000:cl=stereo,atrim=duration=${(effectiveDurations[i] + (i === infos.length - 1 ? hold : 0)).toFixed(3)}[a${i}]`,
    );
  });

  if (xfadeCount === 0) {
    filters.push(`${infos.map((_, i) => `[v${i}][a${i}]`).join("")}concat=n=${clips.length}:v=1:a=1[v][clipaudio]`);
  } else {
    let curV = "[v0]";
    let curA = "[a0]";
    let curDur = effectiveDurations[0];
    for (let i = 0; i < clips.length - 1; i++) {
      const t = cutTransitions[i];
      const outV = i === clips.length - 2 ? "[v]" : `[vx${i + 1}]`;
      const outA = i === clips.length - 2 ? "[clipaudio]" : `[ax${i + 1}]`;
      if (t === "none") {
        filters.push(`${curV}[v${i + 1}]concat=n=2:v=1:a=0,fps=24,settb=AVTB${outV}`);
        filters.push(`${curA}[a${i + 1}]concat=n=2:v=0:a=1,aresample=48000${outA}`);
        curDur += effectiveDurations[i + 1];
      } else {
        const offset = Math.max(0.05, curDur - tDur);
        filters.push(`${curV}[v${i + 1}]xfade=transition=${t}:duration=${tDur.toFixed(3)}:offset=${offset.toFixed(3)},fps=24,settb=AVTB${outV}`);
        filters.push(`${curA}[a${i + 1}]acrossfade=d=${tDur.toFixed(3)}:c1=exp:c2=exp${outA}`);
        curDur = curDur + effectiveDurations[i + 1] - tDur;
      }
      curV = outV;
      curA = outA;
    }
  }

  let input = clips.length;
  const duck = o.sidechain_ducking !== false;
  if (o.music && o.voiceover && duck) {
    args.push("-stream_loop", "-1", "-i", o.music);
    const musicIdx = input++;
    args.push("-i", o.voiceover);
    const voIdx = input++;
    filters.push(`[${musicIdx}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${o.music_volume}[music_raw]`);
    filters.push(`[${voIdx}:a]aresample=48000,aformat=channel_layouts=stereo,highpass=f=100,equalizer=f=3200:width_type=h:width=1000:g=3.5,asplit=2[vo_sc][vo_main]`);
    filters.push(`[music_raw][vo_sc]sidechaincompress=threshold=0.015:ratio=10:attack=20:release=300[music_ducked]`);
    filters.push(`[clipaudio][music_ducked][vo_main]amix=inputs=3:duration=first:dropout_transition=0:normalize=0,loudnorm=I=-16:TP=-1.0:LRA=11[a]`);
  } else {
    const mix = ["[clipaudio]"];
    if (o.music) {
      args.push("-stream_loop", "-1", "-i", o.music);
      filters.push(`[${input}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${o.music_volume}[music]`);
      mix.push("[music]");
      input++;
    }
    if (o.voiceover) {
      args.push("-i", o.voiceover);
      const eq = duck ? ",highpass=f=100,equalizer=f=3200:width_type=h:width=1000:g=3.5" : "";
      filters.push(`[${input}:a]aresample=48000,aformat=channel_layouts=stereo${eq}[vo]`);
      mix.push("[vo]");
    }
    const norm = duck ? ",loudnorm=I=-16:TP=-1.0:LRA=11" : "";
    filters.push(mix.length > 1 ? `${mix.join("")}amix=inputs=${mix.length}:duration=first:dropout_transition=0:normalize=0${norm}[a]` : `[clipaudio]anull${norm}[a]`);
  }

  const output = out;
  args.push(
    "-filter_complex", filters.join(";"),
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-tune", "film", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-ar", "48000", "-b:a", "256k", "-movflags", "+faststart",
    output,
  );
  try {
    await run(FFMPEG, args, { maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { stderr?: string };
    throw new Error(e.code === "ENOENT" ? `ffmpeg is not installed (${FFMPEG_HINT}).` : `ffmpeg failed: ${(e.stderr ?? String(e)).slice(-600)}`);
  }
  return { output, clips, duration: Number((rawTotal + hold).toFixed(2)), held_last_frame: Number(hold.toFixed(2)) };
}
