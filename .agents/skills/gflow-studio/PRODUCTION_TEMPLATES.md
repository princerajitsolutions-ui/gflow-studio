# PRODUCTION TEMPLATES — V4.0 (GFLOW STUDIO AUTONOMOUS EDITION)

All templates below are maintained **automatically in the background** inside `output/<Project>/manifests/` by `gflow-studio` so the chat stays concise and uncluttered. Non-applicable sections are recorded as `NOT_REQUIRED` with a brief reason.

---

## T0 — PROJECT CONFIGURATION / MODULE 00 (COLLECTED AT GATE 1 VIA `ask_question`)

```yaml
project_id: PROJECT01
format: film | clip | trailer | single_episode | series | anthology
runtime:
  target_seconds: 80
  includes_titles: false
  includes_credits: false
  episode_count: null
  per_episode_seconds: null
language:
  screenplay: English
  dialogue: English
  narration: English
  subtitle: English
  on_screen_text: English
  voice_accent: Neutral Cinematic
story_source:
  type: user_script | detailed_story | concept | ai_generated | resume
  files: []
  fidelity: CINEMATIC_ENHANCEMENT
  source_priority: approved_user_decision > approved_canon > original_user_material > approved_supporting_bibles
creative:
  primary_genre: null
  secondary_genres: []
  tone: null
  audience_intensity: PG-13
  inspirations: []
visual_style:
  category: LIVE_ACTION_PHOTOREAL
  optics_lock: "ARRI Alexa Mini LF, 35mm Panavision Primo prime lens, natural 5600K daylight balance"
  skin_realism_lock: "Authentic unretouched human skin micro-texture, visible fine pores, natural freckles, subsurface scattering, zero waxy smoothing"
  character_backdrop_lock: "#808080 solid flat neutral mid-grey studio backdrop"
technical:
  platform: GOOGLE_FLOW_WEB_MCP
  image_model_default: NANO_BANANA_PRO_2K
  image_upscale_resolution: 2752x1536
  video_model_default: VEO_3_1_LITE
  video_model_alternative: OMNI_FLASH_1_1
  source_generation_seconds: 8
  video_upscale_resolution: 1920x1080
  aspect_ratio: "16:9"
  frame_rate_num: 24
  frame_rate_den: 1
  continuity_bridge_strategy: SHARED_2K_BRIDGE_KEYFRAMES
  master_encoding: "-c:v libx264 -crf 14 -preset slow -tune film -pix_fmt yuv420p -c:a aac -ar 48000 -b:a 256k"
  audio_strategy: NATIVE_VEO_OR_HYBRID
approval_policy:
  mode: TWO_GATE_LOW_FRICTION
  gate_1_initial_setup_and_story: APPROVED
  gate_2_exception_only_escalation: ARMED
  version: V001
```

---

## T1 — CONCEPT & SCREENPLAY HANDOFF (`output/<Project>/manifests/SCREENPLAY_V001.md`)

```markdown
# Project Story & Screenplay Contract
Project | Story-source type | Source fidelity | Active version
## 1. Approved Premise / Story Synopsis (Locked at Gate 1)
## 2. Act & Sequence Beat Sheet + Mystery Clue -> Reveal Ledger
## 3. Character Goals, Relationships & Stakes
## 4. World / Supernatural Rules & Costs
## 5. Ordered Scene Outline & Runtime Allocation (8s Shot Multiples)
## 6. COMPLETE PRODUCTION SCREENPLAY (INT/EXT, Action, Exact Speaker Dialogue, Audio Cues)
```

---

## T2 — MASTER CHARACTER / CREATURE / ENVIRONMENT / PROP RECORD (`output/<Project>/manifests/BIBLES_V001.md`)

```markdown
# [ASSET_ID] — [NAME] — V###
Type: Character | Creature | Environment | Hero Prop
Status: PLANNED | GENERATED | VERIFIED_2K | APPROVED
Verified local file path:
Flow in-project asset handle: asset:<Name>
Locked voice ID (for Characters): Aoede | Charon | Fenrir | Kore | Puck | N/A
Identity / Architecture / Material DNA:
Optical & Skin Realism Lock: ARRI Alexa Mini LF 5600K + #808080 neutral studio backdrop (for Characters)
Exact executed Flow prompt:
Automated QA verification notes:
```

