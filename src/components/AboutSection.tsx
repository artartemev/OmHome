import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: 'Коротко о проекте',
    sections: {
      who: {
        title: 'Кто мы:',
        description:
          'Мы находимся в Чианг Мае, Таиланд — у нас настоящий дом преданных: здесь постоянно живут вайшнавы, и вы тоже можете приехать пожить, послужить и вдохновиться вместе с нами.'
      },
      what: {
        title: 'Что делаем:',
        description:
          'проводим регулярные проповеднические программы: киртаны, лекции, санги, нама‑хатты, беседы по шастрам, встречи для гостей, семейные вечера, творческие мастер‑классы и служение в городе.'
      },
      how: {
        title: 'Как устроено:',
        description:
          'дом открыт для приезжающих преданных и интересующихся: мы встречаем лично, помогаем встроиться в ритм, вовлекаем в служение и поддерживаем заботой.'
      }
    },
    stats: [
      { number: '3+', label: 'года' },
      { number: '2', label: 'страны' },
      { number: '400+', label: 'встреч и программ' }
    ]
  },
  en: {
    title: 'About the project',
    sections: {
      who: {
        title: 'Who we are:',
        description:
          'We are based in Chiang Mai, Thailand — we have a real devotee home: Vaishnavas live here full-time, and you are welcome to visit, stay with us, serve, and find inspiration.'
      },
      what: {
        title: 'What we do:',
        description:
          'We host regular preaching programs: kirtans, lectures, sangas, nama-hattas, scripture discussions, gatherings for guests, family evenings, creative workshops, and city outreach service.'
      },
      how: {
        title: 'How it works:',
        description:
          "The home is open to visiting devotees and seekers: we greet everyone personally, help them settle into the rhythm, engage them in service, and surround them with care."
      }
    },
    stats: [
      { number: '3+', label: 'years' },
      { number: '2', label: 'countries' },
      { number: '400+', label: 'events and programs' }
    ]
  }
} as const;

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { language } = useLanguage();
  const { title, sections, stats } = translations[language];

  return (
    <section id="about" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-black mb-4">{sections.who.title}</h3>
            <p className="text-xl text-black leading-relaxed">{sections.who.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-black mb-4">{sections.what.title}</h3>
            <p className="text-xl text-black leading-relaxed">{sections.what.description}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:max-w-2xl mb-16"
        >
          <h3 className="text-2xl font-bold text-black mb-4">{sections.how.title}</h3>
          <p className="text-xl text-black leading-relaxed">{sections.how.description}</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#73729b] to-[#5a5982] text-white p-8 rounded-2xl shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2, type: 'spring' }}
                className="text-5xl lg:text-6xl font-menorah mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-xl uppercase tracking-wide font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
