import { motion } from 'motion/react';
import imgRectangle14 from "figma:asset/2730f52b4eb67de99a5640171106da588153391f.png";
import imgRectangle34 from "figma:asset/e70830a5d50c21485811d96667a824a1cb39a5e5.png";

export function HeroSection() {
  const scrollToJoin = () => {
    document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSupport = () => {
    document.querySelector('#support')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-[#e6e2df] pt-20 lg:pt-32 pb-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left max-w-4xl"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-menorah text-[#73729b] text-5xl md:text-7xl lg:text-8xl font-medium mb-6"
          >
            OmHome
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-black mb-8 max-w-2xl"
          >
            пространство единства, вдохновения и служения
          </motion.p>

          {/* Mobile Infinite Scroll Images */}
          <div className="md:hidden my-8 relative overflow-hidden">
            <motion.div
              animate={{
                x: [0, -100 * 6 * 3] // Move by width of all images (adjusted for larger size)
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex gap-4"
              style={{ width: 'calc(200% + 1rem)' }} // Double width for seamless loop
            >
              {/* First set of images */}
              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(${imgRectangle14})`,
                  filter: 'saturate(1.1) contrast(1.05)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#73729b]/20 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBob3Jpem9udGFsfGVufDF8fHx8MTc1NzQ0NTk2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'sepia(0.1) saturate(1.2)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#86af8d]/20 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1712249238849-cf2742bf7443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBob3Jpem9udGFsfGVufDF8fHx8MTc1NzQ0NTk2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'brightness(1.1) contrast(0.95)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#73729b]/15 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(${imgRectangle34})`,
                  filter: 'hue-rotate(10deg) saturate(1.1)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#86af8d]/20 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY29tbXVuaXR5JTIwaG9yaXpvbnRhbHxlbnwxfHx8fDE3NTc0NDU5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'brightness(1.05) saturate(0.9)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#73729b]/25 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1642391326182-3b72644c48bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBzcGlyaXR1YWwlMjBob3Jpem9udGFsfGVufDF8fHx8MTc1NzQ0NTk2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'contrast(1.1) saturate(1.05)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#86af8d]/15 to-transparent" />
              </div>

              {/* Duplicate set for seamless loop */}
              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(${imgRectangle14})`,
                  filter: 'saturate(1.1) contrast(1.05)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#73729b]/20 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjBob3Jpem9udGFsfGVufDF8fHx8MTc1NzQ0NTk2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'sepia(0.1) saturate(1.2)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#86af8d]/20 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1712249238849-cf2742bf7443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjBob3Jpem9udGFsfGVufDF8fHx8MTc1NzQ0NTk2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'brightness(1.1) contrast(0.95)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#73729b]/15 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(${imgRectangle34})`,
                  filter: 'hue-rotate(10deg) saturate(1.1)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#86af8d]/20 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY29tbXVuaXR5JTIwaG9yaXpvbnRhbHxlbnwxfHx8fDE3NTc0NDU5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'brightness(1.05) saturate(0.9)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#73729b]/25 to-transparent" />
              </div>

              <div 
                className="flex-shrink-0 w-72 h-48 sm:w-96 sm:h-60 bg-cover bg-center rounded-xl shadow-lg relative"
                style={{ 
                  backgroundImage: `url(https://images.unsplash.com/photo-1642391326182-3b72644c48bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW1wbGUlMjBzcGlyaXR1YWwlMjBob3Jpem9udGFsfGVufDF8fHx8MTc1NzQ0NTk2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                  filter: 'contrast(1.1) saturate(1.05)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#86af8d]/15 to-transparent" />
              </div>
            </motion.div>

            {/* Gradient fade effects */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#e6e2df] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#e6e2df] to-transparent pointer-events-none" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-[#73729b] mb-8 max-w-3xl"
          >
            Создаём живые вайшнавские комьюнити там, где их не хватает: Грузия, Сербия — теперь Чиангмай.
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-black mb-12 max-w-2xl"
          >
            Открыто для всех, кто разделяет ценности доброты, уважения и служения
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-left max-w-md relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-[#73729b]/10 to-[#86af8d]/10 p-6 rounded-2xl border-l-4 border-[#73729b] backdrop-blur-sm shadow-lg"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 1.5 }}
                className="h-0.5 bg-gradient-to-r from-[#73729b] to-[#86af8d] mb-4 rounded-full"
              />
              <p className="text-lg md:text-xl text-[#73729b] font-menorah italic leading-relaxed">
                «Здесь находишь друзей и поддержку. Исчезает чувство одиночества — появляется близость и смысл.»
              </p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
                className="mt-2 text-sm text-[#73729b]/70"
              >
                — Участник сообщества
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>



      {/* Floating Images - Right Side Composition */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block overflow-hidden">
        {/* Main large portrait - center right */}
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute top-[20%]"
          style={{ right: '40%' }}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 1, 0],
              filter: ["blur(0px)", "blur(0.5px)", "blur(0px)"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="relative"
          >
            <div
              className="w-56 h-96 lg:w-72 lg:h-[480px] bg-cover bg-center rounded-full shadow-2xl cursor-pointer"
              style={{
                backgroundImage: `url(${imgRectangle14})`,
                filter: 'saturate(1.1) contrast(1.05)'
              }}
            />
            {/* Floating glow effect */}
            <motion.div
              animate={{ 
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-gradient-to-b from-[#73729b]/20 to-[#86af8d]/20 backdrop-blur-sm"
            />
          </motion.div>
        </motion.div>

        {/* Secondary portrait - upper right */}
        <motion.div
          initial={{ opacity: 0, y: -50, x: 80 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 2.5, delay: 1, ease: "easeOut" }}
          className="absolute top-[8%]"
          style={{ right: '20%' }}
        >
          <motion.div
            animate={{
              y: [0, 12, 0],
              rotate: [0, -1.5, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="relative"
          >
            <div
              className="w-44 h-72 lg:w-56 lg:h-80 bg-cover bg-center rounded-full shadow-xl cursor-pointer"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1570093895856-9dc9acd87da5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcG9ydHJhaXQlMjBwZWFjZWZ1bCUyMHZlcnRpY2FsfGVufDF8fHx8MTc1NzQzOTY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                filter: 'sepia(0.1) saturate(1.2)'
              }}
            />
            {/* Dreamy overlay */}
            <motion.div
              animate={{ 
                opacity: [0, 0.3, 0],
                rotate: [0, 360, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 via-transparent to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Third portrait - mid right */}
        <motion.div
          initial={{ opacity: 0, x: 120, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 3, delay: 1.5, ease: "easeOut" }}
          className="absolute top-[45%]"
          style={{ right: '60%' }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 5, 0],
              rotate: [0, 2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="relative"
          >
            <div
              className="w-40 h-64 lg:w-48 lg:h-72 bg-cover bg-center rounded-full shadow-lg cursor-pointer"
              style={{
                backgroundImage: `url(${imgRectangle34})`,
                filter: 'brightness(1.1) contrast(0.95)'
              }}
            />
            {/* Morphing border */}
            <motion.div
              animate={{ 
                borderRadius: ["50%", "40% 60% 70% 30%", "50%"],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 border-2 border-[#73729b]/30"
            />
          </motion.div>
        </motion.div>

        {/* Fourth portrait - lower right */}
        <motion.div
          initial={{ opacity: 0, y: 100, x: 60 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 3.5, delay: 2, ease: "easeOut" }}
          className="absolute top-[68%]"
          style={{ right: '80%' }}
        >
          <motion.div
            animate={{
              y: [0, 18, 0],
              rotate: [0, -2, 0],
              opacity: [0.7, 0.95, 0.7],
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="relative"
          >
            <div
              className="w-36 h-60 lg:w-44 lg:h-72 bg-cover bg-center rounded-full shadow-xl cursor-pointer"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjBjb21tdW5pdHklMjBnYXRoZXJpbmclMjB2ZXJ0aWNhbHxlbnwxfHx8fDE3NTc0Mzk2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                filter: 'hue-rotate(10deg) saturate(1.1)'
              }}
            />
            {/* Pulse effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0, 0.2, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-[#86af8d]/30"
            />
          </motion.div>
        </motion.div>

        {/* Fifth portrait - far right edge */}
        <motion.div
          initial={{ opacity: 0, x: 150, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 4, delay: 2.5, ease: "easeOut" }}
          className="absolute top-[35%]"
          style={{ right: '0%' }}
        >
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 3, 0],
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 8
            }}
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="relative"
          >
            <div
              className="w-32 h-52 lg:w-40 lg:h-60 bg-cover bg-center rounded-full shadow-md cursor-pointer"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1689258077068-75eb291e503b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbiUyMHBlYWNlZnVsJTIwcG9ydHJhaXQlMjB2ZXJ0aWNhbHxlbnwxfHx8fDE3NTc0Mzk2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
                filter: 'brightness(1.05) saturate(0.9)'
              }}
            />
            {/* Gradient shimmer */}
            <motion.div
              animate={{ 
                background: [
                  "linear-gradient(45deg, transparent, rgba(115,114,155,0.2), transparent)",
                  "linear-gradient(225deg, transparent, rgba(134,175,141,0.2), transparent)",
                  "linear-gradient(45deg, transparent, rgba(115,114,155,0.2), transparent)"
                ]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Ambient floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              y: [0, -120],
              x: [0, Math.sin(i) * 40],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut"
            }}
            className="absolute w-3 h-3 bg-gradient-to-r from-[#73729b]/20 to-[#86af8d]/20 rounded-full backdrop-blur-sm"
            style={{
              right: `${15 + i * 8}%`,
              top: `${70 + Math.random() * 20}%`
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, -100],
            x: [0, Math.random() * 100 - 50]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          className="absolute w-2 h-2 bg-[#73729b]/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${60 + Math.random() * 30}%`
          }}
        />
      ))}
    </section>
  );
}