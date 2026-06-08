import type { VelocityLevel } from '@/utils/audio'
import { VELOCITY_OPTIONS } from './types'
import styles from './VirtualDrums.module.css'

interface DrumControlsProps {
  velocity: VelocityLevel
  showKeyLabels: boolean
  onVelocityChange: (velocity: VelocityLevel) => void
  onToggleKeyLabels: () => void
}

const DrumControls = ({ velocity, showKeyLabels, onVelocityChange, onToggleKeyLabels }: DrumControlsProps) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.controlGroup}>
        <h3 className={styles.controlTitle}>🎚️ 力度</h3>
        <div className={styles.velocityButtons}>
          {VELOCITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.velocityButton} ${velocity === option.value ? styles.activeVelocity : ''}`}
              onClick={() => onVelocityChange(option.value)}
            >
              <span className={styles.velocityLabel}>{option.label}</span>
              <span className={styles.velocityDesc}>{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <h3 className={styles.controlTitle}>⌨️ 按键提示</h3>
        <button
          className={`${styles.toggleButton} ${showKeyLabels ? styles.toggleActive : ''}`}
          onClick={onToggleKeyLabels}
        >
          {showKeyLabels ? '显示中' : '已隐藏'}
        </button>
      </div>
    </div>
  )
}

export default DrumControls
