import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Table, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    title: 'Поддержать проект',
    donationsHelpTitle: 'Пожертвования помогают:',
    donationsHelpText:
      'арендовать дом, проводить программы, готовить прасад, украшать алтарь, поддерживать чистоту и оборудование.',
    paymentMethodsTitle: 'Способы превода',
    paymentMethods: [
      { id: 'crypto' as const, title: 'Криптовалюта', description: 'USDT/USDC/BTC и др.' },
      { id: 'sbp' as const, title: 'СБП', description: 'быстрые переводы внутри РФ' },
      { id: 'swift' as const, title: 'SWIFT', description: 'международный банковский перевод' }
    ],
    paymentMethodDetails: {
      crypto: {
        title: 'Криптовалюта',
        description: 'Реквизиты для перевода в USDT (TRC-20) через биржу ByBit.',
        details: [
          { label: 'ByBit UID', value: '115189352' },
          { label: 'USDT TRC-20', value: 'TUTZBW9sH341B7Rz43UnTU9sjVdbTCN1F5' }
        ],
        note: {
          textBefore: 'После перевода сообщите ',
          linkLabel: 't.me/artarteemev',
          linkUrl: 'https://t.me/artarteemev'
        }
      },
      sbp: {
        title: 'СБП',
        description: 'Быстрый перевод по номеру телефона через Систему быстрых платежей.',
        details: [
          { label: 'Телефон', value: '+7 995 597-01-08' },
          { label: 'Банк', value: 'Яндекс Банк / Сбербанк' }
        ],
        note: {
          textBefore: 'После перевода сообщите ',
          linkLabel: 't.me/artarteemev',
          linkUrl: 'https://t.me/artarteemev'
        }
      },
      swift: {
        title: 'SWIFT',
        description: 'Международный банковский перевод в долларах США.',
        details: [
          { label: 'IBAN', value: 'GE73TB7418145068100009USD' },
          { label: 'SWIFT', value: 'TBCBGE22' },
          { label: 'Получатель', value: 'Liubov Verba' }
        ],
        note: {
          textBefore: 'После перевода сообщите ',
          linkLabel: 't.me/artarteemev',
          linkUrl: 'https://t.me/artarteemev'
        }
      }
    },
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
    closePaymentDetailsAria: 'Закрыть реквизиты',
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
      { id: 'crypto' as const, title: 'Cryptocurrency', description: 'USDT/USDC/BTC and more' },
      { id: 'sbp' as const, title: 'FPS', description: 'instant transfers within Russia' },
      { id: 'swift' as const, title: 'SWIFT', description: 'international bank transfer' }
    ],
    paymentMethodDetails: {
      crypto: {
        title: 'Cryptocurrency',
        description: 'Transfer USDT (TRC-20) via ByBit using the details below.',
        details: [
          { label: 'ByBit UID', value: '115189352' },
          { label: 'USDT TRC-20', value: 'TUTZBW9sH341B7Rz43UnTU9sjVdbTCN1F5' }
        ],
        note: {
          textBefore: 'After transferring, please message ',
          linkLabel: 't.me/artarteemev',
          linkUrl: 'https://t.me/artarteemev'
        }
      },
      sbp: {
        title: 'FPS transfer',
        description: 'Instant transfer via the Faster Payments System (Russia).',
        details: [
          { label: 'Phone number', value: '+7 995 597-01-08' },
          { label: 'Bank', value: 'Yandex Bank / Sberbank' }
        ],
        note: {
          textBefore: 'After transferring, please message ',
          linkLabel: 't.me/artarteemev',
          linkUrl: 'https://t.me/artarteemev'
        }
      },
      swift: {
        title: 'SWIFT transfer',
        description: 'International bank transfer in USD.',
        details: [
          { label: 'IBAN', value: 'GE73TB7418145068100009USD' },
          { label: 'SWIFT', value: 'TBCBGE22' },
          { label: 'Beneficiary', value: 'Liubov Verba' }
        ],
        note: {
          textBefore: 'After transferring, please message ',
          linkLabel: 't.me/artarteemev',
          linkUrl: 'https://t.me/artarteemev'
        }
      }
    },
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
    closePaymentDetailsAria: 'Close payment details',
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
    paymentMethodDetails,
    supportLevelsTitle,
    supportLevels,
    transparencyTitle,
    transparencyIntro,
    transparencyDetails,
    transparencyButton,
    transparencyLink,
    targetedTitle,
    donationCategories,
    closePaymentDetailsAria
  } = translations[language];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    (typeof paymentMethods)[number]['id'] | null
  >(null);
  const activeMethod =
    selectedPaymentMethod !== null ? paymentMethodDetails[selectedPaymentMethod] : null;

  useEffect(() => {
    if (selectedPaymentMethod) {
      document.documentElement.classList.add('overflow-hidden');
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setSelectedPaymentMethod(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.documentElement.classList.remove('overflow-hidden');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    document.documentElement.classList.remove('overflow-hidden');
    return undefined;
  }, [selectedPaymentMethod]);

  const handleOpenPaymentDetails = (methodId: typeof paymentMethods[number]['id']) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleClosePaymentDetails = () => {
    setSelectedPaymentMethod(null);
  };

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
                <motion.button
                  type="button"
                  key={method.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenPaymentDetails(method.id)}
                  className="hover:bg-white p-4 rounded-lg transition-colors cursor-pointer text-left w-full border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#73729b] focus-visible:border-[#73729b]"
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
            <div className="grid grid-cols-2 gap-4 mb-8">
              {supportLevels.map((level, index) => (
                <motion.a
                  href="http://boosty.to/omhome"
                  target="_blank"
                  rel="noopener noreferrer"
                  key={level.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#73729b]"
                  aria-label={`${level.title} — ${level.amount}`}
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
                rel="noopener noreferrer"
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

      {activeMethod ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={handleClosePaymentDetails}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-lg w-full bg-white rounded-2xl p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleClosePaymentDetails}
              className="absolute top-4 right-4 p-2 rounded-full text-[#73729b] hover:bg-[#f8f6f3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#73729b]"
              aria-label={closePaymentDetailsAria}
            >
              <X size={20} />
            </button>
            <h4 className="text-2xl font-bold text-[#241f74] mb-3">{activeMethod.title}</h4>
            <p className="text-base text-black leading-relaxed mb-4">{activeMethod.description}</p>
            <div className="space-y-4 mb-4">
              {activeMethod.details.map((detail) => (
                <div key={detail.label} className="bg-[#f8f6f3] rounded-xl p-4">
                  <p className="text-sm uppercase tracking-wide text-[#73729b] mb-1">{detail.label}</p>
                  <p className="text-lg font-semibold text-black break-words">{detail.value}</p>
                </div>
              ))}
            </div>
            {activeMethod.note ? (
              <p className="text-sm text-[#4b4a73] leading-relaxed">
                {activeMethod.note.textBefore}
                <a
                  href={activeMethod.note.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#241f74]"
                >
                  {activeMethod.note.linkLabel}
                </a>
                .
              </p>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
