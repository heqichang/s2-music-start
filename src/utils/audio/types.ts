export type InstrumentType = 'piano' | 'violin' | 'guitar' | 'flute' | 'trumpet' | 'synth'

export type DrumType = 'kick' | 'snare' | 'hihat' | 'tom' | 'ride' | 'cowbell'

export type VelocityLevel = 'p' | 'mf' | 'f'

export interface NoteOptions {
  note: string
  instrument: InstrumentType
  duration?: number
  velocity?: VelocityLevel | number
  startTime?: number
}

export interface DrumOptions {
  drumType: DrumType
  velocity?: VelocityLevel | number
  startTime?: number
}

export interface VelocityConfig {
  gain: number
  brightness: number
  attack: number
  release: number
}

export const VELOCITY_MAP: Record<VelocityLevel, VelocityConfig> = {
  p: { gain: 0.3, brightness: 0.6, attack: 0.05, release: 0.3 },
  mf: { gain: 0.6, brightness: 1.0, attack: 0.02, release: 0.2 },
  f: { gain: 0.9, brightness: 1.3, attack: 0.005, release: 0.15 },
}

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const A4_FREQUENCY = 440
export const A4_MIDI = 69
