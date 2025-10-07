import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import * as React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import imgRectangle16 from 'figma:asset/e5af353556f0ccc88d364bf9e9de41dab821cb94.png';
import imgRectangle17 from 'figma:asset/08a25526285379767f1b263f0136d84372b8d790.png';

const translations = {
  ru: {
    title: 'Миссия и подход',
    missionTitle: 'Наша миссия —',
    missionDescription:
      'распространять знание о вайшнавской культуре, устанавливая дружеские отношения и заботу. Мы приглашаем «обычных» людей через близкие форматы — игры, кино, йогу — и даём возможность постепенно и добровольно соприкоснуться с духовными практиками: пением мантр, обсуждением философии, служением.',
    atmosphereTitle: 'Атмосфера:',
    atmosphereDescription:
      'семейная, принимающая, без осуждения. Мы ставим отношения выше формальностей — и потому правила поддерживаются мягко и с уважением к человеку.'
  },
  en: {
    title: 'Mission and approach',
    missionTitle: 'Our mission is',
    missionDescription:
      'to share knowledge of Vaishnava culture through friendship and care. We invite “ordinary” people with familiar formats—games, films, yoga—and give them a gradual, voluntary way to experience spiritual practices: chanting mantras, discussing philosophy, and serving.',
    atmosphereTitle: 'Atmosphere:',
    atmosphereDescription:
      'family-like, welcoming, and free from judgement. Relationships come before formalities, so guidelines are kept gently and with respect for each person.'
  }
} as const;

export function MissionSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, missionTitle, missionDescription, atmosphereTitle, atmosphereDescription } = translations[language];

  return (
    <section id="mission" ref={ref} className="py-16 lg:py-24 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl"
              style={{ backgroundImage: `url(${imgRectangle16})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-black">{missionTitle}</h3>
            <p className="text-xl text-black leading-relaxed">{missionDescription}</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="order-2 lg:order-1 space-y-6"
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-black">{atmosphereTitle}</h3>
            <p className="text-xl text-black leading-relaxed">{atmosphereDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="order-1 lg:order-2 relative"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl"
              style={{ backgroundImage: `url(${imgRectangle17})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
