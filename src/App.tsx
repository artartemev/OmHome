import { ChiangMaiHomePage } from './pages/ChiangMaiHomePage';
import { PamhoPage } from './pages/PamhoPage';

export default function App() {
  if (typeof window === 'undefined') {
    return <ChiangMaiHomePage />;
  }

  const pathname = window.location.pathname;

  if (pathname.startsWith('/pamho')) {
    return <PamhoPage />;
  }

  return <ChiangMaiHomePage />;
}
