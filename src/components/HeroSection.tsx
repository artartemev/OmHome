import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import logoSvg from '../assets/Logo.svg?url';
import videoPlaceholderImage from '../assets/cover.png?url';
import './HeroSection.css';
import { useLanguage } from '../contexts/LanguageContext';

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

const translations = {
  ru: {
    videoPlaceholder: 'Видео скоро будет',
    logoAlt: 'Логотип OmHome',
    photosAlt: 'Участники OmHome',
    photosPlaceholder: 'Фото скоро будут',
    sliderAria: 'Перейти к слайду',
    swipeHint: 'Пролистай',
    joinCta: 'Принять участие',
    supportCta: 'Поддержать проект'
  },
  en: {
    videoPlaceholder: 'Video coming soon',
    logoAlt: 'OmHome logo',
    photosAlt: 'OmHome participants',
    photosPlaceholder: 'Photos coming soon',
    sliderAria: 'Go to slide',
    swipeHint: 'Swipe',
    joinCta: 'Join the community',
    supportCta: 'Support the project'
  }
} as const;

const HAVE_CURRENT_DATA =
  typeof HTMLMediaElement !== 'undefined'
    ? HTMLMediaElement.HAVE_CURRENT_DATA
    : 2;

export function HeroSection() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguage();
  const t = translations[language];

  const updateVideoReadyState = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.readyState >= HAVE_CURRENT_DATA) {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => setIsVideoReady(true));
      } else {
        setIsVideoReady(true);
      }
    }
  };

  const handleVideoLoaded = () => {
    updateVideoReadyState();
  };

  const handleVideoPlaying = () => {
    updateVideoReadyState();
  };

  const handleVideoLoadStart = () => {
    setIsVideoReady(false);
  };

  const handleVideoWaiting = () => {
    setIsVideoReady(false);
  };

  useEffect(() => {
    if (heroPhotos.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % heroPhotos.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const scrollToJoin = () => {
    document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSupport = () => {
    document.querySelector('#support')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSliderScroll = () => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const slideWidth = slider.offsetWidth;
    const scrollLeft = slider.scrollLeft;
    const newSlide = Math.round(scrollLeft / slideWidth);
    
    setCurrentSlide(newSlide);
  };

  const scrollToSlide = (slideIndex: number) => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const slideWidth = slider.offsetWidth;
    slider.scrollTo({
      left: slideIndex * slideWidth,
      behavior: 'smooth'
    });
  };

  const renderVideoOval = (withLogoOverlay = false) => (
    <div className={`${heroOvalBaseClass} hero-oval--video`}>
      {(!isVideoReady || !heroVideo) ? (
        <div
          className="hero-oval__placeholder hero-oval__placeholder--image"
          style={{ backgroundImage: `url(${videoPlaceholderImage})` }}
        >
          {!heroVideo ? (
            <span className="hero-oval__placeholder-message">{t.videoPlaceholder}</span>
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
          ref={videoRef}
          onCanPlay={handleVideoLoaded}
          onLoadedData={handleVideoLoaded}
          onPlaying={handleVideoPlaying}
          onLoadStart={handleVideoLoadStart}
          onWaiting={handleVideoWaiting}
          onStalled={handleVideoWaiting}
        />
      ) : null}
      <div className="hero-oval__gradient hero-oval__gradient--video" />
      {withLogoOverlay ? (
        <img
          src={logoSvg}
          alt={t.logoAlt}
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
        alt={t.logoAlt}
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
            alt={t.photosAlt}
            className={`hero-oval__photo ${index === currentPhotoIndex ? 'is-active' : ''}`}
          />
        ))
      ) : (
        <div className="hero-oval__placeholder">{t.photosPlaceholder}</div>
      )}
      <div className="hero-oval__gradient hero-oval__gradient--photos" />
    </div>
  );

  return (
    <section className="hero-section">
      <div className="container mx-auto hero-section__container">
        {/* Desktop version */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-section__ovals"
        >
          <div className="hero-oval-wrapper">{renderVideoOval(false)}</div>
          <div className="hero-oval-wrapper">{renderLogoOval()}</div>
          <div className="hero-oval-wrapper">{renderPhotosOval()}</div>
        </motion.div>

        {/* Mobile slider version */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-section__mobile-slider"
        >
          <div 
            className="hero-section__slider-container"
            ref={sliderRef}
            onScroll={handleSliderScroll}
          >
            <div className="hero-section__slide">
              {renderLogoOval()}
            </div>
            <div className="hero-section__slide">
              {renderPhotosOval()}
            </div>
            <div className="hero-section__slide">
              {renderVideoOval(false)}
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="hero-section__dots">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`hero-section__dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => scrollToSlide(index)}
                aria-label={`${t.sliderAria} ${index + 1}`}
              />
            ))}
          </div>

          {/* Swipe hint */}
          <div className="hero-section__swipe-hint">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="hero-section__swipe-icon"
            >
              <path 
                d="M8 5L15 12L8 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.swipeHint}</span>
          </div>
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
            className="bg-[#73729b] text-white w-full sm:w-auto px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-full font-bold transition-all duration-300 hover:bg-[#5a5982]"
          >
            {t.joinCta}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(134, 175, 141, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToSupport}
            className="bg-[#86af8d] text-white w-full sm:w-auto px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg rounded-full font-bold transition-all duration-300 hover:bg-[#6d8f74]"
          >
            {t.supportCta}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
