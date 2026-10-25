import { useEffect } from 'react';
import './flame.css';

// Candlelight for the whole site: one slow "flame" drives CSS variables on <html>,
// and anything with .flame-shadow / .flame-drop / .flame-text casts a shadow that sways with it.
//   --flame-x, --flame-y  -1..1, where the flame leans (slow sway + rare gusts)
//   --flame-i             ~0.85..1.15, brightness (quicker flicker)
//   --flame-lit           0..1, set by the Kartika altar when a lamp was offered today
const FRAME_MS = 40;

export function FlameAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = 0;
    let gust = 0;
    let gustTarget = 0;
    let nextGust = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      const s = now / 1000;

      if (s > nextGust) {
        gustTarget = Math.random() < 0.35 ? Math.random() * 2 - 1 : 0;
        nextGust = s + 2 + Math.random() * 5;
      }
      gust += (gustTarget - gust) * 0.035;

      const x = 0.5 * Math.sin(s * 0.53) + 0.22 * Math.sin(s * 1.37 + 1.3) + 0.45 * gust;
      const y = 0.45 * Math.sin(s * 0.71 + 0.6) + 0.2 * Math.sin(s * 1.91 + 2.1) + 0.15 * Math.abs(gust);
      const i =
        1 +
        0.05 * Math.sin(s * 2.9) +
        0.035 * Math.sin(s * 7.3 + 0.4) +
        0.02 * Math.sin(s * 13.1 + 1.7) -
        0.08 * Math.abs(gust);

      root.style.setProperty('--flame-x', x.toFixed(3));
      root.style.setProperty('--flame-y', y.toFixed(3));
      root.style.setProperty('--flame-i', i.toFixed(3));
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="flame-atmosphere" aria-hidden="true">
      <div className="flame-atmosphere__glow" />
      <div className="flame-atmosphere__vignette" />
    </div>
  );
}
