import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { ArrowUpRight, CalendarPlus, Check, Copy, MapPin, Send, Instagram, Sparkles } from 'lucide-react';
import logo from '../assets/home/art-logo.png';
import artYoga from '../assets/home/art-yoga.png';
import artHat from '../assets/home/art-hat.png';
import artConversation from '../assets/home/art-coversation.png';
import artSilent from '../assets/home/art-silent.png';
import artCow from '../assets/home/art-com.png';
import artCity from '../assets/home/art-footrer.png';
import photoHall from '../assets/home/hall.jpg';
import photoLamp from '../assets/home/lamp.jpg';
import photoKirtan from '../assets/home/kirtan-1.jpg';
import photoKirtan2 from '../assets/home/kirtan-2.jpg';
import photoSmile from '../assets/home/smile.jpg';
import photoLaugh from '../assets/home/laugh.jpg';
import photoFriends from '../assets/home/friends.jpg';
import photoStreet from '../assets/home/street.jpg';
import photoAltar from '../assets/home/altar.jpg';
import photoTrip from '../assets/home/trip.jpg';
import photoYoga from '../assets/home/yoga.jpg';
import photoHarmonium from '../assets/home/harmonium.jpg';
import photoKids from '../assets/home/kids.jpg';
import photoPrasad from '../assets/home/prasad.jpg';
import promptPayQr from '../assets/support/promptpay.jpg';
import {
  downloadIcs,
  formatEventDate,
  relativeDayLabel,
  todayInChiangMai,
  useArchive,
  useEvents,
  type OmEvent,
  type RecurringEvent
} from './home/useEvents';
import { ArchiveSection } from './home/Archive';
import { ReviewsSection } from './home/Reviews';
import styles from './ChiangMaiHomePage.module.css';

const LINKS = {
  channel: 'https://t.me/omhome_thai',
  chat: 'https://t.me/+j7rRLqBkCvhiMWQy',
  contact: 'https://t.me/artartemev',
  instagram: 'https://www.instagram.com/omhome.cnx',
  map: 'https://maps.app.goo.gl/Vm2WUEd4D6yL8JQG7',
  belgrade: 'https://www.instagram.com/omhome.belgrade/',
  batumi: 'https://www.instagram.com/omhome.batumi/'
};

const ADDRESS = 'OmHome Space, Pa Daet, Chiang Mai';

const NAV = [
  { href: '#afisha', label: 'Афиша' },
  { href: '#about', label: 'О доме' },
  { href: '#archive', label: 'Архив' },
  { href: '#support', label: 'Поддержать' },
  { href: '#projects', label: 'Проекты' },
  { href: '#map', label: 'Как найти' }
];

const FORMATS = [
  { art: artConversation, title: 'Чай и разговоры', text: 'Посиделки с чаем, духовные беседы, чайные медитации — без программы и спешки.' },
  { art: artYoga, title: 'Киртаны и практики', text: 'Киртан по субботам, йога, йога-нидра, медитации с поющими чашами.' },
  { art: artHat, title: 'Игры и кино', text: 'Кино по пятницам, квизы, Werewolf, «Шляпа», детективные настолки и RPG.' },
  { art: artSilent, title: 'Лекции и философия', text: 'Чтения, читки пьес Вырыпаева, лекции о Ведах — просто и по-доброму.' }
];

const WEEK = [
  { day: 'Вт–Чт', title: 'Чайная и йога', text: 'Чайные медитации и соматическая йога днём и вечером' },
  { day: 'Пт', title: 'Кино', text: 'Кинопоказ на большом экране и обсуждение за чаем' },
  { day: 'Сб', title: 'Киртан', text: 'Пение мантр, живые инструменты и прасад' },
  { day: 'Вс', title: 'Игры и посиделки', text: 'Квиз, «Шляпа», настолки или просто чай' }
];

const PEOPLE_PER_YEAR = '≈400';

const GALLERY_TOP = [photoHall, photoKirtan, photoFriends, photoAltar, photoLaugh, photoStreet, photoPrasad];
const GALLERY_BOTTOM = [photoSmile, photoYoga, photoLamp, photoKirtan2, photoTrip, photoHarmonium, photoKids];

