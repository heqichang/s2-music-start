import type { RhythmPattern, DifficultyType } from './types'

const beatDuration = (bpm: number, beats: number): number => {
  return (60 / bpm) * beats
}

const generateQuarterNotes = (bpm: number, measures: number): RhythmPattern['notes'] => {
  const notes: RhythmPattern['notes'] = []
  const beatDur = beatDuration(bpm, 1)
  const totalBeats = measures * 4

  for (let i = 0; i < totalBeats; i++) {
    const drums: ('kick' | 'snare' | 'hihat')[] = ['hihat']
    if (i % 4 === 0) drums.push('kick')
    if (i % 4 === 2) drums.push('snare')
    drums.forEach((drum) => {
      notes.push({ time: i * beatDur, drum })
    })
  }
  return notes
}

const easyPatterns: RhythmPattern[] = [
  {
    id: 'easy-1',
    name: '基础节拍 1',
    difficulty: 'easy',
    bpm: 80,
    beatsPerMeasure: 4,
    measures: 2,
    notes: generateQuarterNotes(80, 2),
  },
  {
    id: 'easy-2',
    name: '基础节拍 2',
    difficulty: 'easy',
    bpm: 80,
    beatsPerMeasure: 4,
    measures: 3,
    notes: generateQuarterNotes(80, 3),
  },
  {
    id: 'easy-3',
    name: '基础节拍 3',
    difficulty: 'easy',
    bpm: 80,
    beatsPerMeasure: 4,
    measures: 4,
    notes: generateQuarterNotes(80, 4),
  },
]

const mediumPatterns: RhythmPattern[] = [
  {
    id: 'medium-1',
    name: '八分入门',
    difficulty: 'medium',
    bpm: 100,
    beatsPerMeasure: 4,
    measures: 2,
    notes: (() => {
      const notes: RhythmPattern['notes'] = []
      const beatDur = beatDuration(100, 1)
      const eighthDur = beatDur / 2

      for (let measure = 0; measure < 2; measure++) {
        const measureStart = measure * 4 * beatDur
        for (let beat = 0; beat < 4; beat++) {
          const beatTime = measureStart + beat * beatDur
          notes.push({ time: beatTime, drum: 'hihat' })
          notes.push({ time: beatTime + eighthDur, drum: 'hihat' })
          if (beat === 0) notes.push({ time: beatTime, drum: 'kick' })
          if (beat === 2) notes.push({ time: beatTime, drum: 'snare' })
        }
      }
      return notes.sort((a, b) => a.time - b.time)
    })(),
  },
  {
    id: 'medium-2',
    name: '律动节拍',
    difficulty: 'medium',
    bpm: 100,
    beatsPerMeasure: 4,
    measures: 3,
    notes: (() => {
      const notes: RhythmPattern['notes'] = []
      const beatDur = beatDuration(100, 1)
      const eighthDur = beatDur / 2

      for (let measure = 0; measure < 3; measure++) {
        const measureStart = measure * 4 * beatDur
        for (let beat = 0; beat < 4; beat++) {
          const beatTime = measureStart + beat * beatDur
          notes.push({ time: beatTime, drum: 'hihat' })
          notes.push({ time: beatTime + eighthDur, drum: 'hihat' })
          if (beat === 0 || beat === 2) {
            notes.push({ time: beatTime, drum: beat === 0 ? 'kick' : 'snare' })
          }
          if (beat === 1 || beat === 3) {
            notes.push({ time: beatTime + eighthDur, drum: 'kick' })
          }
        }
      }
      return notes.sort((a, b) => a.time - b.time)
    })(),
  },
  {
    id: 'medium-3',
    name: '进阶节奏',
    difficulty: 'medium',
    bpm: 100,
    beatsPerMeasure: 4,
    measures: 4,
    notes: (() => {
      const notes: RhythmPattern['notes'] = []
      const beatDur = beatDuration(100, 1)
      const eighthDur = beatDur / 2

      for (let measure = 0; measure < 4; measure++) {
        const measureStart = measure * 4 * beatDur
        for (let beat = 0; beat < 4; beat++) {
          const beatTime = measureStart + beat * beatDur
          notes.push({ time: beatTime, drum: 'hihat' })
          notes.push({ time: beatTime + eighthDur, drum: 'hihat' })
          if (beat === 0) notes.push({ time: beatTime, drum: 'kick' })
          if (beat === 2) notes.push({ time: beatTime, drum: 'snare' })
          if (beat === 1 || beat === 3) {
            notes.push({ time: beatTime + eighthDur, drum: 'snare' })
          }
        }
      }
      return notes.sort((a, b) => a.time - b.time)
    })(),
  },
]

const hardPatterns: RhythmPattern[] = [
  {
    id: 'hard-1',
    name: '切分入门',
    difficulty: 'hard',
    bpm: 120,
    beatsPerMeasure: 4,
    measures: 2,
    notes: (() => {
      const notes: RhythmPattern['notes'] = []
      const beatDur = beatDuration(120, 1)
      const eighthDur = beatDur / 2

      for (let measure = 0; measure < 2; measure++) {
        const measureStart = measure * 4 * beatDur
        for (let beat = 0; beat < 4; beat++) {
          const beatTime = measureStart + beat * beatDur
          notes.push({ time: beatTime, drum: 'hihat' })
          notes.push({ time: beatTime + eighthDur, drum: 'hihat' })
        }
        notes.push({ time: measureStart + 0 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 1.5 * beatDur, drum: 'snare' })
        notes.push({ time: measureStart + 2 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 3.5 * beatDur, drum: 'snare' })
      }
      return notes.sort((a, b) => a.time - b.time)
    })(),
  },
  {
    id: 'hard-2',
    name: '复杂切分',
    difficulty: 'hard',
    bpm: 120,
    beatsPerMeasure: 4,
    measures: 3,
    notes: (() => {
      const notes: RhythmPattern['notes'] = []
      const beatDur = beatDuration(120, 1)
      const eighthDur = beatDur / 2

      for (let measure = 0; measure < 3; measure++) {
        const measureStart = measure * 4 * beatDur
        for (let beat = 0; beat < 4; beat++) {
          const beatTime = measureStart + beat * beatDur
          notes.push({ time: beatTime, drum: 'hihat' })
          notes.push({ time: beatTime + eighthDur, drum: 'hihat' })
        }
        notes.push({ time: measureStart + 0 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 0.5 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 2 * beatDur, drum: 'snare' })
        notes.push({ time: measureStart + 2.5 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 3.5 * beatDur, drum: 'snare' })
      }
      return notes.sort((a, b) => a.time - b.time)
    })(),
  },
  {
    id: 'hard-3',
    name: '终极挑战',
    difficulty: 'hard',
    bpm: 120,
    beatsPerMeasure: 4,
    measures: 4,
    notes: (() => {
      const notes: RhythmPattern['notes'] = []
      const beatDur = beatDuration(120, 1)
      const eighthDur = beatDur / 2

      for (let measure = 0; measure < 4; measure++) {
        const measureStart = measure * 4 * beatDur
        for (let beat = 0; beat < 4; beat++) {
          const beatTime = measureStart + beat * beatDur
          notes.push({ time: beatTime, drum: 'hihat' })
          notes.push({ time: beatTime + eighthDur, drum: 'hihat' })
        }
        notes.push({ time: measureStart + 0 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 0.5 * beatDur, drum: 'snare' })
        notes.push({ time: measureStart + 1.5 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 2 * beatDur, drum: 'snare' })
        notes.push({ time: measureStart + 2.5 * beatDur, drum: 'kick' })
        notes.push({ time: measureStart + 3 * beatDur, drum: 'snare' })
        notes.push({ time: measureStart + 3.5 * beatDur, drum: 'kick' })
      }
      return notes.sort((a, b) => a.time - b.time)
    })(),
  },
]

export const RHYTHM_PATTERNS: RhythmPattern[] = [
  ...easyPatterns,
  ...mediumPatterns,
  ...hardPatterns,
]

export const getPatternsByDifficulty = (difficulty: DifficultyType): RhythmPattern[] => {
  return RHYTHM_PATTERNS.filter((p) => p.difficulty === difficulty)
}

export const getRandomPattern = (difficulty: DifficultyType): RhythmPattern => {
  const patterns = getPatternsByDifficulty(difficulty)
  return patterns[Math.floor(Math.random() * patterns.length)]
}
