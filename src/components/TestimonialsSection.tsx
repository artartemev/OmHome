import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import imgEllipse10 from "figma:asset/62045b0f21b8b1e4a29aa4c897296899aaf01741.png";

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const impactPoints = [
    {
      title: "Поддержка русскоязычных преданных:",
      description: "дом, общение, служение, практика."
    },
    {
      title: "Реальные плоды:",
      description: "новые гости возвращаются, интересуются практикой, присоединяются к программам."
    },
    {
      title: "Мягкая проповедь:",
      description: "люди знакомятся с культурой через дружбу и заботу, а не через давление."
    }
  ];

  const testimonials = [
    {
      text: "«Здесь находишь друзей и поддержку. Исчезает чувство одиночества — появляется близость и смысл.»",
      author: "Участник сообщества",
      avatar: "https://images.unsplash.com/photo-1625395694544-079d163b769b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcGVhY2VmdWwlMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc1NzM1ODA1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      text: "«Дом, порядок и забота о деталях — от алтаря до уборки. Хочется тоже взять ответственность и служить.»",
      author: "Волонтёр проекта",
      avatar: "https://images.unsplash.com/photo-1745500872419-2143e3dde193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHNwaXJpdHVhbCUyMGNhbG18ZW58MXx8fHwxNzU3MzU4MDU5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      text: "«Удивительно: где бы ни оказался, можно встретить это настроение и людей, с которыми хочешь идти дальше.»",
      author: "Гость программ",
      avatar: "https://images.unsplash.com/photo-1709202967828-e1a7823ccdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHBlcnNvbiUyMHBvcnRyYWl0JTIwc21pbGluZyUyMHBlYWNlZnVsfGVufDF8fHx8MTc1NzM1ODA2M3ww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          Почему это важно
        </motion.h2>

        {/* Impact Points */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {impactPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-bold text-black mb-3">
                {point.title}
              </h3>
              <p className="text-lg text-black leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials - New Design */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#73729b] to-[#86af8d]" />
              
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative -mt-4 mb-6"
              >
                <div 
                  className="w-20 h-20 bg-cover bg-center rounded-full shadow-xl border-4 border-white mx-auto"
                  style={{ backgroundImage: `url(${testimonial.avatar})` }}
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#86af8d] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </motion.div>
              
              {/* Quote */}
              <div className="text-center">
                <motion.p 
                  className="text-lg text-[#241f74] font-menorah leading-relaxed mb-4 italic"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                >
                  {testimonial.text}
                </motion.p>
                
                {/* Author */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                >
                  <div className="w-12 h-0.5 bg-gradient-to-r from-[#73729b] to-[#86af8d] mx-auto mb-3" />
                  <p className="text-sm text-black/70 font-medium">
                    {testimonial.author}
                  </p>
                </motion.div>
              </div>

              {/* Floating decoration */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: index * 0.5 
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-[#73729b]/10 rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}