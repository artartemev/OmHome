import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Shield, Sparkles, Coffee, Users, Heart, HandHeart, Music, Palette, MessageCircle, Package, Leaf, Home } from 'lucide-react';
import imgEllipse10 from "figma:asset/62045b0f21b8b1e4a29aa4c897296899aaf01741.png";
import imgRectangle33 from "figma:asset/7079ed6ac33259adcd696c14440f8602d1e716fc.png";

export function JoinSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const participationOptions = [
    {
      title: "Волонтёрить:",
      description: "организация событий, кухня/прасад, музыка, дизайн/медиа, перевод, техподдержка, маркетинг",
      icon: <HandHeart className="text-[#86af8d]" size={48} />
    },
    {
      title: "Вести инициативы:",
      description: "нама‑хатта, киртаны, бхакти‑врикша, книжный клуб, йога, мастер‑класс",
      icon: <Music className="text-[#86af8d]" size={48} />
    },
    {
      title: "Помочь ресурсами:",
      description: "оборудование, мебель, расходники, продукты",
      icon: <Package className="text-[#86af8d]" size={48} />
    }
  ];

  const principles = [
    {
      title: "Без мяса, алкоголя, курения.",
      icon: <Leaf className="text-[#73729b]" size={32} />
    },
    {
      title: "Чистота и уважение к общим пространствам.",
      icon: <Sparkles className="text-[#73729b]" size={32} />
    },
    {
      title: "Разделение кухонной утвари для прасада и личной еды; отдельные зоны хранения.",
      icon: <Coffee className="text-[#73729b]" size={32} />
    },
    {
      title: "Открытая коммуникация и регулярные собрания для согласования вопросов.",
      icon: <MessageCircle className="text-[#73729b]" size={32} />
    },
    {
      title: "Мягкое и принимающее отношение к людям и их пути.",
      icon: <Heart className="text-[#73729b]" size={32} />
    }
  ];

  return (
    <section id="join" ref={ref} className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Principles Section */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-['Menorah_Grotesk:Medium'] text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          Принципы пространства
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#f8f6f3] transition-colors"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-[#f8f6f3] rounded-full flex-shrink-0">
                {principle.icon}
              </div>
              <p className="text-xl text-black leading-relaxed">
                {principle.title}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mb-16"
        >
          <a 
            href="#" 
            className="text-xl text-[#241f74] underline hover:text-[#73729b] transition-colors"
          >
            Подробнее о правилах и быте
          </a>
        </motion.div>

        {/* Join Section */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          Как присоединиться
        </motion.h2>

        {/* Hero Image with text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl mb-12"
          style={{ backgroundImage: `url(${imgRectangle33})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center text-white max-w-4xl px-4"
            >
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-menorah leading-tight">
                Приехать в Чиангмай и послужить в OmHome
              </h3>
            </motion.div>
          </div>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="text-2xl font-bold text-[#73729b] mb-8"
        >
          Варианты участия:
        </motion.h3>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {participationOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#f8f6f3] p-6 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full mb-4 shadow-md">
                {option.icon}
              </div>
              <h4 className="text-xl font-bold text-black mb-3">
                {option.title}
              </h4>
              <p className="text-lg text-black leading-relaxed">
                {option.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 2.4 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(115, 114, 155, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#73729b] text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#5a5982]"
          >
            Хочу участвовать
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}