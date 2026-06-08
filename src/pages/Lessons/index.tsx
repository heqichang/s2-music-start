import styles from './Lessons.module.css'

const lessons = [
  { id: 1, title: '认识音符', level: '入门', duration: '10分钟', icon: '🎼' },
  { id: 2, title: '节奏入门', level: '入门', duration: '15分钟', icon: '🥁' },
  { id: 3, title: '音阶练习', level: '初级', duration: '20分钟', icon: '🎹' },
  { id: 4, title: '简单旋律', level: '初级', duration: '25分钟', icon: '🎵' },
  { id: 5, title: '和弦基础', level: '中级', duration: '30分钟', icon: '🎸' },
  { id: 6, title: '乐曲演奏', level: '中级', duration: '40分钟', icon: '🎶' },
]

const Lessons = () => {
  return (
    <div className={styles.lessons}>
      <h2 className={styles.pageTitle}>音乐课程</h2>
      <p className={styles.pageDesc}>选择适合你的课程，开始音乐学习之旅</p>

      <div className={styles.lessonGrid}>
        {lessons.map((lesson) => (
          <div key={lesson.id} className={styles.lessonCard}>
            <div className={styles.lessonIcon}>{lesson.icon}</div>
            <h3 className={styles.lessonTitle}>{lesson.title}</h3>
            <div className={styles.lessonMeta}>
              <span className={styles.level}>{lesson.level}</span>
              <span className={styles.duration}>{lesson.duration}</span>
            </div>
            <button className={styles.startButton}>开始学习</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lessons
