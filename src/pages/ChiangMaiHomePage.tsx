import heroAnimation from '../assets/main/hero.gif';
import logo from '../assets/main/logo.png';
import styles from './ChiangMaiHomePage.module.css';

export function ChiangMaiHomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroIllustration}>
            <img src={heroAnimation} alt="Практика медитации в OmHome" />
          </div>

          <div className={styles.heroLogo}>
            <img src={logo} alt="Логотип OmHome" />
          </div>

          <div className={styles.heroCopy}>
            <p className={styles.heroTagline}>Тёплое пространство для встреч и общения</p>
            <p className={styles.heroDescription}>
              Дом-друзей в Чиангмае: события, коворкинг и уютная атмосфера для русскоязычного (и не только) коммьюнити.
            </p>
            <a className={styles.heroLink} href="#map">
              Как нас найти
            </a>
          </div>
        </div>

        <a className={styles.heroButton} href="#schedule">
          Смотреть афишу
        </a>
      </section>
    </div>
  );
}
