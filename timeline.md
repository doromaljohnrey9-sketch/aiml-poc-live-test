# AIML PoC — Timeline

**v0.3 · Target: Wed May 27 · One role per day · Backend-first**

---

## Timeline

| Day | Focus                                      | Done when...                                              |
| --- | ------------------------------------------ | --------------------------------------------------------- |
| D1  | Auth, RBAC, role routing                   | All 3 roles log in, land in own space, cross-role blocked |
| D2  | Admin dashboard + system settings          | Admin journey fully walkable                              |
| D3  | Contributor — submit content source        | Contributor journey fully walkable                        |
| D4  | Operator — review queue + distribution hub | Operator journey fully walkable                           |
| D5  | Email, notifications, audit log            | Resend fully integrated — notifications live              |
| D6  | Workflows + cron                           | Full automated loop wired end-to-end                      |
| D7  | Smoke test + PoC prep                      | PoC ready for joint review — Wed May 27                   |

---

## D1 — Auth & RBAC

> Starter kit used — auth scaffolding pre-built. RLS deferred post-PoC.

**Setup**

- [ ] Bootstrap starter kit — configure Supabase project, layout/routing, GitHub repo
- [ ] Full DB schema in one migration — include `weekly_loop_enabled` flag in `system_config`

**RBAC**

- [ ] JWT role claim — write role to token on login from users table
- [ ] Server action guard pattern — check role at top of every action, early return with typed error

**Role routing**

- [ ] `middleware.ts` — reads role from JWT, redirects to `/login` or `/403`
- [ ] Three route groups + nav shells: `(admin)` `(operator)` `(contributor)`
- [ ] Shared pages: `/login`, `/403`
- [ ] Supabase client shell with typed DB types + RLS placeholder comments

> Post-PoC: RLS policies — add before any real users touch the system

✅ **All 3 roles log in, land in their own space, cross-role blocked**

---

## D2 — Admin

> Loop schedule config, banned phrases, user management — seeded directly in Supabase for PoC.

**Dashboard**

- [ ] Loop status — last run, next run, items processed
- [ ] Pipeline counts — Pending / Awaiting Review / Approved / Distributed
- [ ] Channel activity — posts per channel this week
- [ ] Failed distributions — surfaced with reason

**System settings**

- [ ] `publishContent` action — emergency stop pauses current loop only (OQ-10 ✓)
- [ ] Loop schedule config — edit `system_config` directly in Supabase for PoC
- [ ] Banned phrase — seed table directly in Supabase for PoC
- [ ] User management — provision via Supabase Auth dashboard for PoC

**In-app notifications**

- [ ] Notification store in DB — accumulate alerts when loop fires with no pending sources (OQ-7 ✓)
- [ ] Notification indicator in nav — visible to Operator

✅ **Admin journey fully walkable**

---

## D3 — Contributor

> Document upload deferred post-PoC. Language: ship EN only if multi-language proves too costly (OQ-11 ✓).

**Submit content source**

- [ ] Content type selector: URL / Text
- [ ] Tavily URL scrape with extracted text preview before submit
- [ ] Language selector: EN | KO — stored on `ContentSource.language` (fallback: EN only for PoC)
- [ ] Optional context note
- [ ] `submitSource()` server action — creates ContentSource, runs Tavily, stores language
- [ ] Confirmation screen

**My submissions**

- [ ] Own submissions list with status

✅ **Contributor journey fully walkable**

---

## D4 — Operator

> Scheduled distribution — Publish Now only for PoC. 3-checkbox items fixed for PoC, configurable post-PoC (OQ-6 ✓). Operator approval is sufficient — no Admin co-approval needed (OQ-5 ✓).

**Review queue**

- [ ] List view — AWAITING_REVIEW, newest first
- [ ] Language label (EN | KO) on each item
- [ ] Generated content — read-only display
- [ ] 3-checkbox review: Factually accurate · NDA-safe · Appropriate tone (fixed, not configurable for PoC)
- [ ] Approve / Reject with confirmation dialogs
- [ ] Rejection reason — predefined list + optional free-text field (OQ-8 ✓)

**Distribution hub**

- [ ] Approved content list
- [ ] Channel selector per item: Newsletter (active) · LinkedIn · Blog · Science Exchange — all three disabled placeholders for PoC
- [ ] Review queue is the Operator landing page
- [ ] Publish Now — scheduled distribution post-PoC

✅ **Operator journey fully walkable**

---

## D5 — Resend

> Newsletter: no subscriber list yet (OQ-4 ✓) — wire up Resend audience but leave empty. Blog: no domain yet, internal Next.js page for PoC (OQ-2 ✓). LinkedIn: company-owned, OAuth token shared with engineering (OQ-3 ✓).

**Email templates**

- [ ] Operator: "Content ready for review" — fires after AI generation
- [ ] Post-distribution confirmation

**Newsletter**

- [ ] Resend audience wired up — empty list for PoC, ready to populate

**Audit log**

- [ ] Immutable log — generation, review, distribution, settings changes all written

✅ **Resend fully integrated — notifications live**

---

## D6 — Workflows

> Workflow 3 is best-effort — deprioritise if time runs short. Banned-phrase retry: one attempt only for PoC. Multi-language: EN + KO if time allows, EN-only fallback acceptable (OQ-11 ✓).

**Workflow 1 — `aiml-weekly-loop`**

- [ ] Trigger: Vercel Cron — Monday 09:00 UTC, gated by `weekly_loop_enabled`
- [ ] PENDING sources → Tavily → GPT-4 (with language param) → banned-phrase filter → store GeneratedContent → notify Operator
- [ ] If no pending sources → write in-app notification (OQ-7 ✓)

**Workflow 2 — `aiml-distribute`**

- [ ] Trigger: `publishContent()` server action
- [ ] Per channel: format → publish (Newsletter via Resend) → store DistributionLog (LinkedIn + Blog wired but disabled for PoC)
- [ ] All channels receive content in source language (OQ-11 ✓)

**Workflow 3 — `aiml-regenerate`** _(best-effort)_

- [ ] Trigger: `submitReview()` with `status: rejected`
- [ ] Fetch source → regenerate with rejection context in same language → filter → store → notify Operator

**Cron**

- [ ] Wired to `weekly_loop_enabled` in `system_config`

✅ **Full automated loop wired end-to-end**

---

## D7 — Smoke test + PoC prep

- [ ] End-to-end run through all 3 role journeys
- [ ] Fix any blockers from D1–D6
- [ ] Seed demo data — content sources, generated content, distribution logs

✅ **PoC ready for joint review — Wed May 27**

---

## Post-PoC

- RLS policies — before any real users touch the system
- Blog domain — Ben to provision when needed (OQ-2 ✓)
- Newsletter subscriber list — populate when ready (OQ-4 ✓)
- Science Exchange — no API access, revisit after core loop validated (OQ-1 ✓)
- Multi-language full implementation — if shipped EN-only for PoC (OQ-11 ✓)
- 3-checkbox items — make Admin-configurable (OQ-6 ✓)
- SaaS / multi-tenancy — deferred, V1 schema not designed around it (OQ-9 ✓)
- Emergency stop — extend to block in-flight distributions if needed (OQ-10 ✓)
- Scheduled distribution
- Document upload (Contributor)
- Banned phrase UI (full)
- User management UI (full)
- Loop schedule UI (full)
- LinkedIn token refresh cron (Workflow 4)
- Banned-phrase retry logic (full, multi-attempt)
