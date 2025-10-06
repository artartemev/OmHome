import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import acyutatmaImage from '../assets/seniors_support/acyutatma.jpg';
import kesavaImage from '../assets/seniors_support/kesava.png';
import mukundaImage from '../assets/seniors_support/mukunda.png';
import prabhupadaImage from '../assets/seniors_support/prabhupada.jpg';
import vatsalaImage from '../assets/seniors_support/vatsala.png';

const translations = {
  ru: {
    title: 'Взаимодействие со старшими',
    description:
      'Мы действуем в духе уважения к старшим вайшнавам и стремимся к благословениям GBC и местной ятры, следуя их наставлениям. В новых регионах мы заранее делимся планами, обсуждаем формат служения и выстраиваем сотрудничество.'
  },
  en: {
    title: 'Working with senior devotees',
    description:
      'We act with deep respect for senior Vaishnavas and seek the blessings of the GBC and the local yatra by following their guidance. In new regions we share plans in advance, discuss the service format, and build cooperation.'
  }
} as const;

const mentors = [
  {
    image: mukundaImage,
    translations: {
      ru: { name: 'Мукунда Мурари прабху', role: 'наставник проекта' },
      en: { name: 'Mukunda Murari Prabhu', role: 'Project mentor' }
    }
  },
  {
    image: kesavaImage,
    translations: {
      ru: { name: 'Бхакти Бхагаватамрита Кешава Махарадж', role: 'наставник проекта в Батуми' },
      en: { name: 'Bhakti Bhagavatamrita Keshava Maharaj', role: 'Project mentor in Batumi' }
    }
  },
  {
    image: acyutatmaImage,
    translations: {
      ru: { name: 'Ачьютатма прабху', role: 'доброжелатель проекта' },
      en: { name: 'Acyutatma Prabhu', role: 'Project well-wisher' }
    }
  },
  {
    image: vatsalaImage,
    translations: {
      ru: { name: 'Ватсала прабху', role: 'доброжелатель проекта' },
      en: { name: 'Vatsala Prabhu', role: 'Project well-wisher' }
    }
  },
  {
    image: prabhupadaImage,
    translations: {
      ru: { name: 'Шрила Прабхупада', role: 'Ачарья Основатель ИСККОН' },
      en: { name: 'Śrīla Prabhupāda', role: 'Founder-Ācārya of ISKCON' }
    }
  }
] as const;

export function AuthoritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, description } = translations[language];

  return (
    <section id="reports" ref={ref} className="py-12 lg:py-20 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-12 text-center lg:text-left max-w-4xl"
        >
          {title}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-black leading-relaxed">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8 place-items-center"
          >
            {mentors.map((mentor, index) => {
              const { name, role } = mentor.translations[language];

              return (
                <motion.figure
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-lg bg-white">
                    <img
                      src={mentor.image}
                      alt={language === 'ru' ? `Фото ${name}` : `Photo of ${name}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <figcaption className="-mt-8 w-40 sm:w-44 bg-white px-4 py-3 rounded-full shadow-md text-center">
                    <p className="font-menorah text-sm text-black leading-tight">{name}</p>
                    <p className="text-xs text-[#73729b] mt-1 leading-snug">{role}</p>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
