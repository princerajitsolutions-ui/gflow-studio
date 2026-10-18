---
name: gflow-studio
description: >-
  Autonomous Multi-Style AI Film & Web Series Production Studio for Google Flow (flow.google.com — Veo 3.1, Nano Banana Pro) powered by flow-mcp and the V4.0 Universal AI Cinematic Master Director framework.
  Activate whenever the user says "use gflow-studio", "GFlow Studio", "Flow Studio", "use gflow-agent", "Create a GFlow Video", or asks to produce a consistent multi-shot video or multi-episode web series in Google Flow.
  Enforces a Low-Friction 2-Gate Approval Policy (Gate 1 at initial setup/story & Cast/Skill Reference check via selectable ask_question options; Gate 2 only on unrecoverable video generation blockers),
  Shared Series-Level Bibles (00_SERIES_BIBLE/ outside episode folders) vs. Episode Collections (episodes/EP01/, EP02/),
  0-Credit 2K (2752x1536) Master Bibles (Characters on #808080 backdrop with Hero/Heroine/Supporting reference likeness + story wardrobe adaptation, Locked Voices, Skills/Abilities/Auras, Creatures, Environments, Props),
  0-Credit Shared 2K Bridge Keyframe Storyboarding (eliminating video snapshot degradation), 2K Multi-Character Composite Keyframes,
  ARRI Alexa Mini LF 5600K Natural Skin & Pore Realism Lock, 1080p Veo 3.1 Start+End Frame Animation, and Archival FFmpeg Mastering (-crf 14 -preset slow -tune film, 48kHz/256kbps AAC).
---

# GFlow Studio (`gflow-studio`) — V4.0 Autonomous Master Director & Google Flow MCP Pipeline

Whenever the user asks to use **`gflow-studio`**, **"GFlow Studio"**, **"Flow Studio"**, **`gflow-agent`**, or requests a multi-shot film or multi-episode web series in **Google Flow (`flow.google.com`)**, follow this V4.0 Autonomous Master Director workflow powered by `flow-mcp` (`C:\Users\babaj\Projects\Antigravity\GFlow\flow-mcp`).

Companion reference files in this skill directory:
- [`MASTER_DIRECTOR_PROMPT.md`](./MASTER_DIRECTOR_PROMPT.md) — Full V4.0 Universal AI Cinematic Master Director specification (Modules 00–07, Global Production Controller, 8-Layer Shot Engineering, and Automated QA/Recovery).
- [`PRODUCTION_TEMPLATES.md`](./PRODUCTION_TEMPLATES.md) — Templates `T0–T8` (15-Section Scene Packet, 18-Section Shot Packet, Audio Cue Contract, and Production Checkpoint).
- [`GPC_SCHEMAS.json`](./GPC_SCHEMAS.json) & [`templates/`](./templates/) — Machine-readable schemas and 13 CSV register headers (including `SKILL_REGISTER.csv`) maintained silently in `00_SERIES_BIBLE/manifests/` and `episodes/EP##/manifests/`.

---

## 1. Non-Negotiable 2-Gate Low-Friction Approval Policy & Selectable Options (`ask_question`)

Never stop at 17 micro-gates or ask open-ended text questions when selectable options can be provided.

1. **GATE 1 — Initial Setup, Story Sign-Off & Cast/Skill Reference Check:**
   - Read any details already provided by the user.
   - For any missing setup choices (`Module 00`: **Standalone Film vs. Multi-Episode Web Series**, Runtime, Aspect Ratio, Visual Style, Audio Route, Language) or story concept/hook selection (`Module 01` when no full script is supplied), **always call the `ask_question` tool** to present interactive, selectable multiple-choice options (prefixing the best option with `(Recommended)`).
   - **Main Cast & Skill Reference Check (Once Character & Skill Design Is Drafted in `Module 03`):** Immediately after drafting the character profiles, **story-required wardrobes** for the **Hero, Heroine, and Main Supporting Roles**, and any **Skill / Ability Cards**, present the summary and ask the user (via `ask_question` selectable options) whether they would like to provide reference images for:
     - **Hero, Heroine, or Main Supporting Roles** (face/likeness photos to be dressed in the story wardrobe), and/or
     - **Specific Skills / Abilities / VFX** (or let Google Flow generate all `2K` Character & Skill Master Plates automatically).
   - Once the user provides any reference images (or selects AI-generated masters), **do NOT ask for any further approvals across Modules 03, 04, 05, 06, or 07.** Execute the entire production pipeline autonomously from `2K` Master Bibles to the stitched `1080p` `-crf 14` master video.
2. **GATE 2 — Exception-Only Escalation (During Video Generation / QA Only If Needed):**
   - During `Module 06` (`2K` keyframe & `1080p` video generation), inspect every output file via `view_file` and `ffprobe`. If a defect occurs (identity drift, extra limb, lip-sync mismatch, or transient Flow error), **automatically self-heal first** (up to 2 targeted retries, `flow_edit` surgical tweaks, or `2K` keyframe recompositions).
   - **Only pause and invoke Gate 2** (via `ask_question` with selectable recovery options) if an unrecoverable blocker occurs (e.g., Flow credits exhausted, persistent content policy refusal requiring a script change, or an explicit user interruption).
3. **Silent Background Manifests (Zero Chat Clutter):**
   - Write all 15-section Scene Packets, 18-section Shot Packets, Bibles, and CSV registers (`PROJECT_REGISTER.csv`, `ASSET_REGISTER.csv`, `SKILL_REGISTER.csv`, `SCENE_MANIFEST.csv`, `SHOT_MANIFEST.csv`, `REFERENCE_MAP.csv`, `CONTINUITY_STATES.csv`, `AUDIO_CUES.csv`, `GENERATION_QA.csv`, `DELIVERY_MANIFEST.csv`, `PRODUCTION_CHECKPOINT.md`) to disk rather than dumping walls of template text into chat.

---

## 2. Web Series vs. Standalone Architecture (Google Flow + Local Disk + GitHub Rules)

### A. Google Flow (`flow.google.com`) Project & Naming Convention
- **1 Google Flow Project per Series (or Standalone Film):** Because Characters (with locked Voices) and Ingredients (`asset:<Title>`) live inside a Flow Project, keep **all episodes of a Web Series inside the same Flow Project** so Episode 2, Episode 3, etc. immediately reuse every Character, Environment, Prop, and Skill Card without re-uploading.
- **Asset Prefixing Inside the Flow Project:**
  - **Characters Tab (`Characters` nav):** `Hero_<Name>`, `Heroine_<Name>`, `Support_<Name>` (registered once with locked voices).
  - **Shared Series Bibles in Grid (`BIBLE_*` prefix):**
    - `BIBLE_CHAR_<Name>_<Wardrobe>_2K` (Wardrobe variants across acts/episodes)
    - `BIBLE_SKILL_<SkillName>_2K` (Skill / Aura / Summon / System UI Master Plates)
    - `BIBLE_ENV_<Location>_2K` (Recurring Environment / Set Plates)
    - `BIBLE_PROP_<Object>_2K` (Recurring Weapons / Artifacts / Relics)
  - **Episode-Scoped Keyframes & Shots (`EP##_*` prefix — or `SC##_*` for Standalone):**
    - Keyframes: `EP01_SC01_KF01_2K`, `EP01_SC01_KF02_2K`...
    - Video Shots: `EP01_SC01_SH01`, `EP01_SC01_SH02`...

### B. Local Disk Folder Structure (`C:\Users\babaj\Projects\Antigravity\GFlow\output\<Series_Title>\`)
Shared assets always sit **outside** the episode folders in `00_SERIES_BIBLE\`, while episode-specific scripts, keyframes, shots, and masters live inside `episodes\EP##_<Title>\` (or `STANDALONE\` for a single film):

```text
C:\Users\babaj\Projects\Antigravity\GFlow\output\<Series_Title>\
├── 00_SERIES_BIBLE\                     <-- SHARED ACROSS ALL EPISODES (Never Duplicated)
│   ├── characters\                      <-- 2K #808080 Character Masters & Wardrobe Variants
│   ├── skills\                          <-- 2K Skill Cards, Active Aura States & Summon Plates
│   ├── environments\                    <-- 2K Empty Architectural / World Plates
│   ├── props\                           <-- 2K Hero Weapons, Relics & System UI Plates
│   └── manifests\                       <-- SERIES_BIBLE.md, PROJECT_REGISTER.csv, ASSET_REGISTER.csv, SKILL_REGISTER.csv, CONTINUITY_STATES.csv
└── episodes\                            <-- EPISODE COLLECTIONS (or 'STANDALONE\' for a single film)
    ├── EP01_<Episode_Title>\
    │   ├── manifests\                   <-- SCREENPLAY_EP01.md, SCENE_MANIFEST.csv, SHOT_MANIFEST.csv, AUDIO_CUES.csv, GENERATION_QA.csv
    │   ├── keyframes\                   <-- EP01_SC01_KF01_2K.jpeg, EP01_SC01_KF02_2K.jpeg...
    │   ├── shots\                       <-- EP01_SC01_SH01_1080P.mp4, EP01_SC01_SH02_1080P.mp4...
    │   ├── audio\                       <-- Episode voiceover & audio stems
    │   └── master\                      <-- <Series>_EP01_MASTER_1080P_CRF14.mp4
    └── EP02_<Episode_Title>\
        └── ...
```

### C. GitHub Storage Rule (Zero Heavy Media in GitHub)
- **Never commit or push project media or `output/` folders** (`.mp4`, `.mov`, `.jpeg`, `.png`, `.wav`, `.m4a`, `.zip`) to GitHub. GitHub is reserved strictly for the `flow-mcp` engine, `gflow-studio` skill docs, and empty CSV/JSON schemas. All project assets and rendered episodes remain strictly on local disk.

---

## 3. Core Optical & Natural Skin Realism Lock (Mandatory on All Live-Action Prompts)

Never use heavy orange/teal LUT prompts (such as `"Kodak 2383 color grade"` or `"warm tungsten key light and cool teal shadows"`) that double-bake contrast or create waxy/fabricated orange skin tones. Always append this optical lock:

> `"Shot on ARRI Alexa Mini LF with 35mm Panavision Primo prime lens, natural 5600K daylight color balance, authentic unretouched human skin micro-texture with visible fine pores, natural freckles, and realistic subsurface scattering, true-to-life original human skin tone, zero waxy or plastic smoothing, full-frame 16:9 with no letterbox bars."`

---

## 4. Autonomous End-to-End Execution Pipeline (Modules 00–07)

### Module 00 & Module 01: Unified Intake & Concept Selection (`Gate 1` via `ask_question`)
- Present missing setup preferences (**Web Series vs. Standalone**, Aspect Ratio, Visual Style, Audio Route) and (if starting from a premise/topic) 3–4 high-hook story concepts in a single `ask_question` modal.
- If continuing an existing **Web Series** (`EP02+`), automatically load `00_SERIES_BIBLE/manifests/` (`ASSET_REGISTER.csv`, `SKILL_REGISTER.csv`, `CONTINUITY_STATES.csv`) so all existing Characters, Wardrobes, Skills, Environments, and Props are reused automatically.

### Module 02: Autonomous Screenplay & Mystery Ledger (`episodes/EP##/manifests/SCREENPLAY_EP##.md`)
- Generate the episode treatment, beat sheet, Mystery Clue $\rightarrow$ Reveal Ledger, and complete production screenplay segmented into `8s` shot beats (`EP##_SC###_SH###`).

### Module 03: Character Design, Cast Reference Intake, Story Wardrobe Adaptation & Skill Bibles
1. **Step 1 — Draft Character Wardrobes & Skill Cards:**
   - Define the physical DNA, personality, voice, and **story-specific wardrobe(s)** for the **Hero, Heroine, and Main Supporting Roles**.
   - For action/fantasy/progression stories (e.g., *Solo Leveling*-style powers), define the **5-Point Skill Cards** in `00_SERIES_BIBLE/manifests/SKILL_REGISTER.csv`:
     1. **Trigger / Cast Tell** (eye glow shift, hand seal, weapon stance, system prompt, vocal command).
     2. **VFX Geometry & Exact Hex Palette** (e.g., `#08080C` abyssal shadow smoke + `#7B2CBF` monarch violet rim veins).
     3. **Skin & Set Lighting Interaction** (sharp rim-lighting without blowing out facial exposure or skin pores).
     4. **Kinetic Progression (`Start` $\rightarrow$ `End`)** (how the power erupts across the `8s` shot).
     5. **Signature SFX & Vocal Cue** (sub-bass drop, blade resonance, crystalline system chime).
2. **Step 2 — Ask for Cast & Skill Reference Images (`ask_question`):**
   - Ask via selectable options whether the user wants to provide reference photos for the **Hero, Heroine, or Supporting Roles** (or specific Skills), or generate them in Google Flow.
3. **Step 3 — Generate `0`-Credit `2K` Character & Skill Masters (`00_SERIES_BIBLE/`):**
   - **Reference Face + Story Wardrobe (`flow_character`):** Pass **both** `image: "<user_reference_path>"` and `describe: "<story-required wardrobe>"` so Flow locks 100% of the reference facial likeness while dressing them in the story's required wardrobe on a `#808080` studio backdrop in `2K` (`2752x1536`, `0` credits), and locks their voice (`Aoede`, `Charon`, `Fenrir`, `Kore`, `Puck`).
   - **Multi-Wardrobe & Skill-State Masters:** Generate `0`-credit `2K` Wardrobe Variant sheets (`BIBLE_CHAR_<Name>_<Wardrobe>_2K.jpeg`) and Character-in-Skill-State sheets (`BIBLE_CHAR_<Name>_<Skill>_2K.jpeg`) plus standalone Skill/Summon/System UI plates (`BIBLE_SKILL_<Name>_2K.jpeg`) in `00_SERIES_BIBLE/skills/`.

### Module 04: Autonomous `0`-Credit `2K` World, Environment & Hero Prop Bibles (`00_SERIES_BIBLE/`)
- Generate `16:9` `2K` (`2752x1536`) empty architectural/location plates (`BIBLE_ENV_*`) in `00_SERIES_BIBLE/environments/` and macro hero prop plates (`BIBLE_PROP_*`) in `00_SERIES_BIBLE/props/` (`Nano Banana Pro`, `max_credits: 0`, `download_quality: "upscaled"`).
- Verify with `view_file` / `ffprobe` (`2752x1536`) and log in `00_SERIES_BIBLE/manifests/ASSET_REGISTER.csv`.

### Module 05 & Module 06: Scene/Shot Engineering, `0`-Credit Shared `2K` Bridge Keyframes & `1080p` Video Animation
1. **Stage A — `0`-Credit Shared `2K` (`2752x1536`) Bridge Keyframe Composition (`episodes/EP##/keyframes/`):**
   - Never rely on low-resolution video last-frame snapshots between continuous shots.
   - Generate chained `2K` (`2752x1536`) stills in Google Flow (`type: "image"`, `max_credits: 0`, `download_quality: "upscaled"`):
     - `EP##_SC###_KF01_2K.jpeg`: References `["asset:<Character>", "asset:BIBLE_ENV_<Name>", "asset:BIBLE_PROP_or_SKILL_<Name>"]`
     - `EP##_SC###_KF02_2K.jpeg`: `reference_previous: true` + `["asset:<Character>", "asset:BIBLE_PROP_or_SKILL_<Name>"]` (**Shared Bridge Frame**: End of `SH001` & Start of `SH002`)
     - **For Skill / Ability Shots:** `KF01_2K` captures the **Activation / Trigger State** (eye glow, stance, rune/UI ignition) and `KF02_2K` captures the **Manifestation / Impact State** (shadow eruption, weapon slash arc, telekinetic shockwave).
   - Inspect every `2K` keyframe via `view_file` and auto-heal via `flow_edit` if needed (`0` credits).
2. **Stage B — `1080p` (`1920x1080`) Video Animation (`episodes/EP##/shots/`):**
   - **Standard Shots ($\le 3$ Reference Ingredients or `Start+End` `2K` Bridge Keyframes):** Animate in Native Composer `Frames` Mode (`Agent Mode` OFF, `model: "Veo 3.1 - Lite"`, `duration: 8`, `max_credits: 5`, `download_quality: "upscaled"` $\rightarrow$ `1920x1080` strictly enforced):
     - **Shot 1:** `first_frame = EP##_SC###_KF01_2K.jpeg`, `last_frame = EP##_SC###_KF02_2K.jpeg`
     - **Shot 2:** `first_frame = EP##_SC###_KF02_2K.jpeg`, `last_frame = EP##_SC###_KF03_2K.jpeg`
   - **Complex Multi-Ingredient Shots ($> 3$ Reference Ingredients, i.e., 4–10 Reference Assets):** Whenever a complex video shot directly attaches **more than 3 reference ingredients** (e.g., Hero + Heroine + Supporting Character + Environment + Prop/Skill in a single `Ingredients` video shot), `flow-mcp` **automatically switches `model` to `"Omni 1.1 Flash"` (`OmniFlat-v1.1`)** (as `Veo 3.1` is capped at 3 ingredients while `Omni 1.1 Flash` supports up to 10 reference ingredients) and downloads in `1080p Upscaled`. Only use `Omni 1.1 Flash` for these complex $>3$-ingredient shots; keep all standard $\le 3$-ingredient and `Start+End` keyframe shots on `Veo 3.1`.
   - **Speaker & Silence Locks:** Explicitly state `"No spoken dialogue; all characters remain completely silent with closed mouths"` on non-dialogue shots, or explicitly specify speaker name, voice timbre, and screen side on dialogue shots while locking other characters' mouths closed.
   - Inspect every downloaded `1080p` `.mp4` via `view_file` and `ffprobe` (`GENERATION_QA.csv`), auto-healing up to 2 times before considering a Gate 2 escalation.

### Module 07: Autonomous Archival `1080p` Master Assembly (`episodes/EP##/master/`)
- Assemble all verified `1080p` (`1920x1080`) clips via `flow_assemble` (`core.assemble`):
  - `transitions`: `"none"` across continuous Shared `2K` Bridge and `mode: "exact"` cuts, with `trim_chained_first_frame: true` (trims `0.04s` [1 frame at `24fps`] from each chained incoming shot for a zero-stutter cut).
  - **Archival Encoding (`assemble.ts`):**
    - Video: `-c:v libx264 -crf 14 -preset slow -tune film -pix_fmt yuv420p` (`~11–12 Mbps` `1080p`).
    - Audio: `-c:a aac -ar 48000 -b:a 256k` (`48 kHz` stereo, with optional neural voiceover via `flow_narrate`, `sidechain_ducking: true`, and `EBU R128 -16 LUFS`).
- Update `CONTINUITY_STATES.csv` in `00_SERIES_BIBLE/manifests/` (so the next episode knows every character's latest wardrobe, injuries, unlocked skills, and narrative state) and present the finished archival master video to the user.
