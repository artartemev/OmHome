import { ArrowLeft } from 'lucide-react';
import { SupportSection } from './home/Support';
import styles from './ChiangMaiHomePage.module.css';

// omhome.space/donate — the donation details alone, for links in posts and the Instagram bio.
export function DonatePage() {
  return (
    <div className={styles.page}>
      <header className={styles.donateBar}>
        <a href="/" className={styles.navBrand}>
          OmHome
        </a>
        <a href="/" className={styles.donateBack}>
          <ArrowLeft size={16} /> На главную
        </a>
      </header>
      <SupportSection standalone />
    </div>
  );
}
