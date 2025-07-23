import { useState, useEffect } from 'react';

function Navigation({ onNavigate, currentPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2 bg-white shadow-md' : 'py-4 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigateTo('home')} 
              className="flex items-center focus:outline-none"
            >
              <div className={`w-10 h-10 ${scrolled ? 'bg-gradient-primary' : 'bg-white'} rounded-xl flex items-center justify-center mr-2 transition-all duration-300`}>
                <svg className={`w-6 h-6 ${scrolled ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className={`font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'} transition-all duration-300`}>PoliGap</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            <NavItem onClick={() => navigateTo('analyzer')} isActive={currentPage === 'analyzer'} scrolled={scrolled}>Policy Analyzer</NavItem>
            <NavItem onClick={() => navigateTo('generator')} isActive={currentPage === 'generator'} scrolled={scrolled}>Policy Generator</NavItem>
            <NavItem onClick={() => navigateTo('assessment')} isActive={currentPage === 'assessment'} scrolled={scrolled}>Risk Assessment</NavItem>
            <NavItem onClick={() => navigateTo('compliances')} isActive={currentPage === 'compliances'} scrolled={scrolled}>Compliance Monitor</NavItem>
            <NavItem onClick={() => navigateTo('knowledgehub')} isActive={currentPage === 'knowledgehub'} scrolled={scrolled}>Knowledge Hub</NavItem>
            <NavItem onClick={() => navigateTo('frameworks')} isActive={currentPage === 'frameworks'} scrolled={scrolled}>Frameworks</NavItem>
            <NavItem onClick={() => navigateTo('pricing')} isActive={currentPage === 'pricing'} scrolled={scrolled}>Pricing</NavItem>
            <NavItem onClick={() => navigateTo('resources')} isActive={currentPage === 'resources'} scrolled={scrolled}>Resources</NavItem>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu} 
              className={`p-2 rounded-md focus:outline-none ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-lg rounded-b-2xl overflow-hidden animate-fadeInDown">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavItem onClick={() => navigateTo('analyzer')} isActive={currentPage === 'analyzer'}>Policy Analyzer</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('generator')} isActive={currentPage === 'generator'}>Policy Generator</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('assessment')} isActive={currentPage === 'assessment'}>Risk Assessment</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('compliances')} isActive={currentPage === 'compliances'}>Compliance Monitor</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('knowledgehub')} isActive={currentPage === 'knowledgehub'}>Knowledge Hub</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('frameworks')} isActive={currentPage === 'frameworks'}>Frameworks</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('pricing')} isActive={currentPage === 'pricing'}>Pricing</MobileNavItem>
            <MobileNavItem onClick={() => navigateTo('resources')} isActive={currentPage === 'resources'}>Resources</MobileNavItem>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ children, onClick, isActive, scrolled }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive
          ? scrolled
            ? 'bg-blue-100 text-blue-700'
            : 'bg-white/20 text-white'
          : scrolled
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-white/90 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function MobileNavItem({ children, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2 rounded-xl text-base font-medium ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default Navigation;
