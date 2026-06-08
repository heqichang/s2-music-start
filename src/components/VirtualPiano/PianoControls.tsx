import { INSTRUMENT_OPTIONS, VELOCITY_OPTIONS } from './types'
import type { InstrumentType, VelocityLevel } from '@/utils/audio'
import styles from './VirtualPiano.module.css'

interface PianoControlsProps {
  instrument: InstrumentType
  velocity: VelocityLevel
  showKeyLabels: boolean
  onInstrumentChange: (instrument: InstrumentType) => void
  onVelocityChange: (velocity: VelocityLevel) => void
  onToggleKeyLabels: () => void
}

const PianoControls = ({
  instrument,
  velocity,
  showKeyLabels,
  onInstrumentChange,
  onVelocityChange,
  onToggleKeyLabels,
}: PianoControlsProps) => {
  return (
    <div className={styles.controlsContainer}>
      <div className={styles.controlGroup}>
        <h3 className={styles.controlTitle}>🎵 音色选择</h3>
        <div className={styles.instrumentButtons}>
          {INSTRUMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.instrumentButton} ${instrument === option.value ? styles.activeInstrument : ''}`}
              onClick={() => onInstrumentChange(option.value)}
            >
              <span className={styles.instrumentIcon}>{option.icon}</span>
              <span className={styles.instrumentLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.controlGroup}>
        <h3 className={styles.controlTitle}>🎚️ 力度控制</h3>
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
          {showKeyLabels ? '隐藏按键' : '显示按键'}
        </button>
      </div>
    </div>
  )
}

export default PianoControls
