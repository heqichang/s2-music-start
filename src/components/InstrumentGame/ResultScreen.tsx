import styles from './InstrumentGame.module.css'

interface ResultScreenProps {
  score: number
  correctCount: number
  totalQuestions: number
  onRestart: () => void
  onGallery: () => void
}

const ResultScreen = ({
  score,
  correctCount,
  totalQuestions,
  onRestart,
  onGallery,
}: ResultScreenProps) => {
  const accuracy = Math.round((correctCount / totalQuestions) * 100)

  const getStarCount = () => {
    if (accuracy >= 90) return 3
    if (accuracy >= 70) return 2
    if (accuracy >= 50) return 1
    return 0
  }

  const getEncouragement = () => {
    if (accuracy >= 90) {
      return {
        title: '太厉害了！',
        message: '你是小小音乐家！每种乐器的声音都听得清清楚楚～🎵',
      }
    }
    if (accuracy >= 70) {
      return {
        title: '做得很好！',
        message: '继续加油，你离乐器小专家越来越近了！💪',
      }
    }
    if (accuracy >= 50) {
      return {
        title: '还不错哦！',
        message: '多去乐器图鉴听听，你的耳朵会越来越灵敏的！🌟',
      }
    }
    return {
      title: '别灰心！',
      message: '每个人都是从不会到会的，多听几遍就记住啦！🎯',
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
            <div className={styles.statValue} style={{ color: '#f59e0b' }}>
              {score}
            </div>
            <div className={styles.statLabel}>得分</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: '#7c3aed' }}>
              {accuracy}%
            </div>
            <div className={styles.statLabel}>正确率</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: '#10b981' }}>
              {correctCount}/{totalQuestions}
            </div>
            <div className={styles.statLabel}>答对题数</div>
          </div>
        </div>

        <div className={styles.resultActions}>
          <button
            className={styles.primaryButton}
            onClick={onRestart}
            style={
              {
                '--btn-color': '#7c3aed',
                '--btn-gradient-from': '#a78bfa',
                '--btn-gradient-to': '#ddd6fe',
              } as React.CSSProperties
            }
          >
            🔄 再玩一次
          </button>
          <button className={styles.secondaryButton} onClick={onGallery}>
            📚 乐器图鉴
          </button>
        </div>
      </div>

      {stars >= 2 && (
        <div className={styles.confetti}>
          {[...Array(25)].map((_, i) => (
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
