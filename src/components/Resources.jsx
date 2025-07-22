import { useState } from 'react';

function Resources({ onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('guides');
  const [currentPage, setCurrentPage] = useState({
    guides: 1,
    webinars: 1,
    apis: 1,
    templates: 1
  });

  const ITEMS_PER_PAGE = 4;

  const categories = {
    guides: {
      title: "Compliance Guides",
      icon: "📋",
      items: [
        {
          title: "GDPR Compliance Checklist 2025",
          description: "Complete guide to achieving GDPR compliance with practical steps and templates.",
          type: "PDF Guide",
          readTime: "15 min read",
          downloadSize: "2.3 MB"
        },
        {
          title: "HIPAA Security Framework",
          description: "Essential security controls and implementation guide for healthcare organizations.",
          type: "Interactive Guide",
          readTime: "20 min read",
          downloadSize: "1.8 MB"
        },
        {
          title: "SOX Internal Controls Guide",
          description: "Financial reporting controls and audit preparation strategies for SOX compliance.",
          type: "PDF Guide",
          readTime: "25 min read",
          downloadSize: "3.1 MB"
        },
        {
          title: "PCI DSS Implementation Roadmap",
          description: "Step-by-step implementation guide for payment card industry security standards.",
          type: "PDF Guide",
          readTime: "18 min read",
          downloadSize: "2.7 MB"
        },
        {
          title: "ISO 27001 Implementation Guide",
          description: "Comprehensive guide for implementing information security management systems.",
          type: "PDF Guide",
          readTime: "30 min read",
          downloadSize: "4.2 MB"
        },
        {
          title: "CCPA Privacy Rights Handbook",
          description: "Complete guide to California Consumer Privacy Act requirements and consumer rights.",
          type: "Interactive Guide",
          readTime: "22 min read",
          downloadSize: "2.8 MB"
        },
        {
          title: "FERPA Compliance for Educational Institutions",
          description: "Educational privacy requirements and best practices for student data protection.",
          type: "PDF Guide",
          readTime: "16 min read",
          downloadSize: "2.1 MB"
        },
        {
          title: "NIST Cybersecurity Framework Guide",
          description: "Implementation roadmap for NIST CSF across different organizational structures.",
          type: "PDF Guide",
          readTime: "35 min read",
          downloadSize: "5.1 MB"
        },
        {
          title: "GDPR Data Protection Impact Assessment Guide",
          description: "Step-by-step guide for conducting DPIAs under GDPR requirements.",
          type: "Interactive Guide",
          readTime: "28 min read",
          downloadSize: "3.4 MB"
        },
        {
          title: "Multi-Framework Compliance Matrix",
          description: "Comparative analysis of requirements across GDPR, HIPAA, SOX, and PCI DSS.",
          type: "Reference Guide",
          readTime: "40 min read",
          downloadSize: "6.8 MB"
        }
      ]
    },
    webinars: {
      title: "Webinars & Videos",
      icon: "🎥",
      items: [
        {
          title: "AI-Powered Compliance: The Future is Here",
          description: "Learn how artificial intelligence is transforming compliance management.",
          type: "Webinar Recording",
          readTime: "45 min watch",
          downloadSize: "Live Event"
        },
        {
          title: "Building a Compliance Culture",
          description: "Strategies for embedding compliance into your organizational DNA.",
          type: "Video Series",
          readTime: "30 min watch",
          downloadSize: "On-Demand"
        },
        {
          title: "Regulatory Updates Q1 2025",
          description: "Latest changes in GDPR, HIPAA, and other major compliance frameworks.",
          type: "Live Webinar",
          readTime: "60 min watch",
          downloadSize: "Upcoming"
        },
        {
          title: "Risk Assessment Best Practices",
          description: "Expert insights on conducting effective compliance risk assessments.",
          type: "Expert Panel",
          readTime: "40 min watch",
          downloadSize: "Available Now"
        }
      ]
    },
    apis: {
      title: "API Documentation",
      icon: "🔌",
      items: [
        {
          title: "PoliGap REST API v2.1",
          description: "Complete API reference for integrating PoliGap with your existing systems.",
          type: "API Docs",
          readTime: "Technical",
          downloadSize: "Interactive"
        },
        {
          title: "Webhook Integration Guide",
          description: "Set up real-time notifications for policy updates and compliance changes.",
          type: "Integration Guide",
          readTime: "10 min read",
          downloadSize: "Code Examples"
        },
        {
          title: "SDK & Libraries",
          description: "Official SDKs for Python, JavaScript, and other popular programming languages.",
          type: "Developer Tools",
          readTime: "Quick Start",
          downloadSize: "GitHub Repo"
        },
        {
          title: "Authentication & Security",
          description: "API security best practices, authentication methods, and rate limiting.",
          type: "Security Guide",
          readTime: "8 min read",
          downloadSize: "Security First"
        },
        {
          title: "GraphQL API Schema",
          description: "Complete GraphQL schema documentation with query examples and mutations.",
          type: "Schema Docs",
          readTime: "Technical",
          downloadSize: "Interactive"
        },
        {
          title: "Bulk Operations API",
          description: "Efficiently process large datasets with our batch processing endpoints.",
          type: "API Guide",
          readTime: "12 min read",
          downloadSize: "Code Examples"
        },
        {
          title: "Real-time Streaming API",
          description: "WebSocket and Server-Sent Events for live compliance monitoring.",
          type: "Streaming Guide",
          readTime: "15 min read",
          downloadSize: "Live Examples"
        },
        {
          title: "Error Handling & Troubleshooting",
          description: "Common error codes, debugging techniques, and resolution strategies.",
          type: "Troubleshooting",
          readTime: "20 min read",
          downloadSize: "Debug Tools"
        },
        {
          title: "API Rate Limits & Optimization",
          description: "Understanding rate limits, optimization techniques, and performance tuning.",
          type: "Performance Guide",
          readTime: "18 min read",
          downloadSize: "Best Practices"
        },
        {
          title: "Third-party Integrations",
          description: "Pre-built integrations with popular compliance and security platforms.",
          type: "Integration Catalog",
          readTime: "25 min read",
          downloadSize: "Plugin Library"
        }
      ]
    },
    templates: {
      title: "Policy Templates",
      icon: "📄",
      items: [
        {
          title: "Privacy Policy Generator",
          description: "AI-powered tool to generate custom privacy policies for your organization.",
          type: "Interactive Tool",
          readTime: "5 min setup",
          downloadSize: "Web-based"
        },
        {
          title: "Data Processing Agreement",
          description: "GDPR-compliant DPA template for vendor relationships and data sharing.",
          type: "Legal Template",
          readTime: "Review Required",
          downloadSize: "1.2 MB"
        },
        {
          title: "Incident Response Playbook",
          description: "Step-by-step procedures for handling data breaches and security incidents.",
          type: "Playbook Template",
          readTime: "30 min read",
          downloadSize: "2.8 MB"
        },
        {
          title: "Employee Training Materials",
          description: "Ready-to-use training modules for compliance awareness programs.",
          type: "Training Kit",
          readTime: "Variable",
          downloadSize: "5.4 MB"
        }
      ]
    }
  };

  // Pagination helper functions
  const getCurrentPageItems = (categoryKey) => {
    const items = categories[categoryKey].items;
    const start = (currentPage[categoryKey] - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return items.slice(start, end);
  };

  const getTotalPages = (categoryKey) => {
    return Math.ceil(categories[categoryKey].items.length / ITEMS_PER_PAGE);
  };

  const handlePageChange = (categoryKey, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryKey]: page
    }));
  };

  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey);
    // Reset to page 1 when changing categories
    setCurrentPage(prev => ({
      ...prev,
      [categoryKey]: 1
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-none mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-gray-800">POLIGAP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-none mx-auto px-4 text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-6">
            Compliance Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Access our comprehensive library of guides, templates, APIs, and educational content to accelerate your compliance journey.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">All resources are free for PoliGap users</span>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 px-4 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                  activeCategory === key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4">
        <div className="max-w-none mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="text-4xl mr-3">{categories[activeCategory].icon}</span>
              {categories[activeCategory].title}
            </h2>
            
            {/* Results count */}
            <div className="text-gray-600">
              Showing {getCurrentPageItems(activeCategory).length} of {categories[activeCategory].items.length} resources
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {getCurrentPageItems(activeCategory).map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                      {item.type}
                    </span>
                    <span>📖 {item.readTime}</span>
                    <span>💾 {item.downloadSize}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                    {activeCategory === 'webinars' ? 'Watch Now' : 'Download'}
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {getTotalPages(activeCategory) > 1 && (
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(activeCategory, currentPage[activeCategory] - 1)}
                disabled={currentPage[activeCategory] === 1}
                className={`flex items-center px-4 py-2 rounded-xl font-semibold transition-colors ${
                  currentPage[activeCategory] === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: getTotalPages(activeCategory) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(activeCategory, page)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                    currentPage[activeCategory] === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(activeCategory, currentPage[activeCategory] + 1)}
                disabled={currentPage[activeCategory] === getTotalPages(activeCategory)}
                className={`flex items-center px-4 py-2 rounded-xl font-semibold transition-colors ${
                  currentPage[activeCategory] === getTotalPages(activeCategory)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated on Compliance</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest compliance insights, regulatory updates, and exclusive resources delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500"
            />
            <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-blue-200 mt-4">
            No spam, unsubscribe anytime. Read our <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Resources;
