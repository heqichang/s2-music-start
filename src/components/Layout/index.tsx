import { Outlet, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

const Layout = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>🎵 音乐启蒙</div>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : styles.navLink)}
            end
          >
            首页
          </NavLink>
          <NavLink
            to="/lessons"
            className={({ isActive }) => (isActive ? styles.active : styles.navLink)}
          >
            课程
          </NavLink>
          <NavLink
            to="/practice"
            className={({ isActive }) => (isActive ? styles.active : styles.navLink)}
          >
            练习
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? styles.active : styles.navLink)}
          >
            关于
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>© 2024 音乐启蒙教育平台</p>
      </footer>
    </div>
  )
}

export default Layout
