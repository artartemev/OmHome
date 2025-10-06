import nityanandaImage from '../assets/nityananda.png';
import prabhupadaImage from '../assets/prabhupada.png';
import { useLanguage } from '../contexts/LanguageContext';

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
    <section
      style={{
        backgroundColor: '#E9E5E2',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '1440px',
          height: '1524px'
        }}
      >
        <h2
          style={{
            position: 'absolute',
            left: '100px',
            top: '80px',
            width: '1222px',
            height: '101px',
            fontFamily: 'MenorahGrotesk',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '84px',
            lineHeight: '101px',
            color: '#000000'
          }}
        >
          {heading}
        </h2>

        <p
          style={{
            position: 'absolute',
            left: '580px',
            top: '221px',
            width: '743px',
            height: '660px',
            fontFamily: 'MenorahGrotesk',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '36px',
            color: '#000000'
          }}
        >
          {firstParagraph}
        </p>

        <p
          style={{
            position: 'absolute',
            left: '149px',
            top: '963px',
            width: '713px',
            height: '428px',
            fontFamily: 'MenorahGrotesk',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '36px',
            textAlign: 'right',
            color: '#000000'
          }}
        >
          {secondParagraph}
        </p>

        <div
          style={{
            position: 'absolute',
            left: '120px',
            top: '225px',
            width: '396px',
            height: '652px',
            borderRadius: '180px',
            overflow: 'hidden'
          }}
        >
          <img
            src={nityanandaImage}
            alt={nityanandaAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '926px',
            top: '932px',
            width: '350px',
            height: '489px',
            borderRadius: '180px',
            overflow: 'hidden'
          }}
        >
          <img
            src={prabhupadaImage}
            alt={prabhupadaAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </div>
      </div>
    </section>
  );
}
