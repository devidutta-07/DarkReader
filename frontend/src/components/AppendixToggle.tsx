import { Images } from 'lucide-react'

interface Props {
  enabled: boolean
  onChange: (v: boolean) => void
}

export default function AppendixToggle({ enabled, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="flex w-full items-center gap-3 rounded-lg border border-line bg-panel-2 p-2.5 text-left transition hover:border-zinc-700"
    >
      <Images size={18} className="shrink-0 text-zinc-500" />
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium text-zinc-100">Appendix Mode</span>
        <span className="block text-[9px] leading-tight text-zinc-500">Move figures &amp; charts to a “Figures &amp; Visuals Appendix” at the end</span>
      </span>
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition ${enabled ? 'bg-accent' : 'bg-zinc-700'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${enabled ? 'left-4.5' : 'left-0.5'}`} style={{ left: enabled ? '18px' : '2px' }} />
      </span>
    </button>
  )
}
