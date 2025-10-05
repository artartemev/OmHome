import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
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
    title: 'Why this format',
    firstParagraph:
      'We deeply respect traditional forms of outreach—book distribution, harinams, public lectures. Thanks to these efforts, Srila Prabhupada’s mission has spread across the globe. At the same time, in some countries and cities (including Thailand) open book distribution can face legal restrictions, and holding harinams requires musicians and community support that are not always available at the beginning. That is why we began using alternative forms of sharing Krishna consciousness that gently invite people into association with devotees: movie nights with discussions on spiritual themes, board games that foster friendship and reflection, cozy lectures and conversations over prasadam, yoga, and cultural evenings.',
    secondParagraph:
      'Through these formats many people first hear the Hare Krishna mantra, learn about the philosophy of bhakti, and discover Srila Prabhupada’s books—after which they develop their own interest. In Georgia and Serbia this approach proved very fruitful: hundreds of people heard about Hare Krishna for the first time, came to kirtans, started reading Prabhupada’s books, and began supporting the devotees. Now we want to continue this mission in Chiang Mai with the same mood of service and care, following the principle of yukta-vairagya—using everything that helps people come closer to God.'
  }
} as const;

export function FormatSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, firstParagraph, secondParagraph } = translations[language];

  return (
    <section ref={ref} className="bg-[#e9e5e2] py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-[84px] leading-tight text-black mb-12 lg:mb-16"
        >
          {title}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          <div className="flex flex-col gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto lg:mx-0 w-full max-w-[360px] sm:max-w-[380px] lg:max-w-[396px] h-[360px] sm:h-[480px] lg:h-[652px] rounded-[160px] lg:rounded-[180px] overflow-hidden shadow-xl"
              style={{ backgroundImage: `url(${nityanandaImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />

            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-black font-menorah-normal text-left lg:text-right max-w-3xl lg:ml-auto"
            >
              {secondParagraph}
            </motion.p>
          </div>

          <div className="flex flex-col gap-10 lg:gap-16">
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-black font-menorah-normal max-w-3xl"
            >
              {firstParagraph}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mx-auto lg:mx-0 w-full max-w-[320px] sm:max-w-[340px] lg:max-w-[350px] h-[320px] sm:h-[400px] lg:h-[489px] rounded-[160px] lg:rounded-[180px] overflow-hidden shadow-xl"
              style={{ backgroundImage: `url(${prabhupadaImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
