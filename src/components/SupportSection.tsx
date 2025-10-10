import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
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
      {
        title: 'Криптовалюта',
        description: 'USDT/USDC/BTC и др.',
        details: [
          'ByBit UID: 115189352',
          'USDT TRC20: TUTZBW9sH341B7Rz43UnTU9sjVdbTCN1F5'
        ],
        note: 'После перевода сообщите: t.me/artarteemev'
      },
      {
        title: 'СБП',
        description: 'быстрые переводы внутри РФ',
        details: [
          'Телефон: +7 995 597 0108',
          'Банки: Яндекс Банк / Сбербанк'
        ],
        note: 'После перевода сообщите: t.me/artarteemev'
      },
      {
        title: 'SWIFT',
        description: 'международный банковский перевод',
        details: [
          'IBAN: GE73TB7418145068100009USD',
          'SWIFT: TBCBGE22',
          'Получатель: Liubov Verba'
        ],
        note: 'После перевода сообщите: t.me/artarteemev'
      }
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
    transparencyLink: 'https://docs.google.com/spreadsheets/d/1gKSs7HlLdmP8QztPw4dCWq3Z_ci_Eh_1m7GP18JMTjM',
    paymentModalTitle: 'Реквизиты',
    paymentModalClose: 'Закрыть',
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
      {
        title: 'Cryptocurrency',
        description: 'USDT/USDC/BTC and more',
        details: [
          'ByBit UID: 115189352',
          'USDT TRC20: TUTZBW9sH341B7Rz43UnTU9sjVdbTCN1F5'
        ],
        note: 'After the transfer, message: t.me/artarteemev'
      },
      {
        title: 'SBP',
        description: 'instant transfers within Russia',
        details: [
          'Phone: +7 995 597 0108',
          'Banks: Yandex Bank / Sberbank'
        ],
        note: 'After the transfer, message: t.me/artarteemev'
      },
      {
        title: 'SWIFT',
        description: 'international bank transfer',
        details: [
          'IBAN: GE73TB7418145068100009USD',
          'SWIFT: TBCBGE22',
          'Beneficiary: Liubov Verba'
        ],
        note: 'After the transfer, message: t.me/artarteemev'
      }
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
    transparencyLink: 'https://docs.google.com/spreadsheets/d/1gKSs7HlLdmP8QztPw4dCWq3Z_ci_Eh_1m7GP18JMTjM',
    paymentModalTitle: 'Details',
    paymentModalClose: 'Close',
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

type PaymentMethod = (typeof translations)['ru']['paymentMethods'][number];

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
    transparencyLink,
    paymentModalTitle,
    paymentModalClose,
    targetedTitle,
    donationCategories
  } = translations[language];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleCloseModal = () => {
    setSelectedMethod(null);
  };

  const modalTitleId = 'support-payment-modal-title';

  return (
    <>
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
                  <motion.button
                    type="button"
                    key={method.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    onClick={() => handleSelectMethod(method)}
                    className="w-full text-left hover:bg-white p-4 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#73729b]/60"
                  >
                    <h4 className="text-xl font-bold text-[#241f74] underline mb-1">{method.title}</h4>
                    <p className="text-lg text-black">{method.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-[#73729b] mb-6">{supportLevelsTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {supportLevels.map((level, index) => (
                  <motion.a
                    key={level.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    href="http://boosty.to/omhomespace"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer block"
                  >
                    <h4 className="text-lg font-bold text-[#241f74] underline mb-2">{level.title}</h4>
                    <p className="text-sm text-black">{level.amount}</p>
                  </motion.a>
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
                <a
                  href={transparencyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[#4b4a73] underline hover:text-[#73729b] transition-colors"
                >
                  <Table size={20} />
                  {transparencyButton}
                  <ExternalLink size={16} />
                </a>
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

      {selectedMethod ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 py-6 sm:items-center">
          <button
            type="button"
            onClick={handleCloseModal}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label={paymentModalClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            className="relative w-full max-w-md sm:max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[min(90vh,38rem)]"
          >
            <div className="overflow-y-auto px-6 py-6 sm:py-8">
              <h4 id={modalTitleId} className="text-2xl font-bold text-[#241f74] mb-4">
                {paymentModalTitle} — {selectedMethod.title}
              </h4>
              <ul className="space-y-2 mb-6">
                {selectedMethod.details.map((detail) => (
                  <li key={detail} className="text-lg text-black leading-relaxed">
                    {detail}
                  </li>
                ))}
              </ul>
              {selectedMethod.note ? (
                <p className="text-base text-[#4b4a73] leading-relaxed">{selectedMethod.note}</p>
              ) : null}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#73729b]/10">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-base font-semibold text-white bg-[#73729b] rounded-lg hover:bg-[#4b4a73] transition-colors"
              >
                {paymentModalClose}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );

}
