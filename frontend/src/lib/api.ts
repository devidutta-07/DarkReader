import type { ConvertOptions, QueueFile } from './types'

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
export const MOCK_API = import.meta.env.VITE_MOCK_API === 'true'

export interface ConvertResult {
  sessionId: string
  downloadUrl: string
  previewUrl: string
  pipeline?: 'A' | 'B'
  pages?: number
}

export async function convertFile(file: File, opts: ConvertOptions): Promise<ConvertResult> {
  if (MOCK_API) {
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 800))
    const url = URL.createObjectURL(file)
    return { sessionId: 'mock-session', downloadUrl: url, previewUrl: url, pipeline: 'A', pages: undefined }
  }

  const fd = new FormData()
  fd.append('file', file)
  fd.append('mode', opts.mode)
  fd.append('bgColor', opts.bgColor)
  fd.append('appendImages', String(opts.appendImages))

  const res = await fetch(`${API_BASE}/api/convert`, { method: 'POST', body: fd })
  if (!res.ok) {
    let detail = `Conversion failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.detail) detail = typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail)
    } catch { /* non-JSON error body */ }
    throw new Error(detail)
  }
  const data = await res.json()
  const downloadUrl = data.download_url?.startsWith('http') ? data.download_url : `${API_BASE}${data.download_url}`
  const fileRes = await fetch(downloadUrl)
  if (!fileRes.ok) throw new Error('Converted file could not be fetched')
  const blob = await fileRes.blob()
  const url = URL.createObjectURL(blob)
  return {
    sessionId: data.session_id,
    downloadUrl: url,
    previewUrl: url,
    pipeline: data.pipeline,
    pages: data.pages,
  }
}

export function cleanupSession(sessionId: string) {
  if (!sessionId || sessionId === 'mock-session' || MOCK_API) return
  const payload = JSON.stringify({ session_id: sessionId })
  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${API_BASE}/api/cleanup`, new Blob([payload], { type: 'application/json' }))
  } else {
    fetch(`${API_BASE}/api/cleanup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {})
  }
}

export function toQueueFile(file: File): QueueFile {
  return { id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`, file, status: 'queued' }
}
