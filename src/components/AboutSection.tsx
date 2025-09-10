import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { number: "3+", label: "года" },
    { number: "2", label: "страны" },
    { number: "400+", label: "встреч и программ" }
  ];

  return (
    <section id="about" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          Коротко о проекте
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-black mb-4">Кто мы:</h3>
            <p className="text-xl text-black leading-relaxed">
              OmHome — социальный проповеднический вайшнавский проект. Наша цель — поддерживать и развивать проповедь в местах, где нет активных общин, но есть энтузиазм семей преданных.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-black mb-4">Что делаем:</h3>
            <p className="text-xl text-black leading-relaxed">
              соединяем духовные программы (киртаны, лекции, санги, нама‑хатты) с социальными событиями (кинопоказы, настольные игры, йога, мастер‑классы), чтобы мягко знакомить людей с вайшнавской культурой.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="lg:max-w-2xl mb-16"
        >
          <h3 className="text-2xl font-bold text-black mb-4">Как устроено:</h3>
          <p className="text-xl text-black leading-relaxed">
            это не просто центр — это дом, где живут преданные и где естественно рождаются отношения, забота и служение.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-[#73729b] to-[#5a5982] text-white p-8 rounded-2xl shadow-lg"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.2, type: "spring" }}
                className="text-5xl lg:text-6xl font-menorah mb-2"
              >
                {stat.number}
              </motion.div>
              <div className="text-xl uppercase tracking-wide font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}