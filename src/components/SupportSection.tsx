import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ExternalLink, Table } from 'lucide-react';

export function SupportSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const donationCategories = [
    {
      emoji: "🍲",
      title: "На прасад",
      description: "продукты, специи, одноразовая/многоразовая посуда, расходники.",
      quote: "«Ваше пожертвование — это чья‑то тёплая тарелка прасада и разговор по душам после программы».",
      color: "bg-[#86af8d]"
    },
    {
      emoji: "🏡",
      title: "Аренда дома",
      description: "ежемесячные платежи за дом и коммунальные.",
      quote: "«Стабильный дом — стабильные программы».",
      color: "bg-[#afaf86]"
    },
    {
      emoji: "🪔",
      title: "Украшение алтаря",
      description: "цветы, ткань, лампады, благовония, парафирналии.",
      quote: "«Помогите сделать алтарную ещё красивее и чище».",
      color: "bg-[#86afad]"
    },
    {
      emoji: "🧺",
      title: "Бытовые расходы",
      description: "чистящие средства, ремонт мелочей, расходники для кухни и уборки.",
      quote: "«Незаметные, но необходимые траты на порядок и уют».",
      color: "bg-[#a386af]"
    }
  ];

  const paymentMethods = [
    {
      title: "Криптовалюта",
      description: "USDT/USDC/BTC и др.",
      color: "text-[#241f74]"
    },
    {
      title: "СБП",
      description: "быстрые переводы внутри РФ",
      color: "text-[#241f74]"
    },
    {
      title: "SWIFT",
      description: "международный банковский перевод",
      color: "text-[#241f74]"
    }
  ];

  const supportLevels = [
    {
      title: "Друг OmHome",
      amount: "300 ฿ / 500 ₽ / $10",
      color: "text-[#241f74]"
    },
    {
      title: "Поддерживающий",
      amount: "900 ฿ / 1 500 ₽ / $30",
      color: "text-[#241f74]"
    },
    {
      title: "Со‑творец",
      amount: "1 800 ฿ / 3 000 ₽ / $60",
      color: "text-[#241f74]"
    },
    {
      title: "Хранитель",
      amount: "3 600 ฿ / 6 000 ₽ / $120",
      color: "text-[#241f74]"
    }
  ];

  return (
    <section id="support" ref={ref} className="py-16 lg:py-24 bg-[#f8f6f3]">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-menorah text-4xl md:text-6xl lg:text-7xl text-black mb-16 text-center lg:text-left"
        >
          Поддержать проект
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-[#73729b] mb-6">
              Пожертвования помогают:
            </h3>
            <p className="text-xl text-black leading-relaxed mb-8">
              арендовать дом, проводить программы, готовить прасад, украшать алтарь, поддерживать чистоту и оборудование.
            </p>

            <h3 className="text-2xl font-bold text-[#73729b] mb-6">
              Способы перевода
            </h3>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="hover:bg-white p-4 rounded-lg transition-colors cursor-pointer"
                >
                  <h4 className={`text-xl font-bold ${method.color} underline mb-1`}>
                    {method.title}
                  </h4>
                  <p className="text-lg text-black">{method.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-[#73729b] mb-6">
              Уровни ежемесячной поддержки
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {supportLevels.map((level, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                >
                  <h4 className={`text-lg font-bold ${level.color} underline mb-2`}>
                    {level.title}
                  </h4>
                  <p className="text-sm text-black">{level.amount}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h4 className="text-xl font-bold text-[#73729b] mb-4">
                Прозрачность и отчётность
              </h4>
              <p className="text-lg text-black leading-relaxed mb-4">
                <span className="font-bold">Ежемесячный отчёт:</span> поступления/расходы по статьям (аренда, прасад, алтарь, быт, оборудование)
              </p>
              <button className="flex items-center gap-2 text-[#4b4a73] underline hover:text-[#73729b] transition-colors">
                <Table size={20} />
                Публичная сводная таблица
                <ExternalLink size={16} />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Donation Categories */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-2xl font-bold text-[#73729b] mb-8 text-center"
        >
          Целевые пожертвования
        </motion.h3>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {donationCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${category.color} text-white p-6 rounded-xl shadow-lg cursor-pointer`}
            >
              <div className="text-5xl mb-4 text-center">{category.emoji}</div>
              <h4 className="text-xl font-bold text-center mb-4">{category.title}</h4>
              <p className="text-sm leading-relaxed mb-4">{category.description}</p>
              <p className="text-sm italic leading-relaxed">{category.quote}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(115, 114, 155, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#73729b] text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#5a5982]"
          >
            Разовый донат
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(127, 178, 194, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#7fb2c2] text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 hover:bg-[#6a9fb0]"
          >
            Ежемесячная поддержка
          </motion.button>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-12 text-center"
        > 
        </motion.div>
      </div>
    </section>
  );
}
