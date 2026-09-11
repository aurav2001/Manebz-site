import React, { useState, useEffect, lazy, Suspense, Component } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import { CompanyProvider } from './context/CompanyContext';
import { LanguageProvider } from './context/LanguageContext';

// Standard direct page imports for instant zero-latency transitions and zero chunk errors
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import PayrollPage from './pages/PayrollPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DynamicPage from './pages/DynamicPage';
import CalculatorPage from './pages/CalculatorPage';
import BlogPage from './pages/BlogPage';
import SmartAssistantWidget from './components/SmartAssistantWidget';

// Error Boundary for seamless chunk recovery
class ChunkErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error('Page render error:', error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900">New Version Available</h2>
          <p className="text-sm text-gray-500 max-w-md">
            The application has received an update. Please reload to load the latest version.
          </p>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

function AppContent() {
  const getRouteInfoFromHash = () => {
    const rawHash = window.location.hash.replace('#/', '').replace('#', '');
    const parts = rawHash.split('/');
    const mainPage = parts[0] || 'home';
    const subRoute = parts.slice(1).join('/') || null;
    const validStaticPages = ['home', 'about', 'services', 'payroll', 'careers', 'contact', 'admin', 'calculator', 'blog'];
    
    if (validStaticPages.includes(mainPage)) {
      return { page: mainPage, subRoute: subRoute };
    }
    if (mainPage === 'p' && subRoute) {
      return { page: 'p', subRoute: subRoute };
    }
    // Check if it's directly a custom page slug
    return { page: 'p', subRoute: mainPage };
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

    if (pageId.startsWith('p/')) {
      mainPage = 'p';
      sub = pageId.replace('p/', '');
      targetHash = pageId;
    } else if (pageId.includes('/')) {
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
      /* Temporarily commented out
      case 'calculator':
        return <CalculatorPage onNavigate={handleNavigate} />;
      */
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} selectedSlug={routeInfo.subRoute} />;
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case 'p':
        return <DynamicPage slug={routeInfo.subRoute} onNavigate={handleNavigate} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const isAdminPage = routeInfo.page === 'admin';

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans antialiased">
      {/* 100% Dynamic SEO Meta Tags & Schema.org JSON-LD Manager */}
      <SEOHead currentPage={routeInfo.page} />

      {/* Pinned Top Navbar (Hidden on full Admin Dashboard for clean UI) */}
      {!isAdminPage && (
        <Navbar 
          currentPage={routeInfo.page} 
          onNavigate={handleNavigate} 
        />
      )}

      {/* Code-split Main Content with Suspense & Chunk Error Boundary */}
      <main className="flex-grow" role="main">
        <ChunkErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            {renderCurrentPage()}
          </Suspense>
        </ChunkErrorBoundary>
      </main>

      {/* Smart Assistant & Direct WhatsApp Lead Widget */}
      {!isAdminPage && <SmartAssistantWidget onNavigate={handleNavigate} />}

      {/* Clean Optimized Footer */}
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CompanyProvider>
        <AppContent />
      </CompanyProvider>
    </LanguageProvider>
  );
}

export default App;
