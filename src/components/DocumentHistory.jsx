import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function DocumentHistory({ isOpen, onClose, onDocumentSelect }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock data for demonstration
  const mockDocuments = [
    {
      id: '1',
      name: 'Privacy Policy v2.1',
      type: 'pdf',
      size: '2.4 MB',
      uploadDate: new Date('2024-01-15'),
      industry: 'technology',
      frameworks: ['GDPR', 'CCPA'],
      status: 'analyzed',
      complianceScore: 85,
      lastAnalysis: new Date('2024-01-15'),
      gaps: 3,
      recommendations: 12
    },
    {
      id: '2',
      name: 'Employee Handbook',
      type: 'docx',
      size: '5.1 MB',
      uploadDate: new Date('2024-01-10'),
      industry: 'technology',
      frameworks: ['GDPR', 'ISO 27001'],
      status: 'processing',
      complianceScore: null,
      lastAnalysis: null,
      gaps: null,
      recommendations: null
    },
    {
      id: '3',
      name: 'Data Protection Policy',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: new Date('2024-01-05'),
      industry: 'healthcare',
      frameworks: ['HIPAA', 'GDPR'],
      status: 'analyzed',
      complianceScore: 92,
      lastAnalysis: new Date('2024-01-05'),
      gaps: 1,
      recommendations: 5
    },
    {
      id: '4',
      name: 'Cookie Policy',
      type: 'txt',
      size: '0.5 MB',
      uploadDate: new Date('2023-12-28'),
      industry: 'technology',
      frameworks: ['GDPR'],
      status: 'error',
      complianceScore: null,
      lastAnalysis: null,
      gaps: null,
      recommendations: null
    }
  ];

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen, user]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('documents')
      //   .select('*')
      //   .eq('user_id', user?.id)
      //   .order('created_at', { ascending: false });
      
      // For demo, use mock data
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
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'score':
        return (b.complianceScore || 0) - (a.complianceScore || 0);
      case 'date':
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzed':
        return 'text-green-700 bg-green-100';
      case 'processing':
        return 'text-blue-700 bg-blue-100';
      case 'error':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
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

  const handleDocumentAction = (document, action) => {
    switch (action) {
      case 'reanalyze':
        console.log('Reanalyzing document:', document.id);
        break;
      case 'download':
        console.log('Downloading document:', document.id);
        break;
      case 'delete':
        console.log('Deleting document:', document.id);
        break;
      case 'view':
        onDocumentSelect?.(document);
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Document History</h2>
              <p className="text-gray-600">Manage and track all your analyzed documents</p>
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

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Documents</option>
                <option value="analyzed">Analyzed</option>
                <option value="processing">Processing</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Upload Date</option>
                <option value="name">Name</option>
                <option value="score">Compliance Score</option>
              </select>
            </div>
          </div>

          {/* Document List */}
          <div className="max-h-96 overflow-y-auto">
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
                <p className="text-gray-600">Upload your first policy document to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-3xl">{getFileIcon(document.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{document.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(document.status)}`}>
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">{document.size}</span>
                            <span className="text-xs text-gray-500">
                              {document.uploadDate.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {document.frameworks.map((framework) => (
                              <span
                                key={framework}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                              >
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {document.status === 'analyzed' && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {document.complianceScore}%
                            </div>
                            <div className="text-xs text-gray-500">Compliance</div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          {document.status === 'analyzed' && (
                            <button
                              onClick={() => handleDocumentAction(document, 'view')}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View Analysis"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDocumentAction(document, 'reanalyze')}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Reanalyze"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDocumentAction(document, 'download')}
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Download"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDocumentAction(document, 'delete')}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {document.status === 'analyzed' && (
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{document.gaps}</div>
                          <div className="text-xs text-gray-500">Compliance Gaps</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{document.recommendations}</div>
                          <div className="text-xs text-gray-500">Recommendations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {document.lastAnalysis?.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">Last Analysis</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentHistory;
