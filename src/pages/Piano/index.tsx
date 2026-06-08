import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import HelpTip from '@/components/HelpTip'
import { PianoKeyboard, PianoControls } from '@/components/VirtualPiano'
import type { InstrumentType, VelocityLevel } from '@/utils/audio'
import pageStyles from '@/styles/Page.module.css'
import styles from './Piano.module.css'

const Piano = () => {
  const [instrument, setInstrument] = useState<InstrumentType>('piano')
  const [velocity, setVelocity] = useState<VelocityLevel>('mf')
  const [showKeyLabels, setShowKeyLabels] = useState(true)

  const handleInstrumentChange = useCallback((newInstrument: InstrumentType) => {
    setInstrument(newInstrument)
  }, [])

  const handleVelocityChange = useCallback((newVelocity: VelocityLevel) => {
    setVelocity(newVelocity)
  }, [])

  const handleToggleKeyLabels = useCallback(() => {
    setShowKeyLabels((prev) => !prev)
  }, [])

  return (
    <div className={pageStyles.page}>
      <Navbar title="虚拟钢琴" icon="🎹" />
      <main className={pageStyles.content}>
        <div className={styles.pianoPage}>
          <div className={styles.header}>
            <h1 className={styles.title}>🎹 虚拟钢琴</h1>
            <p className={styles.description}>
              叮叮咚咚，来弹钢琴吧！点击琴键或使用电脑键盘就能发出美妙的声音
            </p>
            <HelpTip
              title="操作说明"
              tips={[
                '点击/触摸琴键来演奏',
                '电脑键盘：A-L 白键，W-U 黑键',
                '可切换6种不同乐器音色',
                '调整力度感受强弱变化',
              ]}
              position="bottom"
            />
          </div>

          <PianoControls
            instrument={instrument}
            velocity={velocity}
            showKeyLabels={showKeyLabels}
            onInstrumentChange={handleInstrumentChange}
            onVelocityChange={handleVelocityChange}
            onToggleKeyLabels={handleToggleKeyLabels}
          />

          <div className={styles.pianoWrapper}>
            <PianoKeyboard
              instrument={instrument}
              velocity={velocity}
              showKeyLabels={showKeyLabels}
            />
          </div>

          <div className={styles.tips}>
            <h3 className={styles.tipsTitle}>💡 演奏提示</h3>
            <ul className={styles.tipsList}>
              <li>🖱️ 点击/👆 点击或触摸琴键来演奏</li>
              <li>⌨️ 使用电脑键盘也可以演奏（白键: A S D F G H J K 等）</li>
              <li>🎵 切换不同的乐器音色，感受不同的声音</li>
              <li>🎚️ 调整力度，体验不同的强弱变化</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Piano