const PAYMENT_METHODS: {
  id: string;
  title: string;
  hint: string;
  rows?: { label: string; value: string; copy?: string }[];
  qr?: string;
}[] = [
  {
    id: 'thai',
    title: 'TrueMoney / PromptPay',
    hint: 'Отсканируйте QR в любом тайском банковском приложении',
    qr: promptPayQr
  },
  {
    id: 'sbp',
    title: 'СБП — Сбербанк',
    hint: 'Перевод из России по номеру телефона',
    rows: [{ label: 'Телефон', value: '+7 995 597 0108', copy: '+79955970108' }]
  },
  {
    id: 'crypto',
    title: 'Криптовалюта',
    hint: 'USDT, USDC, BTC и другие',
    rows: [
      { label: 'ByBit UID', value: '115189352' },
      { label: 'USDT TRC20', value: 'TUTZBW9sH341B7Rz43UnTU9sjVdbTCN1F5' }
    ]
  },
  {
    id: 'swift',
    title: 'SWIFT',
    hint: 'Международный банковский перевод в USD',
    rows: [
      { label: 'IBAN', value: 'GE73TB7418145068100009USD' },
      { label: 'SWIFT', value: 'TBCBGE22' },
      { label: 'Получатель', value: 'Liubov Verba' }
    ]
  }
];

const PROJECTS = [
  {
    title: 'Гид по Чиангмаю',
    tag: 'Guide',
    text: '400+ мест, маршруты, афиша города и справочник: визы, байки, врачи, деньги. Собрано из живых рекомендаций сообщества.',
    href: 'https://guide.omhome.space/gauranga/',
    cta: 'Открыть гид',
    tone: 'teal'
  },
  {
    title: 'NaviTo',
    tag: 'Барахолка',
    text: 'Доска объявлений для тех, кто живёт в Таиланде: байки, мебель, техника и всё, что ищет новых хозяев.',
    href: 'https://navito.omhome.space',
    cta: 'Перейти в NaviTo',
    tone: 'gold'
  }
];

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
};

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 28" aria-hidden="true">
      <path d="M12 0c.9 7.6 3.6 12.1 12 14-8.4 1.9-11.1 6.4-12 14-.9-7.6-3.6-12.1-12-14C8.4 12.1 11.1 7.6 12 0Z" />
    </svg>
  );
}

function SectionHeading({ eyebrow, children, light }: { eyebrow: string; children: ReactNode; light?: boolean }) {
  return (
    <motion.div className={`${styles.sectionHeading} ${light ? styles.sectionHeadingLight : ''}`} {...reveal}>
      <span className={styles.eyebrow}>
        <Sparkle className={styles.eyebrowSparkle} />
        {eyebrow}
      </span>
      <h2>{children}</h2>
    </motion.div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyButton}
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
      aria-label={copied ? 'Скопировано' : 'Скопировать'}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span>{copied ? 'Готово' : 'Копировать'}</span>
    </button>
  );
}

