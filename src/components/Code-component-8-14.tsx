import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import * as React from 'react';
import { Quote } from 'lucide-react';

export function QuoteSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-gradient-to-br from-[#73729b] to-[#5a5982] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.1, scale: 1 } : {}}
            transition={{ duration: 2, delay: i * 0.5 }}
            className="absolute w-96 h-96 bg-white rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Quote className="w-16 h-16 text-white/60 mx-auto" />
          </motion.div>
          
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-menorah text-white leading-relaxed"
          >
            «Важно, что здесь говорят о вечных ценностях просто и по-доброму. Это даёт ориентиры и спокойствие.»
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <div className="w-24 h-1 bg-white/40 mx-auto rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles for ambiance */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            y: [0, -80],
            x: [0, Math.random() * 60 - 30]
          }}
          transition={{
            duration: 6 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${70 + Math.random() * 20}%`
          }}
        />
      ))}
    </section>
  );
}