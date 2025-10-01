import logo from '../assets/Logo.svg';

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

const testimonials = [
  '«Чувствуется настоящая домашняя атмосфера».',
  '«После работы здесь отдыхает голова — и новые друзья появляются».',
  '«Очень уютное место, куда хочется возвращаться».'
];

export function ChiangMaiHomePage() {
  return (
    <div className="min-h-screen bg-[#f7f3ef] text-[#2a2440]">
      <header className="bg-[#f7f3ef]/90 backdrop-blur border-b border-[#d8d2cb] sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#hero" className="inline-flex items-center">
            <img src={logo} alt="OmHome" className="h-10 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="hover:text-[#5147b5] transition-colors">Кто мы</a>
            <a href="#experience" className="hover:text-[#5147b5] transition-colors">Опыт</a>
            <a href="#events" className="hover:text-[#5147b5] transition-colors">События</a>
            <a href="#principles" className="hover:text-[#5147b5] transition-colors">Принципы</a>
            <a href="#initiative" className="hover:text-[#5147b5] transition-colors">Твоя инициатива</a>
            <a href="#map" className="hover:text-[#5147b5] transition-colors">Как нас найти</a>
            <a href="#schedule" className="hover:text-[#5147b5] transition-colors">Афиша</a>
            <a href="#reviews" className="hover:text-[#5147b5] transition-colors">Отзывы</a>
          </nav>
          <a
            href="/pamho"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#5147b5] px-4 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#3d3490] transition-colors"
          >
            Перейти к Pamho
          </a>
        </div>
      </header>

      <main className="pt-8 md:pt-16" id="hero">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-[#e9e4ff] px-4 py-1 text-sm font-medium text-[#5147b5]">
                Дом-друзей в Чиангмае
              </p>
              <h1 className="font-menorah text-4xl md:text-5xl lg:text-6xl text-[#302a66]">
                OmHome Chiang Mai — тёплое пространство для встреч и общения
              </h1>
              <p className="text-lg md:text-xl text-[#4b456e] leading-relaxed">
                Дом-друзей в Чиангмае: события, коворкинг и уютная атмосфера для русскоязычного (и не только) коммьюнити.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#schedule"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5147b5] px-6 py-3 text-white text-base font-semibold shadow-lg shadow-[#5147b5]/20 hover:bg-[#3d3490] transition-colors"
                >
                  📅 Смотреть афишу
                </a>
                <a
                  href="#map"
                  className="inline-flex items-center gap-2 rounded-full border border-[#5147b5] px-6 py-3 text-base font-semibold text-[#5147b5] hover:bg-[#5147b5]/10 transition-colors"
                >
                  🗺 Как нас найти
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#d7cffc] via-[#f6ede7] to-[#fbe5c8] rounded-3xl blur-xl opacity-60"></div>
              <div className="relative rounded-3xl border border-[#e0d8cf] bg-white p-8 shadow-xl space-y-6">
                <h2 className="text-2xl font-semibold text-[#302a66]">Добро пожаловать домой</h2>
                <p className="text-[#4b456e] leading-relaxed">
                  Мы создаём пространство, куда хочется приходить за вдохновением, спокойствием и новыми знакомствами. Здесь вас всегда ждут чай, печеньки и тёплая компания.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-[#4b456e]">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#f2edff] px-4 py-2">☕ Чай и беседы</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e0] px-4 py-2">🧘 Практики</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#ffe7f2] px-4 py-2">🎶 Музыка</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4 grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66]">🌿 Кто мы</h2>
              <p className="text-lg text-[#4b456e] leading-relaxed">
                OmHome — это не просто место для мероприятий, а настоящий дом, где живут люди, которые создают атмосферу уюта и заботы.
              </p>
              <p className="text-lg text-[#4b456e] leading-relaxed">
                Мы открыты для тех, кто живёт в Чиангмае и хочет найти новых друзей, пообщаться и стать частью тёплого сообщества.
              </p>
              <p className="text-lg text-[#4b456e] leading-relaxed">
                Здесь можно:
              </p>
              <ul className="space-y-3 text-[#4b456e] text-lg">
                <li>• встретиться и познакомиться с другими жителями города,</li>
                <li>• поработать за ноутбуком в спокойной обстановке (коворкинг с хорошим интернетом, чаем и печеньками ☕🍪),</li>
                <li>• прийти на кино, квартирник, настолки или квиз,</li>
                <li>• попробовать йогу, медитацию или познакомиться с киртанами.</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#f4ecff] via-[#fff4e3] to-[#ffe8f1] p-8 shadow-lg space-y-4">
              <h3 className="text-2xl font-semibold text-[#302a66]">Дом, который живёт вместе с городом</h3>
              <p className="text-[#4b456e] leading-relaxed">
                Мы — про доверие, безопасность и поддержку. Открываем двери тем, кто ищет место, где можно быть собой.
              </p>
              <a
                href="/pamho"
                className="inline-flex items-center gap-2 rounded-full border border-[#5147b5] px-5 py-2.5 text-[#5147b5] font-semibold hover:bg-[#5147b5]/10 transition-colors"
              >
                Узнать о Pamho больше
              </a>
            </div>
          </div>
        </section>

        <section id="experience" className="container mx-auto px-4 py-16 md:py-20">
          <div className="rounded-3xl bg-[#302a66] text-white px-8 py-12 shadow-xl">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div className="space-y-6">
                <h2 className="font-menorah text-3xl md:text-4xl">🤝 Опыт и доверие</h2>
                <p className="text-lg leading-relaxed text-white/90">
                  Мы уже открывали такие пространства в Грузии и Сербии. За несколько лет там прошло сотни встреч: лекции, йога, квартирники, настолки, кино, киртаны.
                </p>
                <p className="text-lg leading-relaxed text-white/90">
                  Каждый раз это становилось точкой сближения для людей, которые искали дружескую атмосферу и новые знакомства.
                </p>
                <p className="text-lg leading-relaxed text-white">
                  Теперь мы создаём такую же атмосферу в Чиангмае 🌿
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 space-y-4">
                <p className="text-sm uppercase tracking-wide text-white/60">Наши ценности</p>
                <ul className="space-y-3 text-base leading-relaxed text-white">
                  <li>• Делаем вместе и для людей</li>
                  <li>• Заботимся друг о друге</li>
                  <li>• Поддерживаем инициативы коммьюнити</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66] mb-10">🎉 Что у нас происходит</h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {eventHighlights.map((event) => (
                <div
                  key={event.title}
                  className="rounded-2xl border border-[#e0d8cf] bg-[#faf7f3] p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-4">{event.icon}</div>
                  <h3 className="text-xl font-semibold text-[#302a66] mb-2">{event.title}</h3>
                  <p className="text-[#4b456e] leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="principles" className="container mx-auto px-4 py-16 md:py-20">
          <div className="rounded-3xl bg-[#f0ecff] p-8 shadow-xl space-y-6">
            <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66]">
              ✨ Мы создаём пространство доверия и чистоты
            </h2>
            <p className="text-lg text-[#4b456e] leading-relaxed">
              У нас нет алкоголя, наркотиков и мяса. Всё строится на уважении, дружбе и заботе друг о друге.
            </p>
            <div className="rounded-2xl bg-white p-6 border border-[#e0d8cf]">
              <p className="text-lg text-[#4b456e] leading-relaxed">
                Формат участия — donation. То есть вы сами решаете, хотите ли что-то пожертвовать. Можно приходить даже без пожертвования — это пространство открыто для всех.
              </p>
            </div>
          </div>
        </section>

        <section id="initiative" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66]">🌟 Твоя инициатива</h2>
              <p className="text-lg text-[#4b456e] leading-relaxed">
                OmHome — это живая площадка. Здесь не только проходят наши события, но и ты можешь предложить что-то своё:
              </p>
              <ul className="space-y-3 text-lg text-[#4b456e]">
                <li>• провести квартирник или настольный вечер,</li>
                <li>• устроить мастер-класс или йогу,</li>
                <li>• организовать встречу по интересам.</li>
              </ul>
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-full bg-[#5147b5] px-5 py-3 text-white text-base font-semibold shadow hover:bg-[#3d3490] transition-colors"
              >
                ✍️ Предложить мероприятие
              </a>
            </div>
            <div className="rounded-3xl border border-[#e0d8cf] bg-[#faf7f3] p-8 shadow-lg space-y-4">
              <h3 className="text-2xl font-semibold text-[#302a66]">Готовы поддержать идею</h3>
              <p className="text-[#4b456e] leading-relaxed">
                Подскажем, как организовать встречу, поможем с техникой и анонсами. Просто напиши нам — и мы сделаем это вместе.
              </p>
              <a
                href="https://t.me/omhome"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[#5147b5] font-semibold hover:underline"
              >
                Написать в Telegram →
              </a>
            </div>
          </div>
        </section>

        <section id="map" className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66]">📍 Как нас найти</h2>
              <p className="text-lg text-[#4b456e] leading-relaxed">
                Мы находимся недалеко от центра, в тихом и зелёном районе. Удобно добраться на байке или Grab.
              </p>
              <div className="rounded-3xl border border-[#e0d8cf] bg-[#faf7f3] p-6 shadow">
                <p className="text-sm uppercase tracking-wide text-[#7c75a6] mb-4">Фото пространства</p>
                <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#f4ecff] via-[#fff4e3] to-[#ffe8f1] flex items-center justify-center text-[#5147b5] text-lg font-semibold">
                  Фото дома скоро появится
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg border border-[#e0d8cf]">
                <iframe
                  title="OmHome Chiang Mai location"
                  src="https://maps.google.com/maps?q=Chiang%20Mai&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#5147b5] px-5 py-3 text-white text-base font-semibold shadow hover:bg-[#3d3490] transition-colors"
              >
                Открыть в Google Maps
              </a>
            </div>
          </div>
        </section>

        <section id="schedule" className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66] mb-6">📅 Афиша</h2>
            <p className="text-lg text-[#4b456e] mb-8 max-w-2xl">
              Ближайшие события — в разработке. Мы уже готовим расписание, чтобы ты мог выбрать то, что откликается.
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-dashed border-[#d8d2cb] bg-[#faf7f3] p-6 text-center text-[#7c75a6]"
                >
                  Скоро анонсируем событие #{item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="container mx-auto px-4 py-16 md:py-20">
          <h2 className="font-menorah text-3xl md:text-4xl text-[#302a66] mb-8">💬 Отзывы</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial}
                className="rounded-3xl border border-[#e0d8cf] bg-white p-6 shadow-sm"
              >
                <p className="text-lg text-[#4b456e] leading-relaxed">{testimonial}</p>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="join" className="bg-[#302a66] py-16 md:py-20 text-white">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="font-menorah text-3xl md:text-4xl">🙌 Присоединяйся</h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Присоединяйся к OmHome Chiang Mai — приходи на события, работай в коворкинге, предлагай свои идеи. Дом открыт для тебя.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#302a66] hover:bg-white/90 transition-colors"
              >
                📅 Смотреть афишу
              </a>
              <a
                href="https://t.me/omhome"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                💻 Забронировать место в коворкинге
              </a>
              <a
                href="#initiative"
                className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                ✍️ Предложить мероприятие
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8d2cb] bg-white py-6 text-center text-sm text-[#7c75a6]">
        © 2024 OmHome Chiang Mai. Пространство тёплых встреч.
      </footer>
    </div>
  );
}
