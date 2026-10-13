import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Instagram, MessageSquareHeart, Star } from 'lucide-react';
import styles from '../ChiangMaiHomePage.module.css';

const PREVIEW_LENGTH = 320;

// Long reviews show their beginning (cut on a word) and open in full on «Читать полностью», paragraphs kept.
function ReviewText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  if (text.length <= PREVIEW_LENGTH) return <p className={styles.reviewText}>{text}</p>;
  const preview = `${text.slice(0, text.lastIndexOf(' ', PREVIEW_LENGTH)).replace(/[.,;:!?—\s]+$/, '')}…`;
  return (
    <>
      <p className={styles.reviewText}>{open ? text : preview}</p>
      <button type="button" className={styles.reviewMore} onClick={() => setOpen(!open)}>
        {open ? 'Свернуть' : 'Читать полностью'}
      </button>
    </>
  );
}

type Review = { author: string; rating: number; text: string; when?: string; photo?: string };
type ReviewsData = { rating?: number; count?: number; reviews: Review[]; mapsUrl?: string; writeReviewUrl?: string };

// Google Maps card of OmHome Space. Rating and reviews come from public/reviews.json,
// refreshed by automation/reviews/google_reviews.mjs (no Google API key needed).
const FALLBACK_MAPS_URL = 'https://www.google.com/maps?cid=6928813553851154163';
const INSTAGRAM = 'https://www.instagram.com/omhome.cnx';

function Stars({ value }: { value: number }) {
  return (
    <span className={styles.stars} aria-label={`${value} из 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} fill={n <= Math.round(value) ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}

export function ReviewsSection() {
  const [data, setData] = useState<ReviewsData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}reviews.json`, { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then(setData)
      .catch(() => setData({ reviews: [] }));
  }, []);

  const mapsUrl = data?.mapsUrl ?? FALLBACK_MAPS_URL;
  const writeUrl = data?.writeReviewUrl ?? mapsUrl;
  const reviews = (data?.reviews ?? []).filter((review) => review.text).slice(0, 6);

  return (
    <section id="reviews" className={styles.reviewsSection}>
      <div className={styles.container}>
        <div className={styles.reviewsHeader}>
          <motion.div
            className={`${styles.sectionHeading} ${styles.sectionHeadingLight}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <span className={styles.eyebrow}>Отзывы</span>
            <h2>
              Что говорят <em>гости</em>
            </h2>
          </motion.div>
          {data?.rating && (
            <a className={styles.ratingBadge} href={mapsUrl} target="_blank" rel="noreferrer">
              <strong>{data.rating.toFixed(1)}</strong>
              <span>
                <Stars value={data.rating} />
                {data.count ? `${data.count} отзывов в Google` : 'рейтинг в Google'}
              </span>
            </a>
          )}
        </div>

        {reviews.length > 0 && (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <article key={`${review.author}-${review.when}`} className={styles.reviewCard}>
                <Stars value={review.rating} />
                <ReviewText text={review.text} />
                <footer>
                  {review.photo && <img src={review.photo} alt="" loading="lazy" referrerPolicy="no-referrer" />}
                  <span>
                    <b>{review.author}</b>
                    {review.when && <small>{review.when}</small>}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        )}

        <div className={styles.engageGrid}>
          <article className={styles.engageCard}>
            <MessageSquareHeart size={32} />
            <h3>Были у нас? Расскажите!</h3>
            <p>
              Отзыв в Google помогает новым людям в городе найти тёплое место. Пара предложений — и кто-то не проведёт вечер в
              одиночестве.
            </p>
            <a className={styles.buttonGold} href={writeUrl} target="_blank" rel="noreferrer">
              Оставить отзыв в Google
            </a>
          </article>
          <article className={`${styles.engageCard} ${styles.engageCardAlt}`}>
            <Instagram size={32} />
            <h3>Делитесь моментами</h3>
            <p>
              Снимаете киртан, кино или посиделки? Отмечайте <b>@omhome.cnx</b> в сторис и постах — мы репостим. Фото и видео
              из нашего чата тоже попадают в сторис.
            </p>
            <a className={styles.buttonGhost} href={INSTAGRAM} target="_blank" rel="noreferrer">
              Открыть @omhome.cnx
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
