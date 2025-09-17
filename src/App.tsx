import { useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MissionSection } from './components/MissionSection';
import { QuoteSection } from './components/QuoteSection';
import { ProgramsSection } from './components/ProgramsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { JoinSection } from './components/JoinSection';
import { SupportSection } from './components/SupportSection';
import { AuthoritySection } from './components/AuthoritySection';
import { FAQSection } from './components/FAQSection';
import { ContactsSection } from './components/ContactsSection';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const footerTexts = {
  ru: '© 2024 OmHome. Пространство единства, вдохновения и служения.',
  en: '© 2024 OmHome. A space of unity, inspiration, and service.'
};

function AppContent() {
  const { language } = useLanguage();

  useEffect(() => {
    // Smooth scroll behavior for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#e6e2df] overflow-x-hidden">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <MissionSection />
        <QuoteSection />
        <ProgramsSection />
        <TestimonialsSection />
        <JoinSection />
        <SupportSection />
        <AuthoritySection />
        <FAQSection />
        <ContactsSection />
      </main>

      {/* Footer */}
      <footer className="bg-[#73729b] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg">{footerTexts[language]}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