---

## T3 — 15-SECTION SCENE PRODUCTION PACKET (`output/<Project>/manifests/SC###_SCENE_PACKET_V001.md`)

```markdown
# [PROJECT]_SC###_SCENE_PACKET_V001
01. Scene ID, sequence, screenplay & Bible versions
02. Narrative connection (prev scene -> current scene -> next scene bridge)
03. Approved scene screenplay excerpt (location/time, action, exact dialogue, sounds)
04. Target edited duration (8s shot multiples)
05. Characters & creatures present + entering/exiting states
06. Approved master environment plate (`ENV_*`), spatial layout, 5600K lighting direction
07. Hero props (`PROP_*`), ownership, left/right hand assignment, state changes
08. Actor blocking positions & movement paths
09. Camera axis / 180-degree line & screen direction lock
10. Ordered shot coverage table (T3A) with Shared 2K Bridge Keyframe handoffs
11. Stage A (2K Image Composition) vs Stage B (Flow Video Frames/Ingredients) attachment mapping
12. Scene-wide DX/VO/MX/AM/FX/FL audio cue plan with continuous acoustic room-tone bed
13. Incoming, per-shot delta, and outgoing continuity states
14. Asset dependency verification (`2752x1536` 2K keyframes verified on disk)
15. Automated Scene QA & Assembly status
```

### T3A — Scene Shot-Coverage & Shared `2K` Bridge Table

| shot_id | script_beat | camera_axis | flow_model | flow_mode | start_frame_2k | end_frame_2k | 8s_source | trim_first_frame | audio_cues | transition | status |
|---|---|---|---|---|---|---|---:|---|---|---|---|
| SC001_SH001 | lift orb | med/axisA | VEO_3_1_LITE | FRAMES_FIRST_LAST | KF01_2K.jpeg | KF02_2K.jpeg | 8.0 | false | DX001, AM001 | none | VERIFIED_1080P |
| SC001_SH002 | gaze up | mcu/axisA | VEO_3_1_LITE | FRAMES_FIRST_LAST | KF02_2K.jpeg | KF03_2K.jpeg | 8.0 | true (0.04s) | AM001, FX001 | none | VERIFIED_1080P |

---

## T4 — 18-SECTION SHOT PRODUCTION PACKET (`output/<Project>/manifests/SC###_SH###_PACKET_V001.md`)

