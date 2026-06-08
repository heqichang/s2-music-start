import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

interface NavbarProps {
  title: string
  icon?: string
  showBack?: boolean
}

const Navbar = ({ title, icon = '', showBack = true }: NavbarProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      {showBack && (
        <button className={styles.backButton} onClick={handleBack} aria-label="返回首页">
          ←
        </button>
      )}
      <h1 className={styles.title}>
        {icon && <span className={styles.titleIcon}>{icon}</span>}
        {title}
      </h1>
    </nav>
  )
}

export default Navbar
