import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

import mukundaImage from '../assets/seniors_support/mukunda.png';
import kesavaImage from '../assets/seniors_support/kesava.png';
import acyutatmaImage from '../assets/seniors_support/acyutatma.jpg';
import vatsalaImage from '../assets/seniors_support/vatsala.png';
import prabhupadaImage from '../assets/seniors_support/prabhupada.jpg';

const translations = {
  ru: {
    title: 'Взаимодействие со старшими',
    description:
      'Мы действуем в духе уважения к старшим вайшнавам и стремимся к благословениям GBC и местной ятры, следуя их наставлениям. В новых регионах мы заранее делимся планами, обсуждаем формат служения и выстраиваем сотрудничество.',
    seniors: [
      { image: mukundaImage, name: 'Мукунда Мурари прабху', role: 'наставиник проекта' },
      { image: kesavaImage, name: 'Бхакти Бхагаватамрита Кешава Махарадж', role: 'наставиник проекта в Батуми' },
      { image: acyutatmaImage, name: 'Ачьютатми прабху', role: 'доброжелатель проекта' },
      { image: vatsalaImage, name: 'Ватсала прабху', role: 'доброжелатель проекта' },
      { image: prabhupadaImage, name: 'Шрила Прабхупада', role: 'Ачарья-основатель ИСККОН' }
    ]
  },
  en: {
    title: 'Working with senior devotees',
    description:
      'We act with respect for senior Vaishnavas, seeking the blessings of the GBC and the local yatra while following their guidance. In new regions we share our plans in advance, discuss the service format, and build cooperation.',
    seniors: [
      { image: mukundaImage, name: 'Mukunda Murari Prabhu', role: 'Project mentor' },
      { image: kesavaImage, name: 'Bhakti Bhagavatamrita Keshava Maharaj', role: 'Project mentor in Batumi' },
      { image: acyutatmaImage, name: 'Acyutatma Prabhu', role: 'Project well-wisher' },
      { image: vatsalaImage, name: 'Vatsala Prabhu', role: 'Project well-wisher' },
      { image: prabhupadaImage, name: 'Srila Prabhupada', role: 'Founder-Ācārya of ISKCON' }
    ]
  }
} as const;

export function AuthoritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, description, seniors } = translations[language];

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
            className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3 justify-items-center"
          >
            {seniors.map(({ image, name, role }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="relative w-full max-w-[396px]"
                style={{ aspectRatio: '396 / 652' }}
              >
                <div className="absolute inset-0 rounded-[180px] overflow-hidden shadow-[0_12px_30px_rgba(115,114,155,0.15)]">
                  <img
                    src={image}
                    alt={name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[151px] bg-white flex flex-col items-center justify-center px-6">
                    <p className="font-menorah text-2xl leading-9 text-black text-center">{name}</p>
                    <p className="font-menorah text-lg leading-5 text-black text-center mt-3">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
