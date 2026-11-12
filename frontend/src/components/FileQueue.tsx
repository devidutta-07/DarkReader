import { FileText, X, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import type { QueueFile } from '../lib/types'

interface Props {
  files: QueueFile[]
  selectedId: string | null
  onSelect: (id: string) => void
  onRemove: (id: string) => void
}

const fmtSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

function StatusIcon({ status }: { status: QueueFile['status'] }) {
  switch (status) {
    case 'converting': return <Loader2 size={14} className="animate-spin text-accent" />
    case 'done': return <CheckCircle2 size={14} className="text-emerald-400" />
    case 'error': return <AlertCircle size={14} className="text-red-400" />
    default: return <Clock size={14} className="text-zinc-500" />
  }
}

export default function FileQueue({ files, selectedId, onSelect, onRemove }: Props) {
  if (files.length === 0) return null
  return (
    <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
      {files.map((f) => {
        const selected = f.id === selectedId
        return (
          <li
            key={f.id}
            className={`group flex w-full items-center gap-2 rounded-lg border px-2 py-2 text-left transition ${
              selected ? 'border-accent/50 bg-accent/10' : 'border-line bg-panel-2 hover:border-zinc-700'
            }`}
          >
            <button type="button" onClick={() => onSelect(f.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
              <FileText size={16} className="shrink-0 text-zinc-500" />
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-zinc-100" title={f.file.name}>{f.file.name}</span>
                <span className="block text-[10px] text-zinc-500">
                  {fmtSize(f.file.size)}
                  {f.pages ? ` · ${f.pages} pages` : ''}
                  {f.pipeline ? ` · Pipeline ${f.pipeline}` : ''}
                  {f.status === 'error' && f.error ? ` · ${f.error}` : ''}
                </span>
              </span>
            </button>
            <StatusIcon status={f.status} />
            <button
              type="button"
              onClick={() => onRemove(f.id)}
              className="rounded p-1 text-zinc-600 opacity-0 transition group-hover:opacity-100 hover:text-zinc-200"
              aria-label={`Remove ${f.file.name}`}
            >
              <X size={14} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
