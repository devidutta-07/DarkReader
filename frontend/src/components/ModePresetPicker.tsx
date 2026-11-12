import { Check } from 'lucide-react'
import { ModePresets, type ReadingMode } from '../lib/types'

interface Props {
  mode: ReadingMode
  customColor: string
  onMode: (m: ReadingMode) => void
  onCustomColor: (hex: string) => void
}

export default function ModePresetPicker({ mode, customColor, onMode, onCustomColor }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(ModePresets).map(([key, preset]) => {
          const active = mode === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onMode(key as ReadingMode)}
              aria-pressed={active}
              className={`rounded-lg border p-2 text-left transition ${
                active ? 'border-accent/60 bg-accent/10' : 'border-line bg-panel-2 hover:border-zinc-700'
              }`}
            >
              <span className="mb-1.5 flex h-7 w-full items-center justify-between rounded-md border border-black/30 px-1.5" style={{ backgroundColor: preset.hex }}>
                {active && <Check size={13} className={key === 'cream' ? 'text-zinc-800' : 'text-zinc-100'} />}
              </span>
              <span className="block text-[11px] font-medium text-zinc-100">{preset.label}</span>
              <span className="block text-[9px] leading-tight text-zinc-500">{preset.description}</span>
            </button>
          )
        })}
      </div>

      <div className={`flex items-center gap-2 rounded-lg border p-2 transition ${mode === 'custom' ? 'border-accent/60 bg-accent/10' : 'border-line bg-panel-2'}`}>
        <button type="button" onClick={() => onMode('custom')} className="min-w-0 flex-1 text-left" aria-pressed={mode === 'custom'}>
          <span className="block text-[11px] font-medium text-zinc-100">Custom color</span>
          <span className="block text-[9px] text-zinc-500">Any hex background</span>
        </button>
        <input
          type="color"
          value={customColor}
          onChange={(e) => { onCustomColor(e.target.value); onMode('custom') }}
          className="h-8 w-9 cursor-pointer rounded border border-line bg-transparent"
          aria-label="Pick custom background color"
        />
        <input
          type="text"
          value={customColor}
          onChange={(e) => { onCustomColor(e.target.value); onMode('custom') }}
          spellCheck={false}
          className="w-20 rounded-md border border-line bg-ink px-2 py-1.5 font-mono text-[11px] uppercase text-zinc-200 outline-none focus:border-accent/50"
          aria-label="Custom hex color"
        />
      </div>
    </div>
  )
}
