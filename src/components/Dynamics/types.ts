export type DynamicsLevel = 'p' | 'mf' | 'f'

export interface DynamicsInfo {
  level: DynamicsLevel
  label: string
  name: string
  description: string
  color: string
  colorLight: string
  icon: string
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
}

export const DYNAMICS_CONFIG: Record<DynamicsLevel, DynamicsInfo> = {
  f: {
    level: 'f',
    label: 'f',
    name: 'forte',
    description: '强 - 大声的、有力的',
    color: '#f97316',
    colorLight: '#fdba74',
    icon: '🔊',
  },
  mf: {
    level: 'mf',
    label: 'mf',
    name: 'mezzo-forte',
    description: '中强 - 中等音量',
    color: '#f59e0b',
    colorLight: '#fcd34d',
    icon: '🔉',
  },
  p: {
    level: 'p',
    label: 'p',
    name: 'piano',
    description: '弱 - 轻柔的、小声的',
    color: '#10b981',
    colorLight: '#6ee7b7',
    icon: '🔈',
  },
}

export const DYNAMICS_LEVELS: DynamicsLevel[] = ['p', 'mf', 'f']
