import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import {
  DifficultySelect,
  GameBoard,
  ResultScreen,
  getRandomPattern,
  type DifficultyType,
  type RhythmPattern,
  type GameResult,
} from '@/components/RhythmGame'
import pageStyles from '@/styles/Page.module.css'
import styles from './Rhythm.module.css'

type GameState = 'select' | 'playing' | 'result'

const Rhythm = () => {
  const [gameState, setGameState] = useState<GameState>('select')
  const [difficulty, setDifficulty] = useState<DifficultyType>('easy')
  const [pattern, setPattern] = useState<RhythmPattern | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)

  const handleDifficultySelect = useCallback((diff: DifficultyType) => {
    setDifficulty(diff)
    const newPattern = getRandomPattern(diff)
    setPattern(newPattern)
    setGameState('playing')
  }, [])

  const handleGameComplete = useCallback((gameResult: GameResult) => {
    setResult(gameResult)
    setGameState('result')
  }, [])

  const handleRestart = useCallback(() => {
    const newPattern = getRandomPattern(difficulty)
    setPattern(newPattern)
    setResult(null)
    setGameState('playing')
  }, [difficulty])

  const handleBackToSelect = useCallback(() => {
    setGameState('select')
    setPattern(null)
    setResult(null)
  }, [])

  return (
    <div className={pageStyles.page}>
      <Navbar title="节奏模仿" icon="🥁" />
      <main className={styles.gameContainer}>
        {gameState === 'select' && (
          <DifficultySelect onSelect={handleDifficultySelect} />
        )}
        {gameState === 'playing' && pattern && (
          <GameBoard
            pattern={pattern}
            difficulty={difficulty}
            onComplete={handleGameComplete}
            onBackToSelect={handleBackToSelect}
          />
        )}
        {gameState === 'result' && result && (
          <ResultScreen
            result={result}
            difficulty={difficulty}
            onRestart={handleRestart}
            onBackToSelect={handleBackToSelect}
          />
        )}
      </main>
    </div>
  )
}

export default Rhythm
