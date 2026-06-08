import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import pageStyles from '@/styles/Page.module.css'
import { GameBoard, ResultScreen, InstrumentGallery } from '@/components/InstrumentGame'
import type { Question, InstrumentType, GameStateType } from '@/components/InstrumentGame'
import { INSTRUMENTS } from '@/components/InstrumentGame'
import gameStyles from '@/components/InstrumentGame/InstrumentGame.module.css'
import styles from './Instrument.module.css'

const TOTAL_QUESTIONS = 10

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateQuestions(): Question[] {
  const instrumentIds: InstrumentType[] = INSTRUMENTS.map((i) => i.id)
  const questions: Question[] = []

  for (let i = 0; i < TOTAL_QUESTIONS; i++) {
    const shuffled = shuffleArray(instrumentIds)
    const correctInstrument = shuffled[0]
    const options = shuffled.slice(0, 4)

    questions.push({
      id: i,
      correctInstrument,
      options: shuffleArray(options),
    })
  }

  return questions
}

const Instrument = () => {
  const [gameState, setGameState] = useState<GameStateType>('start')
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const startGame = useCallback(() => {
    const newQuestions = generateQuestions()
    setQuestions(newQuestions)
    setScore(0)
    setCorrectCount(0)
    setGameState('playing')
  }, [])

  const handleComplete = useCallback((finalScore: number, finalCorrectCount: number) => {
    setScore(finalScore)
    setCorrectCount(finalCorrectCount)
    setGameState('result')
  }, [])

  const handleRestart = useCallback(() => {
    startGame()
  }, [startGame])

  const handleGallery = useCallback(() => {
    setGameState('gallery')
  }, [])

  const handleBackFromGallery = useCallback(() => {
    setGameState('start')
  }, [])

  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className={gameStyles.startScreen}>
            <div className={gameStyles.startHeader}>
              <div className={gameStyles.startIcon}>🎺</div>
              <h1 className={gameStyles.startTitle}>乐器猜猜看</h1>
              <p className={gameStyles.startDesc}>
                听一听声音，猜猜是什么乐器！<br />
                认识6种神奇的乐器，听听它们独特的声音吧！
              </p>
            </div>
            <div className={gameStyles.startActions}>
              <button
                className={gameStyles.startButton}
                onClick={startGame}
                style={
                  {
                    '--btn-color': '#7c3aed',
                    '--btn-gradient-from': '#a78bfa',
                    '--btn-gradient-to': '#ddd6fe',
                  } as React.CSSProperties
                }
              >
                🎮 开始游戏
              </button>
              <button
                className={`${gameStyles.startButton} ${gameStyles.secondary}`}
                onClick={handleGallery}
              >
                📚 乐器图鉴
              </button>
            </div>
          </div>
        )

      case 'playing':
        return <GameBoard questions={questions} onComplete={handleComplete} />

      case 'result':
        return (
          <ResultScreen
            score={score}
            correctCount={correctCount}
            totalQuestions={TOTAL_QUESTIONS}
            onRestart={handleRestart}
            onGallery={handleGallery}
          />
        )

      case 'gallery':
        return <InstrumentGallery onBack={handleBackFromGallery} />

      default:
        return null
    }
  }

  return (
    <div className={pageStyles.page}>
      <Navbar title="乐器猜猜看" icon="🎺" />
      <main className={styles.gameContainer}>
        {renderContent()}
      </main>
    </div>
  )
}

export default Instrument
