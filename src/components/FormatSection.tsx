import nityanandaImage from '../assets/nityananda.png';
import prabhupadaImage from '../assets/prabhupada.png';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './FormatSection.module.css';

const translations = {
  ru: {
    heading: 'Почему именно такой формат',
    firstParagraph:
      'Мы с большим уважением относимся к традиционным формам проповеди — распространению книг, харинамам, публичным лекциям. Именно благодаря этим усилиям миссия Шрилы Прабхупады распространилась по всему миру. В то же время, в некоторых странах и городах (в том числе в Таиланде) открытое распространение книг может быть юридически ограничено, а проведение харинам требует музыкантов и поддержки сообщества, которой не всегда достаточно на начальном этапе. Поэтому мы начали использовать альтернативные формы проповеди, которые мягко вовлекают людей в общение с преданными: совместные просмотры фильмов с обсуждениями духовных тем, настольные игры, развивающие дружбу и мышление, уютные лекции и беседы за прасадом, йогу и культурные вечера.',
    secondParagraph:
      'Именно через такие форматы многие впервые узнают о мантре Харе Кришна, о философии бхакти и книгах Шрилы Прабхупады — и уже потом сами проявляют интерес. В Грузии и Сербии такой подход показал себя очень плодотворным — сотни людей впервые услышали о Харе Кришна, пришли на киртаны, начали читать книги Прабхупады и поддерживать преданных. Теперь мы хотим продолжить эту миссию в Чиангмае — с тем же настроением служения и заботы, следуя принципу юкта-вайрагья — использовать всё, что помогает людям приблизиться к Богу.',
    nityanandaAlt: 'Шри Нитьянанда',
    prabhupadaAlt: 'Шрила Прабхупада'
  },
  en: {
    heading: 'Why this format',
    firstParagraph:
      'We deeply respect traditional outreach — book distribution, harinams, public lectures. These efforts allowed Srila Prabhupada’s mission to spread across the world. At the same time, in some countries and cities (including Thailand) open book distribution can be legally restricted, and harinams require musicians and community support that may be limited at the beginning. That is why we started using alternative forms of outreach that gently invite people to connect with devotees: film screenings with spiritual discussions, board games that build friendship and reflection, cozy lectures and conversations over prasadam, yoga, and cultural evenings.',
    secondParagraph:
      'Through these formats many people first hear the Hare Krishna mantra, learn about the philosophy of bhakti, and discover Srila Prabhupada’s books — and then become genuinely interested. In Georgia and Serbia this approach has borne rich fruits: hundreds of people heard about Hare Krishna for the first time, came to kirtans, began reading Prabhupada’s books, and started supporting the devotees. Now we want to continue this mission in Chiang Mai with the same mood of service and care, following the yukta-vairagya principle — using everything that helps people come closer to God.',
    nityanandaAlt: 'Sri Nityananda',
    prabhupadaAlt: 'Srila Prabhupada'
  }
} as const;

export function FormatSection() {
  const { language } = useLanguage();
  const { heading, firstParagraph, secondParagraph, nityanandaAlt, prabhupadaAlt } =
    translations[language];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{heading}</h2>

        <div className={styles.topRow}>
          <div className={styles.imageTall}>
            <img src={nityanandaImage} alt={nityanandaAlt} />
          </div>
          <p className={styles.firstParagraph}>{firstParagraph}</p>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.secondParagraph}>{secondParagraph}</p>
          <div className={styles.imageWide}>
            <img src={prabhupadaImage} alt={prabhupadaAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
