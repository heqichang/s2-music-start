import { useState, useCallback, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HelpTip from '@/components/HelpTip'
import {
  DynamicsVisualizer,
  DynamicsControl,
  type DynamicsLevel,
  type DynamicsVisualizerRef,
} from '@/components/Dynamics'
import { audioEngine } from '@/utils/audio'
import styles from './Dynamics.module.css'

const Dynamics = () => {
  const [currentLevel, setCurrentLevel] = useState<DynamicsLevel>('mf')
  const visualizerRef = useRef<DynamicsVisualizerRef>(null)
  const isInitializedRef = useRef(false)

  const playNoteWithLevel = useCallback(async (level: DynamicsLevel) => {
    try {
      if (!isInitializedRef.current) {
        await audioEngine.init()
        isInitializedRef.current = true
      }
      audioEngine.playNote('C4', 'piano', 1.0, level)
      visualizerRef.current?.triggerBurst()
    } catch (error) {
      console.error('Failed to play note:', error)
    }
  }, [])

  const handleLevelChange = useCallback((level: DynamicsLevel) => {
    setCurrentLevel(level)
    playNoteWithLevel(level)
  }, [playNoteWithLevel])

  const handlePlay = useCallback(() => {
    playNoteWithLevel(currentLevel)
  }, [currentLevel, playNoteWithLevel])

  useEffect(() => {
    const initAudio = async () => {
      try {
        await audioEngine.init()
        isInitializedRef.current = true
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }
    initAudio()
  }, [])

  return (
    <div className={styles.pageContainer}>
      <Navbar title="强弱探索" icon="📊" />
      <main className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>强弱探索</h1>
          <p className={styles.description}>
            点击按钮感受不同的力度，听听声音有什么变化！
          </p>
          <HelpTip
            title="操作说明"
            tips={[
              '点击三个力度按钮切换强弱',
              '点击播放按钮听声音',
              '观察波形和粒子的变化',
              '强(f)声音大，弱(p)声音小',
            ]}
            position="bottom"
          />
        </div>

        <div className={styles.mainCard}>
          <DynamicsVisualizer ref={visualizerRef} level={currentLevel} />
          <DynamicsControl
            currentLevel={currentLevel}
            onLevelChange={handleLevelChange}
            onPlay={handlePlay}
          />
        </div>

        <div className={styles.tipSection}>
          <p className={styles.tipText}>
            <span className={styles.tipEmoji}>💡</span>
            小提示：音乐中的强弱就像说话的声音大小一样，
            强的时候声音大，弱的时候声音小哦！
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dynamics
