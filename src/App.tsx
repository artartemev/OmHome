import { ChiangMaiHomePage } from './pages/ChiangMaiHomePage';
import { DonatePage } from './pages/DonatePage';
import { KartikaPage } from './pages/KartikaPage';
import { PamhoPage } from './pages/PamhoPage';
import { FlameAtmosphere } from './flame/FlameAtmosphere';

function Route() {
  if (typeof window === 'undefined') {
    return <ChiangMaiHomePage />;
  }

  const pathname = window.location.pathname;

  if (pathname.startsWith('/donate')) {
    return <DonatePage />;
  }

  if (pathname.startsWith('/pamho')) {
    return <PamhoPage />;
  }

  if (pathname.startsWith('/kartika')) {
    return <KartikaPage />;
  }

  return <ChiangMaiHomePage />;
}

export default function App() {
  return (
    <>
      <Route />
      <FlameAtmosphere />
    </>
  );
}
