import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { audioEngine } from '@/utils/audio'
import styles from './Home.module.css'

interface ModuleCard {
  id: string
  icon: string
  title: string
  description: string
  colorClass: string
  path?: string
  hasSubMenu?: boolean
}

const modules: ModuleCard[] = [
  {
    id: 'pitch',
    icon: '🎵',
    title: '高低音辨别',
    description: '训练音高敏感度，培养敏锐的听觉',
    colorClass: styles.pitch,
    path: '/pitch',
  },
  {
    id: 'rhythm',
    icon: '🥁',
    title: '节奏模仿',
    description: '跟随节拍律动，培养良好的节奏感',
    colorClass: styles.rhythm,
    path: '/rhythm',
  },
  {
    id: 'instrument',
    icon: '🎺',
    title: '乐器猜猜看',
    description: '识别不同乐器的独特音色',
    colorClass: styles.instrument,
    path: '/instrument',
  },
  {
    id: 'dynamics',
    icon: '📊',
    title: '强弱探索',
    description: '理解音乐中的力度变化奥秘',
    colorClass: styles.dynamics,
    path: '/dynamics',
  },
  {
    id: 'virtual',
    icon: '🎹',
    title: '虚拟乐器',
    description: '自由演奏探索，释放音乐创意',
    colorClass: styles.piano,
    hasSubMenu: true,
  },
]

const Home = () => {
  const navigate = useNavigate()
  const [isStarted, setIsStarted] = useState(false)
  const [showVirtualMenu, setShowVirtualMenu] = useState(false)

  const handleStart = async () => {
    try {
      await audioEngine.init()
      setIsStarted(true)
    } catch (error) {
      console.error('Failed to initialize audio engine:', error)
    }
  }

  const handleModuleClick = (module: ModuleCard) => {
    if (!isStarted) {
      handleStart().then(() => {
        if (module.hasSubMenu) {
          setShowVirtualMenu(true)
        } else if (module.path) {
          navigate(module.path)
        }
      })
      return
    }

    if (module.hasSubMenu) {
      setShowVirtualMenu(true)
    } else if (module.path) {
      navigate(module.path)
    }
  }

  const handleVirtualSelect = (path: string) => {
    setShowVirtualMenu(false)
    navigate(path)
  }

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.title}>🎵 音乐启蒙乐园</h1>
        <p className={styles.subtitle}>专为小朋友设计的趣味音乐学习平台</p>
        {!isStarted && (
          <button className={styles.startButton} onClick={handleStart}>
            <span className={styles.startButtonIcon}>🚀</span>
            开始探索
          </button>
        )}
      </section>

      <section className={styles.modulesGrid}>
        {modules.map((module) => (
          <div
            key={module.id}
            className={`${styles.moduleCard} ${module.colorClass}`}
            onClick={() => handleModuleClick(module)}
          >
            <div className={styles.iconWrapper}>{module.icon}</div>
            <h3 className={styles.moduleTitle}>{module.title}</h3>
            <p className={styles.moduleDesc}>{module.description}</p>
          </div>
        ))}
      </section>

      {showVirtualMenu && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowVirtualMenu(false)}
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>选择乐器</h2>
            <div className={styles.modalButtons}>
              <button
                className={`${styles.modalButton} ${styles.pianoButton}`}
                onClick={() => handleVirtualSelect('/piano')}
              >
                <span className={styles.modalButtonIcon}>🎹</span>
                虚拟钢琴
              </button>
              <button
                className={`${styles.modalButton} ${styles.drumsButton}`}
                onClick={() => handleVirtualSelect('/drums')}
              >
                <span className={styles.modalButtonIcon}>🥁</span>
                虚拟鼓垫
              </button>
            </div>
            <button
              className={styles.modalClose}
              onClick={() => setShowVirtualMenu(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
