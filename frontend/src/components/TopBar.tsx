import { Moon, Maximize2, Minimize2 } from 'lucide-react'

interface Props {
  fullscreen: boolean
  onToggleFullscreen: () => void
}

export default function TopBar({ fullscreen, onToggleFullscreen }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-panel px-4 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Moon size={18} strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <h1 className="text-sm font-semibold tracking-tight text-zinc-100">Dark Reader PDF</h1>
          <p className="hidden text-[11px] text-zinc-500 sm:block">Comfortable dark reading for any PDF</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleFullscreen}
        className="flex items-center gap-2 rounded-md border border-line bg-panel-2 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-accent/40 hover:text-zinc-100"
        aria-label={fullscreen ? 'Exit full-screen reader' : 'Enter full-screen reader'}
      >
        {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        <span className="hidden sm:inline">{fullscreen ? 'Exit full screen' : 'Full-screen reader'}</span>
      </button>
    </header>
  )
}
