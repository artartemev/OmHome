import { animate } from 'motion/react';
import { useRef, useState } from 'react';
import damodara from '../../assets/kartika/damodara.jpg';
import { ARATI_STEPS } from './content';
import styles from './Kartika.module.css';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const POINTS_PER_TURN = 28;

export function Diya({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <span className={`${styles.diya} ${lit ? styles.diyaLit : ''} ${className ?? ''}`} aria-hidden="true">
      <span className={styles.diyaGlow} />
      <span className={styles.diyaFlame}>
        <span className={styles.diyaFlameCore} />
      </span>
      <svg className={styles.diyaBowl} viewBox="0 0 120 56">
        <defs>
          <linearGradient id="diyaBrass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6dc9c" />
            <stop offset="0.45" stopColor="#c99a4a" />
            <stop offset="1" stopColor="#6e4a1c" />
          </linearGradient>
          <radialGradient id="diyaGhee" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#fff2c4" />
            <stop offset="1" stopColor="#e2b85e" />
          </radialGradient>
        </defs>
        <path d="M4 14c0 22 24 36 56 36s56-14 56-36c-10 6-30 10-56 10S14 20 4 14Z" fill="url(#diyaBrass)" />
        <ellipse cx="60" cy="14" rx="56" ry="10" fill="#8a6326" />
        <ellipse cx="60" cy="14.5" rx="50" ry="7.5" fill="url(#diyaGhee)" />
        <path d="M96 12c8-4 14-5 20-2-4 3-10 5-18 5Z" fill="#c99a4a" />
        <path d="M100 11.5c3-4 5-7 5-10" stroke="#3a2a14" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M44 54h32l-4-6H48Z" fill="#7c5622" />
      </svg>
    </span>
  );
}

type Phase = 'idle' | 'arati' | 'done';

export function Altar({ offeredToday, onOffer }: { offeredToday: number; onOffer: () => void }) {
  const altarRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [caption, setCaption] = useState('');
  const lit = phase !== 'idle' || offeredToday > 0;

  const offer = async () => {
    const altar = altarRef.current;
    const frame = frameRef.current;
    const lamp = lampRef.current;
    if (!altar || !frame || !lamp || phase === 'arati') return;

    setPhase('arati');
    setCaption('Лампада зажжена');
    await wait(900);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const box = altar.getBoundingClientRect();
      const pic = frame.getBoundingClientRect();
      const rest = lamp.getBoundingClientRect();
      // Where the lamp's flame sits at rest; the arati moves that point around the picture.
      const restX = rest.left + rest.width * 0.875 - box.left;
      const restY = rest.top + rest.height * 0.3 - box.top;
      const toOffset = (fx: number, fy: number) => ({
        x: pic.left - box.left + fx * pic.width - restX,
        y: pic.top - box.top + fy * pic.height - restY
      });
      let at = { x: 0, y: 0 };

      for (const step of ARATI_STEPS) {
        setCaption(`${step.turns} ${step.turns === 1 ? 'круг' : step.turns < 5 ? 'круга' : 'кругов'} ${step.label}`);
        const start = toOffset(step.cx, step.cy + step.ry);
        await animate(lamp, { x: [at.x, start.x], y: [at.y, start.y] }, { duration: 0.6, ease: 'easeInOut' });

        const xs: number[] = [];
        const ys: number[] = [];
        // Clockwise on screen, starting from the bottom of the circle.
        for (let i = 0; i <= step.turns * POINTS_PER_TURN; i += 1) {
          const angle = Math.PI / 2 + (i / POINTS_PER_TURN) * Math.PI * 2;
          const point = toOffset(step.cx + Math.cos(angle) * step.rx, step.cy + Math.sin(angle) * step.ry);
          xs.push(point.x);
          ys.push(point.y);
        }
        await animate(lamp, { x: xs, y: ys }, { duration: step.turns * step.secondsPerTurn, ease: 'linear' });
        at = start;
      }

      setCaption('');
      await animate(lamp, { x: [at.x, 0], y: [at.y, 0] }, { duration: 0.9, ease: 'easeInOut' });
    }

    onOffer();
    setPhase('done');
    setCaption('Ваша лампада горит перед Дамодарой');
  };

  return (
    <div ref={altarRef} className={`${styles.altar} ${lit ? styles.altarLit : ''}`}>
      <div className={styles.altarHalo} aria-hidden="true" />
      <div ref={frameRef} className={`flame-shadow ${styles.altarFrame}`}>
        <img src={damodara} alt="Мать Яшода связывает малыша Кришну — Шри Дамодара" />
        <div className={styles.altarWarmth} aria-hidden="true" />
      </div>

      <div ref={lampRef} className={styles.altarLamp}>
        <Diya lit={lit} />
      </div>

      <div className={styles.altarActions}>
        <p className={styles.altarCaption} aria-live="polite">
          {caption ||
            (offeredToday > 0
              ? `Сегодня вы предложили ${offeredToday} ${offeredToday === 1 ? 'лампаду' : offeredToday < 5 ? 'лампады' : 'лампад'}`
              : 'Нажмите, чтобы зажечь фитилёк и предложить лампаду')}
        </p>
        <button type="button" className={styles.buttonFlame} onClick={offer} disabled={phase === 'arati'}>
          {phase === 'arati' ? 'Идёт арати…' : offeredToday > 0 ? 'Предложить ещё лампаду' : 'Предложить лампаду'}
        </button>
      </div>
    </div>
  );
}
