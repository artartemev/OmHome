import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, Download, Pause, Play, Printer, SkipForward, Send } from 'lucide-react';
import damodara from '../assets/kartika/damodara.jpg';
import { formatEventDate, todayInChiangMai } from './home/useEvents';
import { Altar, Diya } from './kartika/Altar';
import { BOOKS, KARTIKA, LILA, SPECIAL_DAYS, TRACKS, VERSES, VOWS } from './kartika/content';
import { kartikaDays, kartikaStatus, syncFlameLit, useLamps, useVows } from './kartika/storage';
import styles from './kartika/Kartika.module.css';

// Drop lila-1.jpg … lila-5.jpg into src/assets/kartika and each chapter picks its picture up.
const LILA_IMAGES = import.meta.glob<string>('../assets/kartika/lila-*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
});
const lilaImage = (index: number) =>
  Object.entries(LILA_IMAGES).find(([path]) => new RegExp(`lila-${index + 1}\\.`).test(path))?.[1];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

const LINKS = {
  channel: 'https://t.me/omhome_thai',
  contact: 'https://t.me/artartemev'
};

const NAV = [
  { href: '#lila', label: 'Лила' },
  { href: '#ashtaka', label: 'Дамодараштака' },
  { href: '#vrata', label: 'Обет' },
  { href: '#books', label: 'Книги' },
  { href: '#print', label: 'Для печати' }
];

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const longDate = (date: string) => {
  const [, month, day] = date.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]}`;
};

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }
};

function Heading({ eyebrow, children, id }: { eyebrow: string; children: ReactNode; id?: string }) {
  return (
    <motion.div className={styles.heading} id={id} {...reveal}>
      <span className={styles.eyebrow}>
        <span className={styles.eyebrowFlame} />
        {eyebrow}
      </span>
      <h2 className="flame-text">{children}</h2>
    </motion.div>
  );
}

const plural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

function usePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);
  const track = TRACKS[index];

  const play = (next = index) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (next !== index) {
      setIndex(next);
      setTime(0);
      setDuration(0);
      setFailed(false);
      audio.src = TRACKS[next].src;
    }
    audio.play().catch(() => setPlaying(false));
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  };

  const seek = (fraction: number) => {
    const audio = audioRef.current;
    if (audio && duration) audio.currentTime = fraction * duration;
  };

  const element = (
    <audio
      ref={audioRef}
      src={track.src}
      preload="none"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
      onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
      onError={() => {
        setFailed(true);
        setPlaying(false);
      }}
      onEnded={() => play((index + 1) % TRACKS.length)}
    />
  );

  return { element, track, index, playing, time, duration, failed, play, toggle, seek, next: () => play((index + 1) % TRACKS.length) };
}

type Player = ReturnType<typeof usePlayer>;

function Progress({ player, className }: { player: Player; className?: string }) {
  const fraction = player.duration ? player.time / player.duration : 0;
  return (
    <div
      className={`${styles.progress} ${className ?? ''}`}
      role="slider"
      tabIndex={0}
      aria-label="Перемотка"
      aria-valuemin={0}
      aria-valuemax={Math.round(player.duration)}
      aria-valuenow={Math.round(player.time)}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        player.seek((event.clientX - rect.left) / rect.width);
      }}
      onKeyDown={(event) => {
        if (!player.duration) return;
        if (event.key === 'ArrowRight') player.seek(Math.min(1, (player.time + 10) / player.duration));
        if (event.key === 'ArrowLeft') player.seek(Math.max(0, (player.time - 10) / player.duration));
      }}
    >
      <span style={{ width: `${fraction * 100}%` }} />
    </div>
  );
}

function MiniPlayer({ player }: { player: Player }) {
  return (
    <div className={styles.miniPlayer}>
      <button
        type="button"
        className={styles.miniPlay}
        onClick={player.toggle}
        aria-label={player.playing ? 'Пауза' : 'Слушать Дамодараштаку'}
      >
        {player.playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className={styles.miniInfo}>
        <strong>{player.track.title}</strong>
        <span>{player.failed ? 'Запись не загрузилась — попробуйте другую' : player.track.artist}</span>
        <Progress player={player} className={styles.miniProgress} />
      </div>
      <button type="button" className={styles.miniNext} onClick={player.next} aria-label="Следующая запись">
        <SkipForward size={16} />
      </button>
    </div>
  );
}

function LampCalendar({ lamps, onToday }: { lamps: Record<string, number>; onToday: () => void }) {
  const today = todayInChiangMai();
  const days = kartikaDays();
  const litCount = days.filter((day) => lamps[day]).length;

  return (
    <motion.div className={styles.calendar} {...reveal}>
      <div className={styles.calendarHead}>
        <h3>Лампады месяца</h3>
        <p>
          Зажжено {litCount} из {days.length}. Каждый вечер в этом ряду загорается ещё один огонёк.
        </p>
      </div>
      <div className={styles.calendarGrid}>
        {days.map((day) => {
          const { weekday } = formatEventDate(day);
          const isToday = day === today;
          const future = day > today;
          return (
            <button
              type="button"
              key={day}
              className={`${styles.calendarDay} ${isToday ? styles.calendarToday : ''} ${future ? styles.calendarFuture : ''}`}
              onClick={isToday ? onToday : undefined}
              disabled={!isToday}
              title={isToday ? 'Сегодня — предложить лампаду' : longDate(day)}
            >
              <Diya lit={Boolean(lamps[day])} className={styles.calendarDiya} />
              <strong>{Number(day.slice(8))}</strong>
              <span>{weekday}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

type PrintKind = 'image' | 'card' | 'tracker';

function PrintSheets({ kind, script, vows }: { kind: PrintKind | null; script: 'latin' | 'cyrillic'; vows: string[] }) {
  if (!kind) return null;
  return (
    <div className={styles.printArea}>
      {(kind === 'image' || kind === 'card') && (
        <section className={styles.printPage}>
          <img className={styles.printImage} src={KARTIKA.printImage} alt="" />
          <p className={styles.printCaption}>Шри Дамодара</p>
        </section>
      )}
      {kind === 'card' && (
        <section className={`${styles.printPage} ${styles.printText}`}>
          <h1>Шри Дамодараштака</h1>
          <p className={styles.printSub}>Сатьяврата Муни · «Падма-пурана»</p>
          <div className={styles.printVerses}>
            {VERSES.map((verse, index) => (
              <div key={index} className={styles.printVerse}>
                <span>{index + 1}</span>
                <p className={styles.printSanskrit}>
                  {verse[script].map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
                <p>{verse.meaning}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {kind === 'tracker' && (
        <section className={`${styles.printPage} ${styles.printTracker}`}>
          <img src={damodara} alt="" />
          <h1>Мой обет на Картику</h1>
          <p className={styles.printSub}>
            {longDate(KARTIKA.start)} — {longDate(KARTIKA.end)} {KARTIKA.end.slice(0, 4)}
          </p>
          <ul>
            {(vows.length ? vows : ['', '', '']).map((vow, index) => (
              <li key={index}>{vow}</li>
            ))}
          </ul>
          <div className={styles.printLamps}>
            {kartikaDays().map((day) => (
              <div key={day}>
                <svg viewBox="0 0 40 46" aria-hidden="true">
                  <path d="M20 4c5 8 7 12 7 16a7 7 0 0 1-14 0c0-4 2-8 7-16Z" />
                  <path d="M3 30c0 8 8 13 17 13s17-5 17-13c-5 2-10 3-17 3S8 32 3 30Z" />
                </svg>
                <span>{longDate(day)}</span>
              </div>
            ))}
          </div>
          <p className={styles.printFoot}>Каждый вечер, предложив лампаду, раскрасьте один огонёк · omhome.space/kartika</p>
        </section>
      )}
    </div>
  );
}

export function KartikaPage() {
  const player = usePlayer();
  const { lamps, offer, total } = useLamps();
  const { vows, toggle, setOwn } = useVows();
  const [script, setScript] = useState<'latin' | 'cyrillic'>('cyrillic');
  const [printKind, setPrintKind] = useState<PrintKind | null>(null);
  const altarAnchor = useRef<HTMLDivElement>(null);
  const status = kartikaStatus();
  const today = todayInChiangMai();

  useEffect(() => {
    document.title = 'Картика · месяц Дамодары — OmHome';
    syncFlameLit();
  }, []);

  useEffect(() => {
    if (!printKind) return;
    let cancelled = false;
    const done = () => setPrintKind(null);
    window.addEventListener('afterprint', done);
    // The A4 picture is large: print only once the sheets' images are decoded, or the page comes out blank.
    const images = [...document.querySelectorAll<HTMLImageElement>(`.${styles.printArea} img`)];
    Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (!cancelled) window.print();
    });
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', done);
    };
  }, [printKind]);

  const chosenVows = [...VOWS.filter((vow) => vows.chosen.includes(vow.id)).map((vow) => vow.title), vows.own.trim()].filter(Boolean);
  const scrollToAltar = () => altarAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const upcoming = SPECIAL_DAYS.filter((day) => day.date >= today);
  const nextDay = upcoming[0];

  const statusLine =
    status.phase === 'before'
      ? `До начала Картики ${status.daysLeft} ${plural(status.daysLeft, 'день', 'дня', 'дней')}`
      : status.phase === 'during'
        ? `Сегодня ${status.day}-й день Картики из ${status.total}`
        : 'Картика этого года завершилась, но лампаду можно предлагать всегда';

  return (
    <div className={styles.page}>
      {player.element}
      <div className={styles.screen}>
        <div className={styles.embers} aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>

        <header className={styles.nav}>
          <div className={styles.navInner}>
            <a href="/" className={styles.navBrand}>
              <ArrowLeft size={16} />
              OmHome
            </a>
            <nav className={styles.navLinks}>
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <motion.div
              className={styles.heroCopy}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={styles.eyebrow}>
                <span className={styles.eyebrowFlame} />
                Картика · {longDate(KARTIKA.start)} — {longDate(KARTIKA.end)}
              </span>
              <h1 className={`flame-text ${styles.heroTitle}`}>
                Месяц <em>Дамодары</em>
              </h1>
              <p className={styles.heroLead}>
                Самый тёплый месяц года. Каждый вечер — маленькая лампада перед малышом Кришной, которого мама привязала
                к ступе, и восемь древних молитв о Нём.
              </p>
              <p className={styles.heroStatus}>
                <span className={styles.statusDot} />
                {statusLine}
                {total > 0 && ` · вы зажгли ${total} ${plural(total, 'лампаду', 'лампады', 'лампад')}`}
              </p>
              <div className={styles.heroActions}>
                <button type="button" className={styles.buttonGold} onClick={() => player.toggle()}>
                  {player.playing ? <Pause size={18} /> : <Play size={18} />}
                  {player.playing ? 'Пауза' : 'Слушать Дамодараштаку'}
                </button>
                <a className={styles.buttonGhost} href="#vrata">
                  Принять обет
                </a>
              </div>
              {nextDay && (
                <p className={styles.heroNext}>
                  Ближайший особый день — <strong>{nextDay.title}</strong>, {longDate(nextDay.date)}
                </p>
              )}
            </motion.div>

            <motion.div
              ref={altarAnchor}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Altar offeredToday={lamps[today] ?? 0} onOffer={offer} />
            </motion.div>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.container}>
            <Heading eyebrow="Что такое Картика">
              Месяц, когда любовь <em>весит больше</em>
            </Heading>
            <motion.p className={styles.lead} {...reveal}>
              Картика, или Дамодара-маса, — осенний месяц ведического календаря. В «Падма-пуране» говорится, что из
              всех месяцев он самый дорогой Кришне: любое служение в эти дни — молитва, лампада, страница священной
              книги — приносит плод во много раз больший, чем обычно. Это время не подвигов, а постоянства: понемногу,
              но каждый день и с любовью.
            </motion.p>
            <div className={styles.pillars}>
              {[
                {
                  title: 'Лампада',
                  text: 'Главное подношение месяца — огонёк на топлёном масле. Даже одна лампада, предложенная с любовью, освещает сердце.'
                },
                {
                  title: 'Песня',
                  text: 'Дамодараштака — восемь молитв мудреца Сатьявраты. Их поют каждый вечер, пока лампада кружит перед Господом.'
                },
                {
                  title: 'Обет',
                  text: 'Картика-врата — небольшое личное обещание на весь месяц: больше джапы и чтения, ранний подъём, меньше лишнего.'
                }
              ].map((pillar, index) => (
                <motion.article
                  key={pillar.title}
                  className={`flame-shadow ${styles.pillar}`}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.12 }}
                >
                  <Diya lit className={styles.pillarDiya} />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </motion.article>
              ))}
            </div>

            <motion.div className={styles.howto} {...reveal}>
              <h3>Как предложить лампаду дома</h3>
              <ol>
                <li>
                  <strong>Изображение.</strong> Поставьте картинку Дамодары — её можно распечатать в конце страницы.
                </li>
                <li>
                  <strong>Фитилёк.</strong> Скрутите из ваты тонкий фитиль, пропитайте его гхи (топлёным маслом) и
                  положите в маленькую плошку. Можно взять и свечу.
                </li>
                <li>
                  <strong>Арати.</strong> Зажгите фитилёк и под пение Дамодараштаки плавно ведите лампаду по часовой
                  стрелке: четыре круга у стоп, два у живота, три у лица и семь — вокруг всего облика.
                </li>
                <li>
                  <strong>Тишина.</strong> Поставьте лампаду перед изображением и побудьте рядом. Позовите близких —
                  пусть и они предложат свой огонёк.
                </li>
              </ol>
            </motion.div>
          </div>
        </section>

        <section id="lila" className={styles.lila}>
          <div className={styles.container}>
            <Heading eyebrow="Дамодара-лила">
              Бог, которого <em>связала любовь</em>
            </Heading>
            <ol className={styles.chapters}>
              {LILA.map((chapter, index) => {
                const image = lilaImage(index);
                return (
                  <li key={chapter.title} className={`${styles.chapter} ${image ? '' : styles.chapterTextOnly}`}>
                    {image && (
                      <motion.figure className={`flame-shadow ${styles.chapterFigure}`} {...reveal}>
                        <img src={image} alt={chapter.title} loading="lazy" />
                      </motion.figure>
                    )}
                    <motion.div className={styles.chapterBody} {...reveal}>
                      <span className={styles.chapterMark}>
                        <Diya lit className={styles.chapterDiya} />
                        {ROMAN[index]}
                      </span>
                      <h3 className="flame-text">{chapter.title}</h3>
                      {chapter.text.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                      ))}
                    </motion.div>
                  </li>
                );
              })}
            </ol>
            <motion.blockquote className={styles.quote} {...reveal}>
              Тот, кого мудрецы не могут постичь даже в медитации, позволил матери связать Себя: её любовь оказалась
              сильнее любого знания о Его величии.
              <cite>по «Шримад-Бхагаватам», 10.9</cite>
            </motion.blockquote>
          </div>
        </section>

        <section id="ashtaka" className={styles.ashtaka}>
          <div className={styles.container}>
            <Heading eyebrow="Шри Дамодараштака">
              Восемь молитв <em>для вечерней лампады</em>
            </Heading>

            <motion.div className={`flame-shadow ${styles.player}`} {...reveal}>
              <div className={styles.playerNow}>
                <button
                  type="button"
                  className={styles.playerBig}
                  onClick={player.toggle}
                  aria-label={player.playing ? 'Пауза' : 'Слушать'}
                >
                  {player.playing ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <div className={styles.playerInfo}>
                  <strong>{player.track.title}</strong>
                  <span>
                    {player.track.artist}
                    {player.track.note && ` · ${player.track.note}`}
                  </span>
                  <Progress player={player} />
                  <span className={styles.playerTime}>
                    {formatTime(player.time)} / {formatTime(player.duration)}
                  </span>
                </div>
              </div>
              <ul className={styles.trackList}>
                {TRACKS.map((track, index) => (
                  <li key={track.id}>
                    <button
                      type="button"
                      className={`${styles.trackItem} ${index === player.index ? styles.trackActive : ''}`}
                      onClick={() => (index === player.index ? player.toggle() : player.play(index))}
                    >
                      <span className={styles.trackKind}>{track.kind === 'song' ? 'Песня' : 'Лекция'}</span>
                      <span className={styles.trackTitle}>
                        {track.kind === 'song' ? track.artist : track.title}
                      </span>
                      <span className={styles.trackNote}>{track.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {player.failed && <p className={styles.playerError}>Эта запись сейчас не загружается — выберите другую.</p>}
            </motion.div>

            <div className={styles.scriptToggle} role="group" aria-label="Как показать санскрит">
              <button
                type="button"
                className={script === 'cyrillic' ? styles.scriptActive : ''}
                onClick={() => setScript('cyrillic')}
              >
                Кириллица
              </button>
              <button
                type="button"
                className={script === 'latin' ? styles.scriptActive : ''}
                onClick={() => setScript('latin')}
              >
                IAST
              </button>
            </div>

            <div className={styles.verses}>
              {VERSES.map((verse, index) => (
                <motion.article key={index} className={styles.verse} {...reveal}>
                  <span className={styles.verseNumber}>{index + 1}</span>
                  <p className={styles.sanskrit}>
                    {verse[script].map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                  <p className={styles.meaning}>{verse.meaning}</p>
                </motion.article>
              ))}
            </div>
            <motion.div className={styles.centerActions} {...reveal}>
              <button type="button" className={styles.buttonGhost} onClick={() => setPrintKind('card')}>
                <Printer size={18} />
                Распечатать с текстом молитвы
              </button>
            </motion.div>
          </div>
        </section>

        <section id="vrata" className={styles.vrata}>
          <div className={styles.container}>
            <Heading eyebrow="Картика-врата">
              Мой обет <em>на этот месяц</em>
            </Heading>
            <motion.p className={styles.lead} {...reveal}>
              Выберите одно-два обещания, которые вы точно сможете держать до конца месяца. Лучше маленький обет на
              все {status.total} {plural(status.total, 'день', 'дня', 'дней')}, чем большой — на три. Выбор сохранится в этом браузере.
            </motion.p>
            <motion.div className={styles.vows} {...reveal}>
              {VOWS.map((vow) => {
                const on = vows.chosen.includes(vow.id);
                return (
                  <button
                    type="button"
                    key={vow.id}
                    className={`${styles.vow} ${on ? styles.vowOn : ''}`}
                    onClick={() => toggle(vow.id)}
                    aria-pressed={on}
                  >
                    <Diya lit={on} className={styles.vowDiya} />
                    <span>
                      <strong>{vow.title}</strong>
                      <small>{vow.hint}</small>
                    </span>
                  </button>
                );
              })}
              <label className={styles.vowOwn}>
                <span>Свой обет</span>
                <input
                  value={vows.own}
                  onChange={(event) => setOwn(event.target.value)}
                  placeholder="Например: каждый день звонить маме"
                  maxLength={80}
                />
              </label>
            </motion.div>

            <LampCalendar lamps={lamps} onToday={scrollToAltar} />
          </div>
        </section>

        <section className={styles.days}>
          <div className={styles.container}>
            <Heading eyebrow="Особые дни">
              Огоньки <em>внутри месяца</em>
            </Heading>
            <ul className={styles.daysList}>
              {SPECIAL_DAYS.map((day) => {
                const { weekday } = formatEventDate(day.date);
                return (
                  <motion.li key={day.date} className={`${styles.dayItem} ${day.date < today ? styles.dayPast : ''}`} {...reveal}>
                    <span className={styles.dayDate}>
                      <strong>{longDate(day.date)}</strong>
                      {weekday}
                    </span>
                    <span>
                      <h3>{day.title}</h3>
                      <p>{day.text}</p>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
            <p className={styles.note}>Даты — для Чиангмая. Время поста и выхода из него уточняйте по вайшнавскому календарю.</p>
          </div>
        </section>

        <section id="books" className={styles.books}>
          <div className={styles.container}>
            <Heading eyebrow="Читать и слушать">
              Книги <em>для вечеров Картики</em>
            </Heading>
            <div className={styles.booksGrid}>
              {BOOKS.map((book, index) => (
                <motion.article
                  key={book.title}
                  className={`flame-shadow ${styles.book}`}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: (index % 3) * 0.08 }}
                >
                  <span className={styles.bookPart}>{book.author}</span>
                  <h3>{book.title}</h3>
                  <p>{book.text}</p>
                  <span className={styles.bookLinks}>
                    {book.file && (
                      <a className={styles.bookCta} href={book.file.href} download>
                        <Download size={16} /> {book.file.label}
                      </a>
                    )}
                    {book.listen && (
                      <a className={styles.bookCta} href={book.listen.href} target="_blank" rel="noreferrer">
                        {book.listen.label} <ArrowUpRight size={16} />
                      </a>
                    )}
                  </span>
                </motion.article>
              ))}
            </div>
            <motion.p className={styles.note} {...reveal}>
              Аудиокниги — в Telegram-каналах, а лекции о каждом стихе Дамодараштаки — в плеере выше, сразу после песен.
            </motion.p>
          </div>
        </section>

        <section id="print" className={styles.print}>
          <div className={styles.container}>
            <Heading eyebrow="Стартер-пак">
              Распечатать <em>и поставить на алтарь</em>
            </Heading>
            <div className={styles.printGrid}>
              <motion.article className={`flame-shadow ${styles.printCard}`} {...reveal}>
                <img src={damodara} alt="" loading="lazy" />
                <h3>Картинка Дамодары</h3>
                <p>Высокое разрешение, формат A4 — для домашнего алтаря.</p>
                <div className={styles.printActions}>
                  <a className={styles.buttonGold} href={KARTIKA.printImage} download="Damodara-A4.jpg">
                    <Download size={18} /> Скачать
                  </a>
                  <button type="button" className={styles.buttonGhost} onClick={() => setPrintKind('image')}>
                    <Printer size={18} /> Печать
                  </button>
                </div>
              </motion.article>
              <motion.article className={`flame-shadow ${styles.printCard}`} {...reveal}>
                <div className={styles.printPreviewText}>
                  {VERSES[0].cyrillic.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
                <h3>Карточка с молитвой</h3>
                <p>Два листа: картинка и восемь стихов Дамодараштаки с переводом, чтобы петь по ним вечером.</p>
                <div className={styles.printActions}>
                  <button type="button" className={styles.buttonGold} onClick={() => setPrintKind('card')}>
                    <Printer size={18} /> Распечатать
                  </button>
                </div>
              </motion.article>
              <motion.article className={`flame-shadow ${styles.printCard}`} {...reveal}>
                <div className={styles.printPreviewLamps}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <Diya key={i} lit={i < 4} className={styles.previewDiya} />
                  ))}
                </div>
                <h3>Трекер обета</h3>
                <p>Ваши обеты и {status.total} огоньков: раскрашивайте по одному каждый вечер. Можно вместе с детьми.</p>
                <div className={styles.printActions}>
                  <button type="button" className={styles.buttonGold} onClick={() => setPrintKind('tracker')}>
                    <Printer size={18} /> Распечатать
                  </button>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        <section className={styles.invite}>
          <div className={`${styles.container} ${styles.inviteInner}`}>
            <motion.div {...reveal}>
              <h2 className="flame-text">
                Петь вместе — <em>в OmHome</em>
              </h2>
              <p>
                По субботам у нас киртан, а в Картику мы поём с лампадами для Дамодары. Приходите со своим огоньком —
                или зажгите наш.
              </p>
            </motion.div>
            <motion.div className={styles.inviteActions} {...reveal}>
              <a className={styles.buttonGold} href="/#afisha">
                Афиша OmHome
              </a>
              <a className={styles.buttonGhost} href={LINKS.channel} target="_blank" rel="noreferrer">
                <Send size={16} /> Telegram
              </a>
            </motion.div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <p>
              Дамодараштака — в исполнении Ниранджаны Свами и Аруны деви. Книги и изображения Дамодары — для
              личного чтения и домашнего алтаря, не для продажи.
            </p>
            <a href="/">OmHome · Чиангмай</a>
          </div>
        </footer>

        <MiniPlayer player={player} />
      </div>

      <PrintSheets kind={printKind} script={script} vows={chosenVows} />
    </div>
  );
}
