import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'О проекте', href: '#about' },
  { label: 'Миссия', href: '#mission' },
  { label: 'Программы', href: '#programs' },
  { label: 'Принципы', href: '#principles' },
  { label: 'Присоединиться', href: '#join' },
  { label: 'Поддержать', href: '#support' },
  { label: 'Отчётность', href: '#reports' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Контакты', href: '#contacts' }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#e6e2df]/90 backdrop-blur-sm border-b border-[#73729b]/20"
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="font-menorah text-[#73729b] text-2xl lg:text-3xl font-medium"
          >
            OmHome
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.05, color: '#73729b' }}
                onClick={() => scrollToSection(item.href)}
                className="text-[#241f74] hover:text-[#73729b] transition-colors duration-200 underline decoration-solid"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#73729b] hover:bg-[#73729b]/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left text-[#241f74] hover:text-[#73729b] py-2 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}