# UI Specification — Dark Reader PDF

## Design language
- Dark-themed, modern, responsive. React + Tailwind CSS + Lucide icons.
- Zero modals, zero login/signup. Single split-screen workspace.

## Layout
```
┌───────────────────────────────────────────────┐
│ Top bar: logo "Dark Reader PDF" · fullscreen btn │
├──────────────┬────────────────────────────────┤
│ Control      │  Preview canvas                │
│ panel 380px  │  (rendered PDF / placeholder)  │
│              │                                │
│ File queue   │                                │
│ Palette      │                                │
│ Appendix tgl │                                │
│ Convert btn  │                                │
│ Download btn │                                │
└──────────────┴────────────────────────────────┘
```
- Left panel fixed 380px on desktop, collapses to stacked layout on <1024px.
- Preview pane: `iframe`/`<object>` with Blob URL of converted PDF; placeholder/dropzone state when empty.
- **Full-screen reader toggle**: preview expands to 100vw/100vh, controls hidden, floating exit button (Esc also exits).

## Control panel sections
1. **Upload zone** — drag-drop + click. Accepts `.pdf`, `multiple`, `webkitdirectory` for folder ingest. Shows queue list: file name, size, page count (after convert), status (queued/converting/done/error), remove button. Click queue item → select for preview.
2. **Reading mode presets** (radio/card group):
   - Soft Dark `#121212` (default)
   - OLED Black `#000000`
   - Warm Cream `#F4ECD8`
   - Custom — hex text input + native color picker
3. **Image isolation toggle** — "Appendix Mode: move figures to end of document" (switch).
4. **Convert button** — primary CTA; disabled with empty queue; shows spinner while converting.
5. **Download button(s)** — per completed file; also "Download all" if batch.
6. **Footer hint** — "Files are processed transiently and deleted after your session."

## States
- Empty: dropzone hero + short explainer.
- Uploading/converting: per-file progress row, indeterminate bar on Convert button.
- Done: preview + download; error: toast/inline message with backend detail.
- Queue selection switching updates preview without re-converting.

## Components (frontend/src/components/)
- `TopBar.tsx`, `ControlPanel.tsx`, `UploadDropzone.tsx`, `FileQueue.tsx`, `ModePresetPicker.tsx`, `CustomColorPicker.tsx`, `AppendixToggle.tsx`, `PreviewPane.tsx`, `FullscreenReader.tsx`, `Toast.tsx` (or inline error banner).

## API wiring
- `src/lib/api.ts` — `convertFile(file, opts)`, `downloadUrl(sessionId, filename)`, `cleanupSession(sessionId)` (sendBeacon on unload).
- Base URL from `import.meta.env.VITE_API_BASE_URL`.

## Accessibility
- Labeled controls, keyboard-focusable queue items, Esc exits fullscreen, sufficient contrast on both dark and cream previews.
