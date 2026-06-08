import type { Instrument, InstrumentType } from './types'
import type { DrumType } from '@/utils/audio'

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'piano',
    name: '钢琴',
    emoji: '🎹',
    color: '#7c3aed',
    gradientFrom: '#a78bfa',
    gradientTo: '#ddd6fe',
    description: '钢琴有88个黑白琴键，音域宽广，被称为"乐器之王"。它可以演奏出美妙的旋律和丰富的和声。',
  },
  {
    id: 'violin',
    name: '小提琴',
    emoji: '🎻',
    color: '#ec4899',
    gradientFrom: '#f9a8d4',
    gradientTo: '#fbcfe8',
    description: '小提琴是弦乐器的一种，用弓拉奏。它的声音优美动听，像在唱歌一样，被称为"乐器皇后"。',
  },
  {
    id: 'guitar',
    name: '吉他',
    emoji: '🎸',
    color: '#f97316',
    gradientFrom: '#fdba74',
    gradientTo: '#fed7aa',
    description: '吉他有六根弦，用手指拨弦演奏。它的声音清脆明亮，在流行音乐和民谣中很常见。',
  },
  {
    id: 'flute',
    name: '笛子',
    emoji: '🪈',
    color: '#10b981',
    gradientFrom: '#6ee7b7',
    gradientTo: '#a7f3d0',
    description: '笛子是木管乐器，横着吹。它的声音清亮悠扬，像小鸟在歌唱，非常好听。',
  },
  {
    id: 'trumpet',
    name: '小号',
    emoji: '🎺',
    color: '#f59e0b',
    gradientFrom: '#fcd34d',
    gradientTo: '#fde68a',
    description: '小号是铜管乐器，用嘴吹奏。它的声音嘹亮辉煌，在乐队中常常担任重要的角色。',
  },
  {
    id: 'drum',
    name: '架子鼓',
    emoji: '🥁',
    color: '#3b82f6',
    gradientFrom: '#93c5fd',
    gradientTo: '#bfdbfe',
    description: '架子鼓由好几个鼓和镲片组成，用鼓槌敲击。它是乐队的"节拍器"，让音乐更有节奏感！',
  },
]

export const INSTRUMENT_MAP: Record<InstrumentType, Instrument> = INSTRUMENTS.reduce(
  (map, inst) => {
    map[inst.id] = inst
    return map
  },
  {} as Record<InstrumentType, Instrument>
)

export const MELODY_NOTES: Record<Exclude<InstrumentType, 'drum'>, string[]> = {
  piano: ['C4', 'E4', 'G4', 'C5'],
  violin: ['D4', 'F4', 'A4', 'B4'],
  guitar: ['E4', 'G4', 'B4', 'D5'],
  flute: ['G4', 'A4', 'B4', 'C5'],
  trumpet: ['C4', 'G4', 'C5', 'E5'],
}

interface DrumPatternItem {
  drum: DrumType
  beat: number
}

export const DRUM_PATTERN: DrumPatternItem[] = [
  { drum: 'kick', beat: 0 },
  { drum: 'hihat', beat: 0.5 },
  { drum: 'snare', beat: 1 },
  { drum: 'hihat', beat: 1.5 },
  { drum: 'kick', beat: 2 },
  { drum: 'hihat', beat: 2.5 },
  { drum: 'snare', beat: 3 },
  { drum: 'hihat', beat: 3.5 },
]
