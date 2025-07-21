import { useState } from 'react';

function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass backdrop-blur-md border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Policy.AI</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button className="text-gray-600 hover:text-gray-900 transition-colors">Features</button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">About</button>
              <button className="bg-gradient-primary text-white px-6 py-2 rounded-xl btn-hover focus-ring">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              AI-Powered
              <span className="text-gradient-primary block">Compliance</span>
              Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your compliance workflow with intelligent analysis. Get quantitative scoring, 
              automated gap analysis, and instant policy generation for GDPR, HIPAA, SOX, and more.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => onNavigate('analyzer')}
                className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg btn-hover focus-ring shadow-glow"
              >
                Start Analysis
              </button>
              <button 
                onClick={() => onNavigate('generator')}
                className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg border border-gray-300 btn-hover focus-ring"
              >
                Generate Policy
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>GDPR Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fadeInUp">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for compliance
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools that transform complex compliance into simple, actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Policy Gap Analyzer */}
            <div 
              onClick={() => onNavigate('analyzer')}
              className="group cursor-pointer card-hover bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Gap Analyzer</h4>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Upload your policies and get quantitative compliance scoring against major frameworks. 
                Industry benchmarking with actionable recommendations.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Analyze Now</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Policy Generator */}
            <div 
              onClick={() => onNavigate('generator')}
              className="group cursor-pointer card-hover bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl border border-purple-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">AI Generator</h4>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Create professionally formatted, branded policies in minutes. 
                Industry-specific templates ready for executive review.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                <span>Generate Now</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Knowledge Base */}
            <div 
              onClick={() => onNavigate('compliances')}
              className="group cursor-pointer card-hover bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl border border-emerald-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Knowledge Hub</h4>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Comprehensive guides to major compliance frameworks. 
                Make complex regulations accessible to your entire team.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Risk Assessment */}
            <div 
              onClick={() => onNavigate('assessment')}
              className="group cursor-pointer card-hover bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">Risk Assessment</h4>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Comprehensive risk scoring with prioritized action plans. 
                Reduce vulnerabilities and avoid costly compliance failures.
              </p>
              <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
                <span>Assess Risk</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-primary rounded-full text-white font-semibold mb-6">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ai-pulse"></span>
              Powered by AI
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Expert AI Assistant
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get instant expert insights with our Gemini-powered chat assistant. 
              Context-aware responses based on your uploaded documents.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700">
                🧠 Gemini AI
              </div>
              <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700">
                📄 Context-Aware
              </div>
              <div className="bg-white px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700">
                ⚡ Instant Answers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fadeInUp">
              <div className="text-4xl font-black text-gradient-primary mb-2">40%</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Breach Reduction</div>
              <div className="text-gray-600">With AI-powered compliance</div>
            </div>
            <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl font-black text-gradient-accent mb-2">75%</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Time Savings</div>
              <div className="text-gray-600">On policy creation & analysis</div>
            </div>
            <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-black text-gradient-primary mb-2">10+</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">Frameworks</div>
              <div className="text-gray-600">GDPR, HIPAA, SOX, PCI DSS & more</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h4 className="text-2xl font-bold">Policy.AI</h4>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Transforming compliance with AI-powered analysis, automated reporting, 
              and intelligent policy generation for modern organizations.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <span>© 2024 Policy.AI</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
