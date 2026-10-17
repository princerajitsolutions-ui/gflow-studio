---
name: gflow-studio
description: >-
  Autonomous Multi-Style AI Film & Video Production Studio for Google Flow (flow.google.com — Veo 3.1, Nano Banana Pro) powered by flow-mcp.
  Activate whenever the user says "use gflow-studio", "GFlow Studio", "Flow Studio", "use gflow-agent", "Create a GFlow Video", or asks to produce a consistent multi-shot video in Google Flow.
  Includes 6-Point Interactive Intake, 0-Credit 2K (2752x1536) Master Bibles (Characters on #808080 backdrop with locked voices, Environments, Props),
  0-Credit Shared 2K Bridge Keyframe Storyboarding (eliminating video snapshot degradation), 2K Multi-Character Composite Keyframes,
  ARRI Alexa Mini LF 5600K Natural Skin & Pore Realism Lock, 1080p Veo 3.1 Start+End Frame Animation, and Archival FFmpeg Mastering (-crf 14 -preset slow -tune film, 48kHz/256kbps AAC).
---

# GFlow Studio (`gflow-studio`) — Google Flow MCP Master Production Pipeline

Whenever the user asks to use **`gflow-studio`**, **"GFlow Studio"**, **"Flow Studio"**, **`gflow-agent`**, or requests a multi-shot film/video in **Google Flow (`flow.google.com`)**, follow this end-to-end production pipeline powered by `flow-mcp` (`C:\Users\babaj\Projects\Antigravity\GFlow\flow-mcp`).

---

## Phase 0: 6-Point Interactive Intake (Ask Missing Fields Once)

Before spending any credits, check what the user has already provided and ask **once** for any missing preferences across these **6 dimensions**:

1. **Video Type / Narrative Genre:**
   - `Cinematic Story / Short Film` *(Default)*
   - `Sci-Fi / Cyberpunk / Thriller`
   - `Mythological / Historical Epic`
   - `Explainer / Documentary`
   - `2D / 3D Animated Fable`
2. **Aspect Ratio:**
   - `Landscape (16:9) — Standard Widescreen Film` *(Default — `2752x1536` 2K stills & `1920x1080` 1080p master)*
   - `Vertical (9:16) — Vertical Short / Reel` *(`1080x1920` vertical framing)*
3. **Visual Style:**
   - `Hyper-Realistic Cinematic / Live-Action Photorealism` *(ARRI Alexa Mini LF, Panavision Primo primes, 5600K natural skin micro-texture)*
   - `3D Pixar / Stylized 3D Feature`
   - `2D Illustration / Anime`
   - `Claymation / Stop-Motion`
4. **Target Length / Runtime:**
   - `Concise (~16–32s | 2–4 shots)`
   - `Standard (~60–90s | 8–12 shots)`
   - `Extended (~2–5 min | 15–30 shots)`
5. **Script Input Mode:**
   - **Mode A — Premise / Logline Only:** Autonomously write the complete story arc, Character/Environment/Prop Bible, chained `2K` storyboard keyframes, and calibrated shot prompts.
   - **Mode B — Full Script / Story Bible Provided:** Preserve the user's exact canon, segment into timed `8s` shots, and construct the `2K` Bridge Keyframe storyboard around it.
6. **Audio, Voice & Post-Production Route:**
   - **Route A — Native Veo 3.1 Synchronized Dialogue & Ambience:** Uses locked character voices (`Aoede`, `Charon`, `Fenrir`, `Kore`, `Puck`), explicit speaker/silence locks, continuous acoustic room-tone beds, and `clip_volume: 1.0`.
   - **Route B — Studio Broadcast Hybrid Master:** Combines native Foley/dialogue with neural narration (`flow_narrate`), sidechain BGM ducking (`sidechain_ducking: true`), and `EBU R128 (-16 LUFS)` loudness normalization.

---

## Core Optical & Natural Skin Realism Lock (Mandatory on All Live-Action Prompts)

Never use heavy orange/teal LUT prompts (such as `"Kodak 2383 color grade"` or `"warm tungsten key light and cool teal shadows"`) that double-bake contrast or create waxy/fabricated orange skin tones. Always append this optical lock:

> `"Shot on ARRI Alexa Mini LF with 35mm Panavision Primo prime lens, natural 5600K daylight color balance, authentic unretouched human skin micro-texture with visible fine pores, natural freckles, and realistic subsurface scattering, true-to-life original human skin tone, zero waxy or plastic smoothing, full-frame 16:9 with no letterbox bars."`

---

## Phase 1: `0`-Credit `2K` Master Visual & Voice Bible (In Google Flow)

Generate all foundational assets directly inside Google Flow (`Nano Banana Pro`, `max_credits: 0`, `download_quality: "upscaled"` $\rightarrow$ `2752x1536` `2K`):

1. **Master Characters (`flow_character` / `core.character`):**
   - Rendered on a **solid flat neutral mid-grey studio background (`#808080`)** with zero environmental props or background scenery (so character chips never bleed studio walls into scene environments).
   - Prop-free neutral pose with relaxed hands.
   - Assign a dedicated locked voice (`voice` parameter) and store the full physical + wardrobe specification (`description` parameter).
2. **Master Environments (`ENV_*`):**
   - `16:9` `2K` (`2752x1536`) empty architectural/location plates (`0` credits).
3. **Hero Props (`PROP_*`):**
   - `16:9` `2K` (`2752x1536`) macro reference plates of recurring objects (`0` credits).

---

## Phase 2: `0`-Credit Shared `2K` Bridge Keyframe Storyboard (Approval Gate)

Never rely on low-resolution video last-frame snapshots when transitioning between continuous shots. Instead, generate the complete **`2K` (`2752x1536`) still storyboard** in Google Flow for **0 credits** first:

1. **Shared `2K` Bridge Keyframes for Continuous Multi-Shot Sequences:**
   - Generate chained `2K` (`2752x1536`) stills (`type: "image"`, `max_credits: 0`, `download_quality: "upscaled"`):
     - `KF1_2K`: References `["asset:<Character>", "asset:<ENV>", "asset:<PROP>"]`
     - `KF2_2K`: `reference_previous: true` + `["asset:<Character>", "asset:<PROP>"]` (Shared Bridge Frame: serves as **End** of Shot 1 and **Start** of Shot 2)
     - `KF3_2K`: `reference_previous: true` + `["asset:<Character>", "asset:<PROP>"]` (serves as **End** of Shot 2 and **Start** of Shot 3)
2. **`2K` Composite Keyframes for Multi-Character + Environment + Prop Shots:**
   - Because `Veo 3.1` R2V supports at most 3 ingredient chips, any shot requiring **2+ characters + environment + prop** must first be generated as a `0`-credit `2K` composite still (`KF_<SCENE>_2K.jpeg`) combining the characters and environment, and then animated in `Frames` Mode (`first_frame: KF_<SCENE>_2K.jpeg`).
3. **User Review & `0`-Credit Surgical Edits (`flow_edit`):**
   - Present all `2K` storyboard stills to the user before spending any video credits. Use `flow_edit` (`core.edit`) or regenerate individual stills at `0` credits until 100% approved.

---

## Phase 3: `1080p` Video Animation (`Native Composer Frames Mode`)

Animate approved `2K` keyframes in Native Composer `Frames` Mode (`Agent Mode` OFF, `model: "Veo 3.1 - Lite"`, `max_credits: 5`, `download_quality: "upscaled"` $\rightarrow$ `1920x1080`):

1. **Shared `2K` Bridge Handoff (Zero Video Snapshots, Zero Generational Softening):**
   - **Shot 1:** `first_frame = KF1_2K.jpeg`, `last_frame = KF2_2K.jpeg`
   - **Shot 2:** `first_frame = KF2_2K.jpeg`, `last_frame = KF3_2K.jpeg`
   - Always pass the downloaded **`2752x1536` (`2K`)** JPEG files on disk as `first_frame` and `last_frame` so `Veo 3.1` encodes from true `2K` still photographs at both ends.
2. **Lossless `1080p` PNG Continuation (`flow_continue` `mode: "exact"`):**
   - When an open-ended continuation is required without a pre-generated end keyframe, `runContinue` downloads the `1080p` (`1920x1080`) upscaled source clip, extracts a lossless PNG (`extractLastFrame`), and animates in Native Composer `Frames` Mode (`Start` frame) with `Agent Mode` OFF.
3. **Strict Speaker, Lip-Sync & Acoustic Continuity Locks:**
   - **Silent shots:** Always include `"No spoken dialogue; <Character(s)> remain completely silent with closed mouths."`
   - **Single-speaker two-shots:** Explicitly name the speaker, gender/timbre, and screen side (`"Thorne (58-year-old bearded man on the right, speaking in a deep resonant male baritone voice) says: '...' Aria on the left remains silent with her mouth closed."`).
   - **Continuous Acoustic Bed:** Include an identical location `Audio:` suffix across all shots in the same environment.

---

## Phase 4: Archival `1080p` Master Assembly (`-crf 14 -preset slow -tune film`)

Assemble all `1080p` (`1920x1080`) clips via `flow_assemble` (`core.assemble`):
- `transitions`: Use `"none"` across continuous Shared `2K` Bridge cuts and `mode: "exact"` cuts, with `trim_chained_first_frame: true` (trims `0.04s` [1 frame at `24fps`] from the start of each chained incoming shot for a seamless zero-stutter cut).
- **Archival Encoding (`assemble.ts`):**
  - Video: `-c:v libx264 -crf 14 -preset slow -tune film -pix_fmt yuv420p` (`~11–12 Mbps` `1080p`, preserving fine skin pore detail and film grain).
  - Audio: `-c:a aac -ar 48000 -b:a 256k` (`48 kHz` broadcast stereo).
