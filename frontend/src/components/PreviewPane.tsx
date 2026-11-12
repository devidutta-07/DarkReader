import { FileSearch, Download, AlertTriangle, Loader2 } from 'lucide-react'
import type { QueueFile } from '../lib/types'

interface Props {
  file: QueueFile | null
}

export default function PreviewPane({ file }: Props) {
  if (!file) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-panel-2 text-zinc-600">
          <FileSearch size={28} />
        </div>
        <h2 className="text-sm font-semibold text-zinc-300">No PDF selected</h2>
        <p className="max-w-xs text-xs leading-relaxed text-zinc-500">Upload one or more PDFs, pick a reading mode, and hit Convert. The converted document previews here.</p>
      </div>
    )
  }

  if (file.status === 'converting') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <Loader2 size={30} className="animate-spin text-accent" />
        <p className="text-sm font-medium text-zinc-300">Converting “{file.file.name}”…</p>
        <p className="text-[11px] text-zinc-500">Classifying pages and applying your palette. Large scans may take a moment.</p>
      </div>
    )
  }

  if (file.status === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <AlertTriangle size={30} className="text-red-400" />
        <p className="text-sm font-medium text-zinc-200">Conversion failed</p>
        <p className="max-w-sm text-xs text-zinc-500">{file.error ?? 'Unknown error. Please try again.'}</p>
      </div>
    )
  }

  if (file.status === 'done' && file.previewUrl) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-line bg-panel px-3">
          <p className="min-w-0 truncate text-[11px] text-zinc-400">
            {file.file.name}{file.pipeline ? ` · Pipeline ${file.pipeline}` : ''}{file.pages ? ` · ${file.pages} pages` : ''}
          </p>
          <a
            href={file.downloadUrl}
            download={file.file.name.replace(/\.pdf$/i, '') + '-dark.pdf'}
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-black transition hover:brightness-110"
          >
            <Download size={13} /> Download
          </a>
        </div>
        <iframe key={file.previewUrl} src={file.previewUrl} title={`Preview of ${file.file.name}`} className="min-h-0 flex-1 bg-white" />
      </div>
    )
  }

  // queued (not yet converted)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm font-medium text-zinc-300">“{file.file.name}” is ready to convert</p>
      <p className="text-[11px] text-zinc-500">Choose a mode and press Convert to generate the preview.</p>
    </div>
  )
}
