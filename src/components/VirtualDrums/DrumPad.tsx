import { useCallback } from 'react'
import type { DrumPadData } from './types'
import styles from './VirtualDrums.module.css'

interface DrumPadProps {
  padData: DrumPadData
  isPressed: boolean
  showKeyLabels: boolean
  onPadDown: (type: string) => void
  onPadUp: (type: string) => void
}

const DrumPad = ({ padData, isPressed, showKeyLabels, onPadDown, onPadUp }: DrumPadProps) => {
  const { type, label, icon, keyboardKey, color, glowColor } = padData

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onPadDown(type)
    },
    [type, onPadDown]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onPadUp(type)
    },
    [type, onPadUp]
  )

  const handleMouseLeave = useCallback(() => {
    if (isPressed) {
      onPadUp(type)
    }
  }, [type, isPressed, onPadUp])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      onPadDown(type)
    },
    [type, onPadDown]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      onPadUp(type)
    },
    [type, onPadUp]
  )

  const padStyle: React.CSSProperties = {
    '--drum-color': color,
    '--drum-glow': glowColor,
  } as React.CSSProperties

  const pressedClass = isPressed ? styles.pressed : ''

  return (
    <div
      className={`${styles.drumPad} ${pressedClass}`}
      style={padStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`${label} drum pad`}
    >
      <div className={styles.padContent}>
        <span className={styles.padIcon}>{icon}</span>
        <span className={styles.padLabel}>{label}</span>
        {showKeyLabels && (
          <span className={styles.keyHint}>{keyboardKey.toUpperCase()}</span>
        )}
      </div>
    </div>
  )
}

export default DrumPad
