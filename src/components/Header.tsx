import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const translations = {
  ru: {
    navItems: [
      { label: 'О проекте', href: '#about' },
      { label: 'Миссия', href: '#mission' },
      { label: 'Программы', href: '#programs' },
      { label: 'Принципы', href: '#principles' },
      { label: 'Присоединиться', href: '#join' },
      { label: 'Поддержать', href: '#support' },
      { label: 'Отчётность', href: '#reports' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Контакты', href: '#contacts' }
    ],
    languageLabel: 'Язык',
    languageAria: 'Переключить язык'
  },
  en: {
    navItems: [
      { label: 'About', href: '#about' },
      { label: 'Mission', href: '#mission' },
      { label: 'Programs', href: '#programs' },
      { label: 'Principles', href: '#principles' },
      { label: 'Join', href: '#join' },
      { label: 'Support', href: '#support' },
      { label: 'Reports', href: '#reports' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contacts', href: '#contacts' }
    ],
    languageLabel: 'Language',
    languageAria: 'Toggle language'
  }
} as const;

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' }
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { navItems, languageLabel, languageAria } = translations[language];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (code: (typeof languageOptions)[number]['code']) => {
    setLanguage(code);
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
            <div className="flex items-center space-x-2 pl-4 border-l border-[#73729b]/30">
              <span className="text-sm text-[#241f74] uppercase tracking-wide">
                {languageLabel}
              </span>
              <div className="flex items-center gap-1 rounded-full bg-white/60 p-1">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => handleLanguageChange(option.code)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                      language === option.code
                        ? 'bg-[#73729b] text-white'
                        : 'text-[#241f74] hover:bg-[#73729b]/10'
                    }`}
                    aria-label={`${languageAria}: ${option.label}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
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
            <div className="pt-4 border-t border-[#73729b]/20">
              <p className="text-sm text-[#241f74] mb-3 uppercase tracking-wide">{languageLabel}</p>
              <div className="flex items-center gap-2">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => handleLanguageChange(option.code)}
                    className={`flex-1 px-3 py-2 rounded-full border transition-colors ${
                      language === option.code
                        ? 'bg-[#73729b] text-white border-[#73729b]'
                        : 'border-[#73729b]/40 text-[#241f74] hover:bg-[#73729b]/10'
                    }`}
                    aria-label={`${languageAria}: ${option.label}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}