import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { formatEventDate, type Archive as ArchiveData } from './useEvents';
import styles from '../ChiangMaiHomePage.module.css';

export const CATEGORY_LABELS: Record<string, string> = {
  games: 'Игры',
  kirtan: 'Киртаны',
  cinema: 'Кино',
  practice: 'Практики',
  talks: 'Беседы и лекции',
  tea: 'Чай',
  creative: 'Творчество',
  special: 'Праздники',
  other: 'Разное'
};

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const PAGE = 12;

export function ArchiveSection({ archive, today }: { archive: ArchiveData | null; today: string }) {
  const [filter, setFilter] = useState<string>('all');
  const [visible, setVisible] = useState(PAGE);

  const past = useMemo(
    () => (archive?.events ?? []).filter((event) => event.date < today).reverse(),
    [archive, today]
  );
  const filtered = filter === 'all' ? past : past.filter((event) => event.category === filter);
  const categories = Object.entries(archive?.byCategory ?? {}).sort((a, b) => b[1] - a[1]);

  if (!archive) return null;

  return (
    <section id="archive" className={styles.archiveSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeading}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <span className={styles.eyebrow}>Архив</span>
          <h2>
            {archive.total} событий <em>за первый год</em>
          </h2>
        </motion.div>
        <p className={styles.archiveLead}>
          Всё, что прошло в OmHome Chiang Mai с октября 2025 года, — собрано из анонсов канала. Нажмите на карточку, чтобы
          открыть исходный пост.
        </p>

        <div className={styles.archiveFilters} role="tablist" aria-label="Категории">
          <button
            type="button"
            className={filter === 'all' ? styles.chipActive : styles.chip}
            onClick={() => {
              setFilter('all');
              setVisible(PAGE);
            }}
          >
            Все · {past.length}
          </button>
          {categories.map(([key, count]) => (
            <button
              key={key}
              type="button"
              className={filter === key ? styles.chipActive : styles.chip}
              onClick={() => {
                setFilter(key);
                setVisible(PAGE);
              }}
            >
              {CATEGORY_LABELS[key] ?? key} · {count}
            </button>
          ))}
        </div>

        <div className={styles.archiveGrid}>
          {filtered.slice(0, visible).map((event) => {
            const [, month, day] = event.date.split('-').map(Number);
            return (
              <a
                key={`${event.date}-${event.title}`}
                className={styles.archiveCard}
                href={event.post}
                target="_blank"
                rel="noreferrer"
              >
                <div className={styles.archivePhoto}>
                  {event.photo ? <img src={event.photo} alt="" loading="lazy" /> : <span>{CATEGORY_LABELS[event.category]}</span>}
                </div>
                <div className={styles.archiveBody}>
                  <p className={styles.archiveDate}>
                    {formatEventDate(event.date).weekday} · {day} {MONTHS[month - 1]}
                    {event.time ? ` · ${event.time}` : ''}
                  </p>
                  <h3>{event.title}</h3>
                  {event.description && <p className={styles.archiveDescription}>{event.description}</p>}
                  <span className={styles.archiveTag}>
                    {CATEGORY_LABELS[event.category]} <ArrowUpRight size={14} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {visible < filtered.length && (
          <div className={styles.archiveMore}>
            <button type="button" className={styles.buttonGhost} onClick={() => setVisible((count) => count + PAGE * 2)}>
              Показать ещё · осталось {filtered.length - visible}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
