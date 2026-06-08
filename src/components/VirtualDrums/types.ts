import type { DrumType, VelocityLevel } from '@/utils/audio'

export interface DrumPadData {
  type: DrumType
  label: string
  icon: string
  keyboardKey: string
  color: string
  glowColor: string
}

export const DRUM_PADS: DrumPadData[] = [
  {
    type: 'kick',
    label: '底鼓',
    icon: '🥁',
    keyboardKey: 'q',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
  },
  {
    type: 'snare',
    label: '军鼓',
    icon: '🪘',
    keyboardKey: 'w',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
  },
  {
    type: 'hihat',
    label: '踩镲',
    icon: '🎵',
    keyboardKey: 'e',
    color: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.6)',
  },
  {
    type: 'tom',
    label: '嗵鼓',
    icon: '🔔',
    keyboardKey: 'a',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.6)',
  },
  {
    type: 'ride',
    label: '叮叮镲',
    icon: '✨',
    keyboardKey: 's',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.6)',
  },
  {
    type: 'cowbell',
    label: '牛铃',
    icon: '🔔',
    keyboardKey: 'd',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
  },
]

export const VELOCITY_OPTIONS: { value: VelocityLevel; label: string; description: string }[] = [
  { value: 'p', label: 'p', description: '轻柔' },
  { value: 'mf', label: 'mf', description: '中等' },
  { value: 'f', label: 'f', description: '强音' },
]
