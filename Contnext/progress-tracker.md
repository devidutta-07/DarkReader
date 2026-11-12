# Progress Tracker — Dark Reader PDF

## Phase 1 — Context & Planning
- [x] Read SRS.md
- [x] Create project-overview.md
- [x] Create architecture.md
- [x] Create ui.md
- [x] Create progress-tracker.md

## Phase 2 — Frontend (pending user review)
- [x] Install deps (Tailwind, Lucide)
- [x] App shell: split-screen layout + top bar
- [x] Upload dropzone (multi-file + folder ingest)
- [x] File queue with selection & status
- [x] Mode preset picker + custom color picker
- [x] Appendix Mode toggle
- [x] Convert flow wired to /api/convert (with mock fallback for dev)
- [x] Preview pane (Blob URL iframe)
- [x] Full-screen reader toggle
- [x] Cleanup on unload (sendBeacon)
- [x] Error/empty/loading states
- [x] Lint + typecheck + build pass

## Phase 3 — Backend (after frontend review)
- [ ] FastAPI scaffold (app/ layout, CORS, config)
- [ ] POST /api/convert — validation, session dirs, limits
- [ ] Page classifier (Type A vs Type B)
- [ ] Type A pipeline (background rect, overlay=False)
- [ ] Type B pipeline (NumPy luminance inversion)
- [ ] Appendix Mode (xref image extraction + "Figures & Visuals Appendix")
- [ ] GET /api/download/{session_id}/{filename}
- [ ] POST /api/cleanup + TTL sweeper
- [ ] asyncio.to_thread for CPU-bound work
- [ ] requirements.txt / Dockerfile
- [ ] Manual API smoke tests

## Phase 4 — Integration & Deployment Readiness
- [ ] Frontend ↔ backend integration test
- [ ] VITE_API_BASE_URL + CORS locked to Vercel origin
- [ ] Vercel config (SPA rewrites)
- [ ] Render config (start command, env)
- [ ] End-to-end run-through + cleanup verification
- [ ] README / deploy notes
