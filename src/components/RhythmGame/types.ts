export type DifficultyType = 'easy' | 'medium' | 'hard'

export type GameStateType = 'select' | 'demo' | 'countdown' | 'playing' | 'result'

export type JudgmentType = 'perfect' | 'good' | 'miss'

export type DrumSoundType = 'kick' | 'snare' | 'hihat'

export interface BeatNote {
  time: number
  drum: DrumSoundType
  hit?: boolean
  judgment?: JudgmentType
  userTime?: number
}

export interface RhythmPattern {
  id: string
  name: string
  difficulty: DifficultyType
  bpm: number
  beatsPerMeasure: number
  measures: number
  notes: BeatNote[]
}

export interface DifficultyConfig {
  type: DifficultyType
  label: string
  description: string
  bpm: number
  icon: string
  color: string
  gradientFrom: string
  gradientTo: string
}

export interface GameResult {
  score: number
  perfectCount: number
  goodCount: number
  missCount: number
  totalNotes: number
  accuracy: number
}

export const DIFFICULTIES: DifficultyConfig[] = [
  {
    type: 'easy',
    label: '简单',
    description: '4/4拍，慢速，只有四分音符',
    bpm: 80,
    icon: '🌱',
    color: '#10b981',
    gradientFrom: '#6ee7b7',
    gradientTo: '#a7f3d0',
  },
  {
    type: 'medium',
    label: '中等',
    description: '4/4拍，中速，包含八分音符',
    bpm: 100,
    icon: '🌿',
    color: '#f59e0b',
    gradientFrom: '#fcd34d',
    gradientTo: '#fde68a',
  },
  {
    type: 'hard',
    label: '困难',
    description: '4/4拍，快速，包含八分音符和切分节奏',
    bpm: 120,
    icon: '🌳',
    color: '#ec4899',
    gradientFrom: '#f9a8d4',
    gradientTo: '#fbcfe8',
  },
]

export const JUDGMENT_THRESHOLDS = {
  perfect: 0.1,
  good: 0.2,
}

export const JUDGMENT_SCORES = {
  perfect: 100,
  good: 70,
  miss: 0,
}
