import { useState, useRef, useEffect } from 'react';
import { analyzeWithGemini } from '../lib/gemini';

function ChatExpert({ policyDocument, isOpen, onToggle, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (policyDocument && messages.length === 0) {
      const welcomeMessage = {
        type: 'assistant',
        content: `Hi! I'm your AI Policy Expert. I can see you've uploaded "${policyDocument.fileName}" for analysis.\n\n**I can help you with:**\n• Compliance gap analysis\n• Regulatory framework guidance\n• Best practice recommendations\n• Risk assessment questions\n• Implementation strategies\n\n**Try asking me:**\n• "What are the main compliance risks in my document?"\n• "How can I improve GDPR compliance?"\n• "What security controls should I implement?"\n\nHow can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else if (!policyDocument && messages.length === 0) {
      const genericWelcome = {
        type: 'assistant',
        content: 'Hi! I\'m your AI Policy Expert. Please upload a policy document first using the Policy Analyzer, and then I can provide specific guidance based on your document. I\'m here to help with compliance questions, risk assessments, and best practices!',
        timestamp: new Date()
      };
      setMessages([genericWelcome]);
    }
  }, [policyDocument, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let contextualPrompt = inputMessage.trim();
      
      if (policyDocument) {
        contextualPrompt = `
        Based on the uploaded policy document "${policyDocument.fileName}" (${policyDocument.industry} industry, frameworks: ${policyDocument.frameworks?.join(', ') || 'General'}), please answer this question:
        
        "${inputMessage.trim()}"
        
        Please provide specific, actionable advice that considers the document context and industry requirements.
        `;
      }

      const response = await analyzeWithGemini(contextualPrompt);
      
      const assistantMessage = {
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-glow w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03 8-9 8s9-3.582 9-8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">AI Policy Expert</h3>
              <p className="text-sm text-gray-600">
                {policyDocument ? `Analyzing: ${policyDocument.fileName}` : 'General compliance assistant'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-600">AI Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center mr-2 animate-ai-pulse">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600">AI Assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about compliance, policies, or regulations..."
                className="w-full p-4 border border-gray-300 rounded-2xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-primary text-white p-4 rounded-2xl btn-hover focus-ring disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setInputMessage("What are the main compliance gaps in my document?")}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Compliance Gaps
            </button>
            <button
              onClick={() => setInputMessage("How can I improve my security posture?")}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Security Improvements
            </button>
            <button
              onClick={() => setInputMessage("What are the implementation priorities?")}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Implementation Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatExpert;
