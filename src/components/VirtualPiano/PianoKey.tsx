import { useCallback } from 'react'
import type { PianoKeyData } from './types'
import styles from './VirtualPiano.module.css'

interface PianoKeyProps {
  keyData: PianoKeyData
  isPressed: boolean
  showKeyLabels: boolean
  style?: React.CSSProperties
  onKeyDown: (note: string) => void
  onKeyUp: (note: string) => void
}

const PianoKey = ({ keyData, isPressed, showKeyLabels, style, onKeyDown, onKeyUp }: PianoKeyProps) => {
  const { note, type, keyLabel, keyboardKey } = keyData

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onKeyDown(note)
    },
    [note, onKeyDown]
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onKeyUp(note)
    },
    [note, onKeyUp]
  )

  const handleMouseLeave = useCallback(() => {
    if (isPressed) {
      onKeyUp(note)
    }
  }, [note, isPressed, onKeyUp])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      onKeyDown(note)
    },
    [note, onKeyDown]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      onKeyUp(note)
    },
    [note, onKeyUp]
  )

  const keyClass = type === 'white' ? styles.whiteKey : styles.blackKey
  const pressedClass = isPressed ? styles.pressed : ''

  return (
    <div
      className={`${keyClass} ${pressedClass}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`${keyLabel} key`}
    >
      {showKeyLabels && (
        <div className={styles.keyLabel}>
          <span className={styles.keyboardKey}>{keyboardKey.toUpperCase()}</span>
          <span className={styles.noteName}>{keyLabel}</span>
        </div>
      )}
    </div>
  )
}

export default PianoKey
