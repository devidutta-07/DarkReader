export type ReadingMode = 'soft-dark' | 'oled' | 'cream' | 'custom'

export interface QueueFile {
  id: string
  file: File
  status: 'queued' | 'converting' | 'done' | 'error'
  error?: string
  downloadUrl?: string
  previewUrl?: string
  pipeline?: 'A' | 'B'
  pages?: number
}

export interface ConvertOptions {
  mode: ReadingMode
  bgColor: string
  appendImages: boolean
}

export const ModePresets: Record<Exclude<ReadingMode, 'custom'>, { label: string; hex: string; description: string }> = {
  'soft-dark': { label: 'Soft Dark', hex: '#121212', description: 'Charcoal, zero halation' },
  oled: { label: 'OLED Black', hex: '#000000', description: 'True black, battery saver' },
  cream: { label: 'Warm Cream', hex: '#F4ECD8', description: 'Sepia paper tone' },
}
