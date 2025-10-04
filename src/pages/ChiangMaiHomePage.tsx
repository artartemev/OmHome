import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import heroAnimation from '../assets/main/hero.gif';
import initiationIllustration from '../assets/main/intiation.png';
import communityGatheringImage from '../assets/main/com.png';
import logo from '../assets/main/logo.png';
import sparkleIcon from '../assets/main/sparkle.svg';
import styles from './ChiangMaiHomePage.module.css';

const eventImagesGlob = import.meta.glob('../assets/events/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const experienceImages = Object.values(eventImagesGlob).sort();
const experienceLeftColumn = experienceImages.filter((_, index) => index % 2 === 0);
const experienceRightColumn = experienceImages.filter((_, index) => index % 2 === 1);
const experienceLeftLoop =
  experienceLeftColumn.length > 0
    ? [...experienceLeftColumn, ...experienceLeftColumn]
    : [...experienceImages, ...experienceImages];
const experienceRightLoop =
  experienceRightColumn.length > 0
    ? [...experienceRightColumn, ...experienceRightColumn]
    : [...experienceImages, ...experienceImages];
const experienceLeftDelayGroupSize = Math.max(experienceLeftColumn.length, 1);
const experienceRightDelayGroupSize = Math.max(experienceRightColumn.length, 1);

const happeningsColumns = [
  [
    {
      title: 'Кино и квизы',
      description: 'уютные вечера с обсуждениями.'
    },
    {
      title: 'Йога и мастер-классы',
      description: 'от расслабления до новых навыков.'
    },
    {
      title: 'Живая музыка и киртаны',
      description: 'гармония и вдохновение.'
    }
  ],
  [
    {
      title: 'Настольные игры и квартирники',
      description: 'весёлые форматы для новых знакомств.',
      singleLine: true
    },
    {
      title: 'Коворкинг',
      description: 'работа в уютной обстановке.'
    },
    {
      title: 'Коммьюнити',
      description: 'общение, дружба, забота.'
    }
  ]
];

const initiativeActivities = [
  'устроить мастер-класс или йогу,',
  'провести квартирник или настольный вечер,',
  'организовать встречу по интересам.'
];

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

      <section ref={experienceSectionRef} className={styles.experienceSection}>
        <div className={styles.experienceInner}>
          <div className={styles.experienceGallery}>
            <div className={styles.experienceGradient} aria-hidden="true" />
            <div className={styles.experienceColumns}>
              <div className={styles.experienceColumn}>
                <motion.div
                  className={styles.experienceColumnTrack}
                  animate={{ y: ['0%', '-50%'] }}
                  transition={{ duration: 62, repeat: Infinity, ease: 'linear' }}
                >
                  {experienceLeftLoop.map((imageSrc, index) => (
                    <motion.div
                      key={`experience-left-${index}`}
                      className={styles.experienceImageWrapper}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={experienceInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + (index % experienceLeftDelayGroupSize) * 0.1
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={imageSrc} alt="Тёплые встречи OmHome" className={styles.experienceImage} />
                      <span className={styles.experienceImageOverlay} aria-hidden="true" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              <div className={`${styles.experienceColumn} ${styles.experienceColumnShift}`}>
                <motion.div
                  className={styles.experienceColumnTrack}
                  animate={{ y: ['-50%', '0%'] }}
                  transition={{ duration: 74, repeat: Infinity, ease: 'linear' }}
                >
                  {experienceRightLoop.map((imageSrc, index) => (
                    <motion.div
                      key={`experience-right-${index}`}
                      className={styles.experienceImageWrapper}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={experienceInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.6,
                        delay: 0.6 + (index % experienceRightDelayGroupSize) * 0.1
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={imageSrc} alt="Тёплые встречи OmHome" className={styles.experienceImage} />
                      <span className={styles.experienceImageOverlay} aria-hidden="true" />
                    </motion.div>
                  ))}
                </motion.div>
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

      <section className={styles.happeningsSection}>
        <div className={styles.happeningsInner}>
          <h2 className={styles.happeningsHeading}>Что у нас происходит</h2>
          <div className={styles.happeningsColumns}>
            {happeningsColumns.map((column, columnIndex) => (
              <div key={`happenings-column-${columnIndex}`} className={styles.happeningsColumn}>
                {column.map((item) => (
                  <div key={item.title} className={styles.happening}>
                    <h3
                      className={`${styles.happeningTitle} ${
                        item.singleLine ? styles.happeningTitleSingleLine : ''
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className={styles.happeningDescription}>{item.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <a className={styles.happeningsButton} href="#schedule">
            Смотреть афишу
          </a>
        </div>
      </section>

      <section id="propose-event" className={styles.communitySection}>
        <div className={styles.communityInner}>
          <div className={styles.communityTop}>
            <div className={styles.communityIntro}>
              <h2 className={styles.communityHeading}>Мы создаём пространство доверия и чистоты</h2>
              <p className={styles.communityParagraph}>
                У нас нет алкоголя, наркотиков и мяса. Всё строится на уважении, дружбе и заботе друг о друге.
              </p>
              <p className={`${styles.communityParagraph} ${styles.communityParagraphAccent}`}>
                Формат участия — donation.
              </p>
              <p className={styles.communityParagraph}>
                То есть вы сами решаете, хотите ли что-то пожертвовать. Можно приходить даже без пожертвования — это
                пространство открыто для всех.
              </p>
            </div>

            <div className={styles.communityIllustration}>
              <img src={initiationIllustration} alt="Иллюстрация доверия OmHome" />
            </div>
          </div>

          <p className={styles.communityStatement}>OmHome — это живая площадка.</p>

          <div className={styles.communityBottom}>
            <div className={styles.communityGroupImage}>
              <img src={communityGatheringImage} alt="Встреча друзей OmHome" />
            </div>

            <div className={styles.communityOffer}>
              <h3 className={styles.communityOfferHeading}>Твоя инициатива</h3>
              <p className={styles.communityOfferIntro}>
                Здесь не только проходят наши события, но и ты можешь предложить что-то своё:
              </p>
              <ul className={styles.communityOfferList}>
                {initiativeActivities.map((activity) => (
                  <li key={activity} className={styles.communityOfferListItem}>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a className={styles.communityButton} href="#schedule">
            Предложить мероприятие
          </a>
        </div>
      </section>
    </div>
  );
}
