// Search query analysis utility

export const analyzeSearchQuery = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Keywords that suggest the user might need to upload a document
  const documentRequiredKeywords = [
    'analyze', 'check', 'review', 'scan', 'audit', 'gaps', 'compliance gaps',
    'my document', 'my policy', 'this document', 'uploaded', 'file',
    'assess my', 'check my', 'review my', 'audit my', 'improve my'
  ];

  // Keywords for general compliance questions that don't require a document
  const generalComplianceKeywords = [
    'what is', 'how to', 'explain', 'define', 'requirements', 'rules',
    'gdpr', 'hipaa', 'sox', 'ccpa', 'compliance', 'regulation', 'framework',
    'best practices', 'guidelines', 'standards'
  ];

  // Check if query suggests document analysis is needed
  const requiresDocument = documentRequiredKeywords.some(keyword => 
    lowerQuery.includes(keyword)
  );

  // Check if it's a general compliance question
  const isGeneralQuestion = generalComplianceKeywords.some(keyword => 
    lowerQuery.includes(keyword)
  );

  return {
    query: query.trim(),
    requiresDocument,
    isGeneralQuestion,
    category: requiresDocument ? 'document-analysis' : 
              isGeneralQuestion ? 'general-compliance' : 'general'
  };
};

export const generateSearchResponse = (analysis) => {
  const { query, requiresDocument, isGeneralQuestion, category } = analysis;

  if (requiresDocument) {
    return {
      type: 'document-required',
      message: `## I'd be happy to help you with: *"${query}"*

To provide accurate analysis, I'll need you to upload your policy document first. Please use the **Policy Analyzer** to upload your document, and then I can give you specific insights and recommendations.

### What I can analyze:
- **Compliance gaps and risks** - Identify missing requirements
- **Regulatory alignment** - Check against GDPR, HIPAA, SOX, etc.
- **Missing requirements** - Spot critical policy gaps  
- **Implementation recommendations** - Actionable improvement steps

Would you like to upload a document now?`,
      suggestedAction: 'upload-document'
    };
  }

  if (isGeneralQuestion) {
    return {
      type: 'general-response',
      message: `## Great question: *"${query}"*

I can help you understand compliance requirements, regulations, and best practices. Let me provide you with detailed information about this topic.

### I can also help with:
- **Framework explanations** - GDPR, HIPAA, SOX, CCPA, etc.
- **Implementation guidance** - Step-by-step compliance roadmaps
- **Compliance requirements** - What you need to know and do
- **Industry best practices** - Proven strategies and approaches

How would you like me to elaborate on your question?`,
      suggestedAction: 'continue-chat'
    };
  }

  return {
    type: 'general-response',
    message: `## I'm here to help with: *"${query}"*

I specialize in compliance and policy guidance. I can assist with:

### Document Analysis *(requires upload)*:
- **Policy gap analysis** - Find what's missing in your policies
- **Compliance scoring** - Rate your current compliance level
- **Risk assessment** - Identify potential vulnerabilities

### General Guidance:
- **Regulatory frameworks** - GDPR, HIPAA, SOX, CCPA, and more
- **Best practices** - Industry-proven approaches
- **Implementation strategies** - How to get compliant fast

How can I best assist you with your compliance needs?`,
    suggestedAction: 'continue-chat'
  };
};
