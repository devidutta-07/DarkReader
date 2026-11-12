# Architecture — Dark Reader PDF

## High-level
```
Browser (React SPA, Vercel)
   │  multipart/form-data (file, mode, bgColor, appendImages)
   ▼
FastAPI (Render)  ── asyncio.to_thread ──► PyMuPDF/NumPy pipeline
   │                                         session dir /tmp/<uuid>/
   ▼
GET /api/download/<session_id>/<filename>  (streamed PDF)
POST /api/cleanup  (delete /tmp/<uuid>)
```

## Frontend (`frontend/`)
- Vite + React 19 + TS. Entry `src/main.tsx` → `src/App.tsx`.
- Single-page split-screen: **left control panel (380px)** + **right viewer canvas**.
- State (client-side only):
  - `files[]` upload queue (multi-file + `webkitdirectory` folder ingest, `.pdf` filtered)
  - `selectedId` active queue item
  - `mode` (`soft-dark` | `oled` | `cream` | `custom`), `bgColor` hex
  - `appendImages` (Appendix Mode toggle)
  - `sessionId`, per-file conversion status + download URL
  - `fullscreen` preview toggle
- Conversion flow: select file → POST `/api/convert` → receive `{ session_id, files: [{ name, download_url, pipeline, pages }] }` → render preview via Blob URL / iframe → download button per file.
- On unload: `navigator.sendBeacon('/api/cleanup', JSON.stringify({ session_id }))`.
- Env: `VITE_API_BASE_URL` (Render backend URL), default `http://localhost:8000` for dev.

## Backend (`backend/`, to be built)
- FastAPI app, Uvicorn entrypoint.
- Layout:
  - `app/main.py` — app factory, CORS (allow Vercel origin), router mount.
  - `app/routers/convert.py`, `app/routers/download.py`, `app/routers/cleanup.py`
  - `app/services/classifier.py` — page type detection (`page.get_text("text")` non-empty → Type A; else raster images → Type B).
  - `app/services/type_a.py` — insert `page.insert_rect(rect, color=bg, overlay=False)` (or `draw_rect ... overlay=False`).
  - `app/services/type_b.py` — render page pixmap → NumPy → luminance inversion `L' = 1 - L` preserving chroma → rebuild page.
  - `app/services/appendix.py` — extract images by `xref`, strip from vector pages, append "Figures & Visuals Appendix" pages.
  - `app/services/sessions.py` — UUID session dirs under `/tmp/darkreader-<uuid>/`, TTL sweeper, cleanup.
- CPU-bound work offloaded via `asyncio.to_thread`.
- Limits: max upload size, `.pdf` mime/extension validation, 400/404/500 with descriptive `HTTPException`.

## Data flow / lifecycle
1. Upload → validate → create session dir → classify each page → per-pipeline process → write output PDF(s).
2. Files tracked in-memory (session registry) + on disk in `/tmp`.
3. `cleanup` (beacon or explicit) deletes session dir; TTL sweeper reaps orphans.

## Non-functional
- Async non-blocking event loop; ephemeral storage; strict CORS; no user data persisted.
- Deploy: Vercel (static SPA + rewrites) / Render (Python web service, `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).

## Constraints & decisions
- Tailwind + Lucide for UI (per SRS §4.1) — must be added to frontend deps.
- No state management library needed; local state + context if prop-drilling grows.
- No auth/DB by design.
