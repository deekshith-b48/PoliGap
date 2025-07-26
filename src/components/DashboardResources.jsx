import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineTemplate,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineGlobe,
  HiOutlineFilter
} from 'react-icons/hi';
import {
  MdSecurity,
  MdGavel,
  MdHealthAndSafety,
  MdAccountBalance,
  MdBusiness,
  MdVerifiedUser,
  MdLibraryBooks
} from 'react-icons/md';
import { complianceFrameworks, getFrameworksByCategory, searchFrameworks } from '../data/complianceFrameworks';
import FrameworkDetailsPopup from './FrameworkDetailsPopup';

function DashboardResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [showFrameworkPopup, setShowFrameworkPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('frameworks');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if user is admin
  const isAdmin = user?.email === 'bdeekshith412@gmail.com' || user?.user_metadata?.role === 'admin';

  // Framework filtering logic
  const frameworksByCategory = getFrameworksByCategory();
  const filteredFrameworks = searchQuery
    ? searchFrameworks(searchQuery)
    : selectedCategory === 'all'
      ? Object.values(complianceFrameworks)
      : frameworksByCategory[selectedCategory] || [];

  const handleFrameworkView = (framework) => {
    setSelectedFramework(framework);
    setShowFrameworkPopup(true);
  };

  // Mock resources data
  useEffect(() => {
    const mockResources = [
      {
        id: 1,
        title: 'GDPR Compliance Guide',
        description: 'Complete guide to General Data Protection Regulation compliance',
        category: 'Legal Framework',
        type: 'Guide',
        lastUpdated: new Date('2024-01-15'),
        downloadUrl: '#',
        content: 'Comprehensive GDPR compliance guide covering all aspects of data protection...'
      },
      {
        id: 2,
        title: 'HIPAA Security Rule Checklist',
        description: 'Essential checklist for HIPAA security compliance',
        category: 'Healthcare',
        type: 'Checklist',
        lastUpdated: new Date('2024-01-10'),
        downloadUrl: '#',
        content: 'Step-by-step checklist for HIPAA security rule compliance...'
      },
      {
        id: 3,
        title: 'SOX Internal Controls Framework',
        description: 'Framework for establishing SOX-compliant internal controls',
        category: 'Financial',
        type: 'Framework',
        lastUpdated: new Date('2024-01-05'),
        downloadUrl: '#',
        content: 'Detailed framework for SOX compliance internal controls...'
      },
      {
        id: 4,
        title: 'Privacy Policy Template',
        description: 'Customizable privacy policy template for websites',
        category: 'Templates',
        type: 'Template',
        lastUpdated: new Date('2024-01-20'),
        downloadUrl: '#',
        content: 'Ready-to-use privacy policy template with customizable sections...'
      },
      {
        id: 5,
        title: 'Data Breach Response Plan',
        description: 'Step-by-step guide for responding to data breaches',
        category: 'Security',
        type: 'Guide',
        lastUpdated: new Date('2024-01-12'),
        downloadUrl: '#',
        content: 'Comprehensive data breach response plan and procedures...'
      }
    ];
    setResources(mockResources);
  }, []);

  const categories = ['All', 'Legal Framework', 'Healthcare', 'Financial', 'Templates', 'Security'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddResource = () => {
    setIsAdding(true);
    setEditingResource({
      id: Date.now(),
      title: '',
      description: '',
      category: 'Legal Framework',
      type: 'Guide',
      content: '',
      lastUpdated: new Date(),
      downloadUrl: '#'
    });
  };

  const handleSaveResource = () => {
    if (editingResource.id && editingResource.title.trim()) {
      if (isAdding) {
        setResources([...resources, editingResource]);
      } else {
        setResources(resources.map(r => r.id === editingResource.id ? editingResource : r));
      }
      setEditingResource(null);
      setIsAdding(false);
    }
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Guide': '📖',
      'Checklist': '✅',
      'Framework': '🏗️',
      'Template': '📄',
      'Tutorial': '🎓'
    };
    return icons[type] || '📄';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Legal Framework': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Financial': 'bg-purple-100 text-purple-800',
      'Templates': 'bg-orange-100 text-orange-800',
      'Security': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
          <p className="text-gray-600">
            Comprehensive compliance frameworks, guides, and documentation
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleAddResource}
            className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Add Resource
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">{getTypeIcon(resource.type)}</span>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                    {resource.category}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingResource(resource)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors mr-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Updated {resource.lastUpdated.toLocaleDateString()}</span>
              <span className="bg-gray-100 px-2 py-1 rounded-lg">{resource.type}</span>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                View
              </button>
              <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms' : 'No resources available in this category'}
          </p>
        </div>
      )}

      {/* Edit/Add Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {isAdding ? 'Add New Resource' : 'Edit Resource'}
                </h3>
                <button
                  onClick={() => {
                    setEditingResource(null);
                    setIsAdding(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editingResource.title}
                    onChange={(e) => setEditingResource({...editingResource, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Resource title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingResource.description}
                    onChange={(e) => setEditingResource({...editingResource, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the resource"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editingResource.category}
                      onChange={(e) => setEditingResource({...editingResource, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={editingResource.type}
                      onChange={(e) => setEditingResource({...editingResource, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Guide">Guide</option>
                      <option value="Checklist">Checklist</option>
                      <option value="Framework">Framework</option>
                      <option value="Template">Template</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={editingResource.content}
                    onChange={(e) => setEditingResource({...editingResource, content: e.target.value})}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed content of the resource"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveResource}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    {isAdding ? 'Add Resource' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResource(null);
                      setIsAdding(false);
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardResources;
