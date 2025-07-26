import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function EnterpriseChatExpert({ 
  policyDocument, 
  isOpen, 
  onToggle, 
  onClose, 
  initialQuery,
  analysisContext = null
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('general'); // general, document, analysis
  const [suggestions, setSuggestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  // Pre-defined suggestions based on context
  const contextSuggestions = {
    general: [
      "What are the key requirements for GDPR compliance?",
      "How do I implement data protection by design?",
      "What are the penalties for HIPAA violations?",
      "Explain the difference between GDPR and CCPA"
    ],
    document: [
      "Summarize the main compliance gaps in this document",
      "What are the critical issues that need immediate attention?",
      "How does this policy compare to industry standards?",
      "What clauses should I add to improve compliance?"
    ],
    analysis: [
      "Explain why this received a low compliance score",
      "What are the most important recommendations to implement?",
      "How can I improve my GDPR compliance score?",
      "What's the typical timeline to address these gaps?"
    ]
  };

  useEffect(() => {
    if (isOpen) {
      // Set initial greeting based on context
      const greeting = getContextualGreeting();
      setMessages([greeting]);
      
      // Update suggestions based on mode
      updateSuggestionsForMode();
      
      // Handle initial query if provided
      if (initialQuery) {
        setTimeout(() => {
          handleSendMessage(initialQuery);
        }, 500);
      }
    }
  }, [isOpen, initialQuery, policyDocument, analysisContext]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getContextualGreeting = () => {
    let greeting = {
      id: Date.now(),
      type: 'assistant',
      timestamp: new Date(),
      sender: 'PoliGap AI Assistant'
    };

    if (analysisContext) {
      setChatMode('analysis');
      greeting.content = `Hi! I'm here to help you understand your compliance analysis results. I can explain the gaps found, recommend specific actions, and help you prioritize improvements. What would you like to know about your analysis?`;
    } else if (policyDocument) {
      setChatMode('document');
      greeting.content = `Hello! I can help you analyze your document "${policyDocument.fileName || 'uploaded document'}" for compliance gaps and provide specific recommendations. What would you like to know?`;
    } else {
      setChatMode('general');
      greeting.content = `Welcome to PoliGap AI! I'm your compliance expert assistant. I can help you with GDPR, HIPAA, SOX, and other compliance frameworks. Ask me anything about compliance requirements, policy analysis, or best practices.`;
    }

    return greeting;
  };

  const updateSuggestionsForMode = () => {
    setSuggestions(contextSuggestions[chatMode] || contextSuggestions.general);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Generate contextual response based on the message and current mode
    let response = generateContextualResponse(userMessage);
    
    const assistantMessage = {
      id: Date.now(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      sender: 'PoliGap AI Assistant',
      metadata: response.metadata || {}
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);

    // Update suggestions based on the conversation
    if (response.suggestions) {
      setSuggestions(response.suggestions);
    }
  };

  const generateContextualResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Analysis-specific responses
    if (chatMode === 'analysis' && analysisContext) {
      if (message.includes('score') || message.includes('rating')) {
        return {
          content: `Your document received an overall compliance score of ${analysisContext.overallScore || 85}%. This indicates ${
            (analysisContext.overallScore || 85) >= 90 ? 'excellent' :
            (analysisContext.overallScore || 85) >= 75 ? 'good' : 'needs improvement'
          } compliance levels. The score is calculated based on how well your policy addresses requirements across different frameworks like GDPR, HIPAA, and SOX.`,
          metadata: { type: 'score_explanation' }
        };
      }
      
      if (message.includes('critical') || message.includes('urgent')) {
        return {
          content: `I've identified ${analysisContext.criticalGaps || 3} critical compliance gaps that require immediate attention:

1. **Data Retention Policy Missing** - GDPR Article 17 requires clear data deletion procedures
2. **Breach Notification Incomplete** - Missing 72-hour notification requirement
3. **Access Control Documentation** - HIPAA requires documented security procedures

These should be addressed within 2-3 weeks to minimize compliance risk.`,
          metadata: { type: 'critical_gaps' },
          suggestions: [
            "How do I implement data retention policies?",
            "What should be included in breach notification procedures?",
            "Show me examples of access control documentation"
          ]
        };
      }
    }

    // Document-specific responses
    if (chatMode === 'document' && policyDocument) {
      if (message.includes('gap') || message.includes('missing')) {
        return {
          content: `Based on my analysis of your document, I've identified several compliance gaps:

📍 **High Priority Issues:**
- Missing data subject rights procedures (GDPR Article 12-23)
- Incomplete breach response timeline (72-hour requirement)
- Unclear third-party data sharing provisions

🔧 **Recommended Actions:**
1. Add clear data subject request handling procedures
2. Define specific breach notification workflows
3. Document all third-party data processing agreements

Would you like me to provide specific clause suggestions for any of these areas?`,
          metadata: { type: 'gap_analysis' }
        };
      }
    }

    // General compliance questions
    if (message.includes('gdpr')) {
      return {
        content: `GDPR (General Data Protection Regulation) is the EU's comprehensive data protection law. Here are the key requirements:

🔐 **Core Principles:**
- Lawful basis for processing personal data
- Data minimization and purpose limitation
- Individual rights (access, rectification, erasure)
- Data protection by design and default

⚡ **Key Obligations:**
- Obtain proper consent or establish legal basis
- Implement technical and organizational measures
- Conduct Data Protection Impact Assessments (DPIAs)
- Report breaches within 72 hours

💰 **Penalties:** Up to €20 million or 4% of annual turnover

What specific aspect of GDPR would you like me to explain further?`,
        suggestions: [
          "What are the lawful bases for processing under GDPR?",
          "How do I conduct a DPIA?",
          "What constitutes valid consent under GDPR?",
          "How do I handle data subject requests?"
        ]
      };
    }

    if (message.includes('hipaa')) {
      return {
        content: `HIPAA (Health Insurance Portability and Accountability Act) protects patient health information in the US. Here's what you need to know:

🏥 **Who Must Comply:**
- Healthcare providers (doctors, hospitals, clinics)
- Health plans (insurance companies)
- Healthcare clearinghouses
- Business associates handling PHI

🔒 **Key Requirements:**
- **Administrative Safeguards:** Security officer, access management, training
- **Physical Safeguards:** Facility controls, workstation security, device controls
- **Technical Safeguards:** Access controls, audit logs, encryption

⚖️ **Patient Rights:**
- Right to access their health information
- Right to request corrections
- Right to know who has accessed their data

What specific HIPAA requirement would you like me to explain?`,
        suggestions: [
          "What qualifies as PHI under HIPAA?",
          "How do I implement technical safeguards?",
          "What should be in a HIPAA risk assessment?",
          "How do I handle patient access requests?"
        ]
      };
    }

    // Default helpful response
    return {
      content: `I'd be happy to help you with that! As your compliance AI assistant, I can provide guidance on:

🛡️ **Compliance Frameworks:** GDPR, HIPAA, SOX, CCPA, PIPEDA, and more
📋 **Policy Analysis:** Gap identification and recommendations
⚡ **Best Practices:** Industry standards and implementation guides
🔧 **Practical Solutions:** Specific clauses and procedures

Could you provide more details about what specific compliance topic you'd like to explore? For example:
- Are you working with a particular regulation?
- Do you have specific compliance concerns?
- Are you looking for implementation guidance?`,
      suggestions: contextSuggestions[chatMode]
    };
  };

  const handleSendMessage = async (messageText = null) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      sender: user?.user_metadata?.full_name || user?.email || 'You'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    await simulateAIResponse(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    const greeting = getContextualGreeting();
    setMessages([greeting]);
    updateSuggestionsForMode();
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Compliance AI Assistant</h3>
                <p className="text-blue-100 text-sm">
                  {chatMode === 'analysis' ? 'Analysis Expert' :
                   chatMode === 'document' ? 'Document Analyst' : 'Compliance Expert'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <button
                onClick={exportChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Export chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600 text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && !isTyping && (
          <div className="px-6 pb-4">
            <div className="text-sm text-gray-600 mb-2">Suggested questions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about compliance frameworks, policy gaps, or best practices..."
                className="w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
                rows="2"
              />
            </div>
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnterpriseChatExpert;
