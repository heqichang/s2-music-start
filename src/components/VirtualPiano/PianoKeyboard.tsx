import { useState, useEffect, useCallback, useRef } from 'react'
import { audioEngine } from '@/utils/audio'
import type { InstrumentType, VelocityLevel } from '@/utils/audio'
import PianoKey from './PianoKey'
import { WHITE_KEYS, BLACK_KEYS, BLACK_KEY_POSITIONS } from './types'
import type { PianoKeyData } from './types'
import styles from './VirtualPiano.module.css'

interface PianoKeyboardProps {
  instrument: InstrumentType
  velocity: VelocityLevel
  showKeyLabels: boolean
  onPlayNote?: (note: string) => void
}

const PianoKeyboard = ({ instrument, velocity, showKeyLabels, onPlayNote }: PianoKeyboardProps) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const pressedKeysRef = useRef<Set<string>>(new Set())
  const audioInitializedRef = useRef(false)

  const playNote = useCallback(
    (note: string) => {
      if (typeof window === 'undefined') return
      if (!audioInitializedRef.current) {
        audioEngine.init()
        audioInitializedRef.current = true
      }
      audioEngine.playNote(note, instrument, 0.8, velocity)
      onPlayNote?.(note)
    },
    [instrument, velocity, onPlayNote]
  )

  const handleKeyDown = useCallback(
    (note: string) => {
      if (pressedKeysRef.current.has(note)) return
      pressedKeysRef.current.add(note)
      setPressedKeys(new Set(pressedKeysRef.current))
      playNote(note)
    },
    [playNote]
  )

  const handleKeyUp = useCallback((note: string) => {
    pressedKeysRef.current.delete(note)
    setPressedKeys(new Set(pressedKeysRef.current))
  }, [])

  useEffect(() => {
    const allKeys = [...WHITE_KEYS, ...BLACK_KEYS]
    const keyToNoteMap = new Map<string, string>()
    allKeys.forEach((keyData) => {
      keyToNoteMap.set(keyData.keyboardKey.toLowerCase(), keyData.note)
    })

    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      const note = keyToNoteMap.get(key)
      if (note) {
        handleKeyDown(note)
      }
    }

    const handleKeyUpEvent = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const note = keyToNoteMap.get(key)
      if (note) {
        handleKeyUp(note)
      }
    }

    window.addEventListener('keydown', handleKeyDownEvent)
    window.addEventListener('keyup', handleKeyUpEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent)
      window.removeEventListener('keyup', handleKeyUpEvent)
    }
  }, [handleKeyDown, handleKeyUp])

  const getBlackKeyStyle = (keyData: PianoKeyData): React.CSSProperties => {
    const position = BLACK_KEY_POSITIONS[keyData.note]
    const whiteKeyWidth = 100 / WHITE_KEYS.length
    const left = (position + 1) * whiteKeyWidth - (whiteKeyWidth * 0.3)
    return {
      left: `${left}%`,
    }
  }

  return (
    <div className={styles.keyboardContainer}>
      <div className={styles.pianoKeyboard}>
        <div className={styles.whiteKeysRow}>
          {WHITE_KEYS.map((keyData) => (
            <PianoKey
              key={keyData.note}
              keyData={keyData}
              isPressed={pressedKeys.has(keyData.note)}
              showKeyLabels={showKeyLabels}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
          ))}
        </div>
        <div className={styles.blackKeysRow}>
          {BLACK_KEYS.map((keyData) => (
            <PianoKey
              key={keyData.note}
              keyData={keyData}
              isPressed={pressedKeys.has(keyData.note)}
              showKeyLabels={showKeyLabels}
              style={getBlackKeyStyle(keyData)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PianoKeyboard
