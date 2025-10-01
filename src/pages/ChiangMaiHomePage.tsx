import heroMain from '../assets/hero_photo/405502672_342184758430000_1080280448893141717_n_18027735442755327.webp';
import loungePhoto from '../assets/hero_photo/429146670_627607329506733_1520456757899104652_n_18110259178328831.jpg';
import gatheringPhoto from '../assets/hero_photo/420995137_727177859386693_3789888103366809406_n_18018963803073814.webp';
import heroVideo from '../assets/hero_video/new.mp4';

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

const galleryItems = [
  {
    src: heroMain,
    alt: 'Люди общаются в гостиной OmHome',
    caption: 'Вечер общения и новых знакомств'
  },
  {
    src: loungePhoto,
    alt: 'Уютная гостиная с мягким светом',
    caption: 'Тёплая гостиная, где хочется остаться'
  },
  {
    src: gatheringPhoto,
    alt: 'Музыкальная встреча в OmHome',
    caption: 'Живая музыка и совместное творчество'
  }
];

const testimonials = [
  '«Чувствуется настоящая домашняя атмосфера».',
  '«После работы здесь отдыхает голова — и новые друзья появляются».',
  '«Очень уютное место, куда хочется возвращаться».'
];

export function ChiangMaiHomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="#hero" className="font-menorah text-2xl text-slate-900">OmHome</a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#about" className="transition-colors hover:text-slate-900">Кто мы</a>
            <a href="#experience" className="transition-colors hover:text-slate-900">Опыт</a>
            <a href="#events" className="transition-colors hover:text-slate-900">События</a>
            <a href="#principles" className="transition-colors hover:text-slate-900">Принципы</a>
            <a href="#initiative" className="transition-colors hover:text-slate-900">Твоя инициатива</a>
            <a href="#media" className="transition-colors hover:text-slate-900">Фото и видео</a>
            <a href="#map" className="transition-colors hover:text-slate-900">Как нас найти</a>
            <a href="#schedule" className="transition-colors hover:text-slate-900">Афиша</a>
            <a href="#reviews" className="transition-colors hover:text-slate-900">Отзывы</a>
          </nav>
        </div>
      </header>

      <main id="hero" className="pt-8 md:pt-16">
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center rounded-full bg-white px-4 py-1 text-sm font-medium text-slate-600 shadow">
                Дом-друзей в Чиангмае
              </p>
              <h1 className="font-menorah text-4xl text-slate-900 md:text-5xl lg:text-6xl">
                Тёплое пространство OmHome Chiang Mai для встреч, работы и отдыха
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Уютный дом, где проходят камерные концерты, йога, настолки и просто тёплые встречи друзей. Приходи за атмосферой и поддержкой.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#schedule"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  📅 Смотреть афишу
                </a>
                <a
                  href="#map"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
                >
                  🗺 Как нас найти
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-900">250+</p>
                  <p className="text-sm text-slate-600">гостей уже побывали у нас</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-900">12</p>
                  <p className="text-sm text-slate-600">форматов встреч и мероприятий</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <p className="text-3xl font-semibold text-slate-900">24/7</p>
                  <p className="text-sm text-slate-600">уютный дом и пространство для общения</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
                  <img src={heroMain} alt="Гости OmHome общаются за большим столом" className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Живая атмосфера</p>
                  <p className="text-base font-semibold text-slate-800">Тёплые вечера с чаем, музыкой и новыми друзьями</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">🌿 Кто мы</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                OmHome — это дом, где живут люди, которые создают атмосферу уюта, заботы и искренних встреч.
              </p>
              <p className="text-lg leading-relaxed text-slate-600">
                Мы открыты для тех, кто живёт в Чиангмае и хочет найти новых друзей, пообщаться и стать частью тёплого сообщества.
              </p>
              <p className="text-lg leading-relaxed text-slate-600">Здесь можно:</p>
              <ul className="space-y-3 text-lg text-slate-600">
                <li>• встретиться и познакомиться с другими жителями города;</li>
                <li>• поработать в спокойной обстановке: коворкинг с хорошим интернетом, чаем и печеньем;</li>
                <li>• прийти на кино, квартирник, настолки или квиз;</li>
                <li>• попробовать йогу, медитацию или познакомиться с киртанами.</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">Дом, который живёт вместе с городом</h3>
              <p className="leading-relaxed text-slate-600">
                Мы — про доверие, безопасность и поддержку. Открываем двери тем, кто ищет место, где можно быть собой и делиться своими идеями.
              </p>
              <a
                href="#media"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
              >
                Посмотреть атмосферу
              </a>
            </div>
          </div>
        </section>

        <section id="experience" className="bg-slate-900 py-16 text-white md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl md:text-4xl">🤝 Опыт и доверие</h2>
              <p className="text-lg leading-relaxed text-white/80">
                Мы уже открывали такие пространства в Грузии и Сербии. За несколько лет там прошло сотни встреч: лекции, йога, квартирники, настолки, кино и киртаны.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Каждый раз это становилось точкой сближения для людей, которые искали дружескую атмосферу и новые знакомства.
              </p>
              <p className="text-lg leading-relaxed">Теперь мы создаём такую же атмосферу в Чиангмае 🌿</p>
            </div>
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-wide text-white/60">Наши ценности</p>
              <ul className="space-y-3 text-base leading-relaxed text-white">
                <li>• Делаем вместе и для людей</li>
                <li>• Заботимся друг о друге</li>
                <li>• Поддерживаем инициативы коммьюнити</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="events" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">🎉 Что у нас происходит</h2>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600">
                Разные форматы событий помогают каждому почувствовать себя как дома. Мы собираемся небольшими компаниями, чтобы общаться, играть, слушать музыку и создавать что-то своё.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventHighlights.map((event) => (
                <div
                  key={event.title}
                  className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="text-3xl">{event.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="media" className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">🎥 Видео и фото</h2>
                <p className="text-lg leading-relaxed text-slate-600">
                  Делимся атмосферой из дома: как проходят вечера с настолками, музыкой, практиками и долгими разговорами на кухне.
                </p>
                <p className="text-lg leading-relaxed text-slate-600">
                  Видео помогает почувствовать ритм пространства, а галерея ниже — это живые кадры, которые можно использовать как заглушки до большой фотосъёмки.
                </p>
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow">
                <video src={heroVideo} controls className="aspect-video w-full object-cover" poster={heroMain} />
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <figure key={item.alt} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                    <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="text-sm font-medium text-slate-600">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="principles" className="py-16 md:py-24">
          <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-sm md:px-10">
            <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">✨ Мы создаём пространство доверия и чистоты</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              У нас нет алкоголя, наркотиков и мяса. Всё строится на уважении, дружбе и заботе друг о друге.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-lg leading-relaxed text-slate-600">
                Формат участия — donation. Можно приходить даже без пожертвования: пространство открыто для всех, кто разделяет наши ценности.
              </p>
            </div>
          </div>
        </section>

        <section id="initiative" className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">🌟 Твоя инициатива</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                OmHome — живая площадка. Здесь проходят наши события и мероприятия, которые предлагают гости.
              </p>
              <ul className="space-y-3 text-lg text-slate-600">
                <li>• провести квартирник или настольный вечер;</li>
                <li>• устроить мастер-класс или йогу;</li>
                <li>• организовать встречу по интересам.</li>
              </ul>
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-700"
              >
                ✍️ Предложить мероприятие
              </a>
            </div>
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">Готовы поддержать идею</h3>
              <p className="leading-relaxed text-slate-600">
                Подскажем, как организовать встречу, поможем с техникой и анонсами. Просто напиши нам — и мы сделаем это вместе.
              </p>
              <a
                href="https://t.me/omhome"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-700 transition-colors hover:text-slate-900"
              >
                Написать в Telegram →
              </a>
            </div>
          </div>
        </section>

        <section id="map" className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">📍 Как нас найти</h2>
              <p className="text-lg leading-relaxed text-slate-600">
                Мы находимся недалеко от центра, в тихом и зелёном районе. Удобно добраться на байке или Grab.
              </p>
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-wide text-slate-500">Фото пространства</p>
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm font-semibold text-slate-500">
                  Фото дома скоро появится
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
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
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Открыть в Google Maps
              </a>
            </div>
          </div>
        </section>

        <section id="schedule" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">📅 Афиша</h2>
            <p className="mb-8 max-w-2xl text-lg text-slate-600">
              Ближайшие события — в разработке. Мы готовим расписание, чтобы каждый мог выбрать то, что откликается.
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                  Скоро анонсируем событие #{item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-menorah text-3xl text-slate-900 md:text-4xl">💬 Отзывы</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((testimonial) => (
                <blockquote key={testimonial} className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-lg leading-relaxed text-slate-600">{testimonial}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="bg-slate-900 py-16 text-white md:py-24">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center">
            <h2 className="font-menorah text-3xl md:text-4xl">🙌 Присоединяйся</h2>
            <p className="max-w-2xl text-lg text-white/80 md:text-xl">
              Приходи на события, работай в коворкинге, делись своими идеями. OmHome Chiang Mai открыт для тебя.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 transition-colors hover:bg-white/90"
              >
                📅 Смотреть афишу
              </a>
              <a
                href="https://t.me/omhome"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                💻 Забронировать место в коворкинге
              </a>
              <a
                href="#initiative"
                className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                ✍️ Предложить мероприятие
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2024 OmHome Chiang Mai. Пространство тёплых встреч.
      </footer>
    </div>
  );
}
