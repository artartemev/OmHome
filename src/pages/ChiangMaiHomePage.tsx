import heroAnimation from '../assets/main/hero.gif';
import logo from '../assets/main/logo.png';
import sparkleIcon from '../assets/main/sparkle.svg';
import styles from './ChiangMaiHomePage.module.css';

export function ChiangMaiHomePage() {
  const experienceSectionRef = useRef<HTMLElement | null>(null);
  const experienceInView = useInView(experienceSectionRef, { once: true, amount: 0.2 });

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

      <section className={styles.introSection}>
        <div className={styles.introInner}>
          <h2 className={styles.introHeading}>OmHome</h2>
          <p className={styles.introDescription}>
            — это не просто место для мероприятий, а настоящий дом, где живут люди, которые создают атмосферу уюта и
            заботы.
          </p>

          <div className={styles.introHighlights}>
            <p className={styles.introListHeading}>Здесь можно:</p>
            <ul className={styles.introItems}>
              <li className={styles.introItem}>
                <span className={styles.introItemIcon} aria-hidden="true">
                  <img src={sparkleIcon} alt="" />
                </span>
                встретиться и познакомиться с другими жителями города
              </li>
              <li className={styles.introItem}>
                <span className={styles.introItemIcon} aria-hidden="true">
                  <img src={sparkleIcon} alt="" />
                </span>
                поработать за ноутбуком в спокойной обстановке (коворкинг с хорошим интернетом, чаем и печеньками ☕🍪)
              </li>
              <li className={styles.introItem}>
                <span className={styles.introItemIcon} aria-hidden="true">
                  <img src={sparkleIcon} alt="" />
                </span>
                прийти на кино, квартирник, настолки или квиз
              </li>
              <li className={styles.introItem}>
                <span className={styles.introItemIcon} aria-hidden="true">
                  <img src={sparkleIcon} alt="" />
                </span>
                попробовать йогу, медитацию или познакомиться с киртанами.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
