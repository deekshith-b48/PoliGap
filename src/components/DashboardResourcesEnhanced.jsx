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
  HiOutlineShield,
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

function DashboardResourcesEnhanced() {
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

  // Categories for resources tab
  const categories = ['All', 'Legal Framework', 'Healthcare', 'Financial', 'Templates', 'Security'];
  
  // Mock resources data for resources tab
  useEffect(() => {
    const mockResources = [
      {
        id: 1,
        title: 'GDPR Compliance Checklist',
        description: 'Complete checklist for GDPR compliance implementation',
        category: 'Legal Framework',
        type: 'Checklist',
        lastUpdated: new Date('2024-01-15'),
        downloadUrl: '#',
        content: 'Comprehensive GDPR compliance checklist...'
      },
      {
        id: 2,
        title: 'Privacy Policy Template',
        description: 'Standard privacy policy template for websites',
        category: 'Templates',
        type: 'Template',
        lastUpdated: new Date('2024-01-10'),
        downloadUrl: '#',
        content: 'Standard privacy policy template...'
      },
      {
        id: 3,
        title: 'HIPAA Security Assessment',
        description: 'Healthcare data security assessment framework',
        category: 'Healthcare',
        type: 'Framework',
        lastUpdated: new Date('2024-01-08'),
        downloadUrl: '#',
        content: 'HIPAA security assessment guide...'
      }
    ];
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNew = () => {
    setEditingResource({
      id: Date.now(),
      title: '',
      description: '',
      category: 'Legal Framework',
      type: 'Guide',
      lastUpdated: new Date(),
      downloadUrl: '#',
      content: ''
    });
    setIsAdding(true);
  };

  const handleEdit = (resource) => {
    setEditingResource({...resource});
    setIsAdding(false);
  };

  const handleSave = () => {
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
        {isAdmin && activeTab === 'resources' && (
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <HiOutlinePlus className="w-5 h-5 mr-2" />
            Add Resource
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'frameworks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <HiOutlineShield className="w-5 h-5 mr-2" />
              Compliance Frameworks
            </div>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'resources'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center">
              <HiOutlineDocumentText className="w-5 h-5 mr-2" />
              Resources & Templates
            </div>
          </button>
        </nav>
      </div>

      {/* Frameworks Tab Content */}
      {activeTab === 'frameworks' && (
        <div className="space-y-6">
          {/* Framework Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search compliance frameworks..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <HiOutlineSearch className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {['all', 'Data Protection', 'Healthcare', 'Financial', 'Information Security', 'Payment Security'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Frameworks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrameworks.map((framework) => (
              <div key={framework.id} className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{framework.icon}</div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {framework.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{framework.shortName}</h3>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">{framework.name}</h4>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{framework.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <HiOutlineGlobe className="w-4 h-4 mr-2" />
                      {framework.jurisdiction}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <HiOutlineDocumentText className="w-4 h-4 mr-2" />
                      Effective: {framework.effectiveDate}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleFrameworkView(framework)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group-hover:scale-105"
                  >
                    <HiOutlineEye className="w-4 h-4 mr-2" />
                    View Details & Download
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFrameworks.length === 0 && (
            <div className="text-center py-12">
              <HiOutlineShield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No frameworks found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search terms' : 'No frameworks available in this category'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab Content */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
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
                  <HiOutlineSearch className="w-5 h-5 text-gray-400" />
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
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.category)}`}>
                      {resource.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <p className="text-gray-500 text-xs mb-4">
                    Updated: {resource.lastUpdated.toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(resource.downloadUrl, '_blank')}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Download"
                      >
                        <HiOutlineDownload className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => console.log('View:', resource)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="View"
                      >
                        <HiOutlineEye className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="text-yellow-600 hover:text-yellow-800 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <HiOutlineDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search terms' : 'No resources available in this category'}
              </p>
            </div>
          )}
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
                  <HiOutlineX className="w-6 h-6" />
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
                      {categories.filter(cat => cat !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
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
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Resource content or description"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
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

      {/* Framework Details Popup */}
      <FrameworkDetailsPopup
        framework={selectedFramework}
        isOpen={showFrameworkPopup}
        onClose={() => {
          setShowFrameworkPopup(false);
          setSelectedFramework(null);
        }}
      />
    </div>
  );
}

export default DashboardResourcesEnhanced;
