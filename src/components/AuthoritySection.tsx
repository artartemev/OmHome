import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

export function AuthoritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const leaders = [
    "Махараджа Прабху",
    "Гуру Дев Прабху",
    "Бхакти Прия Матаджи",
    "Кришна Дас Прабху",
    "Радха Прия Матаджи"
  ];

  return (
    <section id="reports" ref={ref} className="py-12 lg:py-20 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-12 text-center lg:text-left max-w-4xl"
        >
          Взаимодействие со старшими
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-black leading-relaxed">
              Мы действуем в духе уважения к старшим вайшнавам и стремимся к благословениям и наставлениям GBC и местной ятры. В новых регионах мы заранее делимся планами, обсуждаем формат служения и выстраиваем сотрудничество.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-3 lg:justify-end"
          >
            {leaders.map((leader, index) => (
              <motion.div
                key={leader}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white px-4 py-2 rounded-full shadow-md text-[#73729b] font-medium"
              >
                {leader}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}