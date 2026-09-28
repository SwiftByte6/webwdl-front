# Privacy Exposure Auditor & Web Platform (`weblab` / `deanonymizer`)

A consent-based privacy exposure auditor and interactive visual dashboard. This tool analyzes public digital footprints across multiple platforms (Reddit, Hacker News, GitHub, Stack Overflow, and personal websites), quantifies identity exposure risks, extracts direct identifiers, and generates actionable privacy risk reports to help users sanitize their online traces before passive adversaries can exploit them.

---

## 🌟 Key Features

- **Multi-Platform OSINT Activity Ingestion**:
  - **Reddit**: Post and comment history via the Arctic Shift API.
  - **Hacker News**: Submissions and comments via the HN Algolia Search API.
  - **GitHub**: Public events, user profile fields, issue/PR comments, and commit author emails via GitHub REST API.
  - **Stack Overflow**: User questions, answers, and profile metadata via Stack Exchange API v2.3.
  - **Personal Website Crawler**: Shallow link-follower that extracts contact links, `mailto:` hrefs, `/about`, `/cv`, `/contact`, and personal bio pages linked from profiles.

- **Dual-Pass Extraction Engine**:
  - **Deterministic Regex Pass**: Extracts and un-mangles obfuscated emails (`name [at] domain [dot] com`) and discovers cross-platform handles across 12+ social networks (LinkedIn, Twitter/X, Bluesky, Telegram, Instagram, etc.).
  - **LLM Contextual Pass**: Identifies soft disclosures including geographic location, employer/school affiliations, work/sleep routine timing, stylometric markers, and demographic disclosures. Every finding is bound directly to quote and permalink evidence.

- **Interactive Next.js Web Dashboard**:
  - Modern web app built with Next.js 16 (App Router), React 19, and Tailwind CSS v4.
  - Interactive WebGL visual effects powered by Three.js & `@react-three/fiber`.
  - Detailed Audit Risk Report viewer with overall risk scoring (High / Moderate / Low), evidence cards, direct identifier highlights, and concrete remediation steps.
  - API endpoint (`/api/audit`) providing dynamic background analysis and JSON payload outputs.

- **Defensive Command-Line Interface (`@deanonymizer/cli`)**:
  - Full-featured CLI for batch audits, CI integration, structured JSON output, concurrency control, and customizable rate limits.
  - Dual provider options (Anthropic with prompt caching, OpenAI-compatible APIs like OpenAI / Gemini / Ollama / Groq, and Claude Code CLI session integration).

---

## 🏗 System Architecture & Monorepo Layout

This project is organized as a `pnpm` monorepo containing the Next.js web application and the TypeScript backend package:

```
webwdl-front/
├── app/                        # Next.js 16 App Router UI & API Routes
│   ├── api/
│   │   └── audit/              # GET /api/audit API route linking backend engine to UI
│   ├── login/                  # Authorization & Consent onboarding page
│   ├── risk-report/            # Risk Report Dashboard page
│   ├── layout.js               # Main root layout & styling wrappers
│   └── page.js                 # Landing page with Hero, Workflow & Research sections
├── components/                 # React UI Components
│   ├── Beams.js / Beams.css    # 3D Three.js WebGL background effects
│   ├── Hero.js                 # Main landing section & audit trigger handle input
│   ├── Navbar.js / Footer.js   # Site navigation & institutional footer
│   ├── ResearchPaper.js        # Academic basis summary section
│   ├── ResearchModal.js        # Research abstract viewer modal
│   ├── RiskReportCard.js       # Interactive findings card component
│   └── Workflow.js             # How-it-works visual guide
├── backend/
│   └── deanonymizer/           # Standalone TypeScript OSINT & Privacy Audit Package
│       ├── src/
│       │   ├── analyze.ts      # LLM synthesis & risk evaluation
│       │   ├── consent.ts      # Interactive consent checks
│       │   ├── extract.ts      # Regex & email un-mangling pass
│       │   ├── index.ts        # CLI entry point
│       │   ├── llm/            # Multi-provider client abstraction (Anthropic/OpenAI/Claude Code)
│       │   └── sources/        # Data collectors (Reddit, HN, GitHub, StackOverflow, Web crawler)
│       ├── package.json
│       └── README.md           # Backend CLI documentation
├── docs/
│   └── ARCHITECTURE.md         # Deep-dive architecture & data flow specification
├── package.json                # Monorepo scripts & dependencies
└── pnpm-workspace.yaml         # Workspace package declaration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.x, v22.x, or v24.x
- **Package Manager**: `pnpm` (recommended) or `npm` / `yarn` / `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SwiftByte6/webwdl-front.git
   cd webwdl-front
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build workspace packages**:
   ```bash
   pnpm build
   ```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory (or set environment variables in your environment):

```bash
# Set your preferred LLM provider API key
ANTHROPIC_API_KEY=sk-ant-api03-...

# OR OpenAI-compatible endpoint key (OpenAI, Gemini, Groq, etc.)
OPENAI_API_KEY=sk-...
# OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
# OPENAI_MODEL=gemini-2.0-flash

# Optional: GitHub token to increase GitHub REST API rate limits (5,000 req/hr vs 60 req/hr)
GITHUB_TOKEN=ghp_...
```

---

## 💻 Usage

### 1. Web Application

Run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Enter a handle (e.g. `aarav_dev` or `u/username`) to initiate a consent-based audit and view the interactive risk report at `/risk-report?handle=<username>`.

### 2. Command Line Interface (CLI)

Run privacy audits directly from your terminal:

```bash
# Audit a Reddit username
pnpm --filter deanonymizer audit -- my_reddit_handle

# Multi-platform audit (Reddit + Hacker News + GitHub + Stack Overflow)
pnpm --filter deanonymizer audit -- my_reddit_handle --hn my_hn_handle --github my_gh_handle --so 1234567

# Audit using Claude Code CLI (No API key needed, uses active Claude Code session)
pnpm --filter deanonymizer audit -- my_reddit_handle --provider claude-code

# Emit JSON output to a file
pnpm --filter deanonymizer audit -- my_reddit_handle --json -o report.json
```

---

## 🔬 Research & Threat Model

### Research Basis
This tool relies on inference principles described in privacy research (e.g., [arXiv:2602.16800](https://arxiv.org/abs/2602.16800)). Disclosures that appear non-identifying in isolation (e.g. timezone, programming framework, local events) compound to yield high-confidence entity linkages when fused across multiple platforms and post histories.

### Threat Model
- **Passive Adversary**: Operates exclusively using publicly reachable APIs, web pages, and public archives.
- **No Credentials / Secret Data**: Does not perform credential stuffing, private API access, or paywalled scraping.
- **Defensive Target**: Shrink attributable digital identity surface by providing users with clear evidence links and remediation steps.

---

## 🛡 Verification & Development Commands

```bash
# Run Next.js & Backend build
pnpm build

# Run linting across workspace
pnpm lint

# Run backend unit tests
pnpm --filter deanonymizer test
```

---

## 📜 License

Distributed under the [MIT License](LICENSE).
