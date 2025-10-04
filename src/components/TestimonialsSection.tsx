import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import * as React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: 'Почему это важно',
    impactPoints: [
      {
        title: 'Поддержка русскоязычных преданных:',
        description: 'дом, общение, служение, практика.'
      },
      {
        title: 'Реальные плоды:',
        description: 'новые гости возвращаются, интересуются практикой, присоединяются к программам.'
      },
      {
        title: 'Мягкая проповедь:',
        description: 'люди знакомятся с культурой через дружбу и заботу, а не через давление.'
      }
    ],
    testimonials: [
      {
        text: '«Здесь находишь друзей и поддержку. Исчезает чувство одиночества — появляется близость и смысл.»',
        author: 'Участник сообщества'
      },
      {
        text: '«Дом, порядок и забота о деталях — от алтаря до уборки. Хочется тоже взять ответственность и служить.»',
        author: 'Волонтёр проекта'
      },
      {
        text: '«Удивительно: где бы ни оказался, можно встретить это настроение и людей, с которыми хочешь идти дальше.»',
        author: 'Гость программ'
      }
    ]
  },
  en: {
    title: 'Why it matters',
    impactPoints: [
      {
        title: 'Support for Russian-speaking devotees:',
        description: 'a home, community, service, and practice.'
      },
      {
        title: 'Tangible results:',
        description: 'new guests return, get curious about the practice, and join the programs.'
      },
      {
        title: 'Gentle outreach:',
        description: 'people discover the culture through friendship and care instead of pressure.'
      }
    ],
    testimonials: [
      {
        text: '“Here you find friends and support. The feeling of loneliness disappears—you gain closeness and meaning.”',
        author: 'Community member'
      },
      {
        text: '“Home, order, and care for every detail—from the altar to cleaning. It makes you want to take responsibility and serve too.”',
        author: 'Project volunteer'
      },
      {
        text: '“It’s amazing: wherever you are, you can meet this mood and people you want to walk alongside.”',
        author: 'Program guest'
      }
    ]
  }
} as const;

export function TestimonialsSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, impactPoints, testimonials } = translations[language];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        {/* Impact Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-bold text-black mb-3">{point.title}</h3>
              <p className="text-lg text-black leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials - New Design */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.text}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#73729b] to-[#86af8d]" />

              {/* Quote */}
              <div className="text-center">
                <motion.p
                  className="mt-6 text-lg text-[#241f74] font-menorah leading-relaxed mb-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                >
                  {testimonial.text}
                </motion.p>

                {/* Author */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                >
                  <div className="w-12 h-0.5 bg-gradient-to-r from-[#73729b] to-[#86af8d] mx-auto mb-3" />
                  <p className="text-sm text-black/70 font-medium">{testimonial.author}</p>
                </motion.div>
              </div>

              {/* Floating decoration */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-[#73729b]/10 rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
