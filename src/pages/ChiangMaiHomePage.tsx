import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarCheck, MapPin, Menu, MessageCircle, Sparkles, X } from 'lucide-react';

const navLinks = [
  { label: 'Главная', href: '#hero' },
  { label: 'О доме', href: '#about' },
  { label: 'Опыт', href: '#experience' },
  { label: 'События', href: '#events' },
  { label: 'Принципы', href: '#principles' },
  { label: 'Инициативы', href: '#initiative' },
  { label: 'Локация', href: '#map' },
  { label: 'Афиша', href: '#schedule' },
  { label: 'Отзывы', href: '#reviews' }
];

const heroBadges = [
  'Коворкинг и чай',
  'Сообщество друзей',
  'События каждый месяц'
];

const eventHighlights = [
  {
    icon: '🎬',
    title: 'Кино и квизы',
    description: 'Уютные вечера с обсуждениями.'
  },
  {
    icon: '🎶',
    title: 'Живая музыка и киртаны',
    description: 'Гармония и вдохновение.'
  },
  {
    icon: '🧘',
    title: 'Йога и мастер-классы',
    description: 'От расслабления до новых навыков.'
  },
  {
    icon: '🎲',
    title: 'Настольные игры и квартирники',
    description: 'Весёлые форматы для новых знакомств.'
  },
  {
    icon: '💻',
    title: 'Коворкинг',
    description: 'Работа в уютной обстановке.'
  },
  {
    icon: '🌸',
    title: 'Коммьюнити',
    description: 'Общение, дружба, забота.'
  }
];

const experienceHighlights = [
  'Пространства в Грузии и Сербии',
  'Сотни встреч за несколько лет',
  'Доверие, дружба и поддержка'
];

const initiativeIdeas = [
  'провести квартирник или настольный вечер',
  'устроить мастер-класс или йогу',
  'организовать встречу по интересам'
];

const testimonials = [
  '«Чувствуется настоящая домашняя атмосфера».',
  '«После работы здесь отдыхает голова — и новые друзья появляются».',
  '«Очень уютное место, куда хочется возвращаться».'
];

