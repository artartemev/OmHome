import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import logoSvg from '../assets/Logo.svg?url';

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

const ovalContainerClasses =
  'relative w-full aspect-[3/4] overflow-hidden rounded-full shadow-2xl border border-white/10';

export function HeroSection() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

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
    <div className={`${ovalContainerClasses} bg-black/10`}>
      {heroVideo ? (
        <video
          key={heroVideo}
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#73729b]/10 text-[#73729b]">
          Видео скоро будет
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f6c56a]/35 via-transparent to-[#73729b]/25" />
      {withLogoOverlay ? (
        <img
          src={logoSvg}
          alt="Логотип OmHome"
          className="pointer-events-none absolute inset-0 m-auto w-[70%] max-w-[260px] drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
        />
      ) : null}
    </div>
  );

  return (
    <section className="relative min-h-screen bg-[#e6e2df] pt-28 pb-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:grid grid-cols-3 gap-6 lg:gap-10"
        >
          <div className="flex justify-center">{renderVideoOval(false)}</div>

          <div className="flex justify-center">
            <div className={`${ovalContainerClasses} flex items-center justify-center bg-[#1b3a2c]`}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />
              <img
                src={logoSvg}
                alt="Логотип OmHome"
                className="relative z-10 w-[78%] max-w-[260px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className={`${ovalContainerClasses} bg-black/10`}>
              {heroPhotos.length ? (
                heroPhotos.map((photo, index) => (
                  <img
                    key={photo}
                    src={photo}
                    alt="Участники OmHome"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
                      index === currentPhotoIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#73729b]/10 text-[#73729b]">
                  Фото скоро будут
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-[#73729b]/20" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:hidden flex justify-center"
        >
          <div className="max-w-[320px] w-full">{renderVideoOval(true)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
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
