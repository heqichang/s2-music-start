import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import {
  DifficultySelect,
  GameBoard,
  ResultScreen,
  generateQuestions,
  type DifficultyType,
  type Question,
} from '@/components/PitchGame'
import pageStyles from '@/styles/Page.module.css'
import styles from './Pitch.module.css'

type GameState = 'select' | 'playing' | 'result'

const Pitch = () => {
  const [gameState, setGameState] = useState<GameState>('select')
  const [difficulty, setDifficulty] = useState<DifficultyType>('easy')
  const [questions, setQuestions] = useState<Question[]>([])
  const [finalScore, setFinalScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const handleDifficultySelect = useCallback((diff: DifficultyType) => {
    setDifficulty(diff)
    const newQuestions = generateQuestions(diff, 10)
    setQuestions(newQuestions)
    setGameState('playing')
  }, [])

  const handleGameComplete = useCallback((score: number, correct: number) => {
    setFinalScore(score)
    setCorrectCount(correct)
    setGameState('result')
  }, [])

  const handleRestart = useCallback(() => {
    const newQuestions = generateQuestions(difficulty, 10)
    setQuestions(newQuestions)
    setFinalScore(0)
    setCorrectCount(0)
    setGameState('playing')
  }, [difficulty])

  const handleBackToSelect = useCallback(() => {
    setGameState('select')
    setQuestions([])
    setFinalScore(0)
    setCorrectCount(0)
  }, [])

  return (
    <div className={pageStyles.page}>
      <Navbar title="高低音辨别" icon="🎵" />
      <main className={styles.gameContainer}>
        {gameState === 'select' && (
          <DifficultySelect onSelect={handleDifficultySelect} />
        )}
        {gameState === 'playing' && questions.length > 0 && (
          <GameBoard
            questions={questions}
            onComplete={handleGameComplete}
          />
        )}
        {gameState === 'result' && (
          <ResultScreen
            score={finalScore}
            correctCount={correctCount}
            totalQuestions={10}
            difficulty={difficulty}
            onRestart={handleRestart}
            onBackToSelect={handleBackToSelect}
          />
        )}
      </main>
    </div>
  )
}

export default Pitch
