import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import imgRectangle28 from "figma:asset/0f6babe4268406b7ddf855a6d902d52cadf0cd93.png";
import imgRectangle29 from "figma:asset/57bdb3d6544af7253ac87496ecd348f669914c3b.png";
import imgRectangle30 from "figma:asset/f4d3c6ce4c81560ba135e103547da8562f44ed3a.png";
import imgRectangle31 from "figma:asset/ca4aea19419ba04cf0f90e9ab20624be82edf82a.png";
import imgRectangle32 from "figma:asset/cfedf5a9193ac76690698538c31643e06074839c.png";

export function AuthoritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const leaders = [
    { img: imgRectangle28, name: "Махараджа Прабху" },
    { img: imgRectangle29, name: "Гуру Дев Прабху" },
    { img: imgRectangle30, name: "Бхакти Прия Матаджи" },
    { img: imgRectangle31, name: "Кришна Дас Прабху" },
    { img: imgRectangle32, name: "Радха Прия Матаджи" }
  ];

  return (
    <section id="reports" ref={ref} className="py-16 lg:py-24 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left max-w-4xl"
        >
          Взаимодействие со старшими
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl text-black leading-relaxed">
              Мы действуем в духе уважения к старшим вайшнавам и стремимся к благословениям и наставлениям GBC и местной ятры. В новых регионах мы заранее делимся планами, обсуждаем формат служения и выстраиваем сотрудничество.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                onHoverStart={() => setHoveredImage(index)}
                onHoverEnd={() => setHoveredImage(null)}
                className="relative cursor-pointer group"
              >
                <div 
                  className={`w-full aspect-square bg-cover bg-center rounded-full shadow-lg transition-all duration-300 ${
                    hoveredImage === index ? 'ring-4 ring-[#73729b]/30' : ''
                  }`}
                  style={{ backgroundImage: `url(${leader.img})` }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent rounded-full" />
                </div>
                
                {/* Name overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredImage === index ? 1 : 0,
                    y: hoveredImage === index ? 0 : 10
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg whitespace-nowrap"
                >
                  <p className="text-sm font-medium text-[#73729b]">
                    {leader.name}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}