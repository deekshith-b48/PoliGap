import { useState } from 'react';
import { frameworksData, getFrameworkColor } from '../data/frameworks';

function Frameworks({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Use consolidated framework data
  const frameworks = frameworksData;

  const categories = {
    all: { name: "All Frameworks", icon: "🌐" },
    privacy: { name: "Privacy & Data Protection", icon: "🔐" },
    healthcare: { name: "Healthcare", icon: "🏥" },
    financial: { name: "Financial", icon: "💰" },
    security: { name: "Information Security", icon: "🛡️" }
  };

  const filteredFrameworks = selectedCategory === 'all' 
    ? frameworks 
    : frameworks.filter(f => f.category === selectedCategory);

  const FrameworkCard = ({ framework }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${getFrameworkColor(framework.category)}-500 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-xl font-bold text-${getFrameworkColor(framework.category)}-600 mb-2`}>
            {framework.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {framework.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {framework.keyRequirements.slice(0, 3).map((req, index) => (
              <span key={index} className={`text-xs bg-${getFrameworkColor(framework.category)}-100 text-${getFrameworkColor(framework.category)}-700 px-2 py-1 rounded`}>
                {req}
              </span>
            ))}
            {framework.keyRequirements.length > 3 && (
              <span className="text-xs text-gray-500">
                +{framework.keyRequirements.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
            Active Framework
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compliance Frameworks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive overview of major compliance frameworks and their requirements
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === key
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Frameworks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrameworks.map((framework) => (
            <FrameworkCard key={framework.id} framework={framework} />
          ))}
        </div>

        {filteredFrameworks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No frameworks found
            </h3>
            <p className="text-gray-500">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Frameworks;
