import { useState, useCallback } from 'react'
import Navbar from '@/components/Navbar'
import HelpTip from '@/components/HelpTip'
import { DrumKit, DrumControls } from '@/components/VirtualDrums'
import type { VelocityLevel } from '@/utils/audio'
import pageStyles from '@/styles/Page.module.css'
import styles from './Drums.module.css'

const Drums = () => {
  const [velocity, setVelocity] = useState<VelocityLevel>('mf')
  const [showKeyLabels, setShowKeyLabels] = useState(true)

  const handleVelocityChange = useCallback((newVelocity: VelocityLevel) => {
    setVelocity(newVelocity)
  }, [])

  const handleToggleKeyLabels = useCallback(() => {
    setShowKeyLabels((prev) => !prev)
  }, [])

  return (
    <div className={pageStyles.page}>
      <Navbar title="虚拟鼓垫" icon="🥁" />
      <main className={pageStyles.content}>
        <div className={styles.drumsPage}>
          <div className={styles.header}>
            <h1 className={styles.title}>🥁 虚拟鼓垫</h1>
            <p className={styles.description}>
              咚咚锵，来打架子鼓吧！点击鼓垫或使用电脑键盘就能打出酷炫的节拍
            </p>
            <HelpTip
              title="操作说明"
              tips={[
                '点击/触摸鼓垫来演奏',
                '电脑键盘：Q W E / A S D 六个键',
                '六种不同的鼓点声音',
                '调整力度体验强弱变化',
              ]}
              position="bottom"
            />
          </div>

          <DrumControls
            velocity={velocity}
            showKeyLabels={showKeyLabels}
            onVelocityChange={handleVelocityChange}
            onToggleKeyLabels={handleToggleKeyLabels}
          />

          <div className={styles.drumsWrapper}>
            <DrumKit
              velocity={velocity}
              showKeyLabels={showKeyLabels}
            />
          </div>

          <div className={styles.tips}>
            <h3 className={styles.tipsTitle}>💡 演奏提示</h3>
            <ul className={styles.tipsList}>
              <li>🖱️ 点击/👆 点击或触摸鼓垫来演奏</li>
              <li>⌨️ 使用电脑键盘也可以演奏（Q W E / A S D）</li>
              <li>🥁 六种不同的鼓点，每种都有独特的声音</li>
              <li>🎚️ 调整力度，体验不同的强弱变化</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Drums
