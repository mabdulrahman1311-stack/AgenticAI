# ResearchPulse — Autonomous Research Intelligence Command Center

> **DejaVu Hackathon — Advanced Agentic AI Track Submission**  
> An autonomous research-monitoring agent designed to continuously track scientific frontiers, detect meaningful scientific changes, deduplicate across preprint and secondary sources, identify direct contradictions, and synthesize evidence-backed intelligence streams.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00.svg)](https://www.sqlalchemy.org)
[![APScheduler](https://img.shields.io/badge/APScheduler-3.10+-blue.svg)](https://apscheduler.readthedocs.io)

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Why ResearchPulse Goes Beyond Simple Keyword Alerts](#2-why-researchpulse-goes-beyond-simple-keyword-alerts)
3. [6 Hackathon Rubric Evaluation Scenarios](#3-6-hackathon-rubric-evaluation-scenarios)
4. [System Architecture & Data Flow](#4-system-architecture--data-flow)
5. [Database Schema (Relational Models)](#5-database-schema-relational-models)
6. [UX/UI Command Center Aesthetic](#6-uxui-command-center-aesthetic)
7. [Step-by-Step Quickstart & Setup Guide](#7-step-by-step-quickstart--setup-guide)
8. [API Endpoints Reference](#8-api-endpoints-reference)
9. [Automated Verification & Testing](#9-automated-verification--testing)
10. [Authors & Hackathon Track Details](#10-authors--hackathon-track-details)

---

## 1. Executive Summary & Problem Statement

Academic research and AI preprints are released at an unprecedented pace. Traditional tools like Google Scholar alerts or keyword search bots produce overwhelming noise:
- **Information Overload:** Users receive dozens of near-identical alerts for minor parameter runs and re-uploads.
- **Isolated Per-Paper Summaries:** Existing tools summarize each paper in a vacuum without comparing it against prior discoveries in that field.
- **Unverified & Sensational Claims:** Ambiguous preprints claiming breakthroughs slip through without caution indicators or empirical verification checks.
- **Zero Scientific Contradiction Awareness:** Researchers are not notified when a new publication directly refutes or challenges a previously accepted paradigm.

**ResearchPulse** solves this by operating as a persistent, autonomous monitoring agent that:
1. Periodically queries research feeds (live arXiv Atom/XML and secondary digests).
2. Performs **multi-source convergence clustering** to collapse multiple articles reporting the same breakthrough into a unified parent card.
3. Conducts **historical baseline comparisons** against prior tracked findings.
4. Detects **scientific contradictions** and assigns color-coded priority warnings.
5. Computes **quantified value/metric shifts** (e.g. latency deltas, context window scaling, accuracy leaps).
6. Distinguishes **primary preprint repositories** from secondary reports with objective source reliability scoring.
7. Surfaces **traceable evidence drawers** with verbatim quotes from the paper text to eliminate hallucination.

---

## 2. Why ResearchPulse Goes Beyond Simple Keyword Alerts

| Feature | Standard Keyword Alert (Google Scholar / RSS) | Typical Conversational Chatbot | ResearchPulse Autonomous Agent |
|---|---|---|---|
| **Interaction Model** | Passive email push | Single prompt-response | Continuous autonomous agent workflow |
| **History & Memory** | None (stateless) | Transient conversation context | Relational persistent memory of prior findings |
| **Change Detection** | None (sends every hit) | No historical baseline | Compares new papers against past topic conclusions |
| **Deduplication** | Exact URL only | None | Fuzzy title matching + multi-source convergence |
| **Alert Fatigue Filter**| None | N/A | Suppresses minor updates & hyperparameter runs |
| **Contradiction Alert**| None | Only if explicitly asked | Autonomous refutation warning against baseline |
| **Traceability** | Plain link | Hallucination risk | Direct verbatim quotes & confidence scoring |

---

## 3. 6 Hackathon Rubric Evaluation Scenarios

The prototype includes built-in test handlers and realistic benchmark data for all 6 scenarios required by the DejaVu Hackathon:

### Scenario 1: Multi-Article Convergence
- **Problem:** Multiple news outlets, digests, and preprints report on the exact same core breakthrough, flooding users with duplicate cards.
- **Agent Solution:** `DeduplicationEngine` detects cross-source convergence using normalized token overlap and semantic clues, assigning a shared `cluster_id`.
- **UI Presentation:** A single parent card (*"Sparse Mixture-of-Experts with Dynamic Expert Capacity and Balanced Routing"*) featuring an expandable accordion displaying the 2 convergent secondary reports (*NeurIPS Technical Brief* and *Hugging Face Daily*), complete with source reliability badges and direct links.

### Scenario 2: Contradiction Detection
- **Problem:** Scientific literature frequently overturns previous assumptions, but researchers miss the shift.
- **Agent Solution:** `ChangeDetectionEngine` queries historical `PaperAnalysis` records. When a new paper refutes prior findings, it triggers `has_contradiction = True` and sets `significance_level = "Contradiction Warning"`.
- **Example:**
  - *Baseline Paper:* Vance et al. (`arxiv:2311.04219`) claimed linear attention mechanisms undergo entropy collapse beyond 32k tokens.
  - *Incoming Paper:* Al-Mansoor et al. (`arxiv:2404.11290`) proves 1M-token needle retrieval using Rotary-Aligned State Tracking, explicitly refuting Vance et al.
- **UI Presentation:** Pulsing amber badge, refutation link, and dedicated diff box in the What's New Delta Matrix.

### Scenario 3: Alert Fatigue Prevention
- **Problem:** Minor prompt tweaks or slight parameter sweeps trigger high-priority alerts, causing alert fatigue.
- **Agent Solution:** Incremental cue detection flags routine variations (e.g., *“Minor Prompt Engineering Variations on HumanEval”* with +0.4% noise) as `significance_level = "Minor Update"` and suppresses high-priority push notifications.
- **UI Presentation:** Card marked with a muted badge `(Suppressed)`, filtered from high-priority streams unless explicitly searched.

### Scenario 4: Trend Emergence & Horizon Synthesis
- **Problem:** Individual papers obscure the broader multi-week direction of research.
- **Agent Solution:** `TrendAnalyzer` aggregates recurring keywords, tracks velocity (`+195%` in Speculative Decoding), and compiles timeline metrics.
- **UI Presentation:** Recharts AreaChart of research acceleration over time, theme frequency bar charts, and an autonomous narrative synthesis.

### Scenario 5: Weakly Supported Claim Handling
- **Problem:** Sensational preprints make unverified claims without empirical evidence.
- **Agent Solution:** `SignificanceRanker` scans for exaggerated buzzwords (*"solves AGI"*, *"100% accuracy on all tasks"*, *"zero errors"*) lacking benchmarks or ablation studies.
- **UI Presentation:** Vivid caution warning badge: `Caution: Unverified Claim (Reliability 42%)` with an explanatory note warning of unverified methodology.

### Scenario 6: Value / Conclusion Shifts
- **Problem:** Metric improvements are buried in lengthy abstracts.
- **Agent Solution:** Regex and structured extraction isolate numerical advances and compare them against historical baselines.
- **Example:** Self-Reflective Tree-Search (`arxiv:2404.08311`) on WebArena:
  - Task Success: `74.5% (Prior SOTA) -> 92.1% (SRTS)` (`+17.6% Absolute Gain`)
  - Execution Latency: `45.2s -> 11.4s` (`-74.8% / 4x Speedup`)
- **UI Presentation:** Dedicated Before vs After diff chips on the card and in the Delta Panel.

---

## 4. System Architecture & Data Flow

```text
       React 19 + TypeScript + Tailwind CSS Frontend
                 (Intelligence Command Center)
                              |
                     REST APIs (FastAPI)
                              |
    +-------------------------+-------------------------+
    |                         |                         |
    v                         v                         v
APScheduler Background     arXiv Public Atom API     OpenAI SDK (gpt-4o-mini)
Periodic Job Scheduler    (HTTPS + Atom XML Parser)   Structured Output JSON
    |                         |                       (Heuristic Fallback Engine)
    +-------------------------+-------------------------+
                              |
                              v
                   Autonomous Agent Pipeline
       (Deduplication -> Change Detection -> Significance Ranking)
                              |
                              v
                 SQLAlchemy Relational Engine
               (SQLite local / PostgreSQL prod)
                              |
    +-------------------------+-------------------------+
    |                         |                         |
    v                         v                         v
PaperAnalyses & Diffs     Multi-Source Clusters     Trend Snapshots
```

### Fallback Resilience
- **OpenAI Key Optional:** If an `OPENAI_API_KEY` is not provided or set to empty, ResearchPulse automatically uses its internal **Heuristic NLP Agent Engine**, allowing full evaluation, seeding, and demo testing without requiring external paid API keys.
- **arXiv Gateway Resilience:** If network timeouts or HTTP 504 errors occur during retrieval, the pipeline logs a `partial` execution status and gracefully saves available papers rather than aborting.

---

## 5. Database Schema (Relational Models)

### `Topic`
- `id` (int, PK)
- `name` (str, indexed)
- `description` (text)
- `keywords` (JSON array of strings)
- `schedule_interval_hours` (int, default 6)
- `is_active` (bool)
- `last_run_at` (datetime)
- `created_at`, `updated_at` (datetime)

### `Paper`
- `id` (int, PK)
- `external_id` (str, unique, e.g. `arxiv:2403.09871`)
- `title` (str, indexed)
- `authors` (JSON list)
- `abstract` (text)
- `published_date` (datetime)
- `source_url` (str)
- `source_type` (`primary_preprint`, `secondary_report`)
- `cluster_id` (str, for multi-source convergence)
- `created_at` (datetime)

### `PaperAnalysis`
- `id` (int, PK)
- `paper_id` (FK `papers.id`)
- `topic_id` (FK `topics.id`)
- `summary` (text)
- `research_question` (text)
- `approach` (text)
- `key_findings` (JSON list)
- `relevance_score` (float, 0.0 - 1.0)
- `significance_level` (`High Impact`, `Minor Update`, `Contradiction Warning`, `Incremental Progress`)
- `confidence_score` (float)
- `source_reliability_score` (float)
- `delta_notes` (text)
- `has_contradiction` (bool)
- `contradiction_target_title` (str)
- `contradiction_detail` (text)
- `value_metric_shifts` (JSON list: `[{metric, previous, current, delta}]`)
- `weakly_supported_warning` (bool)
- `caution_notes` (text)
- `evidence_snippets` (JSON list of verbatim quotes)
- `analyzed_at` (datetime)

### `MonitoringRun`
- `id` (int, PK)
- `topic_id` (FK `topics.id`)
- `started_at`, `completed_at` (datetime)
- `status` (`success`, `partial`, `failed`, `running`)
- `papers_found_count`, `new_papers_count`, `duplicates_skipped_count` (int)
- `error_message` (text)
- `log_details` (JSON list of step-by-step diagnostic events)

### `TrendSnapshot`
- `id` (int, PK)
- `topic_id` (FK `topics.id`)
- `period_label` (str)
- `emerging_themes` (JSON list with velocity and confidence)
- `summary_narrative` (text)
- `metrics` (JSON timeline and counts)
- `created_at` (datetime)

---

## 6. UX/UI Command Center Aesthetic

The user interface is crafted with a modern, glassmorphic dark-mode aesthetic (with a clean light-mode toggle) built in React, TypeScript, and Tailwind CSS:
1. **Radar Pulse & System Status:** Real-time ticker showing active topics, verified publications, high-impact alerts, and contradiction flags.
2. **The "What's New" Delta Panel:** A dedicated diff view above the paper feed comparing incoming findings against the topic's stored history.
3. **Multi-Source Convergence Cards:** Collapses related reports into a parent card with an accordion revealing individual sources.
4. **Traceable Evidence Drawer:** Slide-in drawer with verbatim source quotes, source reliability scores, and historical metric deltas.
5. **Interactive Rubric Scenarios Modal:** A 1-click launcher allowing judges to test each of the 6 hackathon scenarios instantly.
6. **Execution Diagnostics Drawer:** Real-time terminal log viewer detailing each step of the autonomous agent pipeline.

---

## 7. Step-by-Step Quickstart & Setup Guide

### Prerequisites
- **Python 3.10+** (tested on 3.10, 3.11, 3.12, 3.13, 3.14)
- **Node.js 18+** and npm

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```
   *Note: If `OPENAI_API_KEY` is left blank, the application automatically runs its built-in Heuristic NLP Agent Engine.*

5. Start the backend server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The database tables will be created automatically, and the 6 evaluation benchmark scenarios will be seeded on startup!*

---

### Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 8. API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/topics` | List all monitored topics with latest run status & alert counts |
| `POST` | `/api/topics` | Create a new monitored research topic with keywords and interval |
| `GET` | `/api/topics/{id}` | Retrieve single topic metadata and statistics |
| `PUT` | `/api/topics/{id}` | Update topic keywords, interval, or active state |
| `DELETE`| `/api/topics/{id}` | Delete topic and unregister from background scheduler |
| `POST` | `/api/topics/{id}/trigger` | Force an immediate autonomous monitoring run for a topic |
| `GET` | `/api/topics/{id}/papers` | Retrieve enriched intelligence stream (supports `significance`, `group_by_cluster`, `search`) |
| `GET` | `/api/topics/{id}/runs` | Retrieve execution history and step diagnostic logs for a topic |
| `GET` | `/api/topics/{id}/trends` | Retrieve trend snapshots and emerging theme velocity data |
| `POST` | `/api/topics/{id}/trends/regenerate` | Force recalculation of trend matrix and synthesis narrative |
| `GET` | `/api/runs` | Fetch latest diagnostic execution logs across all topics |
| `GET` | `/api/system/stats` | System overview stats (active topics, papers, alerts, heartbeat) |
| `POST` | `/api/system/seed-scenarios` | Reset and re-seed all 6 DejaVu Hackathon evaluation scenarios |
| `POST` | `/api/system/trigger-all` | Trigger immediate monitoring runs across all active topics |

---

## 9. Automated Verification & Testing

You can verify the backend endpoints and scenario logic directly from the command line:

```bash
# Verify backend health and system stats
python -c "import urllib.request; print(urllib.request.urlopen('http://127.0.0.1:8000/api/system/stats').read().decode())"

# Verify multi-article convergence grouping
python -c "import urllib.request, json; data = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/topics/2/papers').read().decode()); clustered = [p for p in data if p['cluster_siblings_count'] > 0]; print(f'Convergent clusters: {len(clustered)}, Sources in cluster: {clustered[0][\"cluster_siblings_count\"] + 1}')"

# Verify contradiction detection
python -c "import urllib.request, json; data = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/topics/2/papers?has_contradiction=true').read().decode()); print(f'Contradictions flagged: {len(data)}, Target refutation: {data[0][\"contradiction_target_title\"][:50]}...')"

# Verify live arXiv retrieval
python -c "import asyncio, sys; sys.path.insert(0, 'backend'); from app.retrieval.arxiv_client import ArxivClient; res = asyncio.run(ArxivClient().fetch_papers(['agentic reasoning'], max_results=2)); print(f'arXiv status: {res[\"status\"]}, Retrieved: {len(res[\"papers\"])}') "
```

---

## 10. Authors & Hackathon Track Details

- **Project:** ResearchPulse — Autonomous Research Intelligence Command Center
- **Hackathon:** DejaVu Hackathon
- **Track:** Advanced Agentic AI Track
- **Core Capabilities:** Meaningful-Change Detection &bull; Multi-Source Deduplication &bull; Historical Comparison &bull; Trend Emergence &bull; Significance Ranking &bull; Source Reliability &bull; Traceable Grounded Summaries
