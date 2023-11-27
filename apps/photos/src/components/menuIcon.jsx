import styles from './menuIcon.module.css'

export default function MenuIcon({ open = false }) {
  return (
    <div className={ open ? `${styles.icon} ${styles.open}` : styles.icon }>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}