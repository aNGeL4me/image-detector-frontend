import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ModelPage from './pages/ModelPage';
import PerformancePage from './pages/PerformancePage';
import TeamPage from './pages/TeamPage';
import MemberDetailPage from './pages/MemberDetailPage';
import DocsPage from './pages/DocsPage';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:name" element={<MemberDetailPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
