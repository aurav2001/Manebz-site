import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';

// Code-split dynamic page loading for maximum performance & fast FCP/LCP
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PayrollPage = lazy(() => import('./pages/PayrollPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Optimized Skeleton Loader during lazy route transition
const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-20 space-y-4">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-red-600 animate-spin" />
      <div className="w-6 h-6 rounded-full bg-sky-500/20 absolute" />
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading MANABS...</span>
  </div>
);

function App() {
  const getRouteInfoFromHash = () => {
    const rawHash = window.location.hash.replace('#/', '').replace('#', '');
    const parts = rawHash.split('/');
    const mainPage = parts[0] || 'home';
    const subRoute = parts[1] || null;
    const validPages = ['home', 'about', 'services', 'payroll', 'careers', 'contact'];
    return {
      page: validPages.includes(mainPage) ? mainPage : 'home',
      subRoute: subRoute
    };
  };

  const [routeInfo, setRouteInfo] = useState(getRouteInfoFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      setRouteInfo(getRouteInfoFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId, subRoute = null) => {
    let targetHash = pageId;
    let mainPage = pageId;
    let sub = subRoute;

    if (pageId.includes('/')) {
      const parts = pageId.split('/');
      mainPage = parts[0];
      sub = parts[1];
      targetHash = pageId;
    } else if (subRoute) {
      targetHash = `${pageId}/${subRoute}`;
    }

    setRouteInfo({ page: mainPage, subRoute: sub });
    window.location.hash = `#/${targetHash}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (routeInfo.page) {
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} initialServiceSlug={routeInfo.subRoute} />;
      case 'payroll':
        return <PayrollPage onNavigate={handleNavigate} />;
      case 'careers':
        return <CareersPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-sky-500 selection:text-white font-sans antialiased">
      {/* 100% Dynamic SEO Meta Tags & Schema.org JSON-LD Manager */}
      <SEOHead currentPage={routeInfo.page} />

      {/* Pinned Top Navbar */}
      <Navbar 
        currentPage={routeInfo.page} 
        onNavigate={handleNavigate} 
      />

      {/* Code-split Main Content with Suspense */}
      <main className="flex-grow" role="main">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderCurrentPage()}
        </Suspense>
      </main>

      {/* Clean Optimized Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
