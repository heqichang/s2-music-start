export const MUSIC_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const

export const NOTE_FREQUENCIES: Record<string, number> = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  B: 493.88,
}

export const DIFFICULTY_LEVELS = {
  beginner: { label: '入门', color: '#52c41a' },
  elementary: { label: '初级', color: '#1890ff' },
  intermediate: { label: '中级', color: '#fa8c16' },
  advanced: { label: '高级', color: '#f5222d' },
} as const
