import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { MessageCircle, Phone, Instagram, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: 'Контакты',
    contacts: [
      {
        category: 'Артём',
        items: [
          { icon: <MessageCircle size={24} />, label: 'Telegram', link: '#' },
          { icon: <Phone size={24} />, label: 'WhatsApp', link: '#' }
        ]
      },
      {
        category: 'Социальные сети',
        items: [
          { icon: <MessageCircle size={24} />, label: 'Канал Telegram', link: '#' },
          { icon: <Instagram size={24} />, label: 'Instagram', link: '#' }
        ]
      },
      {
        category: 'Адрес:',
        items: [{ icon: <MapPin size={24} />, label: 'Google Maps', link: '#' }]
      }
    ],
    description:
      'Мы всегда открыты для диалога и новых знакомств. Свяжитесь с нами любым удобным способом — будем рады познакомиться и рассказать больше о проекте!'
  },
  en: {
    title: 'Contacts',
    contacts: [
      {
        category: 'Artyom',
        items: [
          { icon: <MessageCircle size={24} />, label: 'Telegram', link: '#' },
          { icon: <Phone size={24} />, label: 'WhatsApp', link: '#' }
        ]
      },
      {
        category: 'Social media',
        items: [
          { icon: <MessageCircle size={24} />, label: 'Telegram channel', link: '#' },
          { icon: <Instagram size={24} />, label: 'Instagram', link: '#' }
        ]
      },
      {
        category: 'Address:',
        items: [{ icon: <MapPin size={24} />, label: 'Google Maps', link: '#' }]
      }
    ],
    description:
      'We are always open to dialogue and new connections. Reach out in any convenient way—we’ll be glad to meet you and share more about the project!'
  }
} as const;

export function ContactsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const { title, contacts, description } = translations[language];

  return (
    <section id="contacts" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {contacts.map((contactGroup, groupIndex) => (
            <motion.div
              key={contactGroup.category}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + groupIndex * 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-semibold text-black mb-6">{contactGroup.category}</h3>

              <div className="space-y-3">
                {contactGroup.items.map((item, itemIndex) => (
                  <motion.a
                    key={`${contactGroup.category}-${item.label}`}
                    href={item.link}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + groupIndex * 0.2 + itemIndex * 0.1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center gap-3 text-xl text-black hover:text-[#73729b] transition-colors p-3 rounded-lg hover:bg-[#f8f6f3] group"
                  >
                    <div className="text-[#73729b] group-hover:scale-110 transition-transform">{item.icon}</div>
                    <span className="underline decoration-solid">{item.label}</span>
                    <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="bg-[#f8f6f3] p-8 rounded-2xl max-w-2xl mx-auto">
            <p className="text-lg text-black leading-relaxed">{description}</p>
          </div>
        </motion.div>

        {/* Floating particles around contacts */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView
              ? {
                  opacity: [0, 1, 0],
                  y: [0, -50],
                  x: [0, Math.random() * 40 - 20]
                }
              : {}}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-[#73729b]/40 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`
            }}
          />
        ))}
      </div>
    </section>
  );
}
