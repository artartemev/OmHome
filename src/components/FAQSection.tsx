import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: 'FAQ',
    subtitle: 'для участников и жертвователей',
    faqData: [
      {
        question: 'Кто стоит за проектом OmHome?',
        answer:
          'Команда преданных, которые живут и служат в доме‑пространстве. Инициатор проекта — Артём; к проекту присоединяются семейные пары и друзья в роли волонтёров и координаторов.'
      },
      {
        question: 'Какова главная цель OmHome?',
        answer:
          'Распространение вайшнавской культуры через отношения и заботу: мы мягко знакомим людей с практиками через социальные и духовные программы.'
      },
      {
        question: 'Как формируются расходы и на что идут пожертвования?',
        answer:
          'Основные статьи: аренда дома, прасад, украшение алтаря, быт и хознужды, оборудование и медиа. Доступны целевые пожертвования по каждой статье.'
      },
      {
        question: 'Есть ли ежемесячные доноры и отчёты?',
        answer:
          'Да. Мы поощряем регулярную поддержку и публикуем ежемесячные отчёты (сводная таблица + краткая записка о служении).'
      },
      {
        question: 'Могу ли я помочь не деньгами?',
        answer:
          'Конечно: кухня/прасад, музыка и звук, медиа/дизайн, маркетинг и афиши, перевод, техподдержка, логистика, закупки, уборка.'
      },
      {
        question: 'Можно ли масштабировать OmHome в другой город?',
        answer:
          'Да. Мы делимся гайдом, помогаем с методикой и принципами, консультируем по выбору дома и выстраиванию команды.'
      },
      {
        question: 'Как вы взаимодействуете со старшими и ятрой?',
        answer:
          'Мы заранее обсуждаем планы, ищем благословения и поддерживаем регулярную коммуникацию с руководством ятры и старшими преданными.'
      },
      {
        question: 'Какие ценности в быту у жителей?',
        answer:
          'Чистота, уважение, честность, трезвость; разделение кухонной утвари, открытые встречи для согласования вопросов и бережное разрешение конфликтов.'
      },
      {
        question: 'Что значит «присоединиться» на практике?',
        answer:
          'Вы можете пожить в доме, волонтёрить, вести инициативы (нама‑хатта/книжный клуб/йога), помогать ресурсами. Заполните короткую форму — и мы свяжемся с вами.'
      },
      {
        question: 'Как связаться с ответственными?',
        answer:
          'Кнопка «Контакты»: Telegram/WhatsApp, email, а также контакт ответственного за финансы.'
      }
    ]
  },
  en: {
    title: 'FAQ',
    subtitle: 'for participants and supporters',
    faqData: [
      {
        question: 'Who is behind OmHome?',
        answer:
          'A team of devotees who live and serve in the house space. The project was initiated by Artyom; devotee families and friends join as volunteers and coordinators.'
      },
      {
        question: 'What is the main goal of OmHome?',
        answer:
          'To spread Vaishnava culture through relationships and care. We gently introduce people to the practice via social and spiritual programs.'
      },
      {
        question: 'How are expenses formed and where do donations go?',
        answer:
          'Key categories: house rent, prasadam, altar decoration, household needs, equipment, and media. Targeted donations are available for each category.'
      },
      {
        question: 'Do you have monthly donors and reports?',
        answer:
          'Yes. We encourage regular support and publish monthly reports (summary spreadsheet plus a short service note).'
      },
      {
        question: 'Can I help without money?',
        answer:
          'Absolutely: kitchen/prasadam, music and sound, media/design, marketing and posters, translation, tech support, logistics, purchasing, cleaning.'
      },
      {
        question: 'Can OmHome be replicated in another city?',
        answer:
          'Yes. We share our guide, help with methods and principles, and advise on choosing a house and building a team.'
      },
      {
        question: 'How do you interact with senior devotees and the yatra?',
        answer:
          'We discuss plans in advance, seek blessings, and keep regular communication with the yatra leadership and senior devotees.'
      },
      {
        question: 'What daily values do residents follow?',
        answer:
          'Cleanliness, respect, honesty, sobriety; separate kitchenware, open meetings for coordination, and gentle conflict resolution.'
      },
      {
        question: 'What does “joining” look like in practice?',
        answer:
          'You can stay in the house, volunteer, lead initiatives (nama-hatta/book club/yoga), or help with resources. Fill out a short form and we will get in touch.'
      },
      {
        question: 'How can I contact the team?',
        answer:
          'Use the “Contacts” button: Telegram/WhatsApp, email, plus the finance contact.'
      }
    ]
  }
} as const;

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const { title, subtitle, faqData } = translations[language];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-4 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl lg:text-4xl text-black mb-16 text-center lg:text-left max-w-4xl"
        >
          {subtitle}
        </motion.p>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="border-b-2 border-[#73729b] bg-white"
            >
              <motion.button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left py-6 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="text-xl lg:text-2xl text-black pr-4 leading-relaxed">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={24} className="text-[#73729b]" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      exit={{ y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#f5f5f2] px-4 py-6"
                    >
                      <p className="text-lg lg:text-xl text-black leading-relaxed">{item.answer}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
