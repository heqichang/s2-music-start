import { useState } from 'react'
import styles from './Practice.module.css'

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const Practice = () => {
  const [score, setScore] = useState(0)
  const [currentNote, setCurrentNote] = useState('C')
  const [message, setMessage] = useState('')

  const generateRandomNote = () => {
    const randomIndex = Math.floor(Math.random() * notes.length)
    setCurrentNote(notes[randomIndex])
    setMessage('')
  }

  const handleNoteClick = (note: string) => {
    if (note === currentNote) {
      setScore((prev) => prev + 10)
      setMessage('回答正确！🎉')
      setTimeout(generateRandomNote, 1000)
    } else {
      setMessage('再试试～ 💪')
    }
  }

  return (
    <div className={styles.practice}>
      <h2 className={styles.pageTitle}>音符练习</h2>
      <p className={styles.pageDesc}>通过游戏方式巩固音乐知识</p>

      <div className={styles.scoreBoard}>
        <span>得分：{score}</span>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>请点击音符：</p>
        <div className={styles.targetNote}>{currentNote}</div>
        {message && <p className={styles.message}>{message}</p>}
      </div>

      <div className={styles.pianoKeys}>
        {notes.map((note) => (
          <button key={note} className={styles.pianoKey} onClick={() => handleNoteClick(note)}>
            {note}
          </button>
        ))}
      </div>

      <button className={styles.resetButton} onClick={generateRandomNote}>
        换一个
      </button>
    </div>
  )
}

export default Practice
