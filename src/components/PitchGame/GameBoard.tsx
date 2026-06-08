import { useState, useCallback, useRef, useEffect } from 'react'
import { audioEngine } from '@/utils/audio'
import { type Question } from './types'
import { isCorrectAnswer } from './utils'
import HelpTip from '@/components/HelpTip'
import styles from './PitchGame.module.css'

interface GameBoardProps {
  questions: Question[]
  onComplete: (score: number, correctCount: number) => void
}

const GameBoard = ({ questions, onComplete }: GameBoardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sortAnswers, setSortAnswers] = useState<string[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const scoreRef = useRef(score)
  const currentIndexRef = useRef(currentIndex)
  const sortAnswersRef = useRef(sortAnswers)
  const showFeedbackRef = useRef(showFeedback)
  const isPlayingRef = useRef(isPlaying)

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  useEffect(() => {
    sortAnswersRef.current = sortAnswers
  }, [sortAnswers])

  useEffect(() => {
    showFeedbackRef.current = showFeedback
  }, [showFeedback])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const playQuestion = useCallback(() => {
    if (isPlayingRef.current) return
    setIsPlaying(true)

    try {
      const now = audioEngine.getCurrentTime()
      const noteDuration = 0.6
      const gap = 0.2

      currentQuestion.notes.forEach((note, index) => {
        audioEngine.playNote(note, 'piano', noteDuration, 'mf', now + index * (noteDuration + gap))
      })

      const totalDuration = currentQuestion.notes.length * (noteDuration + gap) * 1000
      setTimeout(() => setIsPlaying(false), totalDuration)
    } catch (error) {
      console.error('Failed to play notes:', error)
      setIsPlaying(false)
    }
  }, [currentQuestion])

  const checkAnswer = useCallback(
    (answer: string | string[]) => {
      const correct = isCorrectAnswer(currentQuestion, answer)
      setSelectedAnswer(answer)
      setIsCorrect(correct)
      setShowFeedback(true)

      if (correct) {
        setScore((prev) => prev + 10)
      }

      setTimeout(() => {
        const currentIdx = currentIndexRef.current
        if (currentIdx < totalQuestions - 1) {
          setCurrentIndex((prev) => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
          setSortAnswers([])
          setIsCorrect(false)
        } else {
          const finalScore = correct ? scoreRef.current + 10 : scoreRef.current
          const correctCount = correct
            ? questions.filter((_, i) => i < currentIdx).length + 1
            : questions.filter((_, i) => i < currentIdx).length
          onComplete(finalScore, correctCount)
        }
      }, 1500)
    },
    [currentQuestion, totalQuestions, questions, onComplete]
  )

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showFeedbackRef.current) return

      if (currentQuestion.type === 'sort') {
        const currentSortAnswers = sortAnswersRef.current
        if (currentSortAnswers.includes(answer)) {
          setSortAnswers(currentSortAnswers.filter((a) => a !== answer))
        } else {
          const newAnswers = [...currentSortAnswers, answer]
          setSortAnswers(newAnswers)

          if (newAnswers.length === currentQuestion.options.length) {
            checkAnswer(newAnswers)
          }
        }
      } else {
        checkAnswer(answer)
      }
    },
    [currentQuestion, checkAnswer]
  )

  const getOptionClass = (option: string) => {
    if (!showFeedback) {
      if (currentQuestion.type === 'sort' && sortAnswers.includes(option)) {
        return `${styles.option} ${styles.optionSelected}`
      }
      return styles.option
    }

    if (currentQuestion.type === 'sort') {
      const correctAnswer = currentQuestion.correctAnswer as string[]
      const isOptionCorrect = correctAnswer.includes(option)
      if (isOptionCorrect) {
        return `${styles.option} ${styles.optionCorrect}`
      }
      return styles.option
    }

    if (option === currentQuestion.correctAnswer) {
      return `${styles.option} ${styles.optionCorrect}`
    }
    if (option === selectedAnswer && !isCorrect) {
      return `${styles.option} ${styles.optionWrong} ${styles.shake}`
    }
    return styles.option
  }

  const getSortOrderLabel = (option: string) => {
    if (currentQuestion.type === 'sort' && sortAnswers.includes(option)) {
      return sortAnswers.indexOf(option) + 1
    }
    return null
  }

  const helpTips = [
    '点击播放按钮听音符',
    '听音后选择你认为正确的答案',
    '排序题需要按顺序点击选项',
    '答对一题得10分，加油哦！',
  ]

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
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <HelpTip title="游戏说明" tips={helpTips} position="bottom" />
      </div>

      <div className={styles.questionArea}>
        <h3 className={styles.questionText}>{currentQuestion.questionText}</h3>

        {currentQuestion.type === 'sort' && sortAnswers.length > 0 && (
          <div className={styles.sortProgress}>
            已选择: {sortAnswers.length} / {currentQuestion.options.length}
          </div>
        )}

        <button
          className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
          onClick={playQuestion}
          disabled={showFeedback}
        >
          <span className={styles.playIcon}>{isPlaying ? '🎵' : '▶️'}</span>
          <span className={styles.playText}>
            {isPlaying ? '播放中...' : '点击播放'}
          </span>
        </button>
      </div>

      <div
        className={`${styles.optionsArea} ${
          currentQuestion.type === 'sort' ? styles.sortOptions : ''
        }`}
      >
        {currentQuestion.options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            className={getOptionClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={showFeedback}
          >
            {getSortOrderLabel(option) && (
              <span className={styles.sortOrderBadge}>{getSortOrderLabel(option)}</span>
            )}
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.wrong}`}>
          <div className={styles.feedbackIcon}>
            {isCorrect ? '🎉' : '😅'}
          </div>
          <div className={styles.feedbackText}>
            {isCorrect ? '太棒了！答对啦！' : '再想想哦～'}
          </div>
          {!isCorrect && currentQuestion.type !== 'sort' && (
            <div className={styles.correctAnswer}>
              正确答案是: <strong>{currentQuestion.correctAnswer}</strong>
            </div>
          )}
          {!isCorrect && currentQuestion.type === 'sort' && (
            <div className={styles.correctAnswer}>
              正确顺序:{' '}
              <strong>{(currentQuestion.correctAnswer as string[]).join(' → ')}</strong>
            </div>
          )}
        </div>
      )}

      {showFeedback && isCorrect && (
        <div className={styles.starsEffect}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={styles.star}
              style={{
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
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
