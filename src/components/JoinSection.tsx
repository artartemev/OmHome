import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
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
    ],
    form: {
      title: 'Расскажите о себе',
      description: 'Оставьте контакты и пару слов о мотивации — мы свяжемся с вами и обсудим участие.',
      nameLabel: 'Имя',
      namePlaceholder: 'Например, Радха',
      phoneLabel: 'Телефон',
      phonePlaceholder: '+66 123 456 789',
      interestLabel: 'Что привлекает в проекте',
      interestPlaceholder: 'Поделитесь, что вас вдохновляет',
      participationLabel: 'Каким видите своё участие',
      participationPlaceholder: 'Расскажите, как хотите быть полезны',
      submit: 'Отправить заявку',
      submitting: 'Отправляем…',
      success: 'Спасибо! Мы получили вашу заявку и свяжемся в ближайшее время.',
      error: 'Не получилось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.',
      close: 'Закрыть'
    }
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
    ],
    form: {
      title: 'Tell us about yourself',
      description: 'Leave your contacts and a few words about your motivation — we will reach out to you to discuss the details.',
      nameLabel: 'Name',
      namePlaceholder: 'For example, Radha',
      phoneLabel: 'Phone',
      phonePlaceholder: '+66 123 456 789',
      interestLabel: 'What attracts you to the project',
      interestPlaceholder: 'Share what inspires you',
      participationLabel: 'How do you see your participation',
      participationPlaceholder: 'Tell us how you would like to help',
      submit: 'Send application',
      submitting: 'Sending…',
      success: 'Thank you! We have received your application and will contact you soon.',
      error: 'We could not send your application. Please try again or contact us directly.',
      close: 'Close'
    }
  }
} as const;

export function JoinSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  const {
    principlesTitle,
    principlesLink,
    joinTitle,
    heroText,
    participationTitle,
    cta,
    principles,
    participationOptions,
    form
  } = translations[language];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', interest: '', participation: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (isFormOpen) {
      document.documentElement.classList.add('overflow-hidden');
      return () => {
        document.documentElement.classList.remove('overflow-hidden');
      };
    }

    document.documentElement.classList.remove('overflow-hidden');
    return undefined;
  }, [isFormOpen]);

  const telegramConfig = useMemo(() => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    return { botToken, chatId };
  }, []);

  const handleOpenForm = () => {
    setSubmitStatus(null);
    setFormData({ name: '', phone: '', interest: '', participation: '' });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      setSubmitStatus('error');
      console.error('Telegram configuration is missing. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);

      const message = [
        language === 'ru' ? 'Новая заявка с сайта OmHome' : 'New application from the OmHome website',
        `${form.nameLabel}: ${formData.name}`,
        `${form.phoneLabel}: ${formData.phone}`,
        `${form.interestLabel}: ${formData.interest}`,
        `${form.participationLabel}: ${formData.participation}`
      ].join('\n');

      const response = await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: telegramConfig.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API responded with ${response.status}`);
      }

      setSubmitStatus('success');
      setFormData({ name: '', phone: '', interest: '', participation: '' });
    } catch (error) {
      console.error('Failed to send Telegram message', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            onClick={handleOpenForm}
            className="bg-[#73729b] text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#5a5982]"
          >
            {cta}
          </motion.button>
        </motion.div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseForm} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleCloseForm}
              className="absolute right-4 top-4 rounded-full bg-[#f3f1ee] px-4 py-2 text-sm font-semibold text-[#241f74] transition-colors hover:bg-[#e6e2df]"
            >
              {form.close}
            </button>

            <h3 className="mb-3 text-3xl font-menorah text-[#241f74]">{form.title}</h3>
            <p className="mb-6 text-base text-black/70">{form.description}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="join-name" className="text-sm font-semibold uppercase tracking-wide text-[#73729b]">
                  {form.nameLabel}
                </label>
                <input
                  id="join-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder={form.namePlaceholder}
                  className="w-full rounded-2xl border border-[#d7d4d0] bg-[#f8f6f3] px-4 py-3 text-base text-black outline-none transition focus:border-[#73729b] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="join-phone" className="text-sm font-semibold uppercase tracking-wide text-[#73729b]">
                  {form.phoneLabel}
                </label>
                <input
                  id="join-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder={form.phonePlaceholder}
                  className="w-full rounded-2xl border border-[#d7d4d0] bg-[#f8f6f3] px-4 py-3 text-base text-black outline-none transition focus:border-[#73729b] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="join-interest" className="text-sm font-semibold uppercase tracking-wide text-[#73729b]">
                  {form.interestLabel}
                </label>
                <textarea
                  id="join-interest"
                  name="interest"
                  required
                  rows={3}
                  value={formData.interest}
                  onChange={(event) => setFormData((prev) => ({ ...prev, interest: event.target.value }))}
                  placeholder={form.interestPlaceholder}
                  className="w-full rounded-2xl border border-[#d7d4d0] bg-[#f8f6f3] px-4 py-3 text-base text-black outline-none transition focus:border-[#73729b] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="join-participation" className="text-sm font-semibold uppercase tracking-wide text-[#73729b]">
                  {form.participationLabel}
                </label>
                <textarea
                  id="join-participation"
                  name="participation"
                  required
                  rows={3}
                  value={formData.participation}
                  onChange={(event) => setFormData((prev) => ({ ...prev, participation: event.target.value }))}
                  placeholder={form.participationPlaceholder}
                  className="w-full rounded-2xl border border-[#d7d4d0] bg-[#f8f6f3] px-4 py-3 text-base text-black outline-none transition focus:border-[#73729b] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#73729b] px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#5a5982] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? form.submitting : form.submit}
                </button>

                {submitStatus === 'success' && (
                  <p className="text-center text-sm font-medium text-[#2f8f46]">{form.success}</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-center text-sm font-medium text-[#b93838]">{form.error}</p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
