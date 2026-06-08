import { type DifficultyType, DIFFICULTIES, type GameResult } from './types'
import styles from './RhythmGame.module.css'

interface ResultScreenProps {
  result: GameResult
  difficulty: DifficultyType
  onRestart: () => void
  onBackToSelect: () => void
}

const ResultScreen = ({
  result,
  difficulty,
  onRestart,
  onBackToSelect,
}: ResultScreenProps) => {
  const diffConfig = DIFFICULTIES.find((d) => d.type === difficulty)

  const getStarCount = () => {
    if (result.accuracy >= 90) return 3
    if (result.accuracy >= 70) return 2
    if (result.accuracy >= 50) return 1
    return 0
  }

  const getEncouragement = () => {
    if (result.accuracy >= 90) {
      return {
        title: '太厉害了！',
        message: '你的节奏感太棒了，简直是节奏小天才！🥁',
      }
    }
    if (result.accuracy >= 70) {
      return {
        title: '做得很好！',
        message: '继续加油，你离完美越来越近了！💪',
      }
    }
    if (result.accuracy >= 50) {
      return {
        title: '还不错哦！',
        message: '多练习几次，你的节奏感会越来越好的！🌟',
      }
    }
    return {
      title: '别灰心！',
      message: '每个人都是从不会到会的，再来一次吧！🎯',
    }
  }

  const stars = getStarCount()
  const encouragement = getEncouragement()

  return (
    <div className={styles.resultScreen}>
      <div className={styles.resultCard}>
        <div className={styles.resultHeader}>
          <div className={styles.trophyIcon}>
            {stars === 3 ? '🏆' : stars === 2 ? '🥈' : stars === 1 ? '🥉' : '🎖️'}
          </div>
          <h2 className={styles.resultTitle}>{encouragement.title}</h2>
          <p className={styles.resultMessage}>{encouragement.message}</p>
        </div>

        <div className={styles.starsDisplay}>
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`${styles.starIcon} ${star <= stars ? styles.starFilled : styles.starEmpty}`}
              style={{ animationDelay: `${star * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className={styles.scoreStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: diffConfig?.color }}>
              {result.score}
            </div>
            <div className={styles.statLabel}>得分</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: '#7c3aed' }}>
              {result.accuracy}%
            </div>
            <div className={styles.statLabel}>正确率</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: '#10b981' }}>
              {result.totalNotes}
            </div>
            <div className={styles.statLabel}>总音符</div>
          </div>
        </div>

        <div className={styles.judgmentStats}>
          <div className={styles.judgmentItem}>
            <span className={styles.judgmentDotPerfect} />
            <span className={styles.judgmentLabel}>完美</span>
            <span className={styles.judgmentCount}>{result.perfectCount}</span>
          </div>
          <div className={styles.judgmentItem}>
            <span className={styles.judgmentDotGood} />
            <span className={styles.judgmentLabel}>不错</span>
            <span className={styles.judgmentCount}>{result.goodCount}</span>
          </div>
          <div className={styles.judgmentItem}>
            <span className={styles.judgmentDotMiss} />
            <span className={styles.judgmentLabel}>错过</span>
            <span className={styles.judgmentCount}>{result.missCount}</span>
          </div>
        </div>

        <div className={styles.difficultyBadge}>
          <span>{diffConfig?.icon}</span>
          <span>{diffConfig?.label}模式</span>
        </div>

        <div className={styles.resultActions}>
          <button
            className={styles.primaryButton}
            onClick={onRestart}
            style={{
              '--btn-color': diffConfig?.color,
              '--btn-gradient-from': diffConfig?.gradientFrom,
              '--btn-gradient-to': diffConfig?.gradientTo,
            } as React.CSSProperties}
          >
            🔄 再玩一次
          </button>
          <button className={styles.secondaryButton} onClick={onBackToSelect}>
            📋 选择难度
          </button>
        </div>
      </div>

      {stars >= 2 && (
        <div className={styles.confetti}>
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: ['#ec4899', '#f59e0b', '#10b981', '#7c3aed', '#3b82f6'][i % 5],
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ResultScreen
