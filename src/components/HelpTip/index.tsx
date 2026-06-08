import { useState, useEffect, useRef } from 'react'
import styles from './HelpTip.module.css'

interface HelpTipProps {
  title?: string
  tips: string[]
  position?: 'top' | 'bottom' | 'left' | 'right'
  autoShow?: boolean
  autoShowDelay?: number
}

const HelpTip = ({
  title = '游戏说明',
  tips,
  position = 'bottom',
  autoShow = false,
  autoShowDelay = 500,
}: HelpTipProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoShow && !hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
      }, autoShowDelay)
      return () => clearTimeout(timer)
    }
  }, [autoShow, autoShowDelay, hasShown])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={styles.helpTipWrapper} ref={tooltipRef}>
      <button
        className={styles.helpButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? '关闭帮助' : '打开帮助'}
      >
        <span className={styles.helpIcon}>?</span>
      </button>

      {isOpen && (
        <div className={`${styles.tooltip} ${styles[position]}`}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>💡 {title}</span>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="关闭"
            >
              ×
            </button>
          </div>
          <ul className={styles.tipsList}>
            {tips.map((tip, index) => (
              <li key={index} className={styles.tipItem}>
                <span className={styles.tipBullet}>•</span>
                <span className={styles.tipText}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default HelpTip
