import { useCallback } from 'react'
import type { DynamicsLevel } from './types'
import { DYNAMICS_CONFIG, DYNAMICS_LEVELS } from './types'
import styles from './Dynamics.module.css'

interface DynamicsControlProps {
  currentLevel: DynamicsLevel
  onLevelChange: (level: DynamicsLevel) => void
  onPlay: () => void
}

const DynamicsControl = ({ currentLevel, onLevelChange, onPlay }: DynamicsControlProps) => {
  const handleLevelClick = useCallback((level: DynamicsLevel) => {
    onLevelChange(level)
  }, [onLevelChange])

  return (
    <div className={styles.controlContainer}>
      <div className={styles.buttonGroup}>
        {DYNAMICS_LEVELS.map((level) => {
          const config = DYNAMICS_CONFIG[level]
          const isActive = currentLevel === level
          return (
            <button
              key={level}
              className={`${styles.dynamicsButton} ${isActive ? styles.active : ''}`}
              style={{
                '--button-color': config.color,
                '--button-color-light': config.colorLight,
              } as React.CSSProperties}
              onClick={() => handleLevelClick(level)}
            >
              <span className={styles.buttonIcon}>{config.icon}</span>
              <span className={styles.buttonLabel}>{config.label}</span>
              <span className={styles.buttonName}>{config.name}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>{DYNAMICS_CONFIG[currentLevel].icon}</div>
        <div className={styles.infoContent}>
          <h3 className={styles.infoTitle}>
            {DYNAMICS_CONFIG[currentLevel].label}
            <span className={styles.infoName}> - {DYNAMICS_CONFIG[currentLevel].name}</span>
          </h3>
          <p className={styles.infoDescription}>
            {DYNAMICS_CONFIG[currentLevel].description}
          </p>
        </div>
      </div>

      <button className={styles.playButton} onClick={onPlay}>
        <span className={styles.playIcon}>▶</span>
        播放音符
      </button>
    </div>
  )
}

export default DynamicsControl
