import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function EnterpriseDocumentHistory({ isOpen, onClose, onDocumentSelect }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Enhanced mock data with enterprise features
  const mockDocuments = [
    {
      id: '1',
      user_id: user?.id || 'demo-user',
      name: 'Privacy Policy v3.2',
      original_name: 'privacy-policy-final.pdf',
      type: 'pdf',
      size: '2.4 MB',
      size_bytes: 2516582,
      upload_date: new Date('2024-01-20'),
      industry: 'technology',
      frameworks: ['GDPR', 'CCPA', 'PIPEDA'],
      status: 'analyzed',
      analysis_completion_date: new Date('2024-01-20'),
      compliance_score: 89,
      critical_gaps: 2,
      total_gaps: 8,
      recommendations: 15,
      risk_level: 'Low',
      file_path: '/documents/privacy-policy-final.pdf',
      analysis_data: {
        overallScore: 89,
        frameworkScores: { 'GDPR': 92, 'CCPA': 88, 'PIPEDA': 87 }
      },
      tags: ['privacy', 'gdpr', 'reviewed'],
      shared_with: ['legal@company.com', 'compliance@company.com'],
      version: '3.2',
      previous_version: '3.1'
    },
    {
      id: '2',
      user_id: user?.id || 'demo-user',
      name: 'Employee Data Protection Policy',
      original_name: 'employee-data-policy.docx',
      type: 'docx',
      size: '1.8 MB',
      size_bytes: 1887436,
      upload_date: new Date('2024-01-18'),
      industry: 'technology',
      frameworks: ['GDPR', 'CCPA'],
      status: 'processing',
      analysis_completion_date: null,
      compliance_score: null,
      critical_gaps: null,
      total_gaps: null,
      recommendations: null,
      risk_level: null,
      file_path: '/documents/employee-data-policy.docx',
      analysis_data: null,
      tags: ['hr', 'employees'],
      shared_with: [],
      version: '1.0',
      previous_version: null,
      processing_stage: 'ai_analysis',
      processing_progress: 65
    },
    {
      id: '3',
      user_id: user?.id || 'demo-user',
      name: 'Cookie Policy v2.1',
      original_name: 'cookie-policy.pdf',
      type: 'pdf',
      size: '0.8 MB',
      size_bytes: 838860,
      upload_date: new Date('2024-01-15'),
      industry: 'technology',
      frameworks: ['GDPR', 'ePrivacy'],
      status: 'analyzed',
      analysis_completion_date: new Date('2024-01-15'),
      compliance_score: 94,
      critical_gaps: 0,
      total_gaps: 3,
      recommendations: 8,
      risk_level: 'Very Low',
      file_path: '/documents/cookie-policy.pdf',
      analysis_data: {
        overallScore: 94,
        frameworkScores: { 'GDPR': 96, 'ePrivacy': 92 }
      },
      tags: ['cookies', 'tracking', 'website'],
      shared_with: ['web@company.com'],
      version: '2.1',
      previous_version: '2.0'
    },
    {
      id: '4',
      user_id: user?.id || 'demo-user',
      name: 'Terms of Service',
      original_name: 'terms-of-service.pdf',
      type: 'pdf',
      size: '3.2 MB',
      size_bytes: 3355443,
      upload_date: new Date('2024-01-10'),
      industry: 'technology',
      frameworks: ['Consumer Protection', 'GDPR'],
      status: 'error',
      analysis_completion_date: null,
      compliance_score: null,
      critical_gaps: null,
      total_gaps: null,
      recommendations: null,
      risk_level: null,
      file_path: '/documents/terms-of-service.pdf',
      analysis_data: null,
      tags: ['legal', 'terms'],
      shared_with: [],
      version: '1.5',
      previous_version: '1.4',
      error_message: 'Document format not recognized. Please re-upload.'
    }
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadDocuments();
    }
  }, [isOpen, user]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // In a real application, this would be a Supabase query:
      // const { data, error } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('upload_date', { ascending: false });
      
      // For now, use mock data
      setTimeout(() => {
        setDocuments(mockDocuments);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments(mockDocuments);
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.status === filter;
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'score':
        return (b.compliance_score || 0) - (a.compliance_score || 0);
      case 'size':
        return b.size_bytes - a.size_bytes;
      case 'date':
      default:
        return new Date(b.upload_date) - new Date(a.upload_date);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'processing':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'error':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'queued':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      default:
        return '📋';
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'very low':
        return 'text-green-700 bg-green-100';
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'high':
        return 'text-orange-700 bg-orange-100';
      case 'critical':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDocumentAction = async (document, action) => {
    switch (action) {
      case 'view':
        onDocumentSelect?.(document);
        onClose();
        break;
      case 'reanalyze':
        console.log('Reanalyzing document:', document.id);
        // In real app: trigger reanalysis API call
        break;
      case 'download':
        console.log('Downloading document:', document.id);
        // In real app: download from Supabase storage
        break;
      case 'duplicate':
        console.log('Duplicating document:', document.id);
        break;
      case 'share':
        console.log('Sharing document:', document.id);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this document?')) {
          console.log('Deleting document:', document.id);
          // In real app: delete from Supabase
        }
        break;
    }
  };

  const handleBulkAction = (action) => {
    const selectedDocuments = documents.filter(doc => selectedDocs.has(doc.id));
    console.log(`Bulk ${action}:`, selectedDocuments);
    
    switch (action) {
      case 'export':
        // Export selected documents
        break;
      case 'reanalyze':
        // Reanalyze selected documents
        break;
      case 'delete':
        if (confirm(`Delete ${selectedDocs.size} selected documents?`)) {
          // Delete selected documents
        }
        break;
      case 'tag':
        // Add tags to selected documents
        break;
    }
    
    setSelectedDocs(new Set());
    setShowBulkActions(false);
  };

  const toggleDocumentSelection = (docId) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-7xl mx-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Document History</h2>
                <p className="text-gray-600">Manage and track all your compliance analyses</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Enhanced Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search documents, tags, or frameworks..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="analyzed">Analyzed</option>
                  <option value="processing">Processing</option>
                  <option value="error">Error</option>
                  <option value="queued">Queued</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="score">Sort by Score</option>
                  <option value="size">Sort by Size</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && (
              <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-blue-900 font-medium">
                    {selectedDocs.size} document{selectedDocs.size !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Export Selected
                    </button>
                    <button
                      onClick={() => handleBulkAction('reanalyze')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Reanalyze
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document Grid/List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading documents...</span>
                </div>
              ) : sortedDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                  </p>
                </div>
              ) : (
                sortedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <div className="flex items-center pt-1">
                        <input
                          type="checkbox"
                          checked={selectedDocs.has(document.id)}
                          onChange={() => toggleDocumentSelection(document.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* File Icon */}
                      <div className="text-3xl">{getFileIcon(document.type)}</div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{document.name}</h3>
                            
                            {/* Status and Metadata */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
                                {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                              </span>
                              
                              {document.version && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                  v{document.version}
                                </span>
                              )}
                              
                              {document.risk_level && (
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRiskColor(document.risk_level)}`}>
                                  {document.risk_level} Risk
                                </span>
                              )}
                              
                              <span className="text-xs text-gray-500">{document.size}</span>
                              <span className="text-xs text-gray-500">
                                {document.upload_date.toLocaleDateString()}
                              </span>
                            </div>

                            {/* Frameworks */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {document.frameworks.map((framework) => (
                                <span
                                  key={framework}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                                >
                                  {framework}
                                </span>
                              ))}
                            </div>

                            {/* Tags */}
                            {document.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {document.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Processing Progress */}
                            {document.status === 'processing' && (
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-blue-700">Processing: {document.processing_stage?.replace('_', ' ')}</span>
                                  <span className="text-blue-700">{document.processing_progress}%</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${document.processing_progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Error Message */}
                            {document.status === 'error' && document.error_message && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                <p className="text-red-700 text-sm">{document.error_message}</p>
                              </div>
                            )}
                          </div>

                          {/* Analysis Results */}
                          {document.status === 'analyzed' && (
                            <div className="flex items-center space-x-6 ml-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {document.compliance_score}%
                                </div>
                                <div className="text-xs text-gray-500">Compliance</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                  {document.critical_gaps}
                                </div>
                                <div className="text-xs text-gray-500">Critical</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {document.recommendations}
                                </div>
                                <div className="text-xs text-gray-500">Actions</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {document.status === 'analyzed' && (
                            <button
                              onClick={() => handleDocumentAction(document, 'view')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              View Analysis
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDocumentAction(document, 'download')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                          >
                            Download
                          </button>
                          
                          {document.status !== 'processing' && (
                            <button
                              onClick={() => handleDocumentAction(document, 'reanalyze')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Reanalyze
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDocumentAction(document, 'share')}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                          >
                            Share
                          </button>
                          
                          <button
                            onClick={() => handleDocumentAction(document, 'duplicate')}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                          >
                            Duplicate
                          </button>
                          
                          <button
                            onClick={() => handleDocumentAction(document, 'delete')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>

                        {/* Shared With */}
                        {document.shared_with.length > 0 && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">Shared with:</span> {document.shared_with.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination would go here */}
            {sortedDocuments.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Previous
                  </button>
                  <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">1</span>
                  <span className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">2</span>
                  <span className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">3</span>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnterpriseDocumentHistory;
