import { useState } from 'react';

function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl rotate-12 opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl -rotate-6 opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-tl from-green-400 to-teal-500 rounded-lg rotate-45 opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 mb-6 animate-pulse">
            POLICY.AI
          </h1>
          <h2 className="text-4xl font-bold text-white mb-4">
            REVOLUTIONIZING COMPLIANCE FOR ORGANIZATIONS
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Transform your compliance workflow with AI-powered analysis. Benchmark against GDPR, HIPAA, SOX, PCI DSS, 
            and 10+ major frameworks. Get quantitative scoring, automated gap analysis, and instant policy generation.
          </p>
          
          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-2 border-pink-400 rounded-2xl p-4">
              <div className="text-3xl font-black text-pink-400 mb-2">$75.8B</div>
              <div className="text-sm text-pink-200">Compliance Market by 2031</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-400 rounded-2xl p-4">
              <div className="text-3xl font-black text-cyan-400 mb-2">83%</div>
              <div className="text-sm text-cyan-200">Compliance Pros Adopting AI</div>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border-2 border-green-400 rounded-2xl p-4">
              <div className="text-3xl font-black text-green-400 mb-2">40%</div>
              <div className="text-sm text-green-200">Reduction in Breaches with AI</div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mb-16 bg-gradient-to-r from-red-900/40 to-orange-900/40 border-4 border-red-400 rounded-3xl p-8 shadow-[8px_8px_0px_0px_#ef4444]">
          <h3 className="text-3xl font-black text-white mb-6 text-center">THE COMPLIANCE CRISIS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-red-300 mb-4">❌ Traditional Challenges</h4>
              <ul className="space-y-2 text-red-100">
                <li>• Manual, time-consuming processes</li>
                <li>• Error-prone analysis requiring deep expertise</li>
                <li>• Complex regulations: GDPR, HIPAA, SOX, PCI DSS</li>
                <li>• Severe financial penalties for non-compliance</li>
                <li>• Ever-changing regulatory landscape</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-orange-300 mb-4">📈 Market Reality</h4>
              <ul className="space-y-2 text-orange-100">
                <li>• 300M+ new regulations expected globally</li>
                <li>• GDPR market: $3.29B → $6.85B by 2030</li>
                <li>• Remote work creates new vulnerabilities</li>
                <li>• Compliance is now strategic imperative</li>
                <li>• Organizations need scalable solutions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Policy Gap Analyzer */}
          <div 
            onClick={() => onNavigate('analyzer')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-pink-600 to-purple-700 p-8 rounded-3xl border-4 border-pink-400 shadow-[8px_8px_0px_0px_#ec4899] hover:shadow-[12px_12px_0px_0px_#ec4899] transition-all">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-black text-white">GAP ANALYZER</h3>
              </div>
              <p className="text-pink-100 text-lg mb-4">
                Upload policy documents and get instant AI-powered compliance gap analysis against GDPR, HIPAA, SOX, and more.
              </p>
              <div className="bg-pink-500 text-white px-4 py-2 rounded-xl font-bold inline-block border-2 border-pink-300">
                ANALYZE NOW →
              </div>
            </div>
          </div>

          {/* Policy Generator */}
          <div 
            onClick={() => onNavigate('generator')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-3xl border-4 border-cyan-400 shadow-[8px_8px_0px_0px_#06b6d4] hover:shadow-[12px_12px_0px_0px_#06b6d4] transition-all">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-2xl font-black text-white">POLICY GENERATOR</h3>
              </div>
              <p className="text-cyan-100 text-lg mb-4">
                Generate compliant policy templates instantly using AI. Choose your industry and regulations for custom policies.
              </p>
              <div className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-bold inline-block border-2 border-cyan-300">
                CREATE NOW →
              </div>
            </div>
          </div>

          {/* Know Compliances Section - Replacing Compliance Monitor */}
          <div 
            onClick={() => onNavigate('compliances')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl border-4 border-indigo-400 shadow-[8px_8px_0px_0px_#6366f1] hover:shadow-[12px_12px_0px_0px_#6366f1] transition-all">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-3xl">�</span>
                </div>
                <h3 className="text-2xl font-black text-white">KNOW COMPLIANCES</h3>
              </div>
              <p className="text-indigo-100 text-lg mb-4">
                Learn about major regulatory frameworks and compliance requirements in simple, easy-to-understand language.
              </p>
              <div className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold inline-block border-2 border-indigo-300">
                LEARN NOW →
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div 
            onClick={() => onNavigate('assessment')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-green-600 to-teal-700 p-8 rounded-3xl border-4 border-green-400 shadow-[8px_8px_0px_0px_#22c55e] hover:shadow-[12px_12px_0px_0px_#22c55e] transition-all">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-400 rounded-2xl flex items-center justify-center border-4 border-black mr-4">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-black text-white">RISK ASSESSMENT</h3>
              </div>
              <p className="text-green-100 text-lg mb-4">
                Comprehensive risk analysis of your current policies with severity scoring and prioritized action plans.
              </p>
              <div className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold inline-block border-2 border-green-300">
                ASSESS NOW →
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-800 to-pink-800 p-8 rounded-3xl border-4 border-purple-400 shadow-[8px_8px_0px_0px_#a855f7] max-w-4xl mx-auto">
            <h3 className="text-3xl font-black text-white mb-4">POWERED BY ADVANCED AI</h3>
            <p className="text-purple-100 text-lg mb-6">
              Our cutting-edge artificial intelligence analyzes thousands of regulations and industry standards 
              to keep your organization compliant and secure.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-purple-500 text-white px-6 py-3 rounded-2xl font-bold border-2 border-purple-300">
                🤖 AI-POWERED
              </div>
              <div className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-bold border-2 border-pink-300">
                ⚡ INSTANT RESULTS
              </div>
              <div className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-bold border-2 border-yellow-300">
                🔒 ENTERPRISE SECURE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
