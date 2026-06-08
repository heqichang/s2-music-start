import type { BeatNote, JudgmentType, DrumSoundType } from './types'
import styles from './RhythmGame.module.css'

interface BeatVisualizerProps {
  notes: BeatNote[]
  currentTime: number
  totalDuration: number
  isPlaying: boolean
  currentBeat: number
  totalBeats: number
  mode: 'demo' | 'playing'
  judgments: { index: number; type: JudgmentType }[]
}

const getDrumColor = (drum: DrumSoundType): string => {
  switch (drum) {
    case 'kick':
      return '#ec4899'
    case 'snare':
      return '#f59e0b'
    case 'hihat':
      return '#3b82f6'
    default:
      return '#6b7280'
  }
}

const getDrumIcon = (drum: DrumSoundType): string => {
  switch (drum) {
    case 'kick':
      return '🥁'
    case 'snare':
      return '🪘'
    case 'hihat':
      return '🎵'
    default:
      return '🎶'
  }
}

const BeatVisualizer = ({
  notes,
  currentTime,
  totalDuration,
  currentBeat,
  totalBeats,
  mode,
  judgments,
}: BeatVisualizerProps) => {
  const visibleDuration = 3
  const judgmentLineY = 80

  const visibleNotes = notes.map((note, index) => {
    const timeOffset = note.time - currentTime
    const y = judgmentLineY - (timeOffset / visibleDuration) * 100
    return {
      ...note,
      index,
      y,
      isVisible: y >= -10 && y <= 110,
      hasPassed: timeOffset < 0,
    }
  })

  const latestJudgment = judgments.length > 0 ? judgments[judgments.length - 1] : null

  return (
    <div className={styles.visualizer}>
      <div className={styles.beatInfo}>
        <span className={styles.beatLabel}>第 {currentBeat} / {totalBeats} 拍</span>
        <span className={styles.modeBadge}>
          {mode === 'demo' ? '🎧 示范' : '🎮 游戏'}
        </span>
      </div>

      <div className={styles.track}>
        <div className={styles.judgmentLine} style={{ top: `${judgmentLineY}%` }}>
          <div className={styles.judgmentLineGlow} />
        </div>

        {visibleNotes.map((note) =>
          note.isVisible ? (
            <div
              key={`${note.index}-${note.time}-${note.drum}`}
              className={`${styles.beatBall} ${note.hasPassed ? styles.beatBallPassed : ''} ${note.judgment ? styles[`beatBall${note.judgment}`] : ''}`}
              style={{
                top: `${note.y}%`,
                '--drum-color': getDrumColor(note.drum),
              } as React.CSSProperties}
            >
              <span className={styles.beatBallIcon}>{getDrumIcon(note.drum)}</span>
            </div>
          ) : null
        )}

        {latestJudgment && (
          <div
            key={`judgment-${judgments.length}`}
            className={`${styles.judgmentText} ${styles[`judgment${latestJudgment.type}`]}`}
          >
            {latestJudgment.type === 'perfect' && '完美!'}
            {latestJudgment.type === 'good' && '不错!'}
            {latestJudgment.type === 'miss' && '错过!'}
          </div>
        )}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(0, Math.min(100, (currentTime / totalDuration) * 100))}%` }}
        />
      </div>
    </div>
  )
}

export default BeatVisualizer
