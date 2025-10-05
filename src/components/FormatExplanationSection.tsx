import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import nityanandaImage from '../assets/nityananda.png';
import prabhupadaImage from '../assets/prabhupada.png';

const translations = {
  ru: {
    title: 'Почему именно такой формат',
    firstParagraph:
      'Мы с большим уважением относимся к традиционным формам проповеди — распространению книг, харинамам, публичным лекциям. Именно благодаря этим усилиям миссия Шрилы Прабхупады распространилась по всему миру. В то же время, в некоторых странах и городах (в том числе в Таиланде) открытое распространение книг может быть юридически ограничено, а проведение харинам требует музыкантов и поддержки сообщества, которой не всегда достаточно на начальном этапе. Поэтому мы начали использовать альтернативные формы проповеди, которые мягко вовлекают людей в общение с преданными: совместные просмотры фильмов с обсуждениями духовных тем, настольные игры, развивающие дружбу и мышление, уютные лекции и беседы за прасадом, йогу и культурные вечера.',
    secondParagraph:
      'Именно через такие форматы многие впервые узнают о мантре Харе Кришна, о философии бхакти и книгах Шрилы Прабхупады — и уже потом сами проявляют интерес. В Грузии и Сербии такой подход показал себя очень плодотворным — сотни людей впервые услышали о Харе Кришна, пришли на киртаны, начали читать книги Прабхупады и поддерживать преданных. Теперь мы хотим продолжить эту миссию в Чиангмае — с тем же настроением служения и заботы, следуя принципу юкта-вайрагья — использовать всё, что помогает людям приблизиться к Богу.'
  },
  en: {
    title: 'Why this format works',
    firstParagraph:
      'We have deep respect for the traditional forms of outreach—book distribution, harinams, public lectures. Thanks to these efforts Śrīla Prabhupāda’s mission spread all over the world. At the same time, in some countries and cities (including Thailand) open book distribution can be legally restricted, and holding harinams requires musicians and community support that are not always available at the beginning. That is why we started using alternative forms of sharing Krishna consciousness that gently invite people to associate with devotees: group film screenings with discussions on spiritual topics, board games that cultivate friendship and thoughtful minds, cozy talks and lectures over prasadam, yoga, and cultural evenings.',
    secondParagraph:
      'Through these formats many people first hear about the Hare Krishna mantra, the philosophy of bhakti, and Śrīla Prabhupāda’s books—and then naturally develop their own interest. In Georgia and Serbia this approach proved very fruitful: hundreds of people heard about Hare Krishna for the first time, came to kirtans, began reading Prabhupāda’s books, and started supporting the devotees. Now we want to continue this mission in Chiang Mai with the same mood of service and care, following the principle of yukta-vairāgya—using everything that helps people come closer to God.'
  }
} as const;

export function FormatExplanationSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, firstParagraph, secondParagraph } = translations[language];

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-[#e9e5e2]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        <div className="space-y-20">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-1"
            >
              <div className="w-full max-w-[24.75rem] mx-auto lg:mx-0">
                <div
                  className="rounded-[180px] overflow-hidden shadow-xl"
                  style={{ aspectRatio: '396 / 652' }}
                >
                  <img
                    src={nityanandaImage}
                    alt="Шри Нитьянанда Прабху"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl lg:text-2xl text-black leading-relaxed font-medium"
            >
              {firstParagraph}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl lg:text-2xl text-black leading-relaxed font-medium text-center lg:text-right"
            >
              {secondParagraph}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="order-1 lg:order-2"
            >
              <div className="w-full max-w-[21.875rem] mx-auto lg:ml-auto">
                <div
                  className="rounded-[180px] overflow-hidden shadow-xl"
                  style={{ aspectRatio: '350 / 489' }}
                >
                  <img
                    src={prabhupadaImage}
                    alt="Шрила Прабхупада"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