function EventCard({ event, today, past }: { event: OmEvent; today: string; past?: boolean }) {
  const { weekday, short } = formatEventDate(event.date);
  const badge = past ? 'Было' : relativeDayLabel(event.date, today);

  return (
    <motion.article className={`${styles.eventCard} ${past ? styles.eventCardPast : ''}`} {...reveal}>
      <div className={styles.eventPoster}>
        {event.poster ? (
          <img src={event.poster} alt={`Афиша: ${event.title}`} loading="lazy" />
        ) : (
          <div className={styles.eventPosterFallback}>
            <Sparkle className={styles.eventPosterSparkle} />
          </div>
        )}
        {badge && <span className={styles.eventBadge}>{badge}</span>}
      </div>
      <div className={styles.eventBody}>
        <p className={styles.eventDate}>
          <span>{weekday}</span>
          <Sparkle className={styles.inlineSparkle} />
          <strong>{short}</strong>
          <Sparkle className={styles.inlineSparkle} />
          <span>{event.time}</span>
        </p>
        <h3 className={styles.eventTitle}>{event.title}</h3>
        {event.subtitle && <p className={styles.eventSubtitle}>{event.subtitle}</p>}
        {event.description && <p className={styles.eventDescription}>{event.description}</p>}
        {!past && (
          <div className={styles.eventActions}>
            <a className={styles.buttonGold} href={event.registration ?? LINKS.contact} target="_blank" rel="noreferrer">
              Записаться
            </a>
            <button type="button" className={styles.buttonGhost} onClick={() => downloadIcs(event, ADDRESS)}>
              <CalendarPlus size={18} />В календарь
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function RecurringCard({ item }: { item: RecurringEvent }) {
  return (
    <motion.article className={styles.recurringCard} {...reveal}>
      {item.poster && <img src={item.poster} alt={`Афиша: ${item.title}`} loading="lazy" />}
      <div>
        <p className={styles.recurringWhen}>
          {item.days} · {item.times.join(' и ')}
        </p>
        <h3>{item.title}</h3>
        {item.subtitle && <p className={styles.recurringSubtitle}>{item.subtitle}</p>}
        {item.description && <p className={styles.recurringSubtitle}>{item.description}</p>}
      </div>
    </motion.article>
  );
}

function Afisha() {
  const { loading, failed, today, upcoming, recent, recurring } = useEvents();
  const showRecent = !loading && upcoming.length === 0 && recent.length > 0;

  return (
    <section id="afisha" className={styles.afishaSection}>
      <div className={styles.container}>
        <div className={styles.afishaHeader}>
          <SectionHeading eyebrow="Афиша" light>
            Ближайшие <em>события</em>
          </SectionHeading>
          <motion.a className={styles.linkArrow} href={LINKS.channel} target="_blank" rel="noreferrer" {...reveal}>
            Все анонсы в Telegram <ArrowUpRight size={20} />
          </motion.a>
        </div>

        {loading && <div className={styles.afishaSkeleton} aria-busy="true" />}

        {!loading && upcoming.length > 0 && (
          <div className={styles.eventsGrid}>
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} today={today} />
            ))}
          </div>
        )}

        {!loading && upcoming.length === 0 && (
          <motion.div className={styles.afishaEmpty} {...reveal}>
            <p>
              {failed
                ? 'Не получилось загрузить афишу.'
                : 'Новые события скоро появятся — мы как раз собираем расписание.'}{' '}
              Свежие анонсы всегда первыми выходят в канале.
            </p>
            <a className={styles.buttonGold} href={LINKS.channel} target="_blank" rel="noreferrer">
              <Send size={18} />
              Подписаться на @omhome_thai
            </a>
          </motion.div>
        )}

        {showRecent && (
          <>
            <h3 className={styles.afishaSubheading}>Недавно было</h3>
            <div className={styles.eventsGrid}>
              {recent.map((event) => (
                <EventCard key={event.id} event={event} today={today} past />
              ))}
            </div>
          </>
        )}

        {recurring.length > 0 && (
          <>
            <h3 className={styles.afishaSubheading}>Регулярно</h3>
            <div className={styles.recurringGrid}>
              {recurring.map((item) => (
                <RecurringCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Marquee({ images, reverse }: { images: string[]; reverse?: boolean }) {
  const loop = [...images, ...images];
  return (
    <div className={styles.marquee}>
      <div className={`${styles.marqueeTrack} ${reverse ? styles.marqueeReverse : ''}`}>
        {loop.map((src, index) => (
          <div key={`${src}-${index}`} className={styles.marqueeItem}>
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChiangMaiHomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const archive = useArchive();
  const byCategory = archive?.byCategory ?? {};
  const stats = [
    { value: PEOPLE_PER_YEAR, label: 'гостей за первый год' },
    { value: archive ? `${archive.total}` : '180+', label: 'событий с октября 2025' },
    {
      value: archive ? `${byCategory.kirtan ?? 0} / ${byCategory.cinema ?? 0}` : '—',
      label: 'киртанов и кинопоказов'
    }
  ];

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <a href="#top" className={styles.navBrand}>
            <Sparkle className={styles.navSparkle} />
            OmHome
          </a>
          <nav className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a className={styles.navCta} href={LINKS.channel} target="_blank" rel="noreferrer">
              <Send size={16} />
              Telegram
            </a>
          </nav>
          <button
            type="button"
            className={styles.navToggle}
            aria-label="Меню"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <section id="top" className={styles.hero}>
        <div className={styles.heroWaves} aria-hidden="true" />
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <motion.div
            className={styles.heroCopy}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.eyebrow}>
              <Sparkle className={styles.eyebrowSparkle} />
              Чиангмай · с октября 2025
            </span>
            <h1 className={styles.heroTitle}>
              Тёплый <em>дом</em>
              <br />
              для встреч
              <br />и вдохновения
            </h1>
            <p className={styles.heroLead}>
              OmHome — живое пространство встреч, практик, разговоров и людей. Киртаны, кино, квизы, йога и чайные
              вечера: без алкоголя и мяса, по донейшену. Приходите как домой.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.buttonGold} href="#afisha">
                Смотреть афишу
              </a>
              <a className={styles.buttonGhost} href={LINKS.chat} target="_blank" rel="noreferrer">
                Войти в чат сообщества
              </a>
            </div>
          </motion.div>

          <div className={styles.heroArches} aria-hidden="true">
            <motion.div
              className={`${styles.arch} ${styles.archMain}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={photoHall} alt="" />
            </motion.div>
            <motion.div
              className={`${styles.arch} ${styles.archSmall}`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={photoKirtan} alt="" />
            </motion.div>
            <motion.img
              className={styles.heroLogo}
              src={logo}
              alt=""
              initial={{ opacity: 0, rotate: -8 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            />
            <Sparkle className={`${styles.floatSparkle} ${styles.floatSparkleOne}`} />
            <Sparkle className={`${styles.floatSparkle} ${styles.floatSparkleTwo}`} />
          </div>
        </div>

        <div className={`${styles.container} ${styles.stats}`}>
          {stats.map((stat) => (
            <motion.div key={stat.label} className={styles.stat} {...reveal}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <Afisha />

      <section id="about" className={styles.aboutSection}>
        <div className={styles.container}>
          <SectionHeading eyebrow="О доме">
            Не просто площадка — <em>настоящий дом</em>
          </SectionHeading>
          <motion.p className={styles.aboutLead} {...reveal}>
            Здесь живут люди, которые создают атмосферу уюта и заботы. Можно прийти на вечер, поработать за ноутбуком
            с чаем и печеньками, познакомиться с теми, кто тоже ищет живое общение, — или предложить своё событие.
          </motion.p>
          <div className={styles.formatsGrid}>
            {FORMATS.map((format, index) => (
              <motion.article
                key={format.title}
                className={styles.formatCard}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.08 }}
              >
                <img src={format.art} alt="" />
                <h3>{format.title}</h3>
                <p>{format.text}</p>
              </motion.article>
            ))}
          </div>

          <motion.div className={styles.weekRhythm} {...reveal}>
            <h3>Ритм недели</h3>
            <div className={styles.weekGrid}>
              {WEEK.map((item) => (
                <div key={item.day} className={styles.weekItem}>
                  <span>{item.day}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.gallerySection} aria-label="Фотографии OmHome">
        <Marquee images={GALLERY_TOP} />
        <Marquee images={GALLERY_BOTTOM} reverse />
        <div className={`${styles.container} ${styles.galleryCopy}`}>
          <motion.p {...reveal}>
            Мы уже открывали такие дома в <a href={LINKS.batumi} target="_blank" rel="noreferrer">Батуми</a> и{' '}
            <a href={LINKS.belgrade} target="_blank" rel="noreferrer">Белграде</a>. Сотни вечеров, лекций, квартирников и
            киртанов — теперь эта атмосфера живёт в Чиангмае.
          </motion.p>
        </div>
      </section>

      <section className={styles.valuesSection}>
        <div className={`${styles.container} ${styles.valuesGrid}`}>
          <motion.img className={styles.valuesArt} src={artCow} alt="" {...reveal} />
          <div>
            <SectionHeading eyebrow="Принципы" light>
              Пространство доверия <em>и чистоты</em>
            </SectionHeading>
            <motion.ul className={styles.valuesList} {...reveal}>
              <li>
                <Sparkle className={styles.inlineSparkle} />
                Без алкоголя, наркотиков и мяса — только вегетарианское угощение.
              </li>
              <li>
                <Sparkle className={styles.inlineSparkle} />
                Формат участия — донейшен: вы сами решаете, сколько вложить. Можно прийти и без пожертвования.
              </li>
              <li>
                <Sparkle className={styles.inlineSparkle} />
                Уважение, дружба и забота друг о друге важнее любых правил.
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      <ArchiveSection archive={archive} today={todayInChiangMai()} />

      <ReviewsSection />

      <section id="support" className={styles.supportSection}>
        <div className={styles.container}>
          <SectionHeading eyebrow="Поддержать">
            Дом живёт <em>благодаря вам</em>
          </SectionHeading>
          <motion.p className={styles.supportLead} {...reveal}>
            Пожертвования идут на аренду дома, прасад, чай, оборудование и уют. Любая сумма — это ещё один тёплый вечер
            для кого-то, кто только приехал в город.
          </motion.p>

          <div className={styles.paymentGrid}>
            {PAYMENT_METHODS.map((method) => (
              <motion.article
                key={method.id}
                className={`${styles.paymentCard} ${method.qr ? styles.paymentCardQr : ''}`}
                {...reveal}
              >
                <h3>{method.title}</h3>
                <p className={styles.paymentHint}>{method.hint}</p>
                {method.qr && (
                  <a href={method.qr} target="_blank" rel="noreferrer" className={styles.qrWrap}>
                    <img src={method.qr} alt="QR-код PromptPay / TrueMoney — Artem Artemev" loading="lazy" />
                  </a>
                )}
                {method.rows?.map((row) => (
                  <div key={row.label} className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>{row.label}</span>
                    <code>{row.value}</code>
                    <CopyButton value={row.copy ?? row.value} />
                  </div>
                ))}
              </motion.article>
            ))}
          </div>

          <motion.p className={styles.supportNote} {...reveal}>
            После перевода напишите{' '}
            <a href={LINKS.contact} target="_blank" rel="noreferrer">
              @artartemev
            </a>{' '}
            — скажем спасибо лично 🙏
          </motion.p>
        </div>
      </section>

      <section id="projects" className={styles.projectsSection}>
        <div className={styles.container}>
          <SectionHeading eyebrow="Проекты" light>
            Что ещё мы <em>делаем</em>
          </SectionHeading>
          <div className={styles.projectsGrid}>
            {PROJECTS.map((project) => (
              <motion.a
                key={project.title}
                href={project.href}
                target={project.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className={`${styles.projectCard} ${styles[`project_${project.tone}`]}`}
                {...reveal}
              >
                <span className={styles.projectTag}>{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <span className={styles.projectCta}>
                  {project.cta} <ArrowUpRight size={18} />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.initiativeSection}>
        <div className={`${styles.container} ${styles.initiativeInner}`}>
          <motion.div {...reveal}>
            <Sparkles className={styles.initiativeIcon} size={36} />
            <h2>
              Есть идея для <em>вечера?</em>
            </h2>
            <p>
              Йога, мастер-класс, квартирник, лекция или настолка — OmHome живая площадка, и ваше событие может стать
              частью афиши.
            </p>
          </motion.div>
          <motion.a className={styles.buttonGold} href={LINKS.contact} target="_blank" rel="noreferrer" {...reveal}>
            Предложить событие
          </motion.a>
        </div>
      </section>

      <section id="map" className={styles.locationSection}>
        <div className={`${styles.container} ${styles.locationGrid}`}>
          <motion.img className={styles.locationArt} src={artCity} alt="" {...reveal} />
          <div>
            <SectionHeading eyebrow="Как найти" light>
              Новый дом <em>с сентября 2026</em>
            </SectionHeading>
            <motion.p className={styles.locationText} {...reveal}>
              В сентябре OmHome переехал в новый дом — тихий мубан, куда удобно добраться на байке или Grab. Точка на
              карте и запись — по кнопкам ниже.
            </motion.p>
            <motion.div className={styles.locationActions} {...reveal}>
              <a className={styles.buttonGold} href={LINKS.map} target="_blank" rel="noreferrer">
                <MapPin size={18} />
                Открыть в Google Maps
              </a>
              <a className={styles.buttonGhost} href={LINKS.contact} target="_blank" rel="noreferrer">
                Записаться: @artartemev
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <Sparkle className={styles.navSparkle} />
            OmHome Space · Чиангмай
          </div>
          <div className={styles.footerLinks}>
            <a href={LINKS.channel} target="_blank" rel="noreferrer">
              <Send size={16} /> Канал
            </a>
            <a href={LINKS.chat} target="_blank" rel="noreferrer">
              <Send size={16} /> Чат
            </a>
            <a href={LINKS.instagram} target="_blank" rel="noreferrer">
              <Instagram size={16} /> Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
