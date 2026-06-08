import { useState, useEffect, useRef, useCallback } from 'react'
import { audioEngine } from '@/utils/audio'
import BeatVisualizer from './BeatVisualizer'
import HelpTip from '@/components/HelpTip'
import type {
  RhythmPattern,
  BeatNote,
  JudgmentType,
  DifficultyType,
  GameResult,
} from './types'
import {
  JUDGMENT_THRESHOLDS,
  JUDGMENT_SCORES,
  DIFFICULTIES,
} from './types'
import styles from './RhythmGame.module.css'

interface GameBoardProps {
  pattern: RhythmPattern
  difficulty: DifficultyType
  onComplete: (result: GameResult) => void
  onBackToSelect: () => void
}

const GameBoard = ({ pattern, difficulty, onComplete, onBackToSelect }: GameBoardProps) => {
  const [gamePhase, setGamePhase] = useState<'demo' | 'countdown' | 'playing' | 'waiting'>('demo')
  const [countdown, setCountdown] = useState(3)
  const [currentTime, setCurrentTime] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [judgments, setJudgments] = useState<{ index: number; type: JudgmentType }[]>([])
  const [notes, setNotes] = useState<BeatNote[]>([])
  const [isButtonPressed, setIsButtonPressed] = useState(false)

  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const notesRef = useRef<BeatNote[]>([])
  const nextNoteIndexRef = useRef(0)
  const gamePhaseRef = useRef(gamePhase)
  const countIntervalRef = useRef<number | null>(null)
  const scoreRef = useRef(0)
  const comboRef = useRef(0)

  const startCountdownRef = useRef<() => void>(() => {})
  const startPlayingRef = useRef<() => void>(() => {})
  const finishGameRef = useRef<() => void>(() => {})
  const startDemoRef = useRef<() => void>(() => {})

  const diffConfig = DIFFICULTIES.find((d) => d.type === difficulty)
  const totalDuration = pattern.measures * pattern.beatsPerMeasure * (60 / pattern.bpm)
  const totalBeats = pattern.measures * pattern.beatsPerMeasure

  const currentBeat = Math.max(
    0,
    Math.min(
      totalBeats,
      Math.floor(currentTime / (60 / pattern.bpm)) + 1
    )
  )

  useEffect(() => {
    gamePhaseRef.current = gamePhase
  }, [gamePhase])

  useEffect(() => {
    setNotes(pattern.notes.map((n) => ({ ...n })))
    notesRef.current = pattern.notes.map((n) => ({ ...n }))
  }, [pattern])

  const playPattern = useCallback(() => {
    try {
      const now = audioEngine.getCurrentTime()
      const startDelay = 0.5

      pattern.notes.forEach((note) => {
        audioEngine.playDrum(note.drum, 'mf', now + startDelay + note.time)
      })

      return startDelay
    } catch (error) {
      console.error('Failed to play pattern:', error)
      return 0
    }
  }, [pattern])

  const finishGame = useCallback(() => {
    setGamePhase('waiting')

    const finalNotes = notesRef.current
    let perfectCount = 0
    let goodCount = 0
    let missCount = 0
    let totalScore = 0

    finalNotes.forEach((note) => {
      if (note.judgment === 'perfect') {
        perfectCount++
        totalScore += JUDGMENT_SCORES.perfect
      } else if (note.judgment === 'good') {
        goodCount++
        totalScore += JUDGMENT_SCORES.good
      } else {
        note.judgment = 'miss'
        missCount++
      }
    })

    if (totalScore === 0 && scoreRef.current > 0) {
      totalScore = scoreRef.current
    }

    const maxPossibleScore = finalNotes.length * JUDGMENT_SCORES.perfect
    const accuracy = Math.max(0, Math.min(100, Math.round((totalScore / maxPossibleScore) * 100)))

    const result: GameResult = {
      score: totalScore,
      perfectCount,
      goodCount,
      missCount,
      totalNotes: finalNotes.length,
      accuracy,
    }

    setTimeout(() => {
      onComplete(result)
    }, 500)
  }, [onComplete])

  useEffect(() => {
    finishGameRef.current = finishGame
  }, [finishGame])

  const startPlaying = useCallback(() => {
    const prepTime = 2

    notesRef.current = pattern.notes.map((n) => ({ ...n }))
    nextNoteIndexRef.current = 0
    scoreRef.current = 0
    comboRef.current = 0
    setNotes(pattern.notes.map((n) => ({ ...n })))
    setCurrentTime(-prepTime)
    setScore(0)
    setCombo(0)
    setJudgments([])
    setGamePhase('playing')
    gamePhaseRef.current = 'playing'

    const audioStartTime = audioEngine.getCurrentTime() + prepTime
    startTimeRef.current = audioStartTime
    console.log('🎮 startPlaying:', {
      audioStartTime,
      prepTime,
      firstNoteTime: pattern.notes[0]?.time,
      totalNotes: pattern.notes.length,
      totalDuration,
    })

    const animate = () => {
      if (gamePhaseRef.current !== 'playing') return

      const now = audioEngine.getCurrentTime()
      const elapsed = now - startTimeRef.current

      if (elapsed >= totalDuration + 1) {
        setCurrentTime(totalDuration)
        finishGameRef.current()
        return
      }

      setCurrentTime(Math.min(totalDuration, elapsed))

      const currentNotes = notesRef.current
      let notesChanged = false
      let hadMiss = false

      while (
        nextNoteIndexRef.current < currentNotes.length &&
        currentNotes[nextNoteIndexRef.current].time < elapsed - JUDGMENT_THRESHOLDS.good
      ) {
        const note = currentNotes[nextNoteIndexRef.current]
        if (!note.hit) {
          note.hit = false
          note.judgment = 'miss'
          setJudgments((prev) => [...prev, { index: nextNoteIndexRef.current, type: 'miss' }])
          notesChanged = true
          hadMiss = true
        }
        nextNoteIndexRef.current++
      }

      if (notesChanged) {
        setNotes([...currentNotes])
      }
      if (hadMiss) {
        comboRef.current = 0
        setCombo(0)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [pattern, totalDuration])

  useEffect(() => {
    startPlayingRef.current = startPlaying
  }, [startPlaying])

  const startCountdown = useCallback(() => {
    setGamePhase('countdown')
    gamePhaseRef.current = 'countdown'
    setCountdown(3)

    let count = 3
    countIntervalRef.current = window.setInterval(() => {
      count--
      setCountdown(count)

      if (count <= 0) {
        if (countIntervalRef.current) {
          clearInterval(countIntervalRef.current)
          countIntervalRef.current = null
        }
        startPlayingRef.current()
      }
    }, 1000)
  }, [])

  useEffect(() => {
    startCountdownRef.current = startCountdown
  }, [startCountdown])

  const startDemo = useCallback(() => {
    nextNoteIndexRef.current = 0
    setCurrentTime(0)
    setGamePhase('demo')
    gamePhaseRef.current = 'demo'

    const startDelay = playPattern()
    const audioStartTime = audioEngine.getCurrentTime() + startDelay
    startTimeRef.current = audioStartTime

    const animate = () => {
      if (gamePhaseRef.current !== 'demo') return

      const now = audioEngine.getCurrentTime()
      const elapsed = now - audioStartTime

      if (elapsed >= totalDuration + 0.5) {
        setCurrentTime(totalDuration)
        startCountdownRef.current()
        return
      }

      setCurrentTime(Math.max(0, Math.min(totalDuration, elapsed)))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [playPattern, totalDuration])

  useEffect(() => {
    startDemoRef.current = startDemo
  }, [startDemo])

  const handleTap = useCallback(() => {
    if (gamePhaseRef.current !== 'playing') return

    setIsButtonPressed(true)
    setTimeout(() => setIsButtonPressed(false), 100)

    const now = audioEngine.getCurrentTime()
    const elapsed = now - startTimeRef.current

    try {
      audioEngine.playDrum('kick', 'f')
    } catch (e) {
      console.error('Play tap sound error:', e)
    }

    const currentNotes = notesRef.current
    const startIndex = nextNoteIndexRef.current

    console.log('👆 handleTap:', {
      now,
      startTime: startTimeRef.current,
      elapsed,
      startIndex,
      currentNoteTime: currentNotes[startIndex]?.time,
      currentNoteDrum: currentNotes[startIndex]?.drum,
      notesLength: currentNotes.length,
    })

    if (startIndex >= currentNotes.length) return

    const firstNote = currentNotes[startIndex]
    if (firstNote.hit) return

    const diff = elapsed - firstNote.time
    const absDiff = Math.abs(diff)

    console.log('   diff:', diff, 'absDiff:', absDiff, 'goodThreshold:', JUDGMENT_THRESHOLDS.good)

    if (absDiff <= JUDGMENT_THRESHOLDS.good) {
      let endIndex = startIndex
      while (
        endIndex + 1 < currentNotes.length &&
        Math.abs(currentNotes[endIndex + 1].time - firstNote.time) < 0.03
      ) {
        endIndex++
      }

      let judgment: JudgmentType
      if (absDiff <= JUDGMENT_THRESHOLDS.perfect) {
        judgment = 'perfect'
      } else {
        judgment = 'good'
      }

      let hitCount = 0
      for (let i = startIndex; i <= endIndex; i++) {
        const note = currentNotes[i]
        note.hit = true
        note.judgment = judgment
        note.userTime = elapsed
        hitCount++
      }

      setNotes([...currentNotes])
      setJudgments((prev) => [...prev, { index: startIndex, type: judgment }])

      const basePoints = judgment === 'perfect' ? JUDGMENT_SCORES.perfect : JUDGMENT_SCORES.good
      const points = basePoints * hitCount
      scoreRef.current += points
      setScore(scoreRef.current)

      comboRef.current += 1
      setCombo(comboRef.current)

      nextNoteIndexRef.current = endIndex + 1
    } else if (diff > JUDGMENT_THRESHOLDS.good) {
      firstNote.hit = false
      firstNote.judgment = 'miss'
      setNotes([...currentNotes])
      setJudgments((prev) => [...prev, { index: startIndex, type: 'miss' }])

      comboRef.current = 0
      setCombo(0)

      nextNoteIndexRef.current = startIndex + 1
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleTap()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTap])

  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioEngine.init()
        console.log('🎵 Audio initialized, state:', audioEngine.getState(), 'currentTime:', audioEngine.getCurrentTime())
        setTimeout(() => startDemoRef.current(), 500)
      } catch (e) {
        console.error('Audio init error:', e)
      }
    }

    ;(window as any).__rhythmDebug = {
      getState: () => ({
        gamePhase: gamePhaseRef.current,
        startTime: startTimeRef.current,
        nextNoteIndex: nextNoteIndexRef.current,
        score: scoreRef.current,
        combo: comboRef.current,
        audioState: audioEngine.getState(),
        audioTime: audioEngine.getCurrentTime(),
        notes: notesRef.current,
      }),
      resumeAudio: () => audioEngine.resume(),
      startDemo: () => startDemoRef.current(),
      startPlaying: () => startPlayingRef.current(),
    }

    initAudio()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current)
      }
    }
  }, [])

  const handleRestart = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (countIntervalRef.current) {
      clearInterval(countIntervalRef.current)
    }
    startDemoRef.current()
  }

  const helpTips = [
    '先听示范，记住节奏',
    '倒计时后开始游戏',
    '点击按钮或按空格键敲鼓',
    '击中音符得分，连击加分！',
  ]

  return (
    <div className={styles.gameBoard}>
      <div className={styles.gameHeader}>
        <button className={styles.backButton} onClick={onBackToSelect}>
          ← 返回
        </button>
        <div className={styles.scoreBadge}>
          <span className={styles.scoreIcon}>⭐</span>
          <span className={styles.scoreText}>{score}分</span>
        </div>
        <div className={`${styles.comboBadge} ${combo > 1 ? '' : styles.comboBadgeHidden}`}>
          <span className={styles.comboText}>{combo} 连击!</span>
        </div>

        <HelpTip title="游戏说明" tips={helpTips} position="bottom" />
      </div>

      <div className={styles.patternInfo}>
        <span className={styles.patternName}>{pattern.name}</span>
        <span className={styles.diffTag} style={{ background: diffConfig?.color }}>
          {diffConfig?.icon} {diffConfig?.label}
        </span>
      </div>

      <div className={styles.visualizerWrapper}>
        <BeatVisualizer
          notes={notes}
          currentTime={currentTime}
          totalDuration={totalDuration}
          isPlaying={gamePhase === 'playing'}
          currentBeat={currentBeat}
          totalBeats={totalBeats}
          mode={gamePhase === 'demo' ? 'demo' : 'playing'}
          judgments={judgments}
        />
      </div>

      {gamePhase === 'countdown' && (
        <div className={styles.countdownOverlay}>
          <div className={styles.countdownNumber}>{countdown}</div>
          <div className={styles.countdownText}>准备...</div>
        </div>
      )}

      <div className={styles.tapArea}>
        <button
          className={`${styles.tapButton} ${isButtonPressed ? styles.tapButtonPressed : ''} ${gamePhase === 'playing' ? styles.tapButtonActive : ''}`}
          onMouseDown={handleTap}
          onTouchStart={(e) => {
            e.preventDefault()
            handleTap()
          }}
          disabled={gamePhase !== 'playing'}
          style={{
            '--btn-color': diffConfig?.color,
            '--btn-gradient-from': diffConfig?.gradientFrom,
            '--btn-gradient-to': diffConfig?.gradientTo,
          } as React.CSSProperties}
        >
          <span className={styles.tapIcon}>🥁</span>
          <span className={styles.tapText}>
            {gamePhase === 'demo' ? '听示范...' : gamePhase === 'countdown' ? '准备...' : '点击敲鼓!'}
          </span>
          <span className={styles.tapHint}>或按空格键</span>
        </button>
      </div>

      <div className={styles.gameActions}>
        <button className={styles.restartButton} onClick={handleRestart}>
          🔄 重新开始
        </button>
      </div>
    </div>
  )
}

export default GameBoard