```markdown
# [PROJECT]_SC###_SH###_PACKET_V001
01. SHOT IDENTITY (Project/Scene/Shot ID, Bible versions, status)
02. CINEMATIC PURPOSE (Narrative objective, emotional beat)
03. VIDEO & EDIT SPECS (8.0s source, 1920x1080 upscaled, 24fps, trim_chained_first_frame)
04. MODEL DECISION (Veo 3.1 - Lite [5 credits] or Omni 1.1 Flash)
05. MODE & BRIDGE STRATEGY (FRAMES_FIRST_LAST Shared 2K Bridge | FRAMES_FIRST 2K Composite | EXACT_1080P_PNG_CONTINUE | INGREDIENTS)
06. VERIFIED SOURCE ASSET TABLE (Asset IDs, verified 2752x1536 paths on disk)
07. STAGE A — 2K IMAGE-COMPOSITION ATTACHMENTS (Assets attached to Nano Banana Pro to build KF_start / KF_end)
08. START-FRAME 2K IMAGE PROMPT & VERIFIED FILE (`SC###_KF##_2K.jpeg`, 2752x1536)
09. END-FRAME 2K IMAGE PROMPT & VERIFIED FILE (`SC###_KF##_2K.jpeg`, 2752x1536, or NOT_REQUIRED)
10. STAGE B — FLOW VIDEO ATTACHMENTS (`first_frame`, `last_frame`, or `reference_images` with Agent Mode OFF)
11. CAMERA / LENS / INITIAL FACING LOCK (35mm/50mm/85mm Panavision Primo, initial subject facing in first 8 words)
12. 0.000–8.000s TIME-CODED ACTION & PERFORMANCE BEATS
13. 8-LAYER TECHNICAL SPEC & EXECUTED FLOW VIDEO PROMPT (with ARRI Alexa Mini LF 5600K Skin Realism Lock)
14. DIALOGUE / SILENCE LOCK (Exact speaker name + voice timbre + screen side, or explicit closed-mouth silence lock)
15. CONTINUOUS ACOUSTIC BED & SFX TIMELINE (MX/AM/FX/FL)
16. INCOMING & OUTGOING CONTINUITY STATE CONTRACT
17. ARTIFACT PREVENTION GUARDS (No extra limbs, no waxy skin, no orange/teal LUT double-baking, no unscripted lip movement)
18. AUTOMATED QA & OUTPUT FILE (`SC###_SH###_1080P.mp4`, 1920x1080, bitrate, pass/self-heal log)
```

---

## T5 — AUDIO CUE CONTRACT (`output/<Project>/manifests/AUDIO_CUES.csv`)

| cue_id | shot_id | type | source_id | exact_text | lang | planned_start_ms | planned_end_ms | measured_start_ms | measured_end_ms | sync_anchor | spatial_location | carryover | fade_or_ducking | source_type | audio_asset_id | status |
|---|---|---|---|---|---|---:|---:|---:|---:|---|---|---|---|---|---|---|
| DX_SC001_001 | SC001_SH001 | DX | Aria_Aoede | After a thousand years, the Astral Orb is still warm. | English | 1500 | 6800 | 1600 | 6900 | lip movement | center | false | retain_native | NATIVE_VEO | BRIDGE_SH01_1080P.mp4 | VERIFIED |

---

## T6 — 2-GATE LOW-FRICTION APPROVAL ARCHITECTURE (REPLACES LEGACY 17-GATE FLOW)

| Gate | When Triggered | How Presented to User | What It Authorizes |
|---|---|---|---|
| **Gate 1 (Initial Setup & Story Sign-Off)** | **Once at the very beginning** (`Modules 00–01`) | Interactive selectable multiple-choice modal via `ask_question` (`(Recommended)` listed first) | Authorizes autonomous end-to-end execution of Screenplay (`M02`), `0`-credit `2K` Character/Creature Bibles (`M03`), `0`-credit `2K` World/Prop Bibles (`M04`), Scene/Shot Packets (`M05`), `0`-credit Shared `2K` Bridge Keyframes + `1080p` Video Animation (`M06`), and `-crf 14` Archival Master Assembly (`M07`). |
| **Gate 2 (Exception-Only Escalation)** | **Only if an unrecoverable blocker occurs during video generation** (`Module 06`) after 2 automatic self-heal attempts | Interactive selectable recovery options via `ask_question` | Resolves credit exhaustion, persistent policy refusals requiring a script adjustment, or user-requested revisions. |

---

## T7 — AUTOMATED QA & SELF-HEALING LOG (`output/<Project>/manifests/GENERATION_QA.csv`)

```markdown
Shot: SC###_SH### | Take: TAKE001 | Model: Veo 3.1 - Lite | Mode: FRAMES_FIRST_LAST (Shared 2K Bridge)
Resolution & Bitrate (ffprobe): 1920x1080 @ 24fps
VISUAL & SKIN REALISM: PASS (5600K natural skin tone, visible fine pores, zero waxy smoothing)
CHARACTER / PROP / ENV CONTINUITY: PASS (matches 2752x1536 start/end bridge keyframes)
DIALOGUE & LIP-SYNC / SILENCE LOCK: PASS
Decision: ACCEPT | AUTO_RETRY_SAME | AUTO_RECOMPOSE_2K_KEYFRAME | ESCALATE_TO_GATE_2
Verified file path:
```

---

## T8 — PORTABLE PRODUCTION CHECKPOINT (`output/<Project>/manifests/PRODUCTION_CHECKPOINT.md`)

```markdown
# PRODUCTION CHECKPOINT — [PROJECT] — V###
Current status: CONFIGURED | RUNNING_AUTONOMOUS_PIPELINE | DELIVERED
Gate 1 approval record:
Active Flow Project ID (`FLOW_MCP_PROJECT_ID`):
Verified 2K Character / Creature / Environment / Prop Bible paths:
Verified 2K Shared Bridge Keyframes (`2752x1536`):
Verified 1080p Video Takes (`1920x1080`):
Stitched Archival Master (`-crf 14 -preset slow -tune film`):
```
