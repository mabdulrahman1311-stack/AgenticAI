# ResearchPulse — Autonomous Research Monitoring Agent

> **ResearchPulse** is an agentic research-monitoring system designed to keep track of selected research topics, discover new publications, analyze them, identify important changes, and notify users when relevant research appears.

**Project type:** AI / Agentic AI / Research Monitoring  
**Team size:** 4 members  
**Project status:** Concept and project documentation in progress; implementation details should be updated as features are built and tested.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [How ResearchPulse Differs from a Chatbot](#4-how-researchpulse-differs-from-a-chatbot)
5. [Objectives](#5-objectives)
6. [Key Features](#6-key-features)
7. [Target Users and Use Cases](#7-target-users-and-use-cases)
8. [System Workflow](#8-system-workflow)
9. [System Architecture](#9-system-architecture)
10. [Planned Technology Stack](#10-planned-technology-stack)
11. [Core Data and AI Processing](#11-core-data-and-ai-processing)
12. [Team Responsibilities](#12-team-responsibilities)
13. [Expected Outcomes and Benefits](#13-expected-outcomes-and-benefits)
14. [Challenges and Safeguards](#14-challenges-and-safeguards)
15. [Future Scope](#15-future-scope)
16. [Development Roadmap](#16-development-roadmap)
17. [Project Status](#17-project-status)
18. [References](#18-references)

---

## 1. Overview

ResearchPulse is an **autonomous research monitoring agent** intended to help students, researchers, developers, and professionals follow fast-moving areas of research without manually searching for new papers every day.

A user selects topics or keywords they want to monitor. ResearchPulse periodically checks available research sources, finds publications that may be new or relevant, removes duplicates, uses AI to extract useful information, compares new findings with previously tracked results, and prepares evidence-backed updates.

The goal is not just to answer a question once. The goal is to support an ongoing monitoring process that can run on a schedule and surface useful updates over time.

## 2. Problem Statement

Research is published across different websites and repositories, and new papers appear continuously. Keeping up with relevant publications can require repeated searches, reading many abstracts, comparing papers, and deciding which updates matter.

This creates several problems:

- **Time-consuming monitoring:** users must repeatedly search for new publications.
- **Information overload:** many results may be unrelated, repetitive, or low priority.
- **Missed updates:** important work can be overlooked between manual searches.
- **Limited comparison:** it takes effort to understand how a new paper relates to earlier work.
- **Scattered information:** findings and paper links can be spread across multiple sources.

ResearchPulse aims to reduce this manual work while keeping the original paper links and supporting evidence available for verification.

## 3. Proposed Solution

ResearchPulse will let a user define a topic to monitor and configure how often the system checks for updates. On each monitoring run, the agent will:

1. Retrieve potentially relevant publications from supported research sources.
2. Normalize publication details and identify duplicates.
3. Assess relevance against the user's topic and preferences.
4. Generate a concise summary of each relevant paper, including its research question, approach, and key findings where the source provides enough information.
5. Compare the new results with the previously stored monitoring history.
6. Highlight noteworthy new papers or changes in the research landscape.
7. Store the results and prepare notifications or a digest for the user.

The design is intended to make monitoring **continuous, traceable, and easier to act on**. Any generated summary should link back to its source so the user can check the original publication.

## 4. How ResearchPulse Differs from a Chatbot

| Capability | Typical question-answering chatbot | ResearchPulse |
|---|---|---|
| Main interaction | Responds when a user sends a prompt | Monitors saved topics across repeated runs |
| Timing | Usually prompt-driven | Can run on a configured schedule |
| Research discovery | May search when asked | Repeatedly retrieves new publications from configured sources |
| History | May not maintain a structured monitoring history | Stores prior results to support deduplication and change detection |
| Relevance | Answers the current question | Ranks and filters publications against a monitoring topic |
| Updates | Usually requires another prompt | Can prepare alerts or digests when useful new results are found |
| Evidence | Depends on the chatbot and its tools | Designed to retain paper metadata and source links for checking |
| Main purpose | Conversational assistance | Ongoing research tracking and update discovery |

**Core difference:** a chatbot is mainly a conversational interface; ResearchPulse is intended to be a persistent monitoring workflow. It combines scheduled retrieval, memory of prior results, analysis, change detection, and notifications. The AI model is one component of the system rather than the entire system.

## 5. Objectives

- Automate recurring searches for research papers on chosen topics.
- Reduce the time needed to identify relevant publications.
- Summarize useful information in an accessible format.
- Identify new results and reduce duplicate notifications.
- Maintain a history of monitored papers and monitoring runs.
- Provide source links so users can verify AI-generated descriptions.
- Build a modular system that can support more research sources and analysis tools over time.

## 6. Key Features

The following features describe the intended product. Mark each feature as complete only after it has been implemented and tested.

### 6.1 Topic Monitoring
Users can define topics, keywords, or research areas they want ResearchPulse to follow.

### 6.2 Scheduled Research Discovery
The system can run checks at a configured interval instead of relying on the user to start every search manually.

### 6.3 Research Retrieval
The agent retrieves publication metadata and available abstracts from supported sources, such as arXiv. Additional sources may be added later.

### 6.4 Duplicate Detection
The system checks identifiers, titles, or normalized metadata to avoid storing or notifying users about the same paper repeatedly.

### 6.5 AI-Powered Paper Summaries
The system generates structured summaries from available paper information. It should distinguish source-supported facts from uncertainty and should not invent details that are absent from the source.

### 6.6 Relevance Ranking
The system assigns a relevance score or priority based on the user's topic and configured preferences. The score should be treated as an aid, not a guarantee of research quality.

### 6.7 Change Detection
New results are compared with the monitoring history so the system can identify newly discovered papers and avoid repeating unchanged information unnecessarily.

### 6.8 Notifications and Digests
The system is designed to prepare concise alerts or periodic digests containing the paper title, short explanation of relevance, publication details, and source link.

### 6.9 Monitoring History
Users can review previously found papers and earlier monitoring results rather than losing context after each run.

## 7. Target Users and Use Cases

### Target Users
- College students exploring a technical or academic topic.
- Researchers following developments in a research field.
- Developers tracking advances in AI, software, or engineering.
- Innovation teams that need regular awareness of emerging research.

### Example Use Cases

**Use case 1 — AI research:** A student monitors large language models and receives a digest of newly found papers.

**Use case 2 — Cybersecurity:** A developer tracks research on a particular security topic and reviews new publications during scheduled checks.

**Use case 3 — Literature review:** A researcher monitors a subject over several weeks and uses the stored paper list to help organize a literature review.

**Use case 4 — Technology trends:** A team follows a technical area and receives a curated list of potentially important new work instead of scanning multiple sources manually.

## 8. System Workflow

```text
User creates a monitoring topic
            |
            v
Scheduler starts a monitoring run
            |
            v
Retrieve papers from configured sources
            |
            v
Normalize metadata and remove duplicates
            |
            v
Filter and rank by relevance
            |
            v
AI summarizes relevant papers
            |
            v
Compare results with stored history
            |
            v
Save papers, summaries, and run details
            |
            v
Prepare alerts or a research digest
            |
            v
User opens the update and checks source papers
```

The workflow should handle partial source failures gracefully. A failed source check should be recorded rather than silently treated as proof that no new papers exist.

## 9. System Architecture

The proposed system is divided into the following components:

| Component | Responsibility |
|---|---|
| Frontend | Lets users create topics, view papers, and review summaries and alerts |
| Backend API | Handles requests, validation, authentication if implemented, and communication between components |
| Scheduler | Starts recurring monitoring jobs |
| Research retrieval module | Queries configured research sources and collects metadata |
| Processing module | Normalizes metadata and detects likely duplicates |
| AI analysis module | Produces structured summaries and relevance assessments |
| Change-detection module | Compares the current run with previously stored results |
| Database | Stores topics, papers, monitoring runs, summaries, and notification status |
| Notification module | Prepares and sends alerts or digests through the configured channel |

### Proposed High-Level Architecture

```text
React + TypeScript Frontend
            |
            v
       FastAPI Backend
            |
    +-------+--------+----------------+
    |                |                |
    v                v                v
Scheduler      Research Sources   AI Analysis
    |          (e.g. arXiv)      (LLM API)
    |                |                |
    +----------------+----------------+
                     |
                     v
              Processing Agent
      (deduplication, ranking, comparison)
                     |
                     v
                PostgreSQL
                     |
                     v
              Alerts / Digests
```

This is a proposed logical design, not a claim that every component is already operational.

## 10. Planned Technology Stack

The stack below is a practical starting proposal. Update it to match the libraries and services actually selected and integrated in the repository.

| Layer | Planned technology | Purpose |
|---|---|---|
| Frontend | React | Build the user interface |
| Frontend language | TypeScript | Add type safety to frontend code |
| Styling | Tailwind CSS | Create a consistent, responsive interface |
| Backend | Python with FastAPI | Provide API endpoints and connect system modules |
| AI model | OpenAI API or another compatible LLM API | Summarize papers and help assess relevance |
| Agent orchestration | Python modules; LangGraph is optional | Organize retrieval, analysis, and decision steps if the workflow needs it |
| Primary research source | arXiv API | Retrieve publication metadata and abstracts where available |
| Additional research source | Semantic Scholar API, optional | Expand coverage where access and API limits allow |
| Database | PostgreSQL | Persist monitoring data and history |
| Database access | SQLAlchemy | Map Python application models to database records |
| Scheduling | APScheduler | Trigger periodic monitoring jobs |
| Semantic similarity | Sentence Transformers, optional | Help compare topics and identify semantically similar papers |
| Backend testing | Pytest and API integration tests | Check backend logic and endpoint behavior |
| Frontend testing | Vitest and React Testing Library | Test frontend components and behavior |
| Version control | Git and GitHub | Track code, review changes, and collaborate as a team |
| Deployment | Cloud hosting to be selected | Make the application accessible for a demonstration or production use |

**Stack consistency note:** this README assumes a Python/FastAPI backend and SQLAlchemy for database access. Prisma is usually a better fit for a TypeScript/Node.js backend. If the team chooses Node.js and Prisma instead, update the backend, database-access, and testing sections together rather than listing incompatible choices as though both are in use.

### AI Capabilities

AI may be used to:

- Summarize paper titles, abstracts, and other permitted source content.
- Explain why a publication may be relevant to a monitored topic.
- Extract structured fields when supported by the source material.
- Draft concise research digests.

AI output should be paired with source links and basic validation. An LLM should not be treated as the authority for publication metadata when that information can be retrieved directly from the source.

## 11. Core Data and AI Processing

### Suggested Data Entities

- **User:** account and preferences, if user accounts are included.
- **Topic:** monitored topic, keywords, sources, and scheduling preferences.
- **Paper:** title, authors, abstract, publication date, source, external identifier, and URL.
- **Paper analysis:** summary, relevance score, explanation, and analysis timestamp.
- **Monitoring run:** start time, completion status, sources checked, and run results.
- **Alert or digest:** related topic, included papers, creation time, and delivery status.

These are suggested entities for initial database design; the final schema may change as requirements become clearer.

### Suggested Processing Rules

1. Prefer stable publication identifiers when checking whether a paper has already been stored.
2. If an identifier is missing, use normalized metadata such as title and authors as a fallback for duplicate checks.
3. Store the source URL and retrieval timestamp for traceability.
4. Keep the relevance score separate from measures of paper quality or credibility.
5. Record failures and incomplete runs so the system can distinguish a source outage from a run that found no new papers.
6. Generate a notification only when there is a meaningful update or when the user explicitly requests a full digest.
7. Allow users to open the original source and verify the summary themselves.

## 12. Team Responsibilities

For a team of four, responsibilities can be divided as follows. Team members should coordinate API contracts and agree on data formats before building modules in parallel.

| Team member / role | Main responsibilities |
|---|---|
| Member 1 — Frontend | React interface, topic management screens, paper list, detail pages, and digest display |
| Member 2 — Backend and database | FastAPI endpoints, PostgreSQL schema, persistence, and integration between modules |
| Member 3 — Research retrieval and scheduling | Research-source integration, scheduled runs, metadata normalization, and duplicate detection |
| Member 4 — AI analysis and quality assurance | Prompt design, summaries, relevance ranking, change-detection support, testing, and demo validation |

These are proposed roles, not fixed assignments. For a small hackathon team, each person may help with integration, documentation, and the final presentation.

### Suggested Collaboration Practices

- Keep the API contract and database fields documented in the repository.
- Use separate Git branches for independent features and review changes before merging.
- Store API keys in environment variables or a secret manager; never commit secrets to GitHub.
- Assign one owner to integrate the complete end-to-end demo.
- Test the full workflow with a small set of known papers before expanding the number of sources.

## 13. Expected Outcomes and Benefits

If implemented as designed, ResearchPulse should:

- Reduce repeated manual searching for research papers.
- Make relevant new publications easier to discover.
- Give users a faster first understanding of papers through concise summaries.
- Reduce repeated results with deduplication and monitoring history.
- Improve continuity by comparing each run with previous results.
- Make research updates easier to verify through source links.

These are expected benefits and should be measured during testing rather than presented as proven results before evaluation.

## 14. Challenges and Safeguards

| Challenge | Proposed safeguard |
|---|---|
| Incomplete or unavailable source data | Record source status and show when a monitoring run is partial |
| Duplicate or near-duplicate papers | Check stable identifiers and normalized metadata; review uncertain matches |
| Incorrect AI summaries | Keep summaries grounded in retrieved content and retain original source links |
| Irrelevant results | Tune topic terms and ranking rules using test examples and user feedback |
| API rate limits | Respect source policies, cache results, and limit request frequency |
| Lost or repeated alerts | Track stored results and notification delivery status |
| Exposed credentials | Use environment variables or a secret manager; exclude secrets from version control |
| Overstating research importance | Explain that relevance scores are estimates and not measures of scientific validity |

## 15. Future Scope

Potential improvements after the first working version include:

- Additional research repositories and publication sources.
- Personalized filters by author, venue, date, keywords, or study area.
- Semantic search across the saved research collection.
- Related-paper and citation-based discovery where source APIs support it.
- Weekly or monthly research reports.
- Email, in-app, or other notification channels.
- Export to CSV, BibTeX, or reference-management tools.
- Team workspaces for shared monitoring topics.
- User feedback to improve relevance ranking.
- Evaluation dashboards for retrieval quality, duplicate rate, summary usefulness, and notification precision.

These are future possibilities and are not part of the current scope unless implemented.

## 16. Development Roadmap

### Phase 1 — Minimum Viable Product
- Define a monitoring topic and keywords.
- Retrieve papers from one research source.
- Normalize results and remove exact duplicates.
- Store paper metadata and monitoring history.
- Show the paper list and original source links in the frontend.

### Phase 2 — AI Analysis
- Add structured summaries.
- Add topic relevance scoring and an explanation of relevance.
- Validate generated output and handle missing abstracts safely.

### Phase 3 — Autonomous Monitoring
- Add scheduled monitoring runs.
- Compare each run with stored history.
- Generate alerts only for new, relevant results.
- Record run status and source errors.

### Phase 4 — Demonstration and Evaluation
- Prepare a small, repeatable test collection.
- Check duplicate detection and relevance-ranking behavior.
- Review summary accuracy against source abstracts.
- Demonstrate a topic being monitored across at least two runs.
- Document known limitations and possible next steps.

## 17. Project Status

The project concept and the proposed workflow, architecture, technology stack, team roles, and roadmap are documented here. **This README does not imply that the listed features have already been implemented.** Update this section as development progresses.

Suggested status checklist:

- [ ] Repository structure and development setup finalized
- [ ] Frontend created
- [ ] Backend API created
- [ ] Database schema and persistence implemented
- [ ] First research source integrated
- [ ] Duplicate detection tested
- [ ] AI summaries and relevance scoring integrated
- [ ] Scheduled monitoring implemented
- [ ] Change detection and alert generation implemented
- [ ] End-to-end demo tested
- [ ] Deployment and demo instructions documented

## 18. References

Use the official documentation for the services and libraries selected by the team:

- [arXiv API Access](https://info.arxiv.org/help/api/index.html)
- [Semantic Scholar API](https://www.semanticscholar.org/product/api)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [APScheduler Documentation](https://apscheduler.readthedocs.io/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub Docs](https://docs.github.com/)

---

## Summary

ResearchPulse aims to move research discovery from one-time, prompt-based searching toward ongoing, evidence-backed monitoring. Its main value is the combination of scheduled retrieval, duplicate detection, AI-supported analysis, stored history, change detection, and notifications. The first development priority should be a small end-to-end version that reliably retrieves papers, stores them, and identifies what is new; more advanced agent behavior can be added after that foundation works.