export function ChiangMaiHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleNavigation = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#e6e2df] text-[#241f74]">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-x-0 top-0 z-40 border-b border-[#73729b]/20 bg-[#e6e2df]/80 backdrop-blur"
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#hero"
              className="font-menorah text-2xl font-medium text-[#73729b]"
            >
              OmHome Chiang Mai
            </motion.a>

            <div className="hidden lg:flex items-center gap-6 text-sm">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  onClick={() => handleNavigation(link.href)}
                  className="rounded-full px-3 py-2 font-semibold text-[#241f74] transition-colors hover:bg-white/70 hover:text-[#73729b]"
                >
                  {link.label}
                </motion.button>
              ))}
              <a
                href="/pamho"
                className="ml-4 inline-flex items-center gap-2 rounded-full bg-[#73729b] px-4 py-2 font-semibold text-white shadow-lg shadow-[#73729b]/20 transition hover:bg-[#565587]"
              >
                <Sparkles className="h-4 w-4" /> Pamho
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-[#73729b] transition hover:bg-[#d9d6f7] lg:hidden"
              aria-label="Открыть меню"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="space-y-3 pb-6">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className="block w-full rounded-2xl bg-white/70 px-4 py-3 text-left text-base font-semibold text-[#241f74] shadow-sm transition hover:bg-white"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/pamho"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#73729b] px-4 py-3 font-semibold text-white shadow-lg shadow-[#73729b]/20"
              >
                <Sparkles className="h-4 w-4" /> Перейти к Pamho
              </a>
            </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="pt-24 lg:pt-32" id="hero">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#efe8de] via-[#e6e2df] to-[#d8d5ff]" />
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#73729b] shadow-sm"
                >
                  <Sparkles className="h-4 w-4" /> Дом-друзей в Чиангмае
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-menorah text-4xl leading-tight text-[#2c298a] sm:text-5xl lg:text-6xl"
                >
                  OmHome Chiang Mai — тёплое пространство для встреч и общения
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg leading-relaxed text-[#3c378f]/80 sm:text-xl"
                >
                  Дом-друзей в Чиангмае: события, коворкинг и уютная атмосфера для русскоязычного (и не только) коммьюнити.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <a
                    href="#schedule"
                    className="inline-flex items-center gap-2 rounded-full bg-[#73729b] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#73729b]/25 transition hover:bg-[#565587]"
                  >
                    <CalendarCheck className="h-5 w-5" /> Смотреть афишу
                  </a>
                  <a
                    href="#map"
                    className="inline-flex items-center gap-2 rounded-full border border-[#73729b] px-6 py-3 text-base font-semibold text-[#73729b] transition hover:bg-[#73729b]/10"
                  >
                    <MapPin className="h-5 w-5" /> Как нас найти
                  </a>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-3"
                >
                  {heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#2c298a] shadow-sm shadow-[#73729b]/10"
                    >
                      {badge}
                    </span>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="relative"
              >
                <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-[#f2e9ff] via-[#ffe9f2] to-[#fff5dd] blur-2xl opacity-80" />
                <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-8 shadow-2xl shadow-[#73729b]/15 backdrop-blur">
                  <div className="space-y-4 text-[#3c378f]">
                    <h2 className="text-2xl font-semibold text-[#2c298a]">Добро пожаловать домой</h2>
                    <p className="text-base leading-relaxed">
                      Мы создаём пространство, куда хочется приходить за вдохновением, спокойствием и новыми знакомствами. Здесь вас всегда ждут чай, печеньки и тёплая компания.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-[#f4efff] p-4 text-sm font-semibold text-[#2c298a] shadow-sm">☕ Чай и беседы</div>
                      <div className="rounded-2xl bg-[#fff1e5] p-4 text-sm font-semibold text-[#2c298a] shadow-sm">🧘 Практики</div>
                      <div className="rounded-2xl bg-[#ffe7f7] p-4 text-sm font-semibold text-[#2c298a] shadow-sm">🎶 Музыка</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="about" className="relative py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/70 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-6">
                <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">🌿 Кто мы</h2>
                <p className="text-lg leading-relaxed text-[#3c378f]/80">
                  OmHome — это не просто место для мероприятий, а настоящий дом, где живут люди, которые создают атмосферу уюта и заботы.
                </p>
                <p className="text-lg leading-relaxed text-[#3c378f]/80">
                  Мы открыты для тех, кто живёт в Чиангмае и хочет найти новых друзей, пообщаться и стать частью тёплого сообщества.
                </p>
                <div className="rounded-3xl border border-[#73729b]/20 bg-white/70 p-6 shadow-lg shadow-[#73729b]/10 backdrop-blur">
                  <p className="text-lg font-semibold text-[#2c298a]">Здесь можно:</p>
                  <ul className="mt-4 space-y-3 text-base leading-relaxed text-[#3c378f]/80">
                    <li>• встретиться и познакомиться с другими жителями города;</li>
                    <li>• поработать за ноутбуком в спокойной обстановке (коворкинг с хорошим интернетом, чаем и печеньками ☕🍪);</li>
                    <li>• прийти на кино, квартирник, настолки или квиз;</li>
                    <li>• попробовать йогу, медитацию или познакомиться с киртанами.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-[#f4efff] via-[#fff1e5] to-[#ffe7f7] p-8 shadow-2xl shadow-[#73729b]/10">
                  <h3 className="text-2xl font-semibold text-[#2c298a]">Дом, который живёт вместе с городом</h3>
                  <p className="mt-4 text-lg leading-relaxed text-[#3c378f]/80">
                    Мы — про доверие, безопасность и поддержку. Открываем двери тем, кто ищет место, где можно быть собой.
                  </p>
                  <a
                    href="/pamho"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#73729b] px-5 py-3 text-sm font-semibold text-[#73729b] transition hover:bg-[#73729b]/10"
                  >
                    Узнать о Pamho больше
                  </a>
                </div>
                <div className="rounded-[2rem] border border-dashed border-[#73729b]/30 bg-white/70 p-8 shadow-lg shadow-[#73729b]/10 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#73729b]">Пространство тепла</p>
                  <p className="mt-3 text-lg leading-relaxed text-[#3c378f]/80">
                    Мы создаём атмосферу дружеской поддержки — с заботой о каждом, кто заходит к нам на чаепитие, практику или концерт.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-[3rem] bg-[#2c298a] px-10 py-14 text-white shadow-2xl">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div className="space-y-6">
                  <h2 className="font-menorah text-3xl sm:text-4xl">🤝 Опыт и доверие</h2>
                  <p className="text-lg leading-relaxed text-white/80">
                    Мы уже открывали такие пространства в Грузии и Сербии. За несколько лет там прошло сотни встреч: лекции, йога, квартирники, настолки, кино, киртаны.
                  </p>
                  <p className="text-lg leading-relaxed text-white/80">
                    Каждый раз это становилось точкой сближения для людей, которые искали дружескую атмосферу и новые знакомства.
                  </p>
                  <p className="text-lg leading-relaxed text-white">
                    Теперь мы создаём такую же атмосферу в Чиангмае 🌿
                  </p>
                </div>
                <div className="grid gap-4">
                  {experienceHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-2xl border border-white/20 bg-white/10 p-5 text-base font-semibold text-white/90"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">🎉 Что у нас происходит</h2>
                <p className="mt-2 text-lg text-[#3c378f]/80">
                  Форматы, которые создают настроение и знакомят с новыми друзьями.
                </p>
              </div>
              <a
                href="#initiative"
                className="inline-flex items-center gap-2 rounded-full border border-[#73729b] px-5 py-3 text-sm font-semibold text-[#73729b] transition hover:bg-[#73729b]/10"
              >
                Предложить событие
              </a>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {eventHighlights.map((event) => (
                <motion.div
                  key={event.title}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-[#73729b]/20 bg-white/70 p-6 shadow-lg shadow-[#73729b]/10 backdrop-blur"
                >
                  <div className="text-4xl">{event.icon}</div>
                  <h3 className="mt-4 text-xl font-semibold text-[#2c298a]">{event.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#3c378f]/80">{event.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="principles" className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-[3rem] border border-[#73729b]/20 bg-gradient-to-br from-[#f4efff] via-[#fff1e5] to-[#ffe7f7] p-10 shadow-2xl shadow-[#73729b]/10">
              <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">✨ Мы создаём пространство доверия и чистоты</h2>
              <p className="mt-4 text-lg leading-relaxed text-[#3c378f]/80">
                У нас нет алкоголя, наркотиков и мяса. Всё строится на уважении, дружбе и заботе друг о друге.
              </p>
              <div className="mt-8 rounded-3xl border border-[#73729b]/20 bg-white/70 p-6 text-lg leading-relaxed text-[#3c378f]/80 shadow-lg shadow-[#73729b]/10 backdrop-blur">
                Формат участия — donation. То есть вы сами решаете, хотите ли что-то пожертвовать. Можно приходить даже без пожертвования — это пространство открыто для всех.
              </div>
            </div>
          </div>
        </section>

        <section id="initiative" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">🌟 Твоя инициатива</h2>
                <p className="text-lg leading-relaxed text-[#3c378f]/80">
                  OmHome — это живая площадка. Здесь не только проходят наши события, но и ты можешь предложить что-то своё:
                </p>
                <ul className="space-y-3 text-lg leading-relaxed text-[#3c378f]/80">
                  {initiativeIdeas.map((idea) => (
                    <li key={idea}>• {idea}</li>
                  ))}
                </ul>
                <a
                  href="#join"
                  className="inline-flex items-center gap-2 rounded-full bg-[#73729b] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#73729b]/20 transition hover:bg-[#565587]"
                >
                  ✍️ Предложить мероприятие
                </a>
              </div>
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-[#73729b]/20 bg-white/70 p-8 shadow-2xl shadow-[#73729b]/10 backdrop-blur">
                  <h3 className="text-2xl font-semibold text-[#2c298a]">Готовы поддержать идею</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#3c378f]/80">
                    Подскажем, как организовать встречу, поможем с техникой и анонсами. Просто напиши нам — и мы сделаем это вместе.
                  </p>
                  <a
                    href="https://t.me/omhome"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-[#2c298a] transition hover:text-[#565587]"
                  >
                    <MessageCircle className="h-5 w-5" /> Написать в Telegram →
                  </a>
                </div>
                <div className="rounded-[2rem] border border-dashed border-[#73729b]/30 bg-gradient-to-br from-[#f4efff] via-[#fff1e5] to-[#ffe7f7] p-8 text-[#2c298a] shadow-lg shadow-[#73729b]/10">
                  <p className="text-sm uppercase tracking-[0.3em]">Команда OmHome</p>
                  <p className="mt-3 text-lg leading-relaxed text-[#2c298a]">
                    Мы помогаем друг другу раскрывать таланты и создавать события, которые откликаются людям.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="map" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">📍 Как нас найти</h2>
                <p className="text-lg leading-relaxed text-[#3c378f]/80">
                  Мы находимся недалеко от центра, в тихом и зелёном районе. Удобно добраться на байке или Grab.
                </p>
                <div className="rounded-[2rem] border border-dashed border-[#73729b]/30 bg-white/70 p-6 text-base leading-relaxed text-[#3c378f]/80 shadow-lg shadow-[#73729b]/10 backdrop-blur">
                  Фото дома скоро появится — мы уже готовим визуальные истории о пространстве.
                </div>
              </div>
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[2.5rem] border border-[#73729b]/20 shadow-xl shadow-[#73729b]/15">
                  <iframe
                    title="OmHome Chiang Mai location"
                    src="https://maps.google.com/maps?q=Chiang%20Mai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    className="h-[320px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <a
                  href="https://maps.app.goo.gl/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#73729b] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#73729b]/20 transition hover:bg-[#565587]"
                >
                  <MapPin className="h-5 w-5" /> Открыть в Google Maps
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="schedule" className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-[3rem] border border-[#73729b]/20 bg-white/70 p-10 shadow-2xl shadow-[#73729b]/10 backdrop-blur">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">📅 Афиша</h2>
                  <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#3c378f]/80">
                    Ближайшие события — в разработке. Мы уже готовим расписание, чтобы ты мог выбрать то, что откликается.
                  </p>
                </div>
                <a
                  href="https://t.me/omhome"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#73729b] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#73729b]/20 transition hover:bg-[#565587]"
                >
                  <CalendarCheck className="h-5 w-5" /> Узнать расписание первым
                </a>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-dashed border-[#73729b]/30 bg-gradient-to-br from-[#f4efff] via-[#fff1e5] to-[#ffe7f7] p-6 text-center text-base font-semibold text-[#2c298a] shadow-lg shadow-[#73729b]/10"
                  >
                    Скоро анонсируем событие #{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-menorah text-3xl text-[#2c298a] sm:text-4xl">💬 Отзывы</h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#3c378f]/80">
              Мы бережно собираем впечатления гостей. Они помогают нам поддерживать атмосферу уюта и доверия.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial}
                  className="rounded-[2rem] border border-[#73729b]/20 bg-white/70 p-6 text-base leading-relaxed text-[#3c378f]/80 shadow-lg shadow-[#73729b]/10 backdrop-blur"
                >
                  {testimonial}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="relative py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2c298a] via-[#3833a3] to-[#5c59c8]" />
          <div className="container mx-auto px-4">
            <div className="rounded-[3rem] border border-white/20 bg-white/5 px-10 py-14 text-center text-white shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="font-menorah text-3xl sm:text-4xl">🙌 Присоединяйся</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
                Присоединяйся к OmHome Chiang Mai — приходи на события, работай в коворкинге, предлагай свои идеи. Дом открыт для тебя.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="#schedule"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#2c298a] shadow-lg shadow-black/20 transition hover:bg-white/90"
                >
                  <CalendarCheck className="h-5 w-5" /> Смотреть афишу
                </a>
                <a
                  href="https://t.me/omhome"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  💻 Забронировать место в коворкинге
                </a>
                <a
                  href="#initiative"
                  className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  ✍️ Предложить мероприятие
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#73729b]/20 bg-white/70 py-8 text-center text-sm text-[#3c378f]/70 backdrop-blur">
        © 2024 OmHome Chiang Mai. Пространство тёплых встреч.
      </footer>
    </div>
  );
}

