import { useState, useRef } from 'react';
import { 
  frameworksData, 
  getFrameworksByCategory, 
  getFrameworksByRegion, 
  getFrameworksByCountry,
  getFrameworksByField,
  searchFrameworks,
  getUniqueCategories,
  getUniqueRegions,
  getUniqueCountries,
  getUniqueFields
} from '../data/frameworks';

function KnowledgeHub({ onNavigate }) {
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterField, setFilterField] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);

  // Use the consolidated framework data
  const frameworks = frameworksData;

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterRegion('');
    setFilterCountry('');
    setFilterField('');
    setSortBy('name');
  };

  const activeFiltersCount = [
    searchQuery,
    filterCategory,
    filterRegion,
    filterCountry,
    filterField
  ].filter(filter => filter && filter.length > 0).length;

  const handleAnalyzeCompliance = async (framework) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResults({
        framework: framework.name,
        overallScore: Math.floor(Math.random() * 30) + 70,
        gaps: [
          { area: "Data Encryption", severity: "Medium", recommendation: "Implement end-to-end encryption" },
          { area: "Access Controls", severity: "High", recommendation: "Enhance role-based permissions" },
          { area: "Audit Logging", severity: "Low", recommendation: "Expand logging coverage" }
        ],
        timeline: "3-6 months",
        estimatedCost: "$15,000 - $25,000"
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCrossPollinationAnalysis = () => {
    onNavigate('cross-pollination');
  };

  const handleFrameworkDNA = (framework) => {
    // Simulate DNA profiling analysis
    const dnaResults = {
      framework: framework.name,
      geneticMarkers: [
        { gene: "Privacy Protection", strength: 95 },
        { gene: "Data Security", strength: 88 },
        { gene: "Compliance Monitoring", strength: 92 },
        { gene: "Risk Assessment", strength: 85 }
      ],
      compatibility: [
        { framework: "ISO 27001", score: 85 },
        { framework: "SOC 2", score: 78 },
        { framework: "NIST", score: 82 }
      ]
    };
    
    alert(`Framework DNA Analysis for ${framework.name}:\n\nGenetic Markers:\n${dnaResults.geneticMarkers.map(g => `${g.gene}: ${g.strength}%`).join('\n')}\n\nTop Compatibilities:\n${dnaResults.compatibility.map(c => `${c.framework}: ${c.score}%`).join('\n')}`);
  };

  // Enhanced filtering function
  const getFilteredFrameworks = () => {
    let filtered = frameworksData.filter(framework => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        framework.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        framework.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (framework.countries && framework.countries.some(country => 
          country.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
        (framework.fields && framework.fields.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      // Category filter
      const matchesCategory = !filterCategory || framework.category === filterCategory;

      // Region filter
      const matchesRegion = !filterRegion || 
        (framework.regions && framework.regions.includes(filterRegion));

      // Country filter
      const matchesCountry = !filterCountry || 
        (framework.countries && framework.countries.includes(filterCountry));

      // Field filter
      const matchesField = !filterField || 
        (framework.fields && framework.fields.includes(filterField));

      return matchesSearch && matchesCategory && matchesRegion && matchesCountry && matchesField;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'complexity':
          const complexityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return (complexityOrder[a.complexity] || 2) - (complexityOrder[b.complexity] || 2);
        case 'region':
          const aRegion = a.regions?.[0] || '';
          const bRegion = b.regions?.[0] || '';
          return aRegion.localeCompare(bRegion);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredFrameworks = getFilteredFrameworks();

  const FrameworkCard = ({ framework }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-500"
         onClick={() => setSelectedFramework(framework)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-blue-600">{framework.name}</h3>
            <div className="flex items-center gap-2">
              {framework.complexity && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  framework.complexity === 'High' ? 'bg-red-100 text-red-700' :
                  framework.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {framework.complexity}
                </span>
              )}
              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                {framework.category}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{framework.description}</p>
          
          {/* Geographic Information */}
          {framework.countries && framework.countries.length > 0 && (
            <div className="mb-2">
              <span className="text-xs text-gray-500 font-medium">Countries: </span>
              <div className="inline-flex flex-wrap gap-1">
                {framework.countries.slice(0, 3).map(country => (
                  <span key={country} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {country}
                  </span>
                ))}
                {framework.countries.length > 3 && (
                  <span className="text-xs text-gray-500">+{framework.countries.length - 3} more</span>
                )}
              </div>
            </div>
          )}
          
          {/* Fields Information */}
          {framework.fields && framework.fields.length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-gray-500 font-medium">Fields: </span>
              <div className="inline-flex flex-wrap gap-1">
                {framework.fields.slice(0, 2).map(field => (
                  <span key={field} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {field}
                  </span>
                ))}
                {framework.fields.length > 2 && (
                  <span className="text-xs text-gray-500">+{framework.fields.length - 2} more</span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mb-3">
            {framework.keyRequirements?.slice(0, 3).map((req, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {req}
              </span>
            ))}
            {framework.keyRequirements?.length > 3 && (
              <span className="text-xs text-gray-500">+{framework.keyRequirements.length - 3} more</span>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAnalyzeCompliance(framework);
              }}
              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
            >
              🧬 Analyze
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleFrameworkDNA(framework);
              }}
              className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
            >
              🧪 DNA Profile
            </button>
          </div>
        </div>
        
        <div className="text-2xl ml-4">
          {framework.icon || (
            <>
              {framework.category === 'privacy' && '🔐'}
              {framework.category === 'healthcare' && '🏥'}
              {framework.category === 'financial' && '💰'}
              {framework.category === 'security' && '🛡️'}
              {framework.category === 'environmental' && '🌱'}
              {framework.category === 'governance' && '⚖️'}
              {framework.category === 'industry' && '🏭'}
              {framework.category === 'international' && '🌍'}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const FrameworkDetail = ({ framework }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{framework.name}</h2>
              <p className="text-gray-600">{framework.description}</p>
            </div>
            <button 
              onClick={() => setSelectedFramework(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex border-b mb-6">
            {['overview', 'requirements', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium capitalize ${
                  activeTab === tab 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-gray-700">{framework.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Regions</h3>
                <div className="flex gap-2">
                  {framework.regions?.map((region, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm uppercase">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Requirements</h3>
              <div className="grid gap-3">
                {framework.keyRequirements?.map((req, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    <div className="font-medium text-gray-900">{req}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI-Powered Analysis Tools</h3>
              
              <div className="grid gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🧬 Compliance DNA Profiling</h4>
                  <p className="text-green-700 text-sm mb-3">
                    Analyze your organization's compliance genetics and compatibility scores
                  </p>
                  <button 
                    onClick={() => handleFrameworkDNA(framework)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Run DNA Analysis
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🌐 Cross-Pollination Engine</h4>
                  <p className="text-purple-700 text-sm mb-3">
                    Discover synergies between different compliance frameworks
                  </p>
                  <button 
                    onClick={handleCrossPollinationAnalysis}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
                    Explore Cross-Pollination
                  </button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">📊 Gap Analysis</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    AI-powered analysis of compliance gaps and recommendations
                  </p>
                  <button 
                    onClick={() => handleAnalyzeCompliance(framework)}
                    disabled={isAnalyzing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run Gap Analysis'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 Knowledge Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            AI-powered compliance intelligence center with advanced analytics
          </p>
          
          {/* Enhanced Search */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className={`relative transition-all ${isSearchExpanded ? 'scale-105' : ''}`}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
                placeholder="Search frameworks, requirements, or ask AI..."
                className="w-full px-4 py-3 pl-12 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                🔍
              </div>
              <div className="absolute right-4 top-2.5">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">AI Ready</span>
              </div>
            </div>
          </div>

          {/* Advanced Filtering Controls */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filter & Sort</h3>
                <button
                  onClick={() => {
                    setFilterCategory('');
                    setFilterRegion('');
                    setFilterCountry('');
                    setFilterField('');
                    setSortBy('name');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {getUniqueCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <select
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Regions</option>
                    {getUniqueRegions().map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {getUniqueCountries().map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Field Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                  <select
                    value={filterField}
                    onChange={(e) => setFilterField(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Fields</option>
                    {getUniqueFields().map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="category">Category</option>
                    <option value="complexity">Complexity</option>
                    <option value="region">Region</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filterCategory || filterRegion || filterCountry || filterField) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filterCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Category: {filterCategory}
                      <button
                        onClick={() => setFilterCategory('')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterRegion && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Region: {filterRegion}
                      <button
                        onClick={() => setFilterRegion('')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterCountry && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      Country: {filterCountry}
                      <button
                        onClick={() => setFilterCountry('')}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterField && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      Field: {filterField}
                      <button
                        onClick={() => setFilterField('')}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={handleCrossPollinationAnalysis}
            className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-2">🌐</div>
            <h3 className="text-lg font-semibold mb-2">Cross-Pollination Engine</h3>
            <p className="text-sm opacity-90">Discover framework synergies and optimize your compliance strategy</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-lg text-white cursor-pointer hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🧬</div>
            <h3 className="text-lg font-semibold mb-2">DNA Profiling</h3>
            <p className="text-sm opacity-90">Analyze compliance genetics and compatibility scores</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-lg text-white cursor-pointer hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <p className="text-sm opacity-90">Get intelligent recommendations and insights</p>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              🧬 Analysis Results for {analysisResults.framework}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analysisResults.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Overall Compliance Score</div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Key Gaps Identified:</h4>
                <div className="space-y-2">
                  {analysisResults.gaps.map((gap, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        gap.severity === 'High' ? 'bg-red-500' :
                        gap.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></span>
                      <span className="font-medium">{gap.area}:</span>
                      <span className="text-gray-600">{gap.recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div><strong>Timeline:</strong> {analysisResults.timeline}</div>
              <div><strong>Estimated Cost:</strong> {analysisResults.estimatedCost}</div>
            </div>
          </div>
        )}

        {/* Frameworks Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Compliance Frameworks ({filteredFrameworks.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrameworks.map((framework) => (
              <FrameworkCard key={framework.id} framework={framework} />
            ))}
          </div>
        </div>

        {filteredFrameworks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No frameworks found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search query
            </p>
          </div>
        )}

        {/* Framework Detail Modal */}
        {selectedFramework && (
          <FrameworkDetail framework={selectedFramework} />
        )}
      </div>
    </div>
  );
}

export default KnowledgeHub;
