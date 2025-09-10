import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const eventImagesGlob = import.meta.glob('../assets/events/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const allEventImages = Object.values(eventImagesGlob).sort();
const leftColumnImages = allEventImages.filter((_, idx) => idx % 2 === 0);
const rightColumnImages = allEventImages.filter((_, idx) => idx % 2 === 1);

export function ProgramsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const spiritualPrograms = [
    "Киртаны / мантра‑йога",
    "Вечерние чтения",
    "Нама‑хатты и бхакти‑врикши",
    "Воскресные программы",
    "Вайшнавские праздники"
  ];

  const socialEvents = [
    "Кинопоказы (семейные, без сцен насилия и т.п.)",
    "Йога и мастер‑классы (вегетарианская кулинария, творчество и т.д.)",
    "Настольные игры и квизы",
    "Музыкальные квартирники"
  ];

  return (
    <section id="programs" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          Что происходит в OmHome
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Photo Gallery with infinite scroll */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden h-[500px] lg:h-[600px]"
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left column - scrolling up */}
                <div className="relative overflow-hidden">
                  <motion.div
                    animate={{ y: [0, -100] }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="space-y-4"
                  >
                    {[...Array(3)].map((_, repeatIndex) => (
                      <div key={repeatIndex} className="space-y-4">
                        {leftColumnImages.map((img, index) => (
                          <motion.div
                            key={`left-${repeatIndex}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="w-full aspect-square bg-cover bg-center rounded-2xl cursor-pointer"
                            style={{ backgroundImage: `url(${img})` }}
                          >
                            <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </div>

              {/* Right column - scrolling down */}
                <div className="relative overflow-hidden">
                  <motion.div
                    animate={{ y: [0, 100] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="space-y-4"
                  >
                    {[...Array(3)].map((_, repeatIndex) => (
                      <div key={repeatIndex} className="space-y-4">
                        {rightColumnImages.map((img, index) => (
                          <motion.div
                            key={`right-${repeatIndex}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="w-full aspect-square bg-cover bg-center rounded-2xl cursor-pointer"
                            style={{ backgroundImage: `url(${img})` }}
                          >
                            <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </div>
            </div>
          </motion.div>

          {/* Programs Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#73729b] mb-6">
                Духовные программы:
              </h3>
              <div className="space-y-3">
                {spiritualPrograms.map((program, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-[#73729b] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-lg text-black">{program}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#73729b] mb-6">
                Социальные события:
              </h3>
              <div className="space-y-3">
                {socialEvents.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-[#86af8d] rounded-full mt-3 flex-shrink-0" />
                    <p className="text-lg text-black">{event}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="bg-[#f8f6f3] p-6 rounded-xl"
            >
              <p className="text-lg text-black leading-relaxed">
                <span className="font-bold">Цель:</span> привлечь, расположить, познакомить, вдохновить; дать людям опыт прасада, доброжелательности и смысла.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.7 }}
              className="flex flex-wrap gap-4"
            >
              <a 
                href="#" 
                className="text-[#241f74] underline hover:text-[#73729b] transition-colors"
              >
                Instagram / Belgrade
              </a>
              <a 
                href="#" 
                className="text-[#241f74] underline hover:text-[#73729b] transition-colors"
              >
                Telegram / Batumi
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}