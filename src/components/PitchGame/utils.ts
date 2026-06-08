import { NOTE_NAMES, INTERVALS, type Question, type DifficultyType } from './types'

function noteToMidi(note: string): number {
  const match = note.match(/^([A-G]#?)(\d)$/)
  if (!match) return 0
  const [, name, octaveStr] = match
  const octave = parseInt(octaveStr, 10)
  const noteIndex = NOTE_NAMES.indexOf(name)
  return (octave + 1) * 12 + noteIndex
}

function midiToNote(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  const noteIndex = midi % 12
  return `${NOTE_NAMES[noteIndex]}${octave}`
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateRandomNotes(count: number, minSemitoneDiff: number = 3): string[] {
  const notes: string[] = []
  const minMidi = noteToMidi('C4')
  const maxMidi = noteToMidi('C6')

  while (notes.length < count) {
    const midi = getRandomInt(minMidi, maxMidi)
    const note = midiToNote(midi)

    if (notes.length === 0) {
      notes.push(note)
    } else {
      const allFarEnough = notes.every((n) => Math.abs(noteToMidi(n) - midi) >= minSemitoneDiff)
      if (allFarEnough) {
        notes.push(note)
      }
    }
  }

  return notes
}

function generateEasyQuestion(id: number): Question {
  const notes = generateRandomNotes(2, 5)
  const sortedNotes = [...notes].sort((a, b) => noteToMidi(a) - noteToMidi(b))
  const higherNote = sortedNotes[1]

  return {
    id,
    notes,
    correctAnswer: higherNote,
    options: shuffleArray(notes),
    type: 'compare',
    questionText: '哪个音更高？',
  }
}

function generateMediumQuestion(id: number): Question {
  const notes = generateRandomNotes(3, 3)
  const sortedNotes = [...notes].sort((a, b) => noteToMidi(a) - noteToMidi(b))

  return {
    id,
    notes,
    correctAnswer: sortedNotes,
    options: shuffleArray(notes),
    type: 'sort',
    questionText: '按从低到高的顺序排列',
  }
}

function generateHardQuestion(id: number): Question {
  const intervalIndex = getRandomInt(0, INTERVALS.length - 1)
  const interval = INTERVALS[intervalIndex]

  const minMidi = noteToMidi('C4')
  const maxMidi = noteToMidi('C6') - interval.semitones
  const rootMidi = getRandomInt(minMidi, maxMidi)

  const rootNote = midiToNote(rootMidi)
  const upperNote = midiToNote(rootMidi + interval.semitones)

  const options = shuffleArray(INTERVALS.map((i) => i.name))

  return {
    id,
    notes: [rootNote, upperNote],
    correctAnswer: interval.name,
    options,
    type: 'interval',
    questionText: '这是什么音程？',
  }
}

export function generateQuestions(difficulty: DifficultyType, count: number = 10): Question[] {
  const questions: Question[] = []

  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(generateEasyQuestion(i + 1))
        break
      case 'medium':
        questions.push(generateMediumQuestion(i + 1))
        break
      case 'hard':
        questions.push(generateHardQuestion(i + 1))
        break
    }
  }

  return questions
}

export function isCorrectAnswer(question: Question, answer: string | string[]): boolean {
  if (Array.isArray(question.correctAnswer)) {
    if (!Array.isArray(answer)) return false
    if (answer.length !== question.correctAnswer.length) return false
    return answer.every((a, i) => a === question.correctAnswer[i])
  } else {
    return answer === question.correctAnswer
  }
}

export { noteToMidi, midiToNote, shuffleArray, generateRandomNotes }
