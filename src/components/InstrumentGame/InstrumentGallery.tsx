import { useState, useCallback, useEffect } from 'react'
import { audioEngine } from '@/utils/audio'
import type { InstrumentType as AudioInstrumentType } from '@/utils/audio'
import type { InstrumentType } from './types'
import { INSTRUMENTS, MELODY_NOTES, DRUM_PATTERN } from './instruments'
import styles from './InstrumentGame.module.css'

interface InstrumentGalleryProps {
  onBack: () => void
}

const InstrumentGallery = ({ onBack }: InstrumentGalleryProps) => {
  const [playingId, setPlayingId] = useState<InstrumentType | null>(null)
  const [selectedId, setSelectedId] = useState<InstrumentType | null>(null)

  useEffect(() => {
    audioEngine.init()
  }, [])

  const playInstrumentSound = useCallback(
    (instrumentId: InstrumentType) => {
      if (playingId === instrumentId) return
      setPlayingId(instrumentId)

      try {
        const now = audioEngine.getCurrentTime()

        if (instrumentId === 'drum') {
          const beatDuration = 0.3
          DRUM_PATTERN.forEach((item) => {
            const startTime = now + item.beat * beatDuration
            audioEngine.playDrum(item.drum, 'mf', startTime)
          })
          const totalDuration = DRUM_PATTERN.length * beatDuration * 1000
          setTimeout(() => setPlayingId(null), totalDuration)
        } else {
          const audioInstrument = instrumentId as AudioInstrumentType
          const noteDuration = 0.5
          const gap = 0.15
          const notes = MELODY_NOTES[instrumentId]
          notes.forEach((note, index) => {
            audioEngine.playNote(
              note,
              audioInstrument,
              noteDuration,
              'mf',
              now + index * (noteDuration + gap)
            )
          })
          const totalDuration = notes.length * (noteDuration + gap) * 1000
          setTimeout(() => setPlayingId(null), totalDuration)
        }
      } catch (error) {
        console.error('Failed to play instrument:', error)
        setPlayingId(null)
      }
    },
    [playingId]
  )

  const selectedInstrument = selectedId ? INSTRUMENTS.find((i) => i.id === selectedId) : null

  return (
    <div className={styles.galleryScreen}>
      <div className={styles.galleryHeader}>
        <button className={styles.backButton} onClick={onBack}>
          ← 返回
        </button>
        <h2 className={styles.galleryTitle}>📚 乐器图鉴</h2>
        <div style={{ width: 80 }} />
      </div>

      <p className={styles.gallerySubtitle}>
        点一点乐器，听听它们的声音吧！
      </p>

      <div className={styles.instrumentGrid}>
        {INSTRUMENTS.map((instrument) => (
          <button
            key={instrument.id}
            className={`${styles.instrumentCard} ${
              playingId === instrument.id ? styles.playing : ''
            } ${selectedId === instrument.id ? styles.selected : ''}`}
            onClick={() => {
              playInstrumentSound(instrument.id)
              setSelectedId(instrument.id)
            }}
            style={
              {
                '--inst-color': instrument.color,
                '--inst-gradient-from': instrument.gradientFrom,
                '--inst-gradient-to': instrument.gradientTo,
              } as React.CSSProperties
            }
          >
            <div className={styles.cardEmojiWrapper}>
              <span className={styles.cardEmoji}>{instrument.emoji}</span>
              {playingId === instrument.id && (
                <span className={styles.playBadge}>🎵</span>
              )}
            </div>
            <span className={styles.cardName}>{instrument.name}</span>
          </button>
        ))}
      </div>

      {selectedInstrument && (
        <div className={styles.instrumentDetail} key={selectedInstrument.id}>
          <div className={styles.detailEmoji}>{selectedInstrument.emoji}</div>
          <h3 className={styles.detailName}>{selectedInstrument.name}</h3>
          <p className={styles.detailDesc}>{selectedInstrument.description}</p>
          <button
            className={`${styles.detailPlayBtn} ${
              playingId === selectedInstrument.id ? styles.playing : ''
            }`}
            onClick={() => playInstrumentSound(selectedInstrument.id)}
            style={
              {
                '--btn-color': selectedInstrument.color,
                '--btn-gradient-from': selectedInstrument.gradientFrom,
                '--btn-gradient-to': selectedInstrument.gradientTo,
              } as React.CSSProperties
            }
          >
            {playingId === selectedInstrument.id ? '🎵 播放中...' : '▶️ 再听一次'}
          </button>
        </div>
      )}
    </div>
  )
}

export default InstrumentGallery
