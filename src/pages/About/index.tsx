import styles from './About.module.css'

const About = () => {
  return (
    <div className={styles.about}>
      <h2 className={styles.pageTitle}>关于我们</h2>
      <p className={styles.pageDesc}>了解音乐启蒙教育平台</p>

      <div className={styles.contentCard}>
        <section className={styles.section}>
          <h3>🎯 我们的使命</h3>
          <p>
            让每个孩子都能轻松接触音乐，在乐趣中培养音乐素养，激发创造力和想象力。
            我们相信音乐是最好的启蒙教育之一。
          </p>
        </section>

        <section className={styles.section}>
          <h3>📚 课程体系</h3>
          <p>
            我们的课程由专业音乐教育团队精心设计，涵盖音符认知、节奏训练、音阶练习、
            简单乐曲演奏等多个模块，适合4-12岁儿童循序渐进地学习。
          </p>
        </section>

        <section className={styles.section}>
          <h3>🎮 学习方式</h3>
          <p>
            采用游戏化学习理念，通过互动练习、成就系统、关卡挑战等方式，
            让孩子在玩耍中自然地掌握音乐知识，培养学习兴趣。
          </p>
        </section>

        <section className={styles.section}>
          <h3>📧 联系我们</h3>
          <p>如有任何问题或建议，欢迎随时与我们联系：hello@musicstart.com</p>
        </section>
      </div>
    </div>
  )
}

export default About
