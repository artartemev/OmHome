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
          'OmHome — социальный проповеднический вайшнавский проект. Наша цель — поддерживать и развивать проповедь в местах, где нет активных общин, но есть энтузиазм семей преданных.'
      },
      what: {
        title: 'Что делаем:',
        description:
          'соединяем духовные программы (киртаны, лекции, санги, нама‑хатты) с социальными событиями (кинопоказы, настольные игры, йога, мастер‑классы), чтобы мягко знакомить людей с вайшнавской культурой.'
      },
      how: {
        title: 'Как устроено:',
        description:
          'это не просто центр — это дом, где живут преданные и где естественно рождаются отношения, забота и служение.'
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
          'OmHome is a social Vaishnava outreach project. Our goal is to support and develop preaching where there are no active communities yet, but devotee families are eager to serve.'
      },
      what: {
        title: 'What we do:',
        description:
          'We combine spiritual programs (kirtans, lectures, sangas, nama-hattas) with social events (movie nights, board games, yoga, workshops) to gently introduce people to Vaishnava culture.'
      },
      how: {
        title: 'How it works:',
        description:
          "It's not just a center—it's a home where devotees live, and relationships, care, and service grow naturally."
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
