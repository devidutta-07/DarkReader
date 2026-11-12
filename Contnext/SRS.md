# Software Requirements Specification (SRS)

## Dark Reader (PDF Engine & Web Application)

---

## 1. Introduction

### 1.1 Purpose

This document outlines the software requirements, system architecture, functional workflows, and non-functional specifications for **Dark Reader PDF**, a specialized web-based application designed to convert PDF documents (academic books, college syllabus materials, whitepapers, and corporate documents) into comfortable reading formats using customizable dark and warm background palettes.

### 1.2 Scope

* **Dark Reader PDF** provides a frictionless, zero-login web interface allowing users to upload individual PDFs or entire folders.
* The system processes documents through two distinct intelligent pipelines: **Type A** (Structured/Text PDFs) and **Type B** (Scanned/Image-Only PDFs).
* It features a split-screen layout with a live interactive preview window, color customization presets, image isolation (moving original figures to an appendix), and session-based management.
* **Deployment Architecture:** Frontend hosted on **Vercel** (React + Vite); Backend hosted on **Render** (Python + FastAPI).

### 1.3 Target Audience

* **Students & Researchers:** Reading dense textbooks or lecture slides under low-light conditions.
* **Professionals:** Reviewing company documents and long technical reports without eye strain.
* **Developers & Privacy Advocates:** Needing client-side or transient server-side processing with automatic data cleanup.

---

## 2. Overall Description

### 2.1 Product Perspective

Dark Reader PDF operates as an independent full-stack web application. It requires no user authentication, database persistence for user profiles, or multi-page navigation. All interactions occur within a single-page split-screen workspace.

### 2.2 User Classes & Characteristics

* **Standard Readers / Students:** Upload multi-page textbooks or notes to convert bright white backgrounds into soft dark or warm cream tones.
* **Power Users:** Utilize custom color pickers, batch folder uploads, image isolation toggles, and full-screen reading modes.

### 2.3 Operating Environment

* **Frontend:** Modern web browsers (Chrome, Firefox, Safari, Edge) supporting HTML5 file APIs and Blob URL rendering.
* **Backend:** Linux container environment running Python 3.10+ via Uvicorn and FastAPI.

---

## 3. System Features & Functional Requirements

### 3.1 PDF Ingestion & Queue Management

* **Multi-file & Folder Upload:** Supports standard multi-file selection and directory/folder ingestion (`webkitdirectory`) restricted to `.pdf` formats.
* **Queue Selection:** Users can select any item from the file queue to preview its converted state in real-time.

### 3.2 Dual-Pipeline Conversion Engine

The backend classifies each PDF page upon upload:

| Pipeline Type | Detection Criterion | Processing Mechanism |
| --- | --- | --- |
| **Type A (Structured Text)** | Text layer extracted via `page.get_text("text")` is non-empty. | Injects a solid background color vector rectangle at the bottom layer (`overlay=False`) matching the user's selected palette, leaving text selectable and crisp. |
| **Type B (Scanned / Image-Only)** | Text layer is empty and page contains raster images. | Extracts pixel data as a NumPy array, applies luminance-preserving pixel transformation (`$L' = 1 - L$`), preserving color highlights and charts while inverting the background and dark ink. |

### 3.3 Embedded Image Isolation (Appendix Mode)

* If enabled, original raster images embedded within vector pages are extracted via their cross-reference (`xref`) tables.
* Images are stripped from text pages to prevent inverted photographic negative artifacts and appended at the end of the document as a dedicated **"Figures & Visuals Appendix"**.

### 3.4 Reading Comfort Modes & Color Customization

* **Soft Dark Mode:** Default dark charcoal background (`#121212`) to eliminate halation.
* **OLED Black Mode:** True black background (`#000000`) for battery-saving and high-contrast display.
* **Warm Cream Mode:** Sepia/paper-tone background (`#F4ECD8`) simulating physical book paper.
* **Custom Color Picker:** Allows users to input custom hex background color codes.

### 3.5 Interactive Preview & Full-Screen Mode

* **Split-Screen Layout:** Left-hand control panel (380px) paired with a right-hand document viewer canvas.
* **Full-Screen Reader Toggle:** Expands the preview pane to full viewport dimensions, hiding navigation controls for an immersive reading experience.

---

## 4. External Interface Requirements

### 4.1 User Interfaces (UI)

* Built with **React**, **Tailwind CSS**, and **Lucide Icons** for a responsive, modern dark-themed aesthetic.
* Single-page architecture with zero modals for login/signup.

### 4.2 Software & API Interfaces

* **RESTful FastAPI Endpoints:**
* `POST /api/convert`: Accepts multipart form data (file, mode, bgColor, appendImages) and returns session metadata and download links.
* `GET /api/download/{session_id}/{filename}`: Streams the processed PDF file.
* `POST /api/cleanup`: Purges transient server storage for a specific session.



---

## 5. Non-Functional Requirements

### 5.1 Performance & Scalability

* **Async Processing:** CPU-intensive PyMuPDF rendering tasks are offloaded to asynchronous thread pools (`asyncio.to_thread`) to prevent blocking the FastAPI event loop.
* **Memory Management:** Temporary session files stored in `/tmp` directories are purged immediately upon browser unload via `navigator.sendBeacon` and explicit cleanup triggers.

### 5.2 Security & Privacy

* **Ephemeral Storage:** No documents are permanently stored on disk; all files are tied to unique UUID sessions.
* **CORS Policy:** Strict cross-origin resource sharing configuration locking down communication between the Vercel frontend and Render backend.

### 5.3 Reliability & Error Handling

* Standardized HTTP status codes (`200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`) paired with descriptive `HTTPException` payloads for robust client-side debugging.