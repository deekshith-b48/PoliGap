import { useState, useRef, useEffect } from 'react';

function LandingPage({ onNavigate }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const testimonials = [
    {
      quote: "Cut our compliance prep from 3 months to 2 weeks. The AI caught gaps our lawyers missed!",
      author: "Sarah Chen",
      role: "CTO, HealthTech SaaS",
      company: "MedFlow Solutions"
    },
    {
      quote: "Finally, compliance software that doesn't require a PhD to operate. Our whole team can use it.",
      author: "Michael Rodriguez", 
      role: "Compliance Director",
      company: "FinanceFirst"
    },
    {
      quote: "The quantitative scoring changed everything. We can now prove compliance improvements to the board.",
      author: "Dr. Amanda Foster",
      role: "Chief Privacy Officer",
      company: "Global Healthcare Corp"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cyberpunk Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-b border-cyan-500/30 shadow-lg">
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-cyan-500/5"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Left Side - Logo + Main CTAs */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow-accent">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-wider" style={{fontFamily: 'Space Grotesk, sans-serif'}}>POLIGAP</h1>
                  <p className="text-xs text-cyan-300 font-medium">Policy Gap Analyzer</p>
                </div>
              </div>

              {/* Main CTAs */}
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  onMouseEnter={() => setShowProductTour(true)}
                  onMouseLeave={() => setShowProductTour(false)}
                  className="relative px-4 py-2 text-cyan-300 hover:text-cyan-100 transition-colors font-medium border border-cyan-500/30 rounded-xl hover:border-cyan-400/50"
                >
                  Product Tour
                  {showProductTour && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-cyan-500/30 rounded-2xl p-4 shadow-glow z-50">
                      <div className="bg-slate-700 rounded-xl h-32 mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-cyan-300 text-sm">30-sec Demo Video</p>
                        </div>
                      </div>
                      <p className="text-white text-sm font-medium">See how PoliGap analyzes policies in real-time</p>
                    </div>
                  )}
                </button>
                <button className="px-4 py-2 text-purple-300 hover:text-purple-100 transition-colors font-medium">
                  Pricing
                </button>
              </div>
            </div>

            {/* Center - Functional Dropdown Menus */}
            <div className="hidden xl:flex items-center space-x-6">

              {/* Features Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  <span>⚡</span>
                  <span>Features</span>
                  <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === 'features' && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-slate-800 border border-cyan-500/30 rounded-2xl p-6 shadow-glow z-50 animate-fadeInUp">
                    <div className="grid grid-cols-1 gap-4">
                      <button
                        onClick={() => onNavigate('analyzer')}
                        className="flex items-start p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-500/30 transition-colors">
                          <span className="text-blue-400">🔍</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Policy Gap Analyzer</h3>
                          <p className="text-gray-400 text-sm">Upload policies, get instant compliance scores</p>
                        </div>
                      </button>

                      <button
                        onClick={() => onNavigate('generator')}
                        className="flex items-start p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-500/30 transition-colors">
                          <span className="text-purple-400">⚡</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">AI Policy Generator</h3>
                          <p className="text-gray-400 text-sm">Generate GDPR/HIPAA docs in 1 click</p>
                        </div>
                      </button>

                      <button
                        onClick={() => onNavigate('assessment')}
                        className="flex items-start p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-500/30 transition-colors">
                          <span className="text-red-400">🛡️</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">Risk Assessment</h3>
                          <p className="text-gray-400 text-sm">AI-powered vulnerability scoring</p>
                        </div>
                      </button>

                      <div className="flex items-start p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors text-left group">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-500/30 transition-colors">
                          <span className="text-green-400">🤖</span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">AI Expert Chat</h3>
                          <p className="text-gray-400 text-sm">Gemini-powered compliance Q&A</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Frameworks Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'frameworks' ? null : 'frameworks')}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  <span>🛡️</span>
                  <span>Frameworks</span>
                  <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'frameworks' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === 'frameworks' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-cyan-500/30 rounded-2xl p-6 shadow-glow z-50 animate-fadeInUp">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors group">
                        <span className="text-lg mr-3">🇪🇺</span>
                        <div>
                          <div className="text-white font-medium text-sm">GDPR</div>
                          <div className="text-gray-400 text-xs">EU Privacy</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors group">
                        <span className="text-lg mr-3">🏥</span>
                        <div>
                          <div className="text-white font-medium text-sm">HIPAA</div>
                          <div className="text-gray-400 text-xs">US Healthcare</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors group">
                        <span className="text-lg mr-3">📊</span>
                        <div>
                          <div className="text-white font-medium text-sm">SOX</div>
                          <div className="text-gray-400 text-xs">Financial</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors group">
                        <span className="text-lg mr-3">💳</span>
                        <div>
                          <div className="text-white font-medium text-sm">PCI DSS</div>
                          <div className="text-gray-400 text-xs">Payments</div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-sm border border-cyan-500/30 rounded-xl py-2">
                      See all 50+ supported frameworks →
                    </button>
                  </div>
                )}
              </div>

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  <span>📚</span>
                  <span>Resources</span>
                  <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === 'resources' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-cyan-500/30 rounded-2xl p-4 shadow-glow z-50 animate-fadeInUp">
                    <div className="space-y-2">
                      <button
                        onClick={() => onNavigate('compliances')}
                        className="w-full text-left p-3 text-white hover:bg-slate-700/50 rounded-xl transition-colors"
                      >
                        📋 Compliance Guides
                      </button>
                      <button className="w-full text-left p-3 text-white hover:bg-slate-700/50 rounded-xl transition-colors">
                        🎥 Webinars
                      </button>
                      <button className="w-full text-left p-3 text-white hover:bg-slate-700/50 rounded-xl transition-colors">
                        🔌 API Docs
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Search + Demo CTA + Account */}
            <div className="flex items-center space-x-4">

              {/* AI Search Bar */}
              <div className="hidden lg:block relative">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-64'}`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Ask compliance questions..."
                    className="w-full bg-slate-800/80 border border-cyan-500/30 rounded-2xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-cyan-500/30 rounded-2xl p-4 shadow-glow z-50">
                      <div className="space-y-2">
                        <div className="p-2 hover:bg-slate-700 rounded-xl cursor-pointer">
                          <div className="text-white text-sm font-medium">GDPR data retention requirements</div>
                          <div className="text-gray-400 text-xs">Article 5(1)(e) - Storage limitation principle</div>
                        </div>
                        <div className="p-2 hover:bg-slate-700 rounded-xl cursor-pointer">
                          <div className="text-white text-sm font-medium">HIPAA breach notification timeline</div>
                          <div className="text-gray-400 text-xs">164.400-414 - 60 day notification rule</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo CTA - Glowing */}
              <button
                onClick={() => onNavigate('analyzer')}
                className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-2xl hover:from-cyan-400 hover:to-purple-500 transition-all transform hover:scale-105 shadow-glow-accent animate-ai-pulse"
              >
                Try Live Demo →
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10"></div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-cyan-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-cyan-500/30">
              <div className="flex flex-col space-y-4 pt-4">
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="text-left text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  🔍 Policy Analyzer
                </button>
                <button
                  onClick={() => onNavigate('generator')}
                  className="text-left text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  ⚡ AI Generator
                </button>
                <button
                  onClick={() => onNavigate('compliances')}
                  className="text-left text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  📚 Learn Frameworks
                </button>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="text-left text-white hover:text-cyan-300 transition-colors font-medium"
                >
                  🛡️ Risk Assessment
                </button>
                <div className="pt-2 border-t border-cyan-500/30">
                  <input
                    type="text"
                    placeholder="Search compliance topics..."
                    className="w-full bg-slate-800/80 border border-cyan-500/30 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fadeInUp">
            {/* Market Stats Banner */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-ai-pulse"></span>
              <span className="text-white/90 font-medium">
                🚀 $75.8B compliance market by 2031 • 83% of teams adopting AI
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              GDPR, HIPAA, SOX—
              <span className="block text-gradient-accent">Compliance Nightmare?</span>
              <span className="block text-4xl md:text-5xl mt-4 text-blue-300">
                Our AI fixes it in minutes.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              Stop drowning in manual audits. Our AI scores your policies, identifies gaps, 
              and generates audit-ready documents. <span className="text-blue-300 font-semibold">No experts needed.</span>
            </p>
            
            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button 
                onClick={() => onNavigate('analyzer')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl btn-hover focus-ring shadow-glow transform hover:scale-105 transition-all"
              >
                Start Free Analysis
              </button>
              <button 
                onClick={() => onNavigate('generator')}
                className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/30 btn-hover focus-ring hover:bg-white/20 transition-all"
              >
                See Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-12 text-white/70">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">40% Fewer Breaches</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">Weeks to Hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">Fortune 500 Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-6 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-black text-gray-900">The Compliance Crisis</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <span className="text-white font-bold text-sm">×</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Manual processes waste 100+ hours/year</h3>
                    <p className="text-gray-700">Traditional compliance methods are time-consuming, error-prone, and require significant expertise</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <span className="text-white font-bold text-sm">$</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">One missed rule = $10M+ fines</h3>
                    <p className="text-gray-700">GDPR fines alone can reach 4% of global revenue. Non-compliance leads to severe financial penalties</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center mr-4 mt-1">
                    <span className="text-white font-bold text-sm">⏰</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Audits take weeks (and still fail)</h3>
                    <p className="text-gray-700">Complex regulations across GDPR, HIPAA, SOX, PCI DSS require constant monitoring and updates</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => document.getElementById('solution').scrollIntoView({behavior: 'smooth'})}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center"
                >
                  How we fix this →
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Problem Visualization */}
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Current Compliance Reality</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-red-100 p-4 rounded-2xl border border-red-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-red-800">Manual Review Process</span>
                    <span className="text-red-600 font-bold">3-6 Months</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="bg-orange-100 p-4 rounded-2xl border border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-orange-800">Error Rate</span>
                    <span className="text-orange-600 font-bold">30-40%</span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                </div>
                <div className="bg-yellow-100 p-4 rounded-2xl border border-yellow-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-yellow-800">Cost per Audit</span>
                    <span className="text-yellow-600 font-bold">$50K-$200K</span>
                  </div>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl font-black mb-8">Massive Market Opportunity</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              The compliance software market is exploding as organizations scramble to meet increasing regulatory demands
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-5xl font-black text-blue-300 mb-4">$75.8B</div>
                <div className="text-lg font-semibold mb-2">Market Size by 2031</div>
                <div className="text-blue-200 text-sm">Compliance Management Software at 10.9% CAGR</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-5xl font-black text-green-300 mb-4">83%</div>
                <div className="text-lg font-semibold mb-2">AI Adoption Rate</div>
                <div className="text-green-200 text-sm">Compliance professionals expect full AI adoption by 2029</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="text-5xl font-black text-purple-300 mb-4">300M</div>
                <div className="text-lg font-semibold mb-2">New Regulations</div>
                <div className="text-purple-200 text-sm">Expected globally in the next decade</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section id="solution" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-5xl font-black text-gray-900 mb-6">The PoliGap Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four powerful AI modules that transform compliance from a nightmare into a competitive advantage
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Policy Gap Analyzer */}
            <div 
              onClick={() => onNavigate('analyzer')}
              className="group cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border-2 border-blue-200 card-hover shadow-soft hover:shadow-glow-accent transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Policy Gap Analyzer</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Upload policies → Get instant compliance scores vs. GDPR/HIPAA/SOX/PCI DSS. 
                Automated benchmarking with numeric scores and industry comparisons.
              </p>
              <div className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold inline-flex items-center group-hover:bg-blue-600 transition-colors">
                Start Analysis
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* AI Policy Generator */}
            <div 
              onClick={() => onNavigate('generator')}
              className="group cursor-pointer bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 border-2 border-purple-200 card-hover shadow-soft hover:shadow-glow-purple transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">AI Policy Generator</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Type "GDPR Privacy Policy" → AI drafts a branded PDF in 30 seconds. 
                Professionally formatted, audit-ready policies tailored to any industry.
              </p>
              <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold inline-flex items-center group-hover:bg-purple-600 transition-colors">
                Generate Policy
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Know Compliances */}
            <div 
              onClick={() => onNavigate('compliances')}
              className="group cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-8 border-2 border-emerald-200 card-hover shadow-soft hover:shadow-glow transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Know Compliances</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Layman's guides to frameworks (e.g., "HIPAA for Marketers"). 
                Educational content that empowers business users, not just legal teams.
              </p>
              <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold inline-flex items-center group-hover:bg-emerald-600 transition-colors">
                Learn Frameworks
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Risk Assessment */}
            <div 
              onClick={() => onNavigate('assessment')}
              className="group cursor-pointer bg-gradient-to-br from-orange-50 to-red-100 rounded-3xl p-8 border-2 border-orange-200 card-hover shadow-soft hover:shadow-glow transition-all"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Risk Assessment</h3>
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                AI identifies top risks + action plan. Comprehensive risk scoring with prioritized 
                recommendations to reduce vulnerabilities and avoid costly fines.
              </p>
              <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-semibold inline-flex items-center group-hover:bg-orange-600 transition-colors">
                Assess Risk
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Expert Chat Demo */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-primary rounded-2xl text-white font-semibold mb-8 shadow-glow">
              <span className="w-3 h-3 bg-white rounded-full mr-3 animate-ai-pulse"></span>
              Powered by Gemini AI
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI Expert Chat Assistant
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Context-aware AI that answers compliance questions using your uploaded documents as reference. 
              Like having a compliance expert on-demand.
            </p>
            
            {/* Chat Demo Preview */}
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-gradient-primary text-white rounded-2xl px-4 py-3 max-w-xs">
                    <p className="text-sm">How does GDPR apply to our HR data?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 bg-gradient-primary rounded-full mr-2"></div>
                      <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
                    </div>
                    <p className="text-sm text-gray-800">Based on your uploaded HR policy, GDPR Article 6 applies to employee data processing. You'll need explicit consent for...</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">Try it with your documents →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Sets PoliGap Apart</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another compliance tool. We're revolutionizing how organizations approach regulatory requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quantitative Scoring</h3>
              <p className="text-gray-700 text-sm">See your compliance % like a credit score. Numeric benchmarking vs. industry peers.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-200 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Modern UI Design</h3>
              <p className="text-gray-700 text-sm">No clunky menus—just drag, click, done. Built for the next generation of compliance.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">1-Click PDFs</h3>
              <p className="text-gray-700 text-sm">Audit-ready policies, formatted & branded. Professional documents in seconds.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl border border-orange-200 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Speed & Accuracy</h3>
              <p className="text-gray-700 text-sm">AI minimizes errors, delivers faster results, and adapts to regulatory updates in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fortune 500 companies, startups, and compliance professionals rely on PoliGap
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-12 mb-16 opacity-70">
            <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
              <span className="font-semibold">SOC 2 Compliant</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
              <span className="font-semibold">ISO 27001 Certified</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
              <span className="font-semibold">GDPR Ready</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
              <span className="font-semibold">Enterprise Security</span>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="text-center">
                <div className="text-6xl mb-6">"</div>
                <blockquote className="text-2xl font-medium mb-8 leading-relaxed">
                  {testimonials[activeTestimonial].quote}
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonials[activeTestimonial].author.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{testimonials[activeTestimonial].author}</div>
                    <div className="text-gray-300 text-sm">{testimonials[activeTestimonial].role}</div>
                    <div className="text-gray-400 text-sm">{testimonials[activeTestimonial].company}</div>
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
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Impact */}
      <section className="py-20 px-6 bg-green-50 border-t-4 border-green-500">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl font-black text-gray-900 mb-8">Proven Results in the Real World</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Organizations using AI-powered compliance tools are seeing dramatic improvements in efficiency and security
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
                <div className="text-5xl font-black text-green-600 mb-4">40%</div>
                <div className="text-xl font-bold text-gray-900 mb-3">Breach Reduction</div>
                <p className="text-gray-700">Standard Chartered Bank reduced regulatory breaches by 40% after implementing AI-powered compliance monitoring</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
                <div className="text-5xl font-black text-blue-600 mb-4">20-40%</div>
                <div className="text-xl font-bold text-gray-900 mb-3">Fewer False Positives</div>
                <p className="text-gray-700">AI-driven tools reduce false positives in alerts, saving millions in investigation costs</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-200">
                <div className="text-5xl font-black text-purple-600 mb-4">WEEKS</div>
                <div className="text-xl font-bold text-gray-900 mb-3">Faster Audits</div>
                <p className="text-gray-700">Automation speeds up audit processes from months to weeks, reducing operational costs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Now - Urgency Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-red-900 to-orange-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6">Why Now? The Window is Closing</h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Regulatory complexity is exploding. Organizations that don't adopt AI-powered compliance now will be left behind.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="text-3xl mb-4">🚨</div>
              <h3 className="text-2xl font-bold mb-4">2024: The Tipping Point</h3>
              <ul className="space-y-3 text-red-100">
                <li>• 300M+ new regulations globally</li>
                <li>• GDPR fines reaching record highs</li>
                <li>• Remote work creates new vulnerabilities</li>
                <li>• Traditional methods can't scale</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="text-3xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold mb-4">2025: The Race Begins</h3>
              <ul className="space-y-3 text-orange-100">
                <li>• GDPR fines expected to double</li>
                <li>• AI adoption becomes competitive advantage</li>
                <li>• Late adopters face exponential costs</li>
                <li>• Compliance becomes strategic imperative</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">2030: AI or Obsolete</h3>
              <ul className="space-y-3 text-yellow-100">
                <li>• Manual compliance = obsolete</li>
                <li>• Real-time adaptation required</li>
                <li>• Organizations need future-proof solutions</li>
                <li>• The compliance landscape fully automated</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => onNavigate('analyzer')}
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-xl btn-hover focus-ring shadow-glow transform hover:scale-105 transition-all"
            >
              Future-Proof Your Compliance →
            </button>
          </div>
        </div>
      </section>

      {/* Tech Stack & Final CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl font-bold mb-6">Powered by Cutting-Edge Technology</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Built with Google's Gemini AI and React.js for unmatched speed, accuracy, and scalability. 
              Enterprise-grade security meets intuitive design.
            </p>
            
            {/* Tech Stack */}
            <div className="flex justify-center flex-wrap gap-6 mb-12">
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 font-semibold">
                🤖 Gemini AI
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 font-semibold">
                ⚛️ React.js
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 font-semibold">
                ⚡ Real-Time
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 font-semibold">
                🔒 Enterprise Secure
              </div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 font-semibold">
                📈 Scalable
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 border border-blue-400 shadow-glow">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Compliance?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join the 83% of compliance professionals who will be using AI by 2029. Start today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => onNavigate('analyzer')}
                  className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-xl btn-hover focus-ring transform hover:scale-105 transition-all"
                >
                  Start Free Trial
                </button>
                <button className="bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl border border-white/30 btn-hover focus-ring hover:bg-white/30 transition-all">
                  Book Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold">PG</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold">PoliGap</h4>
                <p className="text-xs text-gray-400">AI-Powered Compliance</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Revolutionizing compliance with AI-powered analysis, automated reporting, 
              and intelligent policy generation for modern organizations.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <span>© 2024 PoliGap</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
