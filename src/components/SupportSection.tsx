import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ExternalLink, Table } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: 'Поддержать проект',
    donationsHelpTitle: 'Пожертвования помогают:',
    donationsHelpText:
      'арендовать дом, проводить программы, готовить прасад, украшать алтарь, поддерживать чистоту и оборудование.',
    paymentMethodsTitle: 'Способы превода',
    paymentMethods: [
      { title: 'Криптовалюта', description: 'USDT/USDC/BTC и др.' },
      { title: 'СБП', description: 'быстрые переводы внутри РФ' },
      { title: 'SWIFT', description: 'международный банковский перевод' }
    ],
    supportLevelsTitle: 'Уровни ежемесячной поддержки',
    supportLevels: [
      { title: 'Друг OmHome', amount: '300 ฿ / 500 ₽ / $10' },
      { title: 'Поддерживающий', amount: '900 ฿ / 1 500 ₽ / $30' },
      { title: 'Со‑творец', amount: '1 800 ฿ / 3 000 ₽ / $60' },
      { title: 'Хранитель', amount: '3 600 ฿ / 6 000 ₽ / $120' }
    ],
    transparencyTitle: 'Прозрачность и отчётность',
    transparencyIntro: 'Ежемесячный отчёт',
    transparencyDetails: 'поступления/расходы по статьям (аренда, прасад, алтарь, быт, оборудование)',
    transparencyButton: 'Публичная сводная таблица',
    targetedTitle: 'Целевые пожертвования',
    donationCategories: [
      {
        emoji: '🍲',
        title: 'На прасад',
        description: 'продукты, специи, одноразовая/многоразовая посуда, расходники.',
        quote: '«Ваше пожертвование — это чья‑то тёплая тарелка прасада и разговор по душам после программы».',
        color: 'bg-[#86af8d]'
      },
      {
        emoji: '🏡',
        title: 'Аренда дома',
        description: 'ежемесячные платежи за дом и коммунальные.',
        quote: '«Стабильный дом — стабильные программы».',
        color: 'bg-[#afaf86]'
      },
      {
        emoji: '🪔',
        title: 'Украшение алтаря',
        description: 'цветы, ткань, лампады, благовония, парафирналии.',
        quote: '«Помогите сделать алтарную ещё красивее и чище».',
        color: 'bg-[#86afad]'
      },
      {
        emoji: '🧺',
        title: 'Бытовые расходы',
        description: 'чистящие средства, ремонт мелочей, расходники для кухни и уборки.',
        quote: '«Незаметные, но необходимые траты на порядок и уют».',
        color: 'bg-[#a386af]'
      }
    ]
  },
  en: {
    title: 'Support the project',
    donationsHelpTitle: 'Donations help us to:',
    donationsHelpText:
      'rent the house, host programs, cook prasadam, decorate the altar, and keep everything clean and equipped.',
    paymentMethodsTitle: 'Payment methods',
    paymentMethods: [
      { title: 'Cryptocurrency', description: 'USDT/USDC/BTC and more' },
      { title: 'FPS', description: 'instant transfers within Russia' },
      { title: 'SWIFT', description: 'international bank transfer' }
    ],
    supportLevelsTitle: 'Monthly support tiers',
    supportLevels: [
      { title: 'Friend of OmHome', amount: '300 ฿ / 500 ₽ / $10' },
      { title: 'Supporter', amount: '900 ฿ / 1 500 ₽ / $30' },
      { title: 'Co-creator', amount: '1 800 ฿ / 3 000 ₽ / $60' },
      { title: 'Guardian', amount: '3 600 ฿ / 6 000 ₽ / $120' }
    ],
    transparencyTitle: 'Transparency and reporting',
    transparencyIntro: 'Monthly report',
    transparencyDetails: 'income and expenses by category (rent, prasadam, altar, household, equipment)',
    transparencyButton: 'Public summary spreadsheet',
    targetedTitle: 'Targeted donations',
    donationCategories: [
      {
        emoji: '🍲',
        title: 'Prasadam',
        description: 'groceries, spices, reusable/disposable dishes, supplies.',
        quote: '“Your donation becomes a warm plate of prasadam and a heartfelt talk after the program.”',
        color: 'bg-[#86af8d]'
      },
      {
        emoji: '🏡',
        title: 'House rent',
        description: 'monthly rent and utilities.',
        quote: '“A stable house means stable programs.”',
        color: 'bg-[#afaf86]'
      },
      {
        emoji: '🪔',
        title: 'Altar decoration',
        description: 'flowers, fabrics, lamps, incense, paraphernalia.',
        quote: '“Help make the altar even more beautiful and pure.”',
        color: 'bg-[#86afad]'
      },
      {
        emoji: '🧺',
        title: 'Household needs',
        description: 'cleaning supplies, small repairs, kitchen and cleaning consumables.',
        quote: '“Invisible but essential expenses for order and coziness.”',
        color: 'bg-[#a386af]'
      }
    ]
  }
} as const;

export function SupportSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const {
    title,
    donationsHelpTitle,
    donationsHelpText,
    paymentMethodsTitle,
    paymentMethods,
    supportLevelsTitle,
    supportLevels,
    transparencyTitle,
    transparencyIntro,
    transparencyDetails,
    transparencyButton,
    targetedTitle,
    donationCategories
  } = translations[language];

  return (
    <section id="support" ref={ref} className="py-16 lg:py-24 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          {title}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#73729b] mb-6">{donationsHelpTitle}</h3>
            <p className="text-xl text-black leading-relaxed mb-8">{donationsHelpText}</p>

            <h3 className="text-2xl font-bold text-[#73729b] mb-6">{paymentMethodsTitle}</h3>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="hover:bg-white p-4 rounded-lg transition-colors cursor-pointer"
                >
                  <h4 className="text-xl font-bold text-[#241f74] underline mb-1">{method.title}</h4>
                  <p className="text-lg text-black">{method.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-[#73729b] mb-6">{supportLevelsTitle}</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {supportLevels.map((level, index) => (
                <motion.div
                  key={level.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                >
                  <h4 className="text-lg font-bold text-[#241f74] underline mb-2">{level.title}</h4>
                  <p className="text-sm text-black">{level.amount}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h4 className="text-xl font-bold text-[#73729b] mb-4">{transparencyTitle}</h4>
              <p className="text-lg text-black leading-relaxed mb-4">
                <span className="font-bold">{transparencyIntro}:</span> {transparencyDetails}
              </p>
              <button className="flex items-center gap-2 text-[#4b4a73] underline hover:text-[#73729b] transition-colors">
                <Table size={20} />
                {transparencyButton}
                <ExternalLink size={16} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Donation Categories */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-2xl font-bold text-[#73729b] mb-8 text-center"
        >
          {targetedTitle}
        </motion.h3>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {donationCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${category.color} text-white p-6 rounded-xl shadow-lg cursor-pointer`}
            >
              <div className="text-5xl mb-4 text-center">{category.emoji}</div>
              <h4 className="text-xl font-bold text-center mb-4">{category.title}</h4>
              <p className="text-base leading-relaxed mb-4">{category.description}</p>
              <p className="text-base font-semibold leading-relaxed">{category.quote}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
