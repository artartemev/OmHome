import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import promptPayQr from '../../assets/support/promptpay.jpg';
import styles from '../ChiangMaiHomePage.module.css';

const CONTACT = 'https://t.me/artartemev';

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
};

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

// Donation details. Used on the home page (#support) and on its own at omhome.space/donate.
export function SupportSection({ standalone = false }: { standalone?: boolean }) {
  // On /donate the details must be visible at once, without waiting for scroll-triggered animations.
  const appear = standalone ? {} : reveal;
  return (
    <section id="support" className={`${styles.supportSection} ${standalone ? styles.supportStandalone : ''}`}>
      <div className={styles.container}>
        <motion.div className={styles.sectionHeading} {...appear}>
          <span className={styles.eyebrow}>Поддержать</span>
          <h2>
            Дом живёт <em>благодаря вам</em>
          </h2>
        </motion.div>
        <motion.p className={styles.supportLead} {...appear}>
          Пожертвования идут на аренду дома, прасад, чай, оборудование и уют. Любая сумма — это ещё один тёплый вечер для
          кого-то, кто только приехал в город.
        </motion.p>

        <div className={styles.paymentGrid}>
          {PAYMENT_METHODS.map((method) => (
            <motion.article
              key={method.id}
              className={`${styles.paymentCard} ${method.qr ? styles.paymentCardQr : ''}`}
              {...appear}
            >
              <h3>{method.title}</h3>
              <p className={styles.paymentHint}>{method.hint}</p>
              {method.qr && (
                <a href={method.qr} target="_blank" rel="noreferrer" className={styles.qrWrap}>
                  <img src={method.qr} alt="QR-код PromptPay / TrueMoney — Artem Artemev" loading={standalone ? 'eager' : 'lazy'} />
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

        <motion.p className={styles.supportNote} {...appear}>
          После перевода напишите{' '}
          <a href={CONTACT} target="_blank" rel="noreferrer">
            @artartemev
          </a>{' '}
          — скажем спасибо лично 🙏
        </motion.p>
      </div>
    </section>
  );
}
