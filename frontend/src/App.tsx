import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sparkles, Loader2, Download, ShieldCheck } from 'lucide-react'
import TopBar from './components/TopBar'
import UploadDropzone from './components/UploadDropzone'
import FileQueue from './components/FileQueue'
import ModePresetPicker from './components/ModePresetPicker'
import AppendixToggle from './components/AppendixToggle'
import PreviewPane from './components/PreviewPane'
import { convertFile, cleanupSession, toQueueFile, MOCK_API } from './lib/api'
import { ModePresets, type QueueFile, type ReadingMode } from './lib/types'

function Workspace() {
  const [files, setFiles] = useState<QueueFile[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<ReadingMode>('soft-dark')
  const [customColor, setCustomColor] = useState('#1e293b')
  const [appendImages, setAppendImages] = useState(false)
  const [converting, setConverting] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const sessionRef = useRef<string | null>(null)

  const bgColor = mode === 'custom' ? customColor : ModePresets[mode].hex
  const selected = files.find((f) => f.id === selectedId) ?? null
  const doneCount = files.filter((f) => f.status === 'done').length

  const addFiles = useCallback((incoming: File[]) => {
    if (incoming.length === 0) return
    setFiles((prev) => {
      const next = [...prev, ...incoming.map(toQueueFile)]
      setSelectedId((cur) => cur ?? next[next.length - incoming.length]?.id ?? null)
      return next
    })
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      const next = prev.filter((f) => f.id !== id)
      setSelectedId((cur) => (cur === id ? next[0]?.id ?? null : cur))
      return next
    })
  }, [])

  const convertAll = useCallback(async () => {
    const pending = files.filter((f) => f.status !== 'converting' && f.status !== 'done')
    if (pending.length === 0 || converting) return
    setConverting(true)
    for (const item of pending) {
      setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, status: 'converting', error: undefined } : f)))
      try {
        const result = await convertFile(item.file, { mode, bgColor, appendImages })
        sessionRef.current = result.sessionId
        setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, status: 'done', downloadUrl: result.downloadUrl, previewUrl: result.previewUrl, pipeline: result.pipeline, pages: result.pages } : f)))
        setSelectedId(item.id)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Conversion failed'
        setFiles((prev) => prev.map((f) => (f.id === item.id ? { ...f, status: 'error', error: message } : f)))
      }
    }
    setConverting(false)
  }, [files, converting, mode, bgColor, appendImages])

  // Cleanup transient server-side session storage on unload / unmount
  useEffect(() => {
    const handler = () => sessionRef.current && cleanupSession(sessionRef.current)
    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('beforeunload', handler)
      handler()
    }
  }, [])

  // Esc exits full-screen reader
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFullscreen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  const downloadAll = useCallback(() => {
    files.filter((f) => f.status === 'done' && f.downloadUrl).forEach((f, i) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = f.downloadUrl!
        a.download = f.file.name.replace(/\.pdf$/i, '') + '-dark.pdf'
        a.click()
      }, i * 300)
    })
  }, [files])

  const sidebar = (
    <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-r border-line bg-panel p-4 lg:w-[380px]">
      <section>
        <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">1 · Upload</h2>
        <UploadDropzone onFiles={addFiles} />
      </section>

      {files.length > 0 && (
        <section>
          <div className="mb-1.5 flex items-center justify-between">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Queue · {files.length}</h2>
            {doneCount > 1 && (
              <button type="button" onClick={downloadAll} className="flex items-center gap-1 text-[10px] font-medium text-accent hover:brightness-110">
                <Download size={11} /> Download all
              </button>
            )}
          </div>
          <FileQueue files={files} selectedId={selectedId} onSelect={setSelectedId} onRemove={removeFile} />
        </section>
      )}

      <section>
        <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">2 · Reading mode</h2>
        <ModePresetPicker mode={mode} customColor={customColor} onMode={setMode} onCustomColor={setCustomColor} />
      </section>

      <section>
        <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">3 · Figures</h2>
        <AppendixToggle enabled={appendImages} onChange={setAppendImages} />
      </section>

      <button
        type="button"
        onClick={convertAll}
        disabled={files.length === 0 || converting}
        className="mt-auto flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-black transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {converting ? (<><Loader2 size={16} className="animate-spin" /> Converting…</>) : (<><Sparkles size={16} /> Convert {files.length > 1 ? `${files.length} PDFs` : 'PDF'}</>)}
      </button>

      <p className="flex shrink-0 items-center justify-center gap-1.5 text-[10px] text-zinc-600">
        <ShieldCheck size={11} /> Transient processing · files deleted after your session{MOCK_API ? ' · mock mode' : ''}
      </p>
    </aside>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-ink">
        <PreviewPane file={selected} />
        <button
          type="button"
          onClick={() => setFullscreen(false)}
          className="absolute right-4 top-4 rounded-lg border border-line bg-black/70 px-3 py-2 text-xs font-medium text-zinc-200 backdrop-blur transition hover:text-white"
        >
          Exit · Esc
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink text-zinc-200">
      <TopBar fullscreen={false} onToggleFullscreen={() => setFullscreen(true)} />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {sidebar}
        <main className="min-h-0 flex-1 bg-ink">
          <PreviewPane file={selected} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
