import { useState, useRef, useEffect } from 'react';

function LandingPage({ onNavigate }) {
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

  const testimonials = [
    {
      quote: "Cut our compliance prep from 3 months to 2 weeks. The AI caught gaps our lawyers missed!",
      author: "Sarah Chen",
      role: "CTO, HealthTech SaaS",
      company: "MedFlow Solutions",
      industry: "Healthcare",
      savings: "$250K annually"
    },
    {
      quote: "Finally, compliance software that doesn't require a PhD to operate. Our whole team can use it.",
      author: "Michael Rodriguez", 
      role: "Compliance Director",
      company: "FinanceFirst",
      industry: "Financial Services",
      savings: "83% time reduction"
    },
    {
      quote: "The quantitative scoring changed everything. We can now prove compliance improvements to the board.",
      author: "Dr. Amanda Foster",
      role: "Chief Privacy Officer",
      company: "Global Healthcare Corp",
      industry: "Healthcare",
      savings: "Zero penalties in 2 years"
    }
  ];

  const problems = [
    {
      title: "Manual Compliance is Overwhelming",
      description: "Organizations spend 100+ hours per month on manual compliance checks, leading to human errors and missed deadlines.",
      impact: "$10M+ in potential fines",
      icon: "⏰",
      stats: "73% of companies miss compliance deadlines"
    },
    {
      title: "Scattered Regulations & Updates",
      description: "Keeping track of GDPR, HIPAA, SOX, PCI DSS, and 300+ other frameworks is impossible without automation.",
      impact: "Legal liability exposure",
      icon: "📚",
      stats: "150+ regulation updates per quarter"
    },
    {
      title: "No Quantitative Visibility",
      description: "Traditional tools provide checklists but no scoring. Boards need numbers to make informed decisions.",
      impact: "Strategic blindness",
      icon: "📊",
      stats: "85% lack compliance visibility"
    },
    {
      title: "Expert Dependency Bottleneck",
      description: "Compliance expertise is expensive and scarce. Organizations wait months for consultants and lawyers.",
      impact: "$500K+ consultant costs",
      icon: "👥",
      stats: "6-month average expert wait time"
    }
  ];

  const solutions = [
    {
      title: "AI-Powered Instant Analysis",
      description: "Upload any policy document and get instant compliance scores with gap identification in under 60 seconds.",
      benefit: "99.2% accuracy, 1000x faster than manual review",
      icon: "🤖",
      features: ["Real-time analysis", "Multi-framework support", "Instant results"]
    },
    {
      title: "Comprehensive Framework Coverage",
      description: "Pre-built support for 50+ compliance frameworks with automatic updates when regulations change.",
      benefit: "Always up-to-date, never miss changes",
      icon: "🛡️",
      features: ["GDPR, HIPAA, SOX, PCI DSS", "Auto-updates", "Global coverage"]
    },
    {
      title: "Executive Dashboard & Scoring",
      description: "Clear compliance scores (0-100%) with industry benchmarking and trend analysis for board presentations.",
      benefit: "Data-driven compliance decisions",
      icon: "📈",
      features: ["Industry benchmarks", "Trend analysis", "Executive reports"]
    },
    {
      title: "No-Code Implementation",
      description: "Designed for business users, not just legal teams. Anyone can perform compliance analysis without training.",
      benefit: "Democratized compliance expertise",
      icon: "✨",
      features: ["Intuitive interface", "No training required", "Team collaboration"]
    }
  ];

  const keyFeatures = [
    {
      title: "Intelligent Document Analysis",
      description: "Advanced NLP engine analyzes policy documents in multiple formats (PDF, DOCX, TXT) with 99.2% accuracy.",
      techDetails: "Built on Google's Gemini AI with custom compliance training",
      demo: "Try with any policy document",
      icon: "🧠"
    },
    {
      title: "Real-Time Compliance Scoring",
      description: "Get instant numerical scores (0-100%) for each framework with detailed gap analysis and remediation steps.",
      techDetails: "Proprietary scoring algorithm with 10,000+ compliance rules",
      demo: "See live scoring demo",
      icon: "⚡"
    },
    {
      title: "Automated Policy Generation",
      description: "Generate professional, audit-ready policies in minutes using AI-powered templates and industry best practices.",
      techDetails: "Templates for 50+ industries with legal review integration",
      demo: "Generate sample policy",
      icon: "📝"
    },
    {
      title: "Intelligent Remediation Plans",
      description: "Receive prioritized action plans with timelines, effort estimates, and business impact analysis.",
      techDetails: "Risk-based prioritization with resource allocation recommendations",
      demo: "View sample plan",
      icon: "🎯"
    }
  ];

  const industries = [
    { name: "Healthcare", icon: "🏥", compliance: "HIPAA, HITECH", companies: "500+" },
    { name: "Financial Services", icon: "🏦", compliance: "SOX, PCI DSS", companies: "300+" },
    { name: "Technology", icon: "💻", compliance: "GDPR, CCPA", companies: "750+" },
    { name: "Manufacturing", icon: "🏭", compliance: "ISO 27001", companies: "200+" },
    { name: "Retail", icon: "🛍️", compliance: "PCI DSS, GDPR", companies: "400+" },
    { name: "Education", icon: "🎓", compliance: "FERPA, GDPR", companies: "150+" }
  ];

  // Mouse tracking for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
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
                      <button
                        onClick={() => onNavigate('analyzer')}
                        className="w-full flex items-start p-4 bg-gray-50/50 rounded-2xl hover:bg-blue-50 transition-all duration-300 text-left group hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors">
                          <span className="text-blue-600 text-lg">🔍</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold mb-1 text-sm">Policy Gap Analyzer</h3>
                          <p className="text-gray-600 text-xs">Upload policies, get instant compliance scores</p>
                        </div>
                      </button>

                      <button
                        onClick={() => onNavigate('generator')}
                        className="w-full flex items-start p-4 bg-gray-50/50 rounded-2xl hover:bg-purple-50 transition-all duration-300 text-left group hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                          <span className="text-purple-600 text-lg">⚡</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold mb-1 text-sm">AI Policy Generator</h3>
                          <p className="text-gray-600 text-xs">Generate GDPR/HIPAA docs in 1 click</p>
                        </div>
                      </button>

                      <button
                        onClick={() => onNavigate('assessment')}
                        className="w-full flex items-start p-4 bg-gray-50/50 rounded-2xl hover:bg-orange-50 transition-all duration-300 text-left group hover:scale-[1.02]"
                      >
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors">
                          <span className="text-orange-600 text-lg">🛡️</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold mb-1 text-sm">Risk Assessment</h3>
                          <p className="text-gray-600 text-xs">AI-powered vulnerability scoring</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm">
                Pricing
              </button>
              <button 
                onClick={() => onNavigate('compliances')}
                className="px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
              >
                Resources
              </button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-72' : 'w-60'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Ask compliance questions..."
                    className="w-full bg-gray-50/50 border border-gray-200/50 rounded-2xl px-4 py-2.5 pl-10 text-gray-900 placeholder-gray-500 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all text-sm backdrop-blur-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onNavigate('analyzer')}
                className="relative px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                Try Demo
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10 group-hover:opacity-50 transition-opacity"></div>
              </button>

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
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                >
                  🔍 Policy Analyzer
                </button>
                <button
                  onClick={() => onNavigate('generator')}
                  className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                >
                  ⚡ AI Generator
                </button>
                <button
                  onClick={() => onNavigate('compliances')}
                  className="text-left text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm py-2"
                >
                  📚 Learn Frameworks
                </button>
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
                🚀 Trusted by 1,500+ companies • 99.9% accuracy • $50M+ in fines prevented
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
              <button 
                onClick={() => onNavigate('analyzer')}
                className="group relative px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Start Free Analysis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => onNavigate('generator')}
                className="px-6 sm:px-8 py-4 bg-white/60 backdrop-blur-xl text-gray-900 rounded-2xl font-semibold text-lg border border-gray-200/50 transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
              >
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-600 px-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">40% Fewer Breaches</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">Weeks to Hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm">Enterprise Grade</span>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Hidden Costs</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl">
                    <span className="font-semibold text-red-800">Manual Review Time</span>
                    <span className="text-red-600 font-bold">100+ hours/month</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl">
                    <span className="font-semibold text-orange-800">Average Fine per Violation</span>
                    <span className="text-orange-600 font-bold">$4.4M</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-2xl">
                    <span className="font-semibold text-yellow-800">Consultant Costs</span>
                    <span className="text-yellow-600 font-bold">$500K+ annually</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-100 rounded-2xl border-2 border-red-300">
                    <span className="font-semibold text-red-900">Total Business Risk</span>
                    <span className="text-red-700 font-bold text-lg">$50M+ exposure</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-4">PoliGap Solution Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">99.2%</div>
                    <div className="text-blue-100 text-sm">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">60 sec</div>
                    <div className="text-blue-100 text-sm">Analysis Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">83%</div>
                    <div className="text-blue-100 text-sm">Time Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$0</div>
                    <div className="text-blue-100 text-sm">Setup Cost</div>
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
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Enterprise-Grade Features</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Built for scale with enterprise security, accuracy, and reliability at every level
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Core Capabilities</h3>
                <div className="space-y-3">
                  {keyFeatures.map((feature, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                        activeFeature === index
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{feature.icon}</span>
                        <span className="font-semibold text-sm">{feature.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Details */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{keyFeatures[activeFeature].icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{keyFeatures[activeFeature].title}</h3>
                </div>
                
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {keyFeatures[activeFeature].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">🔧 Technical Details</h4>
                    <p className="text-blue-800 text-sm">{keyFeatures[activeFeature].techDetails}</p>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2">🎯 Try It Now</h4>
                    <p className="text-green-800 text-sm">{keyFeatures[activeFeature].demo}</p>
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate('analyzer')}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                >
                  Try This Feature →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Coverage */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted Across Industries</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              From startups to Fortune 500 companies, organizations across every industry rely on PoliGap for compliance excellence
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
                <div className="text-blue-600 font-bold text-xs">{industry.companies}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Proven Results & Happy Customers</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Real companies, real results. See how PoliGap transforms compliance operations.
            </p>
          </div>

          {/* Success Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,500+</div>
              <div className="text-gray-700 font-medium">Companies Trust Us</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
              <div className="text-gray-700 font-medium">Fines Prevented</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
              <div className="text-gray-700 font-medium">Accuracy Rate</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">AI Monitoring</div>
            </div>
          </div>

          {/* Enhanced Testimonial */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200/50 shadow-lg">
              <div className="text-center">
                <div className="text-5xl mb-6 text-gray-300">"</div>
                <blockquote className="text-lg sm:text-xl font-medium mb-8 leading-relaxed text-gray-800">
                  {testimonials[activeTestimonial].quote}
                </blockquote>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold">{testimonials[activeTestimonial].author.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">{testimonials[activeTestimonial].author}</div>
                      <div className="text-gray-600 text-sm">{testimonials[activeTestimonial].role}</div>
                      <div className="text-gray-500 text-sm">{testimonials[activeTestimonial].company}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="bg-blue-50 px-4 py-2 rounded-xl">
                      <div className="text-blue-600 font-semibold text-sm">{testimonials[activeTestimonial].industry}</div>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-xl">
                      <div className="text-green-600 font-semibold text-sm">{testimonials[activeTestimonial].savings}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
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

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Compliance?</h3>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 1,500+ companies using AI-powered compliance. Start your free analysis today and see gaps in under 60 seconds.
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
              ✅ No credit card required • ✅ 2-minute setup • ✅ Instant results
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
