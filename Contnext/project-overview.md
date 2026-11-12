# Project Overview — Dark Reader PDF

## What it is
Dark Reader PDF is a zero-login, single-page web app that converts bright PDFs (textbooks, syllabi, whitepapers, corporate docs) into comfortable dark/warm reading formats. Users upload PDFs, pick a palette, preview live, and download the converted file.

## Key characteristics
- No auth, no database, no multi-page navigation — one split-screen workspace.
- Two conversion pipelines on the backend:
  - **Type A** — text PDFs: background color rectangle injected at the bottom layer (`overlay=False`); text stays selectable.
  - **Type B** — scanned PDFs: luminance inversion (`L' = 1 - L`) via NumPy on extracted pixel data.
- Optional **image isolation**: embedded raster images stripped from vector pages and appended as a "Figures & Visuals Appendix".
- Palettes: Soft Dark (`#121212`), OLED Black (`#000000`), Warm Cream (`#F4ECD8`), custom hex picker.

## Stack
- **Frontend:** React 19 + Vite + TypeScript (already scaffolded in `frontend/`), Tailwind CSS, Lucide icons. Hosted on **Vercel**.
- **Backend:** Python 3.10+, FastAPI, PyMuPDF (`fitz`), NumPy, Uvicorn. Hosted on **Render**. Source in `backend/` (empty).

## API surface
- `POST /api/convert` — multipart (file, mode, bgColor, appendImages) → session metadata + download links.
- `GET /api/download/{session_id}/{filename}` — stream processed PDF.
- `POST /api/cleanup` — purge transient session storage.

## Privacy model
Ephemeral `/tmp` session storage keyed by UUID; no persistence. Cleanup via `navigator.sendBeacon` on unload + explicit cleanup endpoint. Strict CORS between Vercel frontend and Render backend.

## Build order (agreed)
1. Context files (this folder)
2. Frontend build → user review
3. Backend build → user review
4. Integration + deployment readiness

See `progress-tracker.md` for live status.
