---
name: gflow-studio
description: >-
  Autonomous Multi-Style AI Film & Video Production Studio for Google Flow (flow.google.com — Veo 3.1, Nano Banana Pro) powered by flow-mcp and the V4.0 Universal AI Cinematic Master Director framework.
  Activate whenever the user says "use gflow-studio", "GFlow Studio", "Flow Studio", "use gflow-agent", "Create a GFlow Video", or asks to produce a consistent multi-shot video in Google Flow.
  Enforces a Low-Friction 2-Gate Approval Policy (Gate 1 at initial setup/story via selectable ask_question options; Gate 2 only on unrecoverable video generation blockers),
  0-Credit 2K (2752x1536) Master Bibles (Characters on #808080 backdrop with locked voices, Creatures, Environments, Props),
  0-Credit Shared 2K Bridge Keyframe Storyboarding (eliminating video snapshot degradation), 2K Multi-Character Composite Keyframes,
  ARRI Alexa Mini LF 5600K Natural Skin & Pore Realism Lock, 1080p Veo 3.1 Start+End Frame Animation, and Archival FFmpeg Mastering (-crf 14 -preset slow -tune film, 48kHz/256kbps AAC).
---

# GFlow Studio (`gflow-studio`) — V4.0 Autonomous Master Director & Google Flow MCP Pipeline

Whenever the user asks to use **`gflow-studio`**, **"GFlow Studio"**, **"Flow Studio"**, **`gflow-agent`**, or requests a multi-shot film/video in **Google Flow (`flow.google.com`)**, follow this V4.0 Autonomous Master Director workflow powered by `flow-mcp` (`C:\Users\babaj\Projects\Antigravity\GFlow\flow-mcp`).

Companion reference files in this skill directory:
- [`MASTER_DIRECTOR_PROMPT.md`](./MASTER_DIRECTOR_PROMPT.md) — Full V4.0 Universal AI Cinematic Master Director specification (Modules 00–07, Global Production Controller, 8-Layer Shot Engineering, and Automated QA/Recovery).
- [`PRODUCTION_TEMPLATES.md`](./PRODUCTION_TEMPLATES.md) — Templates `T0–T8` (15-Section Scene Packet, 18-Section Shot Packet, Audio Cue Contract, and Production Checkpoint).
- [`GPC_SCHEMAS.json`](./GPC_SCHEMAS.json) & [`templates/`](./templates/) — Machine-readable schemas and 12 CSV register headers maintained silently in `output/<Project>/manifests/`.

---

## 1. Non-Negotiable 2-Gate Low-Friction Approval Policy & Selectable Options (`ask_question`)

Never stop at 17 micro-gates or ask open-ended text questions when selectable options can be provided.

1. **GATE 1 — Initial Setup, Story Sign-Off & Main Cast Reference Check:**
   - Read any details already provided by the user.
   - For any missing setup choices (`Module 00`: Work Type/Runtime, Aspect Ratio, Visual Style, Audio Route, Language) or story concept/hook selection (`Module 01` when no full script is supplied), **always call the `ask_question` tool** to present interactive, selectable multiple-choice options (prefixing the best option with `(Recommended)`).
   - **Main Cast Reference Check (Once Character Design Is Drafted in `Module 03`):** Immediately after drafting the character profiles and story-required wardrobes for the **Hero, Heroine, and Main Supporting Roles**, present the cast design summary and ask the user (via `ask_question` selectable options) whether they would like to provide reference images (photos/headshots) for the **Hero, Heroine, or Main Supporting Roles**, or have Google Flow generate their faces from scratch.
   - Once the user provides any reference images (or selects AI-generated faces), **do NOT ask for any further approvals across Modules 03, 04, 05, 06, or 07.** Execute the entire production pipeline autonomously from Character Masters to the stitched `1080p` `-crf 14` master video.
2. **GATE 2 — Exception-Only Escalation (During Video Generation / QA Only If Needed):**
   - During `Module 06` (`2K` keyframe & `1080p` video generation), inspect every output file via `view_file` and `ffprobe`. If a defect occurs (identity drift, extra limb, lip-sync mismatch, or transient Flow error), **automatically self-heal first** (up to 2 targeted retries, `flow_edit` surgical tweaks, or `2K` keyframe recompositions).
   - **Only pause and invoke Gate 2** (via `ask_question` with selectable recovery options) if an unrecoverable blocker occurs (e.g., Flow credits exhausted, persistent content policy refusal requiring a script change, or an explicit user interruption).
3. **Silent Background Manifests (Zero Chat Clutter):**
   - Write all 15-section Scene Packets, 18-section Shot Packets, Bibles, and CSV registers (`PROJECT_REGISTER.csv`, `ASSET_REGISTER.csv`, `SCENE_MANIFEST.csv`, `SHOT_MANIFEST.csv`, `REFERENCE_MAP.csv`, `CONTINUITY_STATES.csv`, `AUDIO_CUES.csv`, `GENERATION_QA.csv`, `DELIVERY_MANIFEST.csv`, `PRODUCTION_CHECKPOINT.md`) to `output/<Project>/manifests/` rather than dumping walls of template text into chat.

---

## 2. Core Optical & Natural Skin Realism Lock (Mandatory on All Live-Action Prompts)

Never use heavy orange/teal LUT prompts (such as `"Kodak 2383 color grade"` or `"warm tungsten key light and cool teal shadows"`) that double-bake contrast or create waxy/fabricated orange skin tones. Always append this optical lock:

> `"Shot on ARRI Alexa Mini LF with 35mm Panavision Primo prime lens, natural 5600K daylight color balance, authentic unretouched human skin micro-texture with visible fine pores, natural freckles, and realistic subsurface scattering, true-to-life original human skin tone, zero waxy or plastic smoothing, full-frame 16:9 with no letterbox bars."`

---

## 3. Autonomous End-to-End Execution Pipeline (Modules 00–07)

### Module 00 & Module 01: Unified Intake & Concept Selection (`Gate 1` via `ask_question`)
- Present missing setup preferences and (if starting from a premise/topic) 3–4 high-hook story concepts in a single `ask_question` modal.
- Upon Gate 1 confirmation, lock `PROJECT_CONFIG` and begin autonomous execution.

### Module 02: Autonomous Screenplay & Mystery Ledger (`output/<Project>/manifests/SCREENPLAY_V001.md`)
- Generate the treatment, beat sheet, Mystery Clue $\rightarrow$ Reveal Ledger, and complete production screenplay segmented into `8s` shot beats (`SC###_SH###`).

### Module 03: Character Design, Cast Reference Intake & `0`-Credit `2K` Character/Voice Bibles (`flow_character`)
- **Step 1 — Draft Character & Story Wardrobe Designs:** Define the physical DNA, personality, voice, and **story-specific wardrobe(s)** for the **Hero, Heroine, and Main Supporting Roles**.
- **Step 2 — Ask for Cast Reference Images (`ask_question`):** Present the drafted Hero, Heroine, and Supporting Role designs + story wardrobes and ask via `ask_question` if the user has reference images for any of them (e.g., `"I will upload/provide reference images for Hero/Heroine/Supporting roles"`, `"Use reference images for some roles and generate the rest"`, or `"Generate all character faces in Google Flow"`).
- **Step 3 — Lock Reference Likeness + Update Wardrobe per Story (`flow_character` / `core.character`, `0` credits, `2K` upscaled):**
  - When a user provides a reference image for a character, pass **both** `image: "<path_to_user_reference>"` **and** `describe: "<story-required wardrobe and role styling>"` to `flow_character` (`createCharacter`).
  - `createCharacter` automatically attaches the user's reference photo as an Ingredient in Google Flow (`Nano Banana Pro`, `0` credits), **preserves 100% of the subject's exact facial identity, bone structure, eyes, skin tone, and hair**, and **updates their wardrobe to match the exact story requirement** on a **flat `#808080` neutral mid-grey studio backdrop** (`2K` upscaled), then registers that restyled portrait in Flow's **Characters** tab with a locked voice (`Aoede`, `Charon`, `Fenrir`, `Kore`, `Puck`).
  - If the story requires **wardrobe changes across different scenes/acts** (e.g., formal attire in Act 1, tactical/field attire in Act 2), generate `0`-credit `2K` Wardrobe Variant Master Sheets (`CHAR_<Name>_WardrobeA_2K.jpeg`, `CHAR_<Name>_WardrobeB_2K.jpeg`) from the same reference portrait or via `flow_character_edit` so the face stays 100% locked while the wardrobe adapts to each part of the story.
- Verify each character/creature portrait with `view_file` and log in `ASSET_REGISTER.csv`.

### Module 04: Autonomous `0`-Credit `2K` World, Environment & Hero Prop Bibles (`flow_generate` `type: "image"`)
- Generate `16:9` `2K` (`2752x1536`) empty architectural/location plates (`ENV_*`) and macro hero prop plates (`PROP_*`) in Google Flow (`Nano Banana Pro`, `max_credits: 0`, `download_quality: "upscaled"`).
- Verify with `view_file` / `ffprobe` (`2752x1536`) and log in `ASSET_REGISTER.csv`.

### Module 05 & Module 06: Scene/Shot Engineering, `0`-Credit Shared `2K` Bridge Keyframes & `1080p` Video Animation
1. **Stage A — `0`-Credit Shared `2K` (`2752x1536`) Bridge Keyframe Composition:**
   - Never rely on low-resolution video last-frame snapshots between continuous shots.
   - Generate chained `2K` (`2752x1536`) stills in Google Flow (`type: "image"`, `max_credits: 0`, `download_quality: "upscaled"`):
     - `SC###_KF01_2K.jpeg`: References `["asset:<Character>", "asset:<ENV>", "asset:<PROP>"]`
     - `SC###_KF02_2K.jpeg`: `reference_previous: true` + `["asset:<Character>", "asset:<PROP>"]` (**Shared Bridge Frame**: End of `SH001` & Start of `SH002`)
     - `SC###_KF03_2K.jpeg`: `reference_previous: true` + `["asset:<Character>", "asset:<PROP>"]` (**Shared Bridge Frame**: End of `SH002` & Start of `SH003`)
   - For shots with **2+ characters + environment + prop** (exceeding Flow's 3-ingredient R2V limit), compose a `0`-credit `2K` composite still (`KF_<SCENE>_2K.jpeg`) first.
   - Inspect every `2K` keyframe via `view_file` and auto-heal via `flow_edit` if needed (`0` credits).
2. **Stage B — `1080p` (`1920x1080`) Video Animation (`Native Composer Frames Mode`):**
   - Animate in Native Composer `Frames` Mode (`Agent Mode` OFF, `model: "Veo 3.1 - Lite"`, `duration: 8`, `max_credits: 5`, `download_quality: "upscaled"` $\rightarrow$ `1920x1080`):
     - **Shot 1:** `first_frame = SC###_KF01_2K.jpeg`, `last_frame = SC###_KF02_2K.jpeg`
     - **Shot 2:** `first_frame = SC###_KF02_2K.jpeg`, `last_frame = SC###_KF03_2K.jpeg`
   - Always pass the downloaded **`2752x1536` (`2K`)** JPEG paths on disk as `first_frame` and `last_frame`.
   - For open-ended continuations (`flow_continue` `mode: "exact"`), `runContinue` extracts a lossless `1920x1080` PNG from the `1080p` upscaled source video and runs in Native Composer `Frames` Mode (`Start` frame).
   - **Speaker & Silence Locks:** Explicitly state `"No spoken dialogue; all characters remain completely silent with closed mouths"` on non-dialogue shots, or explicitly specify speaker name, voice timbre, and screen side on dialogue shots while locking other characters' mouths closed.
   - Inspect every downloaded `1080p` `.mp4` via `view_file` and `ffprobe` (`GENERATION_QA.csv`), auto-healing up to 2 times before considering a Gate 2 escalation.

### Module 07: Autonomous Archival `1080p` Master Assembly (`-crf 14 -preset slow -tune film`)
- Assemble all verified `1080p` (`1920x1080`) clips via `flow_assemble` (`core.assemble`):
  - `transitions`: `"none"` across continuous Shared `2K` Bridge and `mode: "exact"` cuts, with `trim_chained_first_frame: true` (trims `0.04s` [1 frame at `24fps`] from each chained incoming shot for a zero-stutter cut).
  - **Archival Encoding (`assemble.ts`):**
    - Video: `-c:v libx264 -crf 14 -preset slow -tune film -pix_fmt yuv420p` (`~11–12 Mbps` `1080p`).
    - Audio: `-c:a aac -ar 48000 -b:a 256k` (`48 kHz` stereo, with optional neural voiceover via `flow_narrate`, `sidechain_ducking: true`, and `EBU R128 -16 LUFS`).
- Update `DELIVERY_MANIFEST.csv` and `PRODUCTION_CHECKPOINT.md`, and present the finished archival master video to the user.
