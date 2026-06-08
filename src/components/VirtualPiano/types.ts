import type { InstrumentType, VelocityLevel } from '@/utils/audio'

export type NoteType = 'white' | 'black'

export interface PianoKeyData {
  note: string
  type: NoteType
  keyLabel: string
  keyboardKey: string
}

export const WHITE_KEYS: PianoKeyData[] = [
  { note: 'C4', type: 'white', keyLabel: 'C4', keyboardKey: 'a' },
  { note: 'D4', type: 'white', keyLabel: 'D4', keyboardKey: 's' },
  { note: 'E4', type: 'white', keyLabel: 'E4', keyboardKey: 'd' },
  { note: 'F4', type: 'white', keyLabel: 'F4', keyboardKey: 'f' },
  { note: 'G4', type: 'white', keyLabel: 'G4', keyboardKey: 'g' },
  { note: 'A4', type: 'white', keyLabel: 'A4', keyboardKey: 'h' },
  { note: 'B4', type: 'white', keyLabel: 'B4', keyboardKey: 'j' },
  { note: 'C5', type: 'white', keyLabel: 'C5', keyboardKey: 'k' },
  { note: 'D5', type: 'white', keyLabel: 'D5', keyboardKey: 'l' },
  { note: 'E5', type: 'white', keyLabel: 'E5', keyboardKey: ';' },
  { note: 'F5', type: 'white', keyLabel: 'F5', keyboardKey: "'" },
  { note: 'G5', type: 'white', keyLabel: 'G5', keyboardKey: 'z' },
  { note: 'A5', type: 'white', keyLabel: 'A5', keyboardKey: 'x' },
  { note: 'B5', type: 'white', keyLabel: 'B5', keyboardKey: 'c' },
  { note: 'C6', type: 'white', keyLabel: 'C6', keyboardKey: 'v' },
]

export const BLACK_KEYS: PianoKeyData[] = [
  { note: 'C#4', type: 'black', keyLabel: 'C#4', keyboardKey: 'w' },
  { note: 'D#4', type: 'black', keyLabel: 'D#4', keyboardKey: 'e' },
  { note: 'F#4', type: 'black', keyLabel: 'F#4', keyboardKey: 't' },
  { note: 'G#4', type: 'black', keyLabel: 'G#4', keyboardKey: 'y' },
  { note: 'A#4', type: 'black', keyLabel: 'A#4', keyboardKey: 'u' },
  { note: 'C#5', type: 'black', keyLabel: 'C#5', keyboardKey: 'o' },
  { note: 'D#5', type: 'black', keyLabel: 'D#5', keyboardKey: 'p' },
  { note: 'F#5', type: 'black', keyLabel: 'F#5', keyboardKey: '1' },
  { note: 'G#5', type: 'black', keyLabel: 'G#5', keyboardKey: '2' },
  { note: 'A#5', type: 'black', keyLabel: 'A#5', keyboardKey: '3' },
]

export const BLACK_KEY_POSITIONS: Record<string, number> = {
  'C#4': 0,
  'D#4': 1,
  'F#4': 3,
  'G#4': 4,
  'A#4': 5,
  'C#5': 7,
  'D#5': 8,
  'F#5': 10,
  'G#5': 11,
  'A#5': 12,
}

export const INSTRUMENT_OPTIONS: { value: InstrumentType; label: string; icon: string }[] = [
  { value: 'piano', label: '钢琴', icon: '🎹' },
  { value: 'violin', label: '小提琴', icon: '🎻' },
  { value: 'guitar', label: '吉他', icon: '🎸' },
  { value: 'flute', label: '笛子', icon: '🎼' },
  { value: 'trumpet', label: '小号', icon: '🎺' },
  { value: 'synth', label: '合成器', icon: '🎛️' },
]

export const VELOCITY_OPTIONS: { value: VelocityLevel; label: string; description: string }[] = [
  { value: 'p', label: 'p', description: '轻柔' },
  { value: 'mf', label: 'mf', description: '中等' },
  { value: 'f', label: 'f', description: '强音' },
]
