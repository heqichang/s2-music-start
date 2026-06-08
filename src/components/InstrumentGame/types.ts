export type InstrumentType = 'piano' | 'violin' | 'guitar' | 'flute' | 'trumpet' | 'drum'

export type GameStateType = 'start' | 'playing' | 'result' | 'gallery'

export interface Instrument {
  id: InstrumentType
  name: string
  emoji: string
  color: string
  gradientFrom: string
  gradientTo: string
  description: string
}

export interface Question {
  id: number
  correctInstrument: InstrumentType
  options: InstrumentType[]
}
