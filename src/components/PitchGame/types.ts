export type DifficultyType = 'easy' | 'medium' | 'hard'

export type GameStateType = 'select' | 'playing' | 'result'

export interface Question {
  id: number
  notes: string[]
  correctAnswer: string | string[]
  options: string[]
  type: 'compare' | 'sort' | 'interval'
  questionText: string
}

export interface DifficultyConfig {
  type: DifficultyType
  label: string
  description: string
  icon: string
  color: string
  gradientFrom: string
  gradientTo: string
}

export const DIFFICULTIES: DifficultyConfig[] = [
  {
    type: 'easy',
    label: '简单',
    description: '2个音对比，判断哪个更高',
    icon: '🌱',
    color: '#10b981',
    gradientFrom: '#6ee7b7',
    gradientTo: '#a7f3d0',
  },
  {
    type: 'medium',
    label: '中等',
    description: '3个音排序，从低到高排列',
    icon: '🌿',
    color: '#f59e0b',
    gradientFrom: '#fcd34d',
    gradientTo: '#fde68a',
  },
  {
    type: 'hard',
    label: '困难',
    description: '音程识别，挑战你的耳朵',
    icon: '🌳',
    color: '#ec4899',
    gradientFrom: '#f9a8d4',
    gradientTo: '#fbcfe8',
  },
]

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const OCTAVES = [4, 5, 6]

export const INTERVALS = [
  { name: '大二度', semitones: 2 },
  { name: '大三度', semitones: 4 },
  { name: '纯四度', semitones: 5 },
  { name: '纯五度', semitones: 7 },
  { name: '大六度', semitones: 9 },
  { name: '八度', semitones: 12 },
]
