import { useState, useEffect, useCallback, useRef } from 'react'
import { audioEngine } from '@/utils/audio'
import type { DrumType, VelocityLevel } from '@/utils/audio'
import DrumPad from './DrumPad'
import { DRUM_PADS } from './types'
import styles from './VirtualDrums.module.css'

interface DrumKitProps {
  velocity: VelocityLevel
  showKeyLabels: boolean
  onPlayDrum?: (drumType: DrumType) => void
}

const DrumKit = ({ velocity, showKeyLabels, onPlayDrum }: DrumKitProps) => {
  const [pressedPads, setPressedPads] = useState<Set<string>>(new Set())
  const pressedPadsRef = useRef<Set<string>>(new Set())
  const audioInitializedRef = useRef(false)

  const playDrum = useCallback(
    (drumType: DrumType) => {
      if (typeof window === 'undefined') return
      if (!audioInitializedRef.current) {
        audioEngine.init()
        audioInitializedRef.current = true
      }
      audioEngine.playDrum(drumType, velocity)
      onPlayDrum?.(drumType)
    },
    [velocity, onPlayDrum]
  )

  const handlePadDown = useCallback(
    (type: string) => {
      if (pressedPadsRef.current.has(type)) return
      pressedPadsRef.current.add(type)
      setPressedPads(new Set(pressedPadsRef.current))
      playDrum(type as DrumType)
    },
    [playDrum]
  )

  const handlePadUp = useCallback((type: string) => {
    pressedPadsRef.current.delete(type)
    setPressedPads(new Set(pressedPadsRef.current))
  }, [])

  useEffect(() => {
    const keyToDrumMap = new Map<string, DrumType>()
    DRUM_PADS.forEach((pad) => {
      keyToDrumMap.set(pad.keyboardKey.toLowerCase(), pad.type)
    })

    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()
      const drumType = keyToDrumMap.get(key)
      if (drumType) {
        handlePadDown(drumType)
      }
    }

    const handleKeyUpEvent = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const drumType = keyToDrumMap.get(key)
      if (drumType) {
        handlePadUp(drumType)
      }
    }

    window.addEventListener('keydown', handleKeyDownEvent)
    window.addEventListener('keyup', handleKeyUpEvent)

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent)
      window.removeEventListener('keyup', handleKeyUpEvent)
    }
  }, [handlePadDown, handlePadUp])

  return (
    <div className={styles.drumKitContainer}>
      <div className={styles.drumKit}>
        {DRUM_PADS.map((pad) => (
          <DrumPad
            key={pad.type}
            padData={pad}
            isPressed={pressedPads.has(pad.type)}
            showKeyLabels={showKeyLabels}
            onPadDown={handlePadDown}
            onPadUp={handlePadUp}
          />
        ))}
      </div>
    </div>
  )
}

export default DrumKit
