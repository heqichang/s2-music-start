import { useState, useCallback, useEffect } from 'react'
import { audioEngine } from '@/utils/audio'
import type { InstrumentType as AudioInstrumentType } from '@/utils/audio'
import type { Question, InstrumentType } from './types'
import HelpTip from '@/components/HelpTip'
import { INSTRUMENT_MAP, MELODY_NOTES, DRUM_PATTERN } from './instruments'
import styles from './InstrumentGame.module.css'

interface GameBoardProps {
  questions: Question[]
  onComplete: (score: number, correctCount: number) => void
}

const GameBoard = ({ questions, onComplete }: GameBoardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<InstrumentType | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const correctInstrument = INSTRUMENT_MAP[currentQuestion.correctInstrument]

  useEffect(() => {
    audioEngine.init()
  }, [])

  const playInstrumentSound = useCallback(
    (instrumentId: InstrumentType) => {
      if (isPlaying) return
      setIsPlaying(true)

      try {
        const now = audioEngine.getCurrentTime()

        if (instrumentId === 'drum') {
          const beatDuration = 0.3
          DRUM_PATTERN.forEach((item) => {
            const startTime = now + item.beat * beatDuration
            audioEngine.playDrum(item.drum, 'mf', startTime)
          })
          const totalDuration = DRUM_PATTERN.length * beatDuration * 1000
          setTimeout(() => setIsPlaying(false), totalDuration)
        } else {
          const audioInstrument = instrumentId as AudioInstrumentType
          const noteDuration = 0.5
          const gap = 0.15
          const notes = MELODY_NOTES[instrumentId]
          notes.forEach((note, index) => {
            audioEngine.playNote(
              note,
              audioInstrument,
              noteDuration,
              'mf',
              now + index * (noteDuration + gap)
            )
          })
          const totalDuration = notes.length * (noteDuration + gap) * 1000
          setTimeout(() => setIsPlaying(false), totalDuration)
        }
      } catch (error) {
        console.error('Failed to play instrument:', error)
        setIsPlaying(false)
      }
    },
    [isPlaying]
  )

  const handleAnswer = useCallback(
    (answer: InstrumentType) => {
      if (showFeedback) return

      const correct = answer === currentQuestion.correctInstrument
      setSelectedAnswer(answer)
      setIsCorrect(correct)
      setShowFeedback(true)

      if (correct) {
        setScore((prev) => prev + 10)
      }

      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setCurrentIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
          setIsCorrect(false)
        } else {
          const finalScore = correct ? score + 10 : score
          const correctCount = correct
            ? questions.filter((_, i) => i < currentIndex).length + 1
            : questions.filter((_, i) => i < currentIndex).length
          onComplete(finalScore, correctCount)
        }
      }, 1500)
    },
    [currentQuestion, currentIndex, totalQuestions, score, questions, showFeedback, onComplete]
  )

  const helpTips = [
    '点击播放按钮听乐器声音',
    '选择你认为正确的乐器',
    '答对一题得10分',
    '可以在图鉴中学习更多乐器知识',
  ]

  const getOptionClass = (optionId: InstrumentType) => {
    const baseClass = styles.option

    if (!showFeedback) {
      return baseClass
    }

    if (optionId === currentQuestion.correctInstrument) {
      return `${baseClass} ${styles.optionCorrect}`
    }
    if (optionId === selectedAnswer && !isCorrect) {
      return `${baseClass} ${styles.optionWrong} ${styles.shake}`
    }
    return baseClass
  }

  return (
    <div className={styles.gameBoard}>
      <div className={styles.gameHeader}>
        <div className={styles.scoreBadge}>
          <span className={styles.scoreIcon}>⭐</span>
          <span className={styles.scoreText}>{score}分</span>
        </div>

        <div className={styles.progressWrapper}>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>
              第 {currentIndex + 1} / {totalQuestions} 题
            </span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <HelpTip title="游戏说明" tips={helpTips} position="bottom" />
      </div>

      <div className={styles.questionArea}>
        <h3 className={styles.questionText}>听一听，这是什么乐器？</h3>

        <button
          className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
          style={
            {
              '--btn-color': correctInstrument.color,
              '--btn-gradient-from': correctInstrument.gradientFrom,
              '--btn-gradient-to': correctInstrument.gradientTo,
            } as React.CSSProperties
          }
          onClick={() => playInstrumentSound(currentQuestion.correctInstrument)}
          disabled={showFeedback}
        >
          <span className={styles.playIcon}>{isPlaying ? '🎵' : '▶️'}</span>
          <span className={styles.playText}>{isPlaying ? '播放中...' : '点击播放'}</span>
        </button>
      </div>

      <div className={styles.optionsArea}>
        {currentQuestion.options.map((optionId) => {
          const option = INSTRUMENT_MAP[optionId]
          return (
            <button
              key={optionId}
              className={getOptionClass(optionId)}
              onClick={() => handleAnswer(optionId)}
              disabled={showFeedback}
              style={
                {
                  '--inst-color': option.color,
                  '--inst-gradient-from': option.gradientFrom,
                  '--inst-gradient-to': option.gradientTo,
                } as React.CSSProperties
              }
            >
              <span className={styles.optionEmoji}>{option.emoji}</span>
              <span className={styles.optionName}>{option.name}</span>
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.wrong}`}>
          <div className={styles.feedbackIcon}>{isCorrect ? '🎉' : '😅'}</div>
          <div className={styles.feedbackText}>
            {isCorrect ? '太棒了！答对啦！' : '再想想哦～'}
          </div>
          {!isCorrect && (
            <div className={styles.correctAnswer}>
              正确答案是: <strong>{correctInstrument.name} {correctInstrument.emoji}</strong>
            </div>
          )}
        </div>
      )}

      {showFeedback && isCorrect && (
        <div className={styles.starsEffect}>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className={styles.star}
              style={{
                left: `${15 + Math.random() * 70}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            >
              ⭐
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default GameBoard
