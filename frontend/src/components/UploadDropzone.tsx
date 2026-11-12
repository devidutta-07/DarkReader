import { useCallback, useRef, useState } from 'react'
import { UploadCloud, FolderOpen, FilePlus2 } from 'lucide-react'

interface Props {
  onFiles: (files: File[]) => void
}

const pdfOnly = (list: FileList | null): File[] =>
  list ? Array.from(list).filter((f) => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf') : []

export default function UploadDropzone({ onFiles }: Props) {
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const folderRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      onFiles(pdfOnly(e.dataTransfer.files))
    },
    [onFiles],
  )

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition ${
          dragging ? 'border-accent/60 bg-accent/5' : 'border-line bg-panel-2 hover:border-accent/40'
        }`}
      >
        <UploadCloud size={26} className="text-zinc-500 transition group-hover:text-accent" />
        <p className="text-sm font-medium text-zinc-200">Drop PDFs here, or click to browse</p>
        <p className="text-[11px] text-zinc-500">Multiple files supported · .pdf only</p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => folderRef.current?.click()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-zinc-400 transition hover:text-zinc-100"
        >
          <FolderOpen size={13} /> Upload folder
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-zinc-400 transition hover:text-zinc-100"
        >
          <FilePlus2 size={13} /> Add more
        </button>
      </div>

      <input ref={fileRef} type="file" accept=".pdf,application/pdf" multiple hidden onChange={(e) => { onFiles(pdfOnly(e.target.files)); e.target.value = '' }} />
      <input
        ref={folderRef}
        type="file"
        multiple
        hidden
        // @ts-expect-error non-standard webkitdirectory attribute
        webkitdirectory=""
        onChange={(e) => { onFiles(pdfOnly(e.target.files)); e.target.value = '' }}
      />
    </div>
  )
}
