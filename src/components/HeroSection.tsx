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

  return (
    <section className="hero-section">
      <div className="container mx-auto hero-section__container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-section__ovals"
        >
          <div className="hero-oval-wrapper">{renderVideoOval(false)}</div>

          <div className="hero-oval-wrapper">
            <div className={`${heroOvalBaseClass} hero-oval--logo`}>
              <div className="hero-oval__gradient hero-oval__gradient--logo" />
              <img
                src={logoSvg}
                alt="Логотип OmHome"
                className="hero-oval__logo-overlay"
              />
            </div>
          </div>

          <div className="hero-oval-wrapper">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-section__mobile-oval"
        >
          <div>{renderVideoOval(true)}</div>
        </motion.div>

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
