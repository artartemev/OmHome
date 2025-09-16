import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import logoSvg from '../assets/Logo.svg?url';
import videoPlaceholderImage from '../assets/hero_photo/2_4.jpeg?url';
import './HeroSection.css';

const heroPhotos = (Object.values(
  import.meta.glob('../assets/hero_photo/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP}', {
    eager: true,
    import: 'default',
    query: '?url'
  })
) as string[]).sort();

const heroVideos = (Object.values(
  import.meta.glob('../assets/hero_video/*.{mp4,MP4,webm,WEBM}', {
    eager: true,
    import: 'default',
    query: '?url'
  })
) as string[]).sort();

const heroVideo = heroVideos.find((video) => video.toLowerCase().endsWith('.mp4')) ?? heroVideos[0];

const heroOvalBaseClass = 'hero-oval';

export function HeroSection() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(min-width: 768px)').matches;
  });

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoLoadStart = () => {
    setIsVideoLoaded(false);
  };

  useEffect(() => {
    if (heroPhotos.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktopLayout(event.matches);
    };

    setIsDesktopLayout(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const scrollToJoin = () => {
    document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSupport = () => {
    document.querySelector('#support')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderVideoOval = (withLogoOverlay = false) => (
    <div className={`${heroOvalBaseClass} hero-oval--video`}>
      {(!isVideoLoaded || !heroVideo) ? (
        <div
          className="hero-oval__placeholder hero-oval__placeholder--image"
          style={{ backgroundImage: `url(${videoPlaceholderImage})` }}
        >
          {!heroVideo ? (
            <span className="hero-oval__placeholder-message">Видео скоро будет</span>
          ) : null}
        </div>
      ) : null}
      {heroVideo ? (
        <video
          key={heroVideo}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="hero-oval__media"
          onCanPlay={handleVideoLoaded}
          onLoadedData={handleVideoLoaded}
          onLoadStart={handleVideoLoadStart}
        />
      ) : null}
      <div className="hero-oval__gradient hero-oval__gradient--video" />
      {withLogoOverlay ? (
        <img
          src={logoSvg}
          alt="Логотип OmHome"
          className="hero-oval__logo-overlay"
        />
      ) : null}
    </div>
  );

  const renderLogoOval = () => (
    <div className={`${heroOvalBaseClass} hero-oval--logo`}>
      <div className="hero-oval__gradient hero-oval__gradient--logo" />
      <img
        src={logoSvg}
        alt="Логотип OmHome"
        className="hero-oval__logo-overlay hero-oval__logo-overlay--large"
      />
    </div>
  );

  const renderPhotosOval = () => (
    <div className={`${heroOvalBaseClass} hero-oval--photos`}>
      {heroPhotos.length ? (
        heroPhotos.map((photo, index) => (
          <img
            key={photo}
            src={photo}
            alt="Участники OmHome"
            className={`hero-oval__photo ${index === currentPhotoIndex ? 'is-active' : ''}`}
          />
        ))
      ) : (
        <div className="hero-oval__placeholder">
          Фото скоро будут
        </div>
      )}
      <div className="hero-oval__gradient hero-oval__gradient--photos" />
    </div>
  );

  type HeroOvalType = 'video' | 'logo' | 'photos';

  const desktopOvalOrder: HeroOvalType[] = ['video', 'logo', 'photos'];
  const mobileOvalOrder: HeroOvalType[] = ['logo', 'photos', 'video'];

  const renderHeroOval = (ovalType: HeroOvalType) => {
    switch (ovalType) {
      case 'video':
        return renderVideoOval(false);
      case 'logo':
        return renderLogoOval();
      case 'photos':
        return renderPhotosOval();
      default:
        return null;
    }
  };

  return (
    <section className="hero-section">
      <div className="container mx-auto hero-section__container">
        {isDesktopLayout ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-section__ovals"
          >
            {desktopOvalOrder.map((ovalType) => (
              <div key={`desktop-${ovalType}`} className="hero-oval-wrapper">
                {renderHeroOval(ovalType)}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-section__mobile-slider"
          >
            {mobileOvalOrder.map((ovalType) => (
              <div key={`mobile-${ovalType}`} className="hero-section__mobile-slide">
                <div className="hero-oval-wrapper">{renderHeroOval(ovalType)}</div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-section__cta"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(115, 114, 155, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToJoin}
            className="bg-[#73729b] text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#5a5982]"
          >
            Принять участие
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(134, 175, 141, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToSupport}
            className="bg-[#86af8d] text-white px-8 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#6d8f74]"
          >
            Поддержать проект
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
