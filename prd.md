# AIML System — Developer-Facing PRD

**Version:** 0.3 (Draft)
**Ticket:** MVP-132 (child task)
**Author:** Engineering
**Status:** Draft — Pending stakeholder review
**Last updated:** 2026-05-19
**Changelog v0.3:** Section 3, 10, and 11 updated with Vercel Workflow SDK (v4) specifics sourced from official docs at workflow-sdk.dev. Sections 2, 5, 6, 7, 8, 10 updated to move multi-language content generation from V2 to V1/MVP (EN + KO support with per-source language selection by Contributors).

---

## Table of Contents

1. [Overview & Intent](#1-overview--intent)
2. [V1 vs V2 Scope Boundary](#2-v1-vs-v2-scope-boundary)
3. [Tech Stack](#3-tech-stack)
4. [Roles & Permission Matrix](#4-roles--permission-matrix)
5. [User Flows](#5-user-flows)
6. [Data Model](#6-data-model)
7. [Server Actions & Route Handlers](#7-server-actions--route-handlers)
8. [AI Integration](#8-ai-integration)
9. [Channel Integration](#9-channel-integration)
10. [Workflow Definitions (Vercel Workflows)](#10-workflow-definitions-vercel-workflows)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Open Questions & Assumptions](#12-open-questions--assumptions)

---

## 1. Overview & Intent

### What is AIML?

AIML (AI-driven Inbound Marketing Loop System) is a **B2B marketing automation platform** targeting the global bio/pharma industry. It is not a marketing tool — the CEO frames it as **operational infrastructure**: a continuous, self-sustaining loop of content creation, review, distribution, and analysis that runs even when marketing staff are inexperienced or leadership is not actively involved.

### What the CEO actually wants (reading between the lines)

| CEO intent                                  | What it means for the dev team                                                                                                       |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| "Operator must not be able to edit"         | No free-text fields for Operators. All interaction is choice-driven (approve / reject / select). Enforce at UI and API level.        |
| "Weekly loop is forced"                     | A Vercel Cron triggers the loop every week. No manual override for Operators. Only Admin can pause via emergency stop.               |
| "NDA-safe by default"                       | Every AI-generated output must pass through a banned-phrase filter before it can be approved or distributed. This is non-negotiable. |
| "Admin oversight without daily involvement" | Admin sees summaries and statuses — not a workflow participant. They should know what happened without having to act.                |
| "Usable by beginners"                       | UX is click-driven. No training required. The system guides the Operator through each step.                                          |
| "Sustained global visibility"               | The goal is consistency and reach, not viral moments. The loop must keep running even with minimal human input.                      |

---

## 2. V1 vs V2 Scope Boundary

### V1 — MVP (Phase 1, target: 2–3 months)

The core automated loop, end to end. Minimal but fully functional.

- Role system: Admin, Operator, Contributor (auth + permission enforcement via Supabase Auth + RLS + Server Actions)
- Contributor submits a content source (URL, document, internal note)
- Tavily scrapes and extracts clean text from submitted URLs
- GPT-4 generates a draft with NDA-safe phrasing rules enforced via system prompt
- Banned-phrase filter runs before any content is surfaced for review
- Operator reviews via 3-checkbox approval UI (no free-text editing)
- Rejected content is automatically sent back to GPT-4 for regeneration
- Approved content is distributed to: **LinkedIn** (LinkedIn API), **Company Blog** (internal post), **Newsletter** (Resend)
- Weekly forced loop via Vercel Cron — not manually triggerable by Operator
- DistributionLog recorded per publish event
- Admin dashboard — loop status, content counts, channel activity (read-only, <3s load)
- All actions are logged (immutable audit trail)
- Multi-language content generation (EN + KO at minimum)

**Out of scope for V1:**

- Science Exchange integration
- EngagementMetric ingestion (LinkedIn reactions, email open rates)
- Recharts analytics dashboard
- Contributor scoring / source quality ranking
- Admin digest email
- CMS integration for blog
- SaaS / multi-tenant mode

### V2 — Phase 2 (target: 3–6 months after V1)

- EngagementMetric ingestion (LinkedIn API reactions/comments, Resend open rates)
- Recharts analytics dashboard (engagement trends, content performance per channel)
- Science Exchange channel integration
- Contributor source quality scoring
- Admin weekly digest email (summary pushed to CEO without login required)
- CMS integration for blog (Sanity or Contentful — TBD)
- AI-suggested topics based on engagement feedback loop
- SaaS / multi-tenant architecture (paywall scoping — see Open Questions)

---

## 3. Tech Stack

| Layer                 | Choice                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Framework             | Next.js (App Router)                                                                                                 |
| Server Logic          | Next.js Server Actions + Server Components                                                                           |
| Route Handlers        | Next.js Route Handlers (webhooks only)                                                                               |
| Database              | Supabase (Postgres)                                                                                                  |
| Auth                  | Supabase Auth                                                                                                        |
| AI Model              | OpenAI GPT-4                                                                                                         |
| AI Abstraction        | Vercel AI SDK                                                                                                        |
| Workflow Engine       | Vercel Workflows — powered by [Workflow SDK v4](https://workflow-sdk.dev) (`workflow` + `@workflow/ai` npm packages) |
| Workflow AI Package   | `@workflow/ai` — `DurableAgent` + `@workflow/world-vercel` for zero-config deployment                                |
| Hosting               | Vercel                                                                                                               |
| Crons                 | Vercel Cron Jobs                                                                                                     |
| Web Search / Scraping | Tavily                                                                                                               |
| LinkedIn              | LinkedIn API (official)                                                                                              |
| Email                 | Resend                                                                                                               |
| UI Components         | shadcn/ui                                                                                                            |
| Styling               | Tailwind CSS                                                                                                         |
| Charts                | Recharts (V2)                                                                                                        |
| Version Control       | GitHub                                                                                                               |

---

## 4. Roles & Permission Matrix

### Role definitions

| Role            | Who                                  | Description                                               |
| --------------- | ------------------------------------ | --------------------------------------------------------- |
| **Admin**       | CEO, business leads                  | Full visibility. System settings. No content creation.    |
| **Operator**    | Marketing / PR staff                 | Runs the loop. Reviews and approves. Cannot edit content. |
| **Contributor** | Developers, planners, internal staff | Submits content sources only. No loop visibility.         |
| **System**      | Vercel Cron / Workflows              | Automated AI processing. No human interaction.            |

### Permission matrix

| Action                   | Admin | Operator |  Contributor  |    System     |
| ------------------------ | :---: | :------: | :-----------: | :-----------: |
| View dashboard           |  ✅   |    ✅    |      ❌       |      ❌       |
| Submit content source    |  ❌   |    ❌    |      ✅       |      ❌       |
| View content source list |  ✅   |    ✅    | ✅ (own only) |      ❌       |
| Trigger AI generation    |  ❌   |    ✅    |      ❌       |      ✅       |
| View generated content   |  ✅   |    ✅    |      ❌       |      ❌       |
| Approve / reject content |  ✅   |    ✅    |      ❌       |      ❌       |
| Edit generated content   |  ❌   |    ❌    |      ❌       |      ❌       |
| Execute distribution     |  ❌   |    ✅    |      ❌       | ✅ (via cron) |
| View distribution logs   |  ✅   |    ✅    |      ❌       |      ❌       |
| Manage banned phrases    |  ✅   |    ❌    |      ❌       |      ❌       |
| Manage users / roles     |  ✅   |    ❌    |      ❌       |      ❌       |
| Configure weekly loop    |  ✅   |    ❌    |      ❌       |      ❌       |
| Emergency stop           |  ✅   |    ❌    |      ❌       |      ❌       |
| View system settings     |  ✅   |    ❌    |      ❌       |      ❌       |

### Technical enforcement

- Supabase Auth issues JWTs with a `role` claim on login
- Server Actions read the session via `createServerClient()` from `@supabase/ssr` — role is checked at the top of every action before any DB operation
- Unauthorized calls to Server Actions return early with a typed error (no data leak)
- Supabase Row Level Security (RLS) policies enforce data isolation at the database layer (e.g. Contributors can only read their own `ContentSource` rows)
- Route Handlers (webhooks) are protected by a shared secret header (`X-Webhook-Secret`)
- No client-side permission check is authoritative — all enforcement is server-side

---

## 5. User Flows

### 5.1 Contributor — Submit Content Source

```
1. Contributor logs in
2. Navigates to "Submit Content"
3. Selects target language: English | Korean
4. Selects input type: URL | Text | Document
5. If URL → system calls Tavily to scrape and preview extracted text
6. Contributor confirms / adds optional context note
7. Submits → ContentSource record created (status: PENDING, language set)
8. Confirmation shown. Contributor's work is done.
```

### 5.2 System — Weekly AI Generation Loop (Vercel Cron)

```
1. Vercel Cron fires every Monday 09:00 UTC
2. Triggers Vercel Workflow: `aiml-weekly-loop`
3. Workflow fetches all ContentSource records with status: PENDING
4. For each ContentSource:
   a. Calls Tavily if source is a URL (if not already scraped)
   b. Sends extracted text to GPT-4 via Vercel AI SDK with NDA-safe system prompt + language parameter
   c. GPT-4 generates content in the specified language (as stored in ContentSource.language)
   d. Runs banned-phrase filter on generated output
   e. If phrases detected → regenerates (max 2 retries)
   f. Creates GeneratedContent record (status: AWAITING_REVIEW, language preserved)
   g. Updates ContentSource status: PROCESSED
5. Notifies Operator via email (Resend) that content is ready for review
```

### 5.3 Operator — Review & Approve

```
1. Operator logs in → Dashboard shows pending review count
2. Navigates to "Review Queue"
3. For each GeneratedContent item:
   a. Sees language label (EN | KO)
   b. Reads generated content (read-only)
   c. Completes 3-checkbox review:
      - [ ] Factually accurate
      - [ ] NDA-safe
      - [ ] Appropriate tone for bio/pharma B2B
   d. Chooses: Approve | Reject
   e. If Approve → ReviewStatus updated: APPROVED
   f. If Reject → ReviewStatus updated: REJECTED
      → System automatically queues for AI regeneration in same language
4. Approved items appear in Distribution Hub
```

### 5.4 Operator — Distribution

```
1. Operator navigates to Distribution Hub
2. Sees all APPROVED content items
3. For each item, selects target channels:
   - [ ] LinkedIn
   - [ ] Company Blog
   - [ ] Newsletter
4. Selects: Publish Now | Schedule
5. If Schedule → picks date/time
6. Confirms → Vercel Workflow: `aiml-distribute` triggered
7. Workflow publishes to each selected channel
8. DistributionLog record created per channel per content item
9. Operator sees success/failure status per channel
```

### 5.5 Admin — Dashboard Overview

```
1. Admin logs in → Dashboard
2. Sees:
   - Weekly loop status (last run, next run, items processed)
   - Content pipeline counts (Pending / Awaiting Review / Approved / Distributed)
   - Channel activity (posts sent per channel this week)
   - Any failed distributions (with reason)
3. Can navigate to System Settings:
   - Manage banned phrases
   - Manage users and roles
   - Configure weekly loop schedule
   - Emergency stop toggle
4. Admin takes no action in the content loop itself
```

---

## 6. Data Model

### Entity: `users`

Managed by Supabase Auth. Extended with a profile table.

```sql
users (
  id          uuid PRIMARY KEY,          -- Supabase Auth UID
  email       text NOT NULL,
  role        text NOT NULL,             -- 'admin' | 'operator' | 'contributor'
  full_name   text,
  created_at  timestamptz DEFAULT now(),
  is_active   boolean DEFAULT true
)
```

### Entity: `content_sources`

```sql
content_sources (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by    uuid REFERENCES users(id),
  input_type      text NOT NULL,          -- 'url' | 'text' | 'document'
  raw_input       text,                   -- URL or raw text
  extracted_text  text,                   -- Tavily output (if URL)
  context_note    text,                   -- Optional contributor note
  language        text NOT NULL,          -- 'en' | 'ko'
  status          text NOT NULL,          -- 'pending' | 'processing' | 'processed' | 'failed'
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
)
```

RLS: Contributors can SELECT/INSERT their own rows only. Operators and Admins can SELECT all.

### Entity: `generated_content`

```sql
generated_content (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_source_id   uuid REFERENCES content_sources(id),
  generated_text      text NOT NULL,
  channel_formats     jsonb,              -- { linkedin: "...", blog: "...", newsletter: "..." }
  language            text NOT NULL,      -- 'en' | 'ko'
  generation_attempt  int DEFAULT 1,
  model_used          text DEFAULT 'gpt-4',
  prompt_version      text,               -- tracks which prompt template was used
  banned_phrase_hit   boolean DEFAULT false,
  created_at          timestamptz DEFAULT now()
)
```

### Entity: `review_statuses`

```sql
review_statuses (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_content_id  uuid REFERENCES generated_content(id),
  reviewed_by           uuid REFERENCES users(id),
  status                text NOT NULL,    -- 'awaiting_review' | 'approved' | 'rejected'
  checkbox_factual      boolean,
  checkbox_nda_safe     boolean,
  checkbox_tone         boolean,
  rejection_reason      text,             -- optional, for internal tracking
  reviewed_at           timestamptz,
  created_at            timestamptz DEFAULT now()
)
```

### Entity: `distribution_logs`

```sql
distribution_logs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_content_id  uuid REFERENCES generated_content(id),
  channel               text NOT NULL,    -- 'linkedin' | 'blog' | 'newsletter'
  status                text NOT NULL,    -- 'pending' | 'success' | 'failed'
  scheduled_at          timestamptz,
  published_at          timestamptz,
  external_post_id      text,             -- LinkedIn post ID, blog post slug, etc.
  error_message         text,
  created_at            timestamptz DEFAULT now()
)
```

### Entity: `engagement_metrics` _(V2 only — schema defined now for forward compatibility)_

```sql
engagement_metrics (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_log_id   uuid REFERENCES distribution_logs(id),
  channel               text NOT NULL,
  metric_type           text NOT NULL,    -- 'view' | 'click' | 'reaction' | 'open' | 'inquiry'
  value                 int DEFAULT 0,
  recorded_at           timestamptz DEFAULT now()
)
```

### Entity: `banned_phrases`

```sql
banned_phrases (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase      text NOT NULL,
  added_by    uuid REFERENCES users(id),
  created_at  timestamptz DEFAULT now()
)
```

### Entity: `system_config`

```sql
system_config (
  key         text PRIMARY KEY,           -- e.g. 'weekly_loop_enabled', 'loop_day', 'loop_time', 'supported_languages'
  value       text NOT NULL,
  updated_by  uuid REFERENCES users(id),
  updated_at  timestamptz DEFAULT now()
)
```

Example V1 config entries:

- `weekly_loop_enabled`: 'true' | 'false'
- `loop_day`: 'monday' (day of week, case-insensitive)
- `loop_time`: '09:00' (UTC time in HH:MM format)
- `supported_languages`: 'en,ko' (comma-separated language codes)

---

## 7. Server Actions & Route Handlers

### Architecture overview

There is no separate backend server. All user-initiated writes go through **Next.js Server Actions**. All reads happen via **Supabase client queries in Server Components**. The only Route Handlers are for inbound webhooks and Vercel Workflow callbacks.

```
Next.js App
├── Server Components       → read data directly via Supabase server client
├── Server Actions          → all user-initiated writes + workflow triggers
└── Route Handlers          → inbound webhooks only (LinkedIn OAuth, Vercel Workflow callbacks)

Vercel Workflows            → all async heavy lifting (AI generation, scraping, publishing)
Supabase RLS                → data isolation enforced at DB layer
```

Every Server Action follows this pattern:

```ts
"use server";

export async function someAction(input: InputType) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.role !== "expected_role") {
    return { error: "Unauthorized" };
  }

  // DB operation or workflow trigger
}
```

---

### Server Actions

#### Content Sources

| Action                       | File                         | Role            | Description                                              |
| ---------------------------- | ---------------------------- | --------------- | -------------------------------------------------------- |
| `createContentSource(input)` | `actions/content-sources.ts` | Contributor     | Insert new ContentSource row with language field         |
| `previewScrape(url)`         | `actions/content-sources.ts` | Contributor     | Call Tavily, return extracted text preview (no DB write) |
| `getContentSources()`        | Server Component query       | Operator, Admin | Fetch all sources (RLS filters by role)                  |

#### Review

| Action                | File                | Role            | Description                                                              |
| --------------------- | ------------------- | --------------- | ------------------------------------------------------------------------ |
| `submitReview(input)` | `actions/review.ts` | Operator, Admin | Insert ReviewStatus row; if rejected, trigger `aiml-regenerate` workflow |

```ts
// input shape
{
  generated_content_id: string
  status: 'approved' | 'rejected'
  checkbox_factual: boolean
  checkbox_nda_safe: boolean
  checkbox_tone: boolean
  rejection_reason?: string  // predefined enum value, not free text
  // note: language is inherited from ContentSource; not editable on review
}
```

#### Distribution

| Action                  | File                      | Role     | Description                               |
| ----------------------- | ------------------------- | -------- | ----------------------------------------- |
| `publishContent(input)` | `actions/distribution.ts` | Operator | Trigger `aiml-distribute` Vercel Workflow |

```ts
// input shape
{
  generated_content_id: string
  channels: ('linkedin' | 'blog' | 'newsletter')[]
  scheduled_at?: string  // ISO 8601, null = publish immediately
}
```

#### System Settings (Admin only)

| Action                     | File                  | Role  | Description                       |
| -------------------------- | --------------------- | ----- | --------------------------------- |
| `addBannedPhrase(phrase)`  | `actions/settings.ts` | Admin | Insert banned phrase              |
| `deleteBannedPhrase(id)`   | `actions/settings.ts` | Admin | Delete banned phrase              |
| `updateConfig(key, value)` | `actions/settings.ts` | Admin | Update system_config row          |
| `updateUser(id, updates)`  | `actions/settings.ts` | Admin | Update user role or active status |

---

### Route Handlers

These are the only `app/api/` routes in the project. Not for general data access — webhooks and workflow callbacks only.

| Method | Route                    | Protected by              | Description                                                   |
| ------ | ------------------------ | ------------------------- | ------------------------------------------------------------- |
| `GET`  | `/api/auth/callback`     | —                         | Supabase OAuth callback (LinkedIn token exchange)             |
| `POST` | `/api/webhooks/workflow` | `X-Webhook-Secret` header | Vercel Workflow step callbacks (update DB on step completion) |
| `POST` | `/api/cron/weekly-loop`  | Vercel Cron auth header   | Cron entry point — triggers `aiml-weekly-loop` workflow       |

---

### Server Component Data Queries

Reads are plain Supabase queries inside Server Components — no actions needed. RLS handles authorization automatically.

| Page            | Query                                                                    | Role            |
| --------------- | ------------------------------------------------------------------------ | --------------- |
| `/dashboard`    | `getDashboardSummary()` — loop status, pipeline counts, channel activity | Admin, Operator |
| `/review`       | `getAwaitingReview()` — GeneratedContent where status = awaiting_review  | Operator, Admin |
| `/distribution` | `getApprovedContent()` + `getDistributionLogs()`                         | Operator, Admin |
| `/submit`       | `getMyContentSources()` — RLS returns own rows only                      | Contributor     |
| `/settings`     | `getBannedPhrases()`, `getSystemConfig()`, `getUsers()`                  | Admin           |

---

## 8. AI Integration

### Model

OpenAI GPT-4 via Vercel AI SDK (`ai` package). This abstraction layer allows future model swapping (e.g. GPT-4o, Claude) without changing application logic.

### Prompt Strategy

Two-layer prompt architecture:

**Layer 1 — System Prompt (fixed, Admin-managed in system_config)**

Sets the persona, rules, and hard constraints. Template includes language parameter:

```
You are a professional B2B content writer specializing in the global bio/pharma industry.
Generate content in {TARGET_LANGUAGE}.

Rules:
- Never mention specific client names, project names, or confidential details.
- Never make unverified scientific claims.
- Never use superlatives (world's best, revolutionary, breakthrough) unless directly quoted from a credible source.
- Write in a professional, factual, and measured tone appropriate for senior bio/pharma executives.
- All content must be NDA-safe: avoid any information that could identify a client or reveal proprietary processes.
- Format output as JSON with keys: { linkedin, blog, newsletter } — each a standalone piece formatted for that channel.
```

Supported languages in V1: English (en), Korean (ko). {TARGET_LANGUAGE} is substituted dynamically per request.

**Layer 2 — User Prompt (dynamic, per ContentSource)**

```
Here is the source material:

[extracted_text from Tavily or raw contributor input]

Optional context from the contributor:
[context_note]

Generate content for all three channels based on this material. Follow all rules in your system instructions.
Remember: output language is {TARGET_LANGUAGE}.
```

### NDA-Safe Phrasing Rules

After generation, before storing `GeneratedContent`, run a banned-phrase check:

1. Load all `banned_phrases` from the database
2. Scan `generated_text` (case-insensitive) for any match — applies to all languages
3. If match found:
   - Set `banned_phrase_hit: true`
   - Increment `generation_attempt`
   - Retry generation (max 2 retries) with the banned phrase appended to the system prompt: `"Also avoid the following phrases: [list]"`
   - If still failing after 2 retries → set ContentSource status: `failed`, notify Admin

**Language note:** Admins may add language-specific banned phrases (e.g., Korean-language equivalents of sensitive terms) to the `banned_phrases` table. The filter applies to generated content regardless of language.

### Prompt Versioning

Each `GeneratedContent` record stores `prompt_version` (e.g. `v1.0`). When the system prompt is updated, bump the version. This allows retrospective analysis of which prompt version produced which content.

### Channel Formatting

GPT-4 returns a JSON object with three keys. Each is formatted differently:

| Channel      | Format guidance in prompt                                                    |
| ------------ | ---------------------------------------------------------------------------- |
| `linkedin`   | 150–300 words, professional tone, 2–3 relevant hashtags, no em-dashes        |
| `blog`       | 400–600 words, structured with a header and 2–3 subheadings, no client names |
| `newsletter` | 100–150 words, concise summary, clear CTA (e.g. "Read more on our blog")     |

---

## 9. Channel Integration

### 9.1 LinkedIn (LinkedIn API — official)

- Auth: OAuth 2.0. Admin connects the company LinkedIn page once via Settings. Tokens stored encrypted in `system_config`.
- Post endpoint: `POST https://api.linkedin.com/v2/ugcPosts`
- On success: store `external_post_id` (LinkedIn post URN) in `distribution_logs`
- On failure: log error, set status: `failed`, surface in Admin dashboard
- Token refresh: handle expiry via Vercel Workflow scheduled token refresh

### 9.2 Company Blog

- V1: Internal blog. Posts stored as records in a `blog_posts` Supabase table. Rendered by the Next.js frontend at `/blog/[slug]`.
- Slug auto-generated from blog content title + timestamp
- V2: Replace with CMS (Sanity / Contentful — TBD)

### 9.3 Newsletter (Resend)

- Use Resend's broadcast/audience API
- Operator selects subscriber list (configured in Settings by Admin)
- Email template: React Email template rendered server-side
- On send: store `external_post_id` (Resend message ID) in `distribution_logs`

### 9.4 Science Exchange _(V2)_

- API integration approach TBD — pending API access and documentation review
- Placeholder in channel selector UI in V1 (disabled, tooltip: "Coming soon")

---

## 10. Workflow Definitions (Vercel Workflows)

### SDK Overview

All async processing in AIML is implemented using **Vercel Workflow SDK v4** (`npm install workflow @workflow/ai`). Two TypeScript directives are the core primitives:

- **`"use workflow"`** — marks a function as a durable workflow. It runs in a sandboxed environment (no full Node.js access), orchestrates step calls using standard `async/await`, and **must be deterministic**. The runtime re-plays this function on resume, using a persisted event log to skip already-completed steps without re-executing them. `Math.random` and `Date` are safe to use — the SDK pins them across replays.
- **`"use step"`** — marks a unit of work within a workflow. Steps have full Node.js and npm access, **auto-retry on failure** (default: 3 attempts), and their results are persisted to the event log. Each step appears as a discrete, named trace in the Vercel dashboard.

**Infrastructure:** When deployed to Vercel, zero configuration is required. The `@workflow/world-vercel` package handles queues, persistence, and routing automatically. Workflows survive crashes and deployments — running executions continue on their original version, while new triggers use the latest code.

**Next.js integration** requires wrapping the Next.js config:

```ts
// next.config.ts
import { withWorkflow } from "workflow/next";
export default withWorkflow(nextConfig);
```

**Starting a workflow** from a Server Action or Route Handler:

```ts
import { start } from "workflow/api";
import { aimlWeeklyLoop } from "@/workflows/weekly-loop/workflow";

const run = await start(aimlWeeklyLoop, [payload]);
// run.id is available for tracking; run.readable for streaming (not used here)
```

**Important serialization rule:** Step parameters are passed by value, not by reference. Always return mutated data from steps rather than relying on in-place mutation.

---

### Project Structure

```
workflows/
├── weekly-loop/
│   ├── workflow.ts        ← "use workflow" — aimlWeeklyLoop()
│   └── steps.ts           ← "use step" — scrape, generate, filter, store, notify
├── distribute/
│   ├── workflow.ts        ← "use workflow" — aimlDistribute()
│   └── steps.ts           ← "use step" — format, publish (per channel), log
├── regenerate/
│   ├── workflow.ts        ← "use workflow" — aimlRegenerate()
│   └── steps.ts           ← "use step" — fetch source, generate, store, notify
└── shared/
    ├── bannedPhraseFilter.ts  ← shared step reused by weekly-loop and regenerate
    └── notifyOperators.ts     ← shared notify step
```

---

### Workflow 1: `aiml-weekly-loop`

**Trigger:** Vercel Cron → `POST /api/cron/weekly-loop` → `start(aimlWeeklyLoop, [])` every Monday 09:00 UTC

**File:** `workflows/weekly-loop/workflow.ts`

```ts
export async function aimlWeeklyLoop() {
  "use workflow";

  const config = await fetchLoopConfig(); // step: reads system_config
  if (!config.weekly_loop_enabled) return; // abort if emergency stop active

  const sources = await fetchPendingSources(); // step: SELECT content_sources WHERE status='pending'

  for (const source of sources) {
    const text = await scrapeIfUrl(source); // step: Tavily call (skipped if input_type != 'url')
    const draft = await generateContent(text, source.context_note, source.language); // step: GPT-4 via AI SDK
    const filtered = await runBannedPhraseFilter(draft); // step: scan + optional retry
    await storeGeneratedContent(source.id, filtered, source.language); // step: INSERT generated_content
    await markSourceProcessed(source.id); // step: UPDATE content_sources
  }

  await notifyOperators(); // step: Resend email to all Operators
  await logWorkflowExecution("aiml-weekly-loop"); // step: audit log entry
}
```

**Step details:**

| Step function                                        | Directive    | Retry                           | Description                                                                                                                |
| ---------------------------------------------------- | ------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `fetchLoopConfig()`                                  | `"use step"` | 3×                              | Reads `weekly_loop_enabled` from `system_config`                                                                           |
| `fetchPendingSources()`                              | `"use step"` | 3×                              | Queries `content_sources` where `status = 'pending'`                                                                       |
| `scrapeIfUrl(source)`                                | `"use step"` | 3×                              | Calls Tavily; returns existing `extracted_text` if already scraped                                                         |
| `generateContent(text, note, language)`              | `"use step"` | 3×                              | Calls GPT-4 via Vercel AI SDK with language parameter; returns `{ linkedin, blog, newsletter }` JSON in specified language |
| `runBannedPhraseFilter(draft)`                       | `"use step"` | 1× (retries handled internally) | Scans output; re-calls `generateContent` up to 2× if phrases detected; sets `banned_phrase_hit` flag                       |
| `storeGeneratedContent(sourceId, content, language)` | `"use step"` | 3×                              | INSERTs `generated_content` + `review_statuses` (status: `awaiting_review`) with language field                            |
| `markSourceProcessed(sourceId)`                      | `"use step"` | 3×                              | UPDATEs `content_sources.status = 'processed'`                                                                             |
| `notifyOperators()`                                  | `"use step"` | 3×                              | Sends Resend email to all active Operators                                                                                 |
| `logWorkflowExecution(name)`                         | `"use step"` | 3×                              | Writes execution record to Supabase audit log                                                                              |

**Observability:** Every step appears by name in the Vercel Workflows dashboard — duration, status, input/output data, and retry attempts are all visible with no additional configuration.

---

### Workflow 2: `aiml-distribute`

**Trigger:** Operator calls `publishContent()` Server Action → `start(aimlDistribute, [payload])`
Also triggered at `scheduled_at` datetime if scheduling is chosen.

**File:** `workflows/distribute/workflow.ts`

```ts
export async function aimlDistribute(payload: {
  generated_content_id: string;
  channels: ("linkedin" | "blog" | "newsletter")[];
  scheduled_at?: string;
}) {
  "use workflow";

  if (payload.scheduled_at) {
    await sleep(new Date(payload.scheduled_at)); // suspend without consuming resources until scheduled time
  }

  const content = await fetchApprovedContent(payload.generated_content_id); // step

  for (const channel of payload.channels) {
    const formatted = await formatForChannel(content, channel); // step
    const result = await publishToChannel(formatted, channel); // step: LinkedIn / blog / Resend
    await storeDistributionLog(payload.generated_content_id, channel, result); // step
  }
}
```

> **Note on `sleep()`:** The Workflow SDK's built-in `sleep()` function suspends the workflow without consuming any compute or memory resources until the target datetime. This replaces any need for a custom scheduling mechanism.

**Step details:**

| Step function                               | Directive    | Retry | Description                                                        |
| ------------------------------------------- | ------------ | ----- | ------------------------------------------------------------------ | -------------------------- |
| `fetchApprovedContent(id)`                  | `"use step"` | 3×    | Fetches `generated_content` + `channel_formats` from Supabase      |
| `formatForChannel(content, channel)`        | `"use step"` | 3×    | Extracts channel-specific JSON key                                 |
| `publishToChannel(content, channel)`        | `"use step"` | 3×    | Calls LinkedIn API / Supabase insert / Resend depending on channel |
| `storeDistributionLog(id, channel, result)` | `"use step"` | 3×    | INSERTs `distribution_logs` with `status: success                  | failed`+`external_post_id` |

---

### Workflow 3: `aiml-regenerate`

**Trigger:** `submitReview()` Server Action with `status: 'rejected'` → `start(aimlRegenerate, [payload])`

**File:** `workflows/regenerate/workflow.ts`

```ts
export async function aimlRegenerate(payload: {
  generated_content_id: string;
  rejection_reason: string;
}) {
  "use workflow";

  const source = await fetchSourceForContent(payload.generated_content_id); // step
  const draft = await generateContentWithRejectionContext(
    source,
    payload.rejection_reason,
    source.language
  ); // step
  const filtered = await runBannedPhraseFilter(draft); // step (shared)
  await storeGeneratedContent(source.id, filtered, source.language, { incrementAttempt: true }); // step
  await notifyOperatorRegenReady(payload.generated_content_id); // step
}
```

**Step details:**

| Step function                                                   | Directive    | Retry | Description                                                                                    |
| --------------------------------------------------------------- | ------------ | ----- | ---------------------------------------------------------------------------------------------- |
| `fetchSourceForContent(id)`                                     | `"use step"` | 3×    | Joins `generated_content` → `content_sources`; retrieves language                              |
| `generateContentWithRejectionContext(source, reason, language)` | `"use step"` | 3×    | GPT-4 call with rejection reason appended to user prompt; respects language from ContentSource |
| `runBannedPhraseFilter(draft)`                                  | `"use step"` | 1×    | Shared step from `workflows/shared/`                                                           |
| `storeGeneratedContent(..., language)`                          | `"use step"` | 3×    | INSERTs new `generated_content` with `generation_attempt` incremented and language field       |
| `notifyOperatorRegenReady(id)`                                  | `"use step"` | 3×    | Resend email to Operators with link to review queue                                            |

---

### Workflow 4: `aiml-linkedin-token-refresh` _(Referenced in Section 9.1)_

**Trigger:** Vercel Cron — scheduled before LinkedIn OAuth token expiry

**File:** `workflows/token-refresh/workflow.ts`

```ts
export async function aimlLinkedInTokenRefresh() {
  "use workflow";

  const token = await fetchLinkedInToken(); // step: reads encrypted token from system_config
  const refreshed = await refreshOAuthToken(token); // step: calls LinkedIn token refresh endpoint
  await storeRefreshedToken(refreshed); // step: writes back to system_config (encrypted)
}
```

---

### Deployment Notes

- **No infrastructure setup needed on Vercel.** The `@workflow/world-vercel` package auto-configures queues, state persistence, and routing on deploy.
- **Single-region in V1:** The Vercel World backend currently runs in `iad1`. For best performance, deploy the AIML app to `iad1` as well.
- **Atomic versioning:** In-flight workflow runs continue on the version they started on. New triggers pick up the latest deployed code. This makes zero-downtime deploys safe for long-running workflows.
- **Local development:** The Local World (included in the SDK) provides virtual infrastructure locally — no queue or database setup required during development. Run `npx workflow web` to open the local observability dashboard.
- **Webhook callbacks:** The existing `/api/webhooks/workflow` Route Handler (protected by `X-Webhook-Secret`) is used for any external event resumption patterns if needed in V2 (e.g. human-in-the-loop approvals via `createWebhook()`). Not required for V1.

---

## 11. Non-Functional Requirements

### Security & Compliance

- All user sessions managed via Supabase Auth — JWTs validated server-side in every Server Action and Server Component
- Role enforcement at Server Action layer (early return on unauthorized) AND database layer (RLS)
- All content generation and distribution actions written to an immutable audit log in Supabase
- NDA-safe phrasing enforced as a hard step in the generation pipeline — not optional
- Banned phrase list editable by Admin only
- LinkedIn OAuth tokens stored encrypted in `system_config` (not plaintext)
- Vercel Workflow callbacks protected by `X-Webhook-Secret` header
- Emergency stop: Admin toggle in `system_config` — disables weekly cron entry point and blocks `publishContent` action

### Performance

- Dashboard summary endpoint: <3 seconds response time (per CEO PRD)
- AI generation: async via Vercel Workflow — not blocking a user request
- Tavily scraping: async, with a preview option for Contributors before submission

### Logging & Observability

- Every workflow execution logged (start time, steps completed, errors)
- Every distribution attempt logged in `distribution_logs` regardless of outcome
- Every review action logged in `review_statuses`
- Failed AI generations flagged in Admin dashboard
- **Vercel Workflow SDK built-in observability** is the primary observability tool for V1: each named step is traced in the Vercel dashboard with status, duration, input/output data, and retry count — no additional configuration or external service required
- Local development observability: `npx workflow web` opens a local dashboard showing all workflow runs and step traces

### Extensibility

- Channel publisher abstracted behind an interface — adding a new channel = new publisher module + DB enum value
- AI model swappable via Vercel AI SDK provider config (no application logic change required)
- Prompt versioning built in from day 1
- All config (loop schedule, banned phrases, channel settings) in `system_config` — no hardcoded values

### Multi-language Support (V1)

- All generated content stored with a `language` field (default: `'en'`)
- System prompt designed to accept a `target_language` parameter
- Contributor specifies target language when submitting content source
- Content generated in selected language (EN + KO in V1)
- UI string externalization deferred to V2 but architecture must not block it

### Usability

- Operator workflow is fully click-driven — no free-text input at any step
- All destructive or irreversible actions (distribute, emergency stop) require a confirmation dialog
- Mobile-responsive UI (shadcn/ui + Tailwind)

---

## 12. Open Questions & Assumptions

### Open Questions (must be answered before implementation)

| #     | Question                                                                                                                                                                                                                 | Who to ask    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| OQ-1  | Science Exchange — do we have API access? What does the integration look like? Is it V1 or definitely V2?                                                                                                                | CEO / PM      |
| OQ-2  | Company Blog — is this on the existing product site, or a standalone blog to be built? What's the URL/domain?                                                                                                            | CEO / PM      |
| OQ-3  | LinkedIn — which LinkedIn entity posts? Company page or a personal profile? Who owns the OAuth token?                                                                                                                    | CEO / Admin   |
| OQ-4  | Newsletter — does a subscriber list already exist? Which Resend audience do we send to?                                                                                                                                  | Operator / PM |
| OQ-5  | The permission matrix shows Operator can "Review & Approve" — but the CEO says "Admin oversight." Should Admin approval be required before distribution, or is Operator approval sufficient?                             | CEO           |
| OQ-6  | The 3-checkbox review — are the three checkboxes fixed (factual / NDA-safe / tone) or configurable by Admin?                                                                                                             | CEO / PM      |
| OQ-7  | What happens when the weekly loop fires but there are no pending ContentSources? Silent skip, or notify Operator to submit?                                                                                              | PM            |
| OQ-8  | Rejection reason — should this be a free-text field for Operators, or a predefined list? (Given the no-free-text principle, a predefined list may be preferred)                                                          | CEO / PM      |
| OQ-9  | SaaS extension — the CEO asks which features should be paywalled. This affects architecture decisions (multi-tenancy). Is this a V2 concern or does it affect V1 data model design?                                      | CEO           |
| OQ-10 | Emergency stop — does this pause the loop only (no new generation), or also block any in-flight distributions?                                                                                                           | CEO           |
| OQ-11 | Multi-language implementation — should language selection be per-content-source (Contributor chooses), per-loop (Admin configures), or both? Should all channels receive translated versions, or only specific channels? | CEO / PM      |

### Assumptions (document for stakeholder confirmation)

| #   | Assumption                                                                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------- |
| A-1 | Science Exchange is V2. A disabled placeholder will appear in the channel selector in V1.                         |
| A-2 | Company Blog is an internal Next.js page in V1 — not an external CMS.                                             |
| A-3 | Operator approval alone is sufficient for distribution in V1. Admin does not need to co-approve.                  |
| A-4 | The three review checkboxes are fixed in V1. Admin can configure them in V2.                                      |
| A-5 | Multi-tenancy is not required in V1. Single-organization deployment only.                                         |
| A-6 | Content generation supports English and Korean in V1. Language is selected per content source by the Contributor. |
| A-7 | The weekly loop fires every Monday 09:00 UTC by default. Admin can change the day/time in Settings.               |
| A-8 | Rejection reason is a predefined dropdown list in V1 (consistent with no-free-text principle).                    |

---

_This document is a living draft. All open questions should be resolved before implementation tickets are cut.
Next step: share with CEO / PM for review. Implementation sub-tickets to be created after approval._
