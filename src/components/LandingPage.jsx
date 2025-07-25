import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ModernLandingWorkflow from './ModernLandingWorkflow';

function LandingPage({ onNavigate, onSearch, onAuthOpen, onProfileOpen, onHistoryOpen }) {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeProblem, setActiveProblem] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  const complianceFrameworks = [
    {
      name: "GDPR (General Data Protection Regulation)",
      description: "EU regulation for data protection and privacy affecting all companies processing EU citizens' data",
      scope: "Global reach",
      sector: "All sectors processing personal data",
      keyRequirements: "Data minimization, consent, right to erasure"
    },
    {
      name: "HIPAA (Health Insurance Portability and Accountability Act)", 
      description: "US federal law protecting sensitive patient health information in healthcare organizations",
      scope: "US Healthcare",
      sector: "Healthcare providers, insurers, business associates",
      keyRequirements: "Administrative, physical, technical safeguards"
    },
    {
      name: "SOX (Sarbanes-Oxley Act)",
      description: "US federal law enhancing corporate disclosure and financial transparency for public companies",
      scope: "US Public Companies",
      sector: "Publicly traded companies",
      keyRequirements: "Internal controls, financial reporting accuracy"
    }
  ];

  const problems = [
    {
      title: "Complex Regulatory Landscape",
      description: "Organizations must navigate multiple overlapping regulations like GDPR, HIPAA, SOX, and industry-specific requirements that frequently change.",
      impact: "Compliance complexity",
      icon: "⏰",
      stats: "Multiple frameworks to track"
    },
    {
      title: "Manual Review Processes",
      description: "Traditional compliance reviews rely on manual document analysis, which is time-intensive and prone to human oversight.",
      impact: "Resource intensive",
      icon: "📚",
      stats: "Time-consuming analysis"
    },
    {
      title: "Lack of Standardized Scoring",
      description: "Most compliance tools provide checklists without quantitative metrics, making it difficult to measure progress and compare against standards.",
      impact: "Limited visibility",
      icon: "📊",
      stats: "Difficult to measure progress"
    },
    {
      title: "Expert Knowledge Requirements",
      description: "Compliance analysis traditionally requires specialized legal and regulatory expertise that may not be readily available in all organizations.",
      impact: "Knowledge dependency",
      icon: "👥",
      stats: "Specialized expertise needed"
    }
  ];

  const solutions = [
    {
      title: "AI-Powered Document Analysis",
      description: "Upload policy documents and receive automated analysis against major compliance frameworks with detailed gap identification.",
      benefit: "Streamlined analysis process with systematic approach",
      icon: "🤖",
      features: ["Document scanning", "Framework comparison", "Gap identification"]
    },
    {
      title: "Comprehensive Framework Support",
      description: "Built-in support for major compliance frameworks including GDPR, HIPAA, SOX, and other widely-adopted standards.",
      benefit: "Standardized approach to compliance assessment",
      icon: "🛡️",
      features: ["GDPR, HIPAA, SOX", "Standard frameworks", "Best practices"]
    },
    {
      title: "Scoring and Assessment Dashboard",
      description: "Visual compliance scoring system that provides clear metrics and progress tracking for organizational assessment.",
      benefit: "Quantifiable compliance metrics and progress tracking",
      icon: "📈",
      features: ["Visual scoring", "Progress tracking", "Assessment reports"]
    },
    {
      title: "User-Friendly Interface",
      description: "Designed for business users with intuitive workflows that don't require specialized compliance training to operate effectively.",
      benefit: "Accessible compliance analysis for all team members",
      icon: "✨",
      features: ["Intuitive design", "Clear workflows", "Team accessibility"]
    }
  ];

  const keyFeatures = [
    {
      title: "Document Analysis Engine",
      description: "Advanced text processing engine that analyzes policy documents in multiple formats (PDF, DOCX, TXT) for compliance assessment.",
      techDetails: "Built using modern NLP techniques with compliance rule matching",
      demo: "Upload your policy document to test",
      icon: "🧠"
    },
    {
      title: "Learn Frameworks",
      description: "Comprehensive guide to major compliance frameworks with simple explanations, requirements, and practical implementation guidance.",
      techDetails: "Educational content covering GDPR, HIPAA, SOX and other frameworks",
      demo: "Explore framework guides",
      icon: "�"
    },
    {
      title: "Policy Generation Assistant",
      description: "AI-assisted policy generation using established templates and industry best practices for common compliance requirements.",
      techDetails: "Template-based generation with compliance framework integration",
      demo: "Generate sample policy",
      icon: "📝"
    },
    {
      title: "Risk Assessment",
      description: "Comprehensive organizational risk assessment that analyzes your company's location, industry, data handling practices, and regulatory exposure to provide tailored compliance recommendations.",
      techDetails: "Multi-factor risk analysis considering geography, industry, data types, and regulatory requirements",
      demo: "Start organizational risk assessment",
      icon: "🎯"
    }
  ];

  const industries = [
    { name: "Healthcare", icon: "🏥", compliance: "HIPAA, HITECH", description: "Patient data protection" },
    { name: "Financial Services", icon: "🏦", compliance: "SOX, PCI DSS", description: "Financial data security" },
    { name: "Technology", icon: "💻", compliance: "GDPR, CCPA", description: "Data privacy compliance" },
    { name: "Manufacturing", icon: "🏭", compliance: "ISO 27001", description: "Quality management" },
    { name: "Retail", icon: "🛍️", compliance: "PCI DSS, GDPR", description: "Customer data protection" },
    { name: "Education", icon: "🎓", compliance: "FERPA, GDPR", description: "Student data privacy" }
  ];

  // Mouse tracking for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate compliance frameworks
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % complianceFrameworks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate problems
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProblem((prev) => (prev + 1) % problems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
      setSearchQuery(''); // Clear search after submission
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Minimalist Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">POLIGAP</h1>
                <p className="text-xs text-gray-500 font-medium">AI Policy Analysis</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm group"
                >
                  <span>Features</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === 'features' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl animate-slideDown">
                    <div className="space-y-4">
                      <Link
                        to="/analyzer"
                        className="w-full flex items-start p-4 bg-gray-50/50 rounded-2xl hover:bg-blue-50 transition-all duration-300 text-left group hover:scale-[1.02]"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                          <span className="text-blue-600 text-lg">🔍</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold mb-1 text-sm">Policy Gap Analyzer</h3>
                          <p className="text-gray-600 text-xs">Upload policies, get instant compliance scores</p>
                        </div>
                      </Link>

                      <Link
                        to="/generator"
                        className="w-full flex items-start p-4 bg-gray-50/50 rounded-2xl hover:bg-purple-50 transition-all duration-300 text-left group hover:scale-[1.02]"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                          <span className="text-purple-600 text-lg">⚡</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold mb-1 text-sm">AI Policy Generator</h3>
                          <p className="text-gray-600 text-xs">Generate GDPR/HIPAA docs in 1 click</p>
                        </div>
                      </Link>

                      <Link
                        to="/assessment"
                        className="w-full flex items-start p-4 bg-gray-50/50 rounded-2xl hover:bg-orange-50 transition-all duration-300 text-left group hover:scale-[1.02]"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                          <span className="text-orange-600 text-lg">🛡️</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold mb-1 text-sm">Risk Assessment</h3>
                          <p className="text-gray-600 text-xs">AI-powered vulnerability scoring</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm">
                Pricing
              </button>
              <Link 
                to="/compliances"
                className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Resources
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* User Actions */}
              {user ? (
                <div className="hidden lg:flex items-center space-x-3">
                  <button
                    onClick={onHistoryOpen}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>History</span>
                  </button>
                  <button
                    onClick={onProfileOpen}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">
                      {user.user_metadata?.full_name || 'User'}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <button
                    onClick={() => onAuthOpen('signin')}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onAuthOpen('signup')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium text-sm transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              {/* Search */}
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch} className={`relative transition-all duration-300 ${isSearchFocused ? 'w-72' : 'w-60'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask compliance questions... (Press Enter to chat)"
                    className="w-full bg-gray-50/50 border border-gray-200/50 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all text-sm backdrop-blur-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {/* Search button */}
                  {searchQuery.trim() && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  )}
                </form>
              </div>

              {/* CTA Button */}
              <Link
                to="/analyzer"
                className="relative px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Try Demo
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10 group-hover:opacity-50 transition-opacity"></div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200/50 animate-slideDown">
              {/* Mobile Search */}
              <div className="px-4 py-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask compliance questions..."
                    className="w-full bg-gray-50/50 border border-gray-200/50 rounded-2xl px-4 py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery.trim() && (
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  )}
                </form>
              </div>
              
              <div className="flex flex-col space-y-3 pt-4 px-4">
                <Link
                  to="/analyzer"
                  className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  🔍 Policy Analyzer
                </Link>
                <Link
                  to="/generator"
                  className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  ⚡ AI Generator
                </Link>
                <Link
                  to="/compliances"
                  className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  📚 Learn Frameworks
                </Link>

                {/* Mobile Auth Buttons */}
                {user ? (
                  <>
                    <button
                      onClick={onHistoryOpen}
                      className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                    >
                      📄 Document History
                    </button>
                    <button
                      onClick={onProfileOpen}
                      className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                    >
                      👤 Profile Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onAuthOpen('signin')}
                      className="text-left text-blue-600 hover:text-blue-700 transition-colors font-medium text-sm py-2"
                    >
                      🔐 Sign In
                    </button>
                    <button
                      onClick={() => onAuthOpen('signup')}
                      className="text-left text-purple-600 hover:text-purple-700 transition-colors font-medium text-sm py-2"
                    >
                      ✨ Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"
            style={{
              left: `${mousePosition.x * 0.02}px`,
              top: `${mousePosition.y * 0.02}px`,
              animationDelay: '0s'
            }}
          ></div>
          <div 
            className="absolute w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"
            style={{
              right: `${mousePosition.x * 0.01}px`,
              bottom: `${mousePosition.y * 0.01}px`,
              animationDelay: '2s'
            }}
          ></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeInUp">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-gray-200/50 mb-8 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-gray-700 font-medium text-sm">
                {user ? (
                  <>👋 Welcome back, {user.user_metadata?.full_name || 'User'}! • Ready for analysis</>
                ) : (
                  <>🚀 AI-powered compliance analysis • Framework-based assessment • Policy gap identification</>
                )}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              GDPR, HIPAA, SOX—
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Compliance Made Simple
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light px-4">
              Stop drowning in manual audits. Our AI scores your policies, identifies gaps, 
              and generates audit-ready documents in minutes. <span className="text-blue-600 font-semibold">No experts needed.</span>
            </p>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 px-4">
              <Link
                to="/analyzer"
                className="group relative px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span className="relative z-10">{user ? 'Analyze Document' : 'Start Free Analysis'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              {user ? (
                <button
                  onClick={onHistoryOpen}
                  className="px-6 sm:px-8 py-4 bg-white/60 backdrop-blur-xl text-gray-900 rounded-2xl font-semibold text-lg border border-gray-200/50 transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
                >
                  View History
                </button>
              ) : (
                <button
                  onClick={() => onAuthOpen('signup')}
                  className="px-6 sm:px-8 py-4 bg-white/60 backdrop-blur-xl text-gray-900 rounded-2xl font-semibold text-lg border border-gray-200/50 transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
                >
                  Create Account
                </button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-600 px-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">Framework Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">Easy to Use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The Compliance Crisis Costing Billions</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional compliance methods are broken. Organizations are drowning in manual processes while facing escalating regulatory complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Interactive Problem Showcase */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
              <div className="space-y-6">
                {problems.map((problem, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
                      activeProblem === index 
                        ? 'border-red-300 bg-red-50/50 shadow-lg scale-105' 
                        : 'border-gray-200 bg-gray-50/30 hover:border-red-200'
                    }`}
                    onClick={() => setActiveProblem(index)}
                  >
                    <div className="flex items-start">
                      <div className="text-3xl mr-4 mt-1">{problem.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{problem.description}</p>
                        <div className="flex flex-wrap justify-between items-center">
                          <span className="text-red-600 font-semibold text-sm">{problem.impact}</span>
                          <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-lg">{problem.stats}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Impact Visualization */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Compliance Challenges</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl">
                    <span className="font-semibold text-red-800">Manual Review Process</span>
                    <span className="text-red-600 font-bold">Time-intensive</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl">
                    <span className="font-semibold text-orange-800">Multiple Frameworks</span>
                    <span className="text-orange-600 font-bold">Complex tracking</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-2xl">
                    <span className="font-semibold text-yellow-800">Expert Knowledge</span>
                    <span className="text-yellow-600 font-bold">Specialized skills needed</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-100 rounded-2xl border-2 border-red-300">
                    <span className="font-semibold text-red-900">Compliance Complexity</span>
                    <span className="text-red-700 font-bold text-lg">Growing challenge</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">PoliGap Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">AI</div>
                    <div className="text-blue-100 text-sm">Powered Analysis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Multi</div>
                    <div className="text-blue-100 text-sm">Framework Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Visual</div>
                    <div className="text-blue-100 text-sm">Scoring System</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Easy</div>
                    <div className="text-blue-100 text-sm">To Use Interface</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions & Features Showcase */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The PoliGap Advantage</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Four powerful solutions that transform compliance from a cost center into a competitive advantage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className="group bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200/50 transition-all duration-500 hover:bg-white/80 hover:shadow-xl hover:scale-[1.02]"
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span className="text-2xl">{solution.icon}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{solution.title}</h3>
                </div>
                <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                  {solution.description}
                </p>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-6">
                  <div className="text-green-700 font-semibold text-sm mb-2">✨ Key Benefit:</div>
                  <div className="text-green-800 font-medium">{solution.benefit}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {solution.features.map((feature, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Deep Dive */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Wavy Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path 
              fill="url(#wave-gradient)" 
              fillOpacity="0.3" 
              d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,122.7C672,96,768,64,864,85.3C960,107,1056,181,1152,197.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>
          </svg>
          
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path 
              fill="url(#wave-gradient-2)" 
              fillOpacity="0.2" 
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave-reverse"
            />
            <defs>
              <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Eye-catching badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <span className="mr-2">�️</span>
              MAIN TOOLS & FEATURES
              <span className="ml-2">�️</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-orange-700 to-amber-800 bg-clip-text text-transparent mb-6">
              Enterprise-Grade Tools
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Built for scale with enterprise security, accuracy, and reliability at every level
            </p>
            
            {/* Interactive indicator */}
            <div className="flex items-center justify-center space-x-2 text-orange-600 text-sm font-medium bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <span className="hover:animate-bounce cursor-pointer">👆</span>
              <span>Click any tool below to start using it instantly</span>
              <span className="hover:animate-bounce cursor-pointer">👆</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-orange-200/50 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Tools header with icon */}
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl">🛠️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Available Tools</h3>
                      <p className="text-xs text-gray-600">Click to explore each tool</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {keyFeatures.map((feature, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group ${
                          activeFeature === index
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl border border-orange-300'
                            : 'bg-gradient-to-r from-white to-cream-50 text-gray-700 hover:from-amber-50 hover:to-orange-50 border border-orange-200 hover:border-orange-300 hover:shadow-lg'
                        }`}
                      >
                        {/* Hover glyph */}
                        <div className={`absolute top-2 right-2 transition-all duration-300 ${
                          activeFeature === index 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
                        }`}>
                          <span className={`text-lg ${
                            activeFeature === index ? 'text-white' : 'text-orange-500'
                          }`}>
                            ✨
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mr-3 transition-all duration-300 ${
                              activeFeature === index 
                                ? 'bg-white/20' 
                                : 'bg-gradient-to-r from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200'
                            }`}>
                              <span className="text-xl">{feature.icon}</span>
                            </div>
                            <div>
                              <span className={`font-semibold text-sm block ${
                                activeFeature === index ? 'text-white' : 'text-gray-800'
                              }`}>
                                {feature.title}
                              </span>
                              <span className={`text-xs ${
                                activeFeature === index ? 'text-orange-100' : 'text-gray-500'
                              }`}>
                                {activeFeature === index ? 'Currently active' : 'Click to view'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Arrow indicator */}
                          <div className={`transition-transform duration-300 ${
                            activeFeature === index ? 'transform rotate-90' : ''
                          }`}>
                            <span className={activeFeature === index ? 'text-white' : 'text-orange-400'}>▶</span>
                          </div>
                        </div>
                        
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Quick access hint */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 shadow-sm">
                    <div className="flex items-center text-green-700 text-xs">
                      <span className="mr-2 hover:animate-spin cursor-pointer">💡</span>
                      <span className="font-medium">Pro Tip: Each tool opens in a specialized interface for optimal workflow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-orange-200/50 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/30 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Tool header with status */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center mr-4 shadow-lg hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl text-white">{keyFeatures[activeFeature].icon}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{keyFeatures[activeFeature].title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          <span className="text-sm text-green-600 font-medium">Ready to use</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tool type badge with hover glyph */}
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer">
                      <span className="group-hover:hidden">AI TOOL</span>
                      <span className="hidden group-hover:inline">🚀 LAUNCH</span>
                    </div>
                  </div>
                  
                  {/* Description with emphasis */}
                  <div className="bg-white/90 rounded-2xl p-6 mb-6 border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {keyFeatures[activeFeature].description}
                    </p>
                  </div>

                  {/* Enhanced info cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm">🔧</span>
                        </div>
                        <h4 className="font-bold text-blue-900">Technical Specs</h4>
                        <span className="ml-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">⚡</span>
                      </div>
                      <p className="text-blue-800 text-sm leading-relaxed">{keyFeatures[activeFeature].techDetails}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-5 border border-green-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm">🎯</span>
                        </div>
                        <h4 className="font-bold text-green-900">What You Can Do</h4>
                        <span className="ml-auto text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">✨</span>
                      </div>
                      <p className="text-green-800 text-sm leading-relaxed">{keyFeatures[activeFeature].demo}</p>
                    </div>
                  </div>

                  {/* Enhanced action button */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <button 
                      onClick={() => {
                        switch(activeFeature) {
                          case 0: // Document Analysis Engine
                            onNavigate('analyzer');
                            break;
                          case 1: // Learn Frameworks
                            onNavigate('compliances');
                            break;
                          case 2: // Policy Generation Assistant
                            onNavigate('generator');
                            break;
                          case 3: // Risk Assessment
                            onNavigate('assessment');
                            break;
                          default:
                            onNavigate('analyzer');
                        }
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden group"
                    >
                      {/* Button wave effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      
                      <div className="flex items-center justify-center relative z-10">
                        <span className="mr-2 group-hover:animate-bounce">🚀</span>
                        <span>Launch {keyFeatures[activeFeature].title}</span>
                        <span className="ml-2 group-hover:animate-pulse">→</span>
                      </div>
                    </button>
                    
                    {/* Quick stats with hover glyphs */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center group cursor-pointer">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-2 group-hover:animate-ping"></span>
                        <span className="group-hover:text-amber-600 transition-colors duration-300">Enterprise Ready</span>
                        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">🏢</span>
                      </div>
                      <div className="flex items-center group cursor-pointer">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 group-hover:animate-ping"></span>
                        <span className="group-hover:text-green-600 transition-colors duration-300">Instant Access</span>
                        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">⚡</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Coverage */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for Multiple Industries</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              PoliGap supports compliance analysis across various industries, each with their own specific regulatory requirements and frameworks
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <div 
                key={index}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 text-center hover:bg-white/80 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-3xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{industry.name}</h3>
                <p className="text-gray-600 text-xs mb-2">{industry.compliance}</p>
                <div className="text-blue-600 font-medium text-xs">{industry.description}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready for Any Industry, Any Scale</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our AI platform adapts to your industry's specific requirements, whether you're a tech startup or a multinational corporation.
            </p>
            <button 
              onClick={() => onNavigate('analyzer')}
              className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Industry Analysis
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Social Proof */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Compliance Framework Information</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Learn about major compliance frameworks and how they apply to modern organizations.
            </p>
          </div>

          {/* Key Features Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">GDPR</div>
              <div className="text-gray-700 font-medium">EU Data Protection</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">HIPAA</div>
              <div className="text-gray-700 font-medium">Healthcare Privacy</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">SOX</div>
              <div className="text-gray-700 font-medium">Financial Controls</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">AI</div>
              <div className="text-gray-700 font-medium">Powered Analysis</div>
            </div>
          </div>

          {/* Compliance Framework Information */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
              <div className="text-center">
                <div className="text-5xl mb-6 text-gray-300">"</div>
                <blockquote className="text-lg sm:text-xl font-medium mb-8 leading-relaxed text-gray-800">
                  {complianceFrameworks[activeTestimonial].description}
                </blockquote>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-lg">📋</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{complianceFrameworks[activeTestimonial].name}</div>
                      <div className="text-gray-600 text-sm">{complianceFrameworks[activeTestimonial].scope}</div>
                      <div className="text-gray-500 text-sm">{complianceFrameworks[activeTestimonial].sector}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="bg-blue-50 px-4 py-2 rounded-xl">
                      <div className="text-blue-600 font-semibold text-sm">Key Requirements</div>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-xl">
                      <div className="text-green-600 font-semibold text-sm">{complianceFrameworks[activeTestimonial].keyRequirements}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Framework Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {complianceFrameworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-blue-500 shadow-lg' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Workflow Section */}
      <ModernLandingWorkflow onAuthOpen={onAuthOpen} />

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Compliance?</h3>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience AI-powered compliance analysis. Start analyzing your policies against major frameworks and identify areas for improvement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button 
                onClick={() => onNavigate('analyzer')}
                className="bg-white text-gray-900 px-6 sm:px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Analysis
              </button>
              <button className="bg-white/20 backdrop-blur-xl text-white px-6 sm:px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 transition-all duration-300 hover:bg-white/30">
                Schedule Demo
              </button>
            </div>
            <div className="mt-6 text-blue-200 text-sm">
              ✅ Free to try • ✅ Easy setup • ✅ Framework analysis
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h4 className="text-xl font-bold">PoliGap</h4>
                <p className="text-xs text-gray-400">AI-Powered Compliance Excellence</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Revolutionizing compliance with enterprise-grade AI analysis, automated reporting, 
              and intelligent policy generation for modern organizations worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-gray-400 mb-6">
              <button className="hover:text-gray-200 transition-colors">Privacy Policy</button>
              <button className="hover:text-gray-200 transition-colors">Terms of Service</button>
              <button className="hover:text-gray-200 transition-colors">Security</button>
              <button className="hover:text-gray-200 transition-colors">API Documentation</button>
              <button className="hover:text-gray-200 transition-colors">Support</button>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center">
              <span className="text-gray-500 text-sm">© 2024 PoliGap. All rights reserved. Built with 💙 for compliance professionals.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
