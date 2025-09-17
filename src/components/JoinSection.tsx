import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Sparkles, Coffee, Heart, HandHeart, Music, MessageCircle, Package, Leaf } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import imgRectangle33 from 'figma:asset/7079ed6ac33259adcd696c14440f8602d1e716fc.png';

const icons = {
  volunteer: <HandHeart className="text-[#86af8d]" size={48} />,
  lead: <Music className="text-[#86af8d]" size={48} />,
  support: <Package className="text-[#86af8d]" size={48} />,
  vegetarian: <Leaf className="text-[#73729b]" size={32} />,
  clean: <Sparkles className="text-[#73729b]" size={32} />,
  kitchen: <Coffee className="text-[#73729b]" size={32} />,
  communication: <MessageCircle className="text-[#73729b]" size={32} />,
  care: <Heart className="text-[#73729b]" size={32} />
} as const;

const translations = {
  ru: {
    principlesTitle: 'Принципы пространства',
    principlesLink: 'Подробнее о правилах и быте',
    joinTitle: 'Как присоединиться',
    heroText: 'Приехать в Чиангмай и послужить в OmHome',
    participationTitle: 'Варианты участия:',
    cta: 'Хочу участвовать',
    principles: [
      { title: 'Без мяса, алкоголя, курения.', icon: icons.vegetarian },
      { title: 'Чистота и уважение к общим пространствам.', icon: icons.clean },
      {
        title: 'Разделение кухонной утвари для прасада и личной еды; отдельные зоны хранения.',
        icon: icons.kitchen
      },
      {
        title: 'Открытая коммуникация и регулярные собрания для согласования вопросов.',
        icon: icons.communication
      },
      { title: 'Мягкое и принимающее отношение к людям и их пути.', icon: icons.care }
    ],
    participationOptions: [
      {
        title: 'Волонтёрить:',
        description: 'организация событий, кухня/прасад, музыка, дизайн/медиа, перевод, техподдержка, маркетинг',
        icon: icons.volunteer
      },
      {
        title: 'Вести инициативы:',
        description: 'нама‑хатта, киртаны, бхакти‑врикша, книжный клуб, йога, мастер‑класс',
        icon: icons.lead
      },
      {
        title: 'Помочь ресурсами:',
        description: 'оборудование, мебель, расходники, продукты',
        icon: icons.support
      }
    ]
  },
  en: {
    principlesTitle: 'House principles',
    principlesLink: 'Learn more about the guidelines',
    joinTitle: 'How to join',
    heroText: 'Come to Chiang Mai and serve at OmHome',
    participationTitle: 'Ways to get involved:',
    cta: "I want to participate",
    principles: [
      { title: 'No meat, alcohol, or smoking.', icon: icons.vegetarian },
      { title: 'Cleanliness and respect for shared spaces.', icon: icons.clean },
      {
        title: 'Separate kitchenware for prasadam and personal food; dedicated storage zones.',
        icon: icons.kitchen
      },
      {
        title: 'Open communication and regular meetings to coordinate questions.',
        icon: icons.communication
      },
      { title: 'A gentle, welcoming attitude to everyone and their journey.', icon: icons.care }
    ],
    participationOptions: [
      {
        title: 'Volunteer:',
        description: 'event organisation, kitchen/prasadam, music, design/media, translation, tech support, outreach',
        icon: icons.volunteer
      },
      {
        title: 'Lead initiatives:',
        description: 'nama-hatta, kirtans, bhakti-vriksha, book club, yoga, workshop',
        icon: icons.lead
      },
      {
        title: 'Support with resources:',
        description: 'equipment, furniture, supplies, groceries',
        icon: icons.support
      }
    ]
  }
} as const;

export function JoinSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { principlesTitle, principlesLink, joinTitle, heroText, participationTitle, cta, principles, participationOptions } =
    translations[language];

  return (
    <section id="join" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div id="principles" className="-mt-24 pt-24" aria-hidden="true" />
        {/* Principles Section */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-['Menorah_Grotesk:Medium'] text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {principlesTitle}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#f8f6f3] transition-colors"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#f8f6f3] rounded-full flex-shrink-0">
                {principle.icon}
              </div>
              <p className="text-xl text-black leading-relaxed">{principle.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <a href="#" className="text-xl text-[#241f74] underline hover:text-[#73729b] transition-colors">
            {principlesLink}
          </a>
        </motion.div>

        {/* Join Section */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {joinTitle}
        </motion.h2>

        {/* Hero Image with text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl mb-12"
          style={{ backgroundImage: `url(${imgRectangle33})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center text-white max-w-4xl px-4"
            >
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-menorah leading-tight">{heroText}</h3>
            </motion.div>
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-2xl font-bold text-[#73729b] mb-8"
        >
          {participationTitle}
        </motion.h3>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {participationOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#f8f6f3] p-6 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full mb-4 shadow-md">
                {option.icon}
              </div>
              <h4 className="text-xl font-bold text-black mb-3">{option.title}</h4>
              <p className="text-lg text-black leading-relaxed">{option.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 2.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(115, 114, 155, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#73729b] text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#5a5982]"
          >
            {cta}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
