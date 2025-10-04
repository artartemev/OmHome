import heroAnimation from '../assets/main/hero.gif';
import logo from '../assets/main/logo.png';
import sparkleIcon from '../assets/main/sparkle.svg';
import styles from './ChiangMaiHomePage.module.css';

const eventImagesGlob = import.meta.glob('../assets/events/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const experienceImages = Object.values(eventImagesGlob).sort();
const experienceLeftColumn = experienceImages.filter((_, index) => index % 2 === 0).slice(0, 3);
const experienceRightColumn = experienceImages.filter((_, index) => index % 2 === 1).slice(0, 3);

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

      <section className={styles.experienceSection}>
        <div className={styles.experienceInner}>
          <div className={styles.experienceGallery}>
            <div className={styles.experienceGradient} aria-hidden="true" />
            <div className={styles.experienceColumns}>
              <div className={styles.experienceColumn}>
                {experienceLeftColumn.map((imageSrc, index) => (
                  <div key={`experience-left-${index}`} className={styles.experienceImageWrapper}>
                    <img src={imageSrc} alt="Тёплые встречи OmHome" className={styles.experienceImage} />
                  </div>
                ))}
              </div>
              <div className={`${styles.experienceColumn} ${styles.experienceColumnShift}`}>
                {experienceRightColumn.map((imageSrc, index) => (
                  <div key={`experience-right-${index}`} className={styles.experienceImageWrapper}>
                    <img src={imageSrc} alt="Тёплые встречи OmHome" className={styles.experienceImage} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.experienceContent}>
            <h2 className={styles.experienceHeading}>Опыт и доверие</h2>
            <p className={styles.experienceText}>
              Мы уже открывали такие пространства в Грузии и Сербии. За несколько лет там прошло сотни встреч: лекции,
              йога, квартирники, настолки, кино, киртаны.
            </p>
            <p className={styles.experienceText}>
              Каждый раз это становилось точкой сближения для людей, которые искали дружескую атмосферу и новые
              знакомства.
            </p>
            <p className={styles.experienceText}>Теперь мы создаём такую же атмосферу в Чиангмае 🌿</p>
            <div className={styles.experienceLinks}>
              <a
                className={styles.experienceLink}
                href="https://www.instagram.com/omhome_belgrade/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram OmHome Belgrade
              </a>
              <a
                className={styles.experienceLink}
                href="https://www.instagram.com/omhome_batumi/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram OmHome Batumi
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
