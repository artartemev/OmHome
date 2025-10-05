import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: '🙏 Почему именно такой формат',
    paragraphs: [
      'Мы с большим уважением относимся к традиционным формам проповеди — распространению книг, харинамам, публичным лекциям. Именно благодаря этим усилиям миссия Шрилы Прабхупады распространилась по всему миру.',
      'В то же время, в некоторых странах и городах (в том числе в Таиланде) открытое распространение книг может быть юридически ограничено, а проведение харинам требует музыкантов и поддержки сообщества, которой не всегда достаточно на начальном этапе.',
      'Поэтому мы начали использовать альтернативные формы проповеди, которые мягко вовлекают людей в общение с преданными:'
    ],
    list: [
      'совместные просмотры фильмов с обсуждениями духовных тем,',
      'настольные игры, развивающие дружбу и мышление,',
      'уютные лекции и беседы за прасадом,',
      'йогу и культурные вечера.'
    ],
    conclusion: [
      'Именно через такие форматы многие впервые узнают о мантре Харе Кришна, о философии бхакти и книгах Шрилы Прабхупады — и уже потом сами проявляют интерес.',
      'В Грузии и Сербии такой подход показал себя очень плодотворным — сотни людей впервые услышали о Харе Кришна, пришли на киртаны, начали читать книги Прабхупады и поддерживать преданных.',
      'Теперь мы хотим продолжить эту миссию в Чиангмае — с тем же настроением служения и заботы, следуя принципу юкта-вайрагья — использовать всё, что помогает людям приблизиться к Богу.'
    ]
  },
  en: {
    title: '🙏 Why this format',
    paragraphs: [
      'We deeply respect the traditional forms of outreach—book distribution, harinams, and public lectures. Thanks to these efforts, Srila Prabhupada’s mission spread all over the world.',
      'At the same time, in some countries and cities (including Thailand) open book distribution may be legally restricted, and holding harinams requires musicians and community support that is not always available in the early stages.',
      'That is why we began using alternative forms of outreach that gently involve people in associating with devotees:'
    ],
    list: [
      'shared movie screenings with discussions on spiritual topics,',
      'board games that develop friendship and thinking,',
      'cozy lectures and conversations over prasadam,',
      'yoga and cultural evenings.'
    ],
    conclusion: [
      'Through these formats many people first hear about the Hare Krishna mantra, the philosophy of bhakti, and Srila Prabhupada’s books—and then become interested on their own.',
      'In Georgia and Serbia this approach proved very fruitful—hundreds of people first heard about Hare Krishna, came to kirtans, started reading Prabhupada’s books, and began supporting the devotees.',
      'Now we want to continue this mission in Chiang Mai—with the same mood of service and care, following the principle of yukta-vairagya: to use everything that helps people come closer to God.'
    ]
  }
} as const;

export function WhyFormatSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { language } = useLanguage();
  const { title, paragraphs, list, conclusion } = translations[language];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-[#f5f2ef]">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl text-[#292838] mb-12 text-center"
        >
          {title}
        </motion.h2>

        <div className="space-y-6 text-xl text-[#292838] leading-relaxed">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 * (index + 1) }}
            >
              {paragraph}
            </motion.p>
          ))}

          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 * (paragraphs.length + 1) }}
            className="list-disc pl-6 space-y-3"
          >
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>

          {conclusion.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.2 * (paragraphs.length + 2 + index)
              }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
