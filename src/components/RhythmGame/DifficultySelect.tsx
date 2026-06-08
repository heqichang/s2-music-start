import { DIFFICULTIES, type DifficultyType } from './types'
import styles from './RhythmGame.module.css'

interface DifficultySelectProps {
  onSelect: (difficulty: DifficultyType) => void
}

const DifficultySelect = ({ onSelect }: DifficultySelectProps) => {
  return (
    <div className={styles.selectScreen}>
      <div className={styles.selectHeader}>
        <div className={styles.selectIcon}>🥁</div>
        <h2 className={styles.selectTitle}>选择难度</h2>
        <p className={styles.selectDesc}>跟着节拍一起敲，准备好了吗？</p>
      </div>

      <div className={styles.difficultyGrid}>
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.type}
            className={styles.difficultyCard}
            style={{
              '--diff-color': diff.color,
              '--diff-gradient-from': diff.gradientFrom,
              '--diff-gradient-to': diff.gradientTo,
            } as React.CSSProperties}
            onClick={() => onSelect(diff.type)}
          >
            <div className={styles.diffIconWrapper}>
              <span className={styles.diffIcon}>{diff.icon}</span>
            </div>
            <h3 className={styles.diffLabel}>{diff.label}</h3>
            <p className={styles.diffDesc}>{diff.description}</p>
            <div className={styles.diffBpm}>BPM: {diff.bpm}</div>
            <div className={styles.diffStars}>
              {diff.type === 'easy' && '⭐'}
              {diff.type === 'medium' && '⭐⭐'}
              {diff.type === 'hard' && '⭐⭐⭐'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DifficultySelect
