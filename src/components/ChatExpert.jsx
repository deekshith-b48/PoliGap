import { useState, useRef, useEffect } from 'react';
import { analyzeWithGemini } from '../lib/gemini';

function ChatExpert({ policyDocument, isOpen, onToggle, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize welcome message based on document context
  useEffect(() => {
    if (policyDocument && messages.length === 0) {
      const welcomeMessage = {
        type: 'assistant',
        content: `👋 Hello! I'm your AI Policy Expert. I can see you've uploaded "${policyDocument.fileName}" for analysis.\n\n🎯 **I can help you with:**\n• Compliance gap analysis\n• Regulatory framework guidance\n• Best practice recommendations\n• Risk assessment questions\n• Implementation strategies\n\n💡 **Try asking me:**\n• "What are the main compliance risks in my document?"\n• "How can I improve GDPR compliance?"\n• "What security controls should I implement?"\n\nHow can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else if (!policyDocument && messages.length === 0) {
      const genericWelcome = {
        type: 'assistant',
        content: '👋 Hello! I\'m your AI Policy Expert. Please upload a policy document first using the Policy Analyzer, and then I can provide specific guidance based on your document. I\'m here to help with compliance questions, risk assessments, and best practices!',
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
      // Create a context-aware prompt for the AI
      const documentContext = policyDocument ? 
        `Document: ${policyDocument.fileName} (${policyDocument.fileType}, uploaded ${policyDocument.uploadDate?.toLocaleDateString()})
        Industry: ${policyDocument.industry || 'Not specified'}
        Frameworks: ${policyDocument.frameworks?.join(', ') || 'Not specified'}` : 
        'No document context available';

      const contextPrompt = `
You are a Policy Compliance Expert AI assistant. You are helping a user analyze their policy document and answer compliance questions.

DOCUMENT CONTEXT:
${documentContext}

USER QUESTION: "${userMessage.content}"

INSTRUCTIONS:
- Provide expert-level advice on policy compliance and governance
- Reference specific compliance frameworks (GDPR, HIPAA, SOX, PCI DSS, etc.) when relevant
- Give actionable, specific recommendations
- If asked about gaps or issues, provide concrete steps to address them
- Keep responses professional but conversational
- If you need more context about the document, ask clarifying questions
- Focus on practical implementation and compliance best practices

Please provide a helpful response:`;

      const response = await analyzeWithGemini(contextPrompt);

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
        content: '❌ I apologize, but I encountered an error while processing your question. Please try rephrasing your question or check if your document was uploaded properly. If the issue persists, please try again in a moment.',
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

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-20 w-96 h-[600px] bg-gradient-to-br from-purple-900 to-blue-900 rounded-3xl border-4 border-pink-400 shadow-[8px_8px_0px_0px_#ec4899] z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-700 p-4 border-b-4 border-pink-400 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center border-2 border-black mr-3">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Chat with AI Expert</h3>
              <p className="text-pink-200 text-xs">Policy Document Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-2 rounded-lg font-black border-2 border-red-300 hover:bg-red-400 transition-all text-sm"
          >
            ✕
          </button>
        </div>
        
        {/* Document Context Indicator */}
        {policyDocument && (
          <div className="mt-3 bg-purple-800 bg-opacity-50 p-3 rounded-xl border-2 border-purple-400">
            <div className="flex items-center text-sm">
              <span className="text-yellow-400 mr-2">📄</span>
              <div>
                <p className="text-white font-bold">{policyDocument.fileName}</p>
                <p className="text-purple-200 text-xs">
                  {policyDocument.industry && `${policyDocument.industry} • `}
                  Uploaded {policyDocument.uploadDate?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-blue-300' 
                : 'bg-white text-gray-800 border-2 border-gray-300'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-2 opacity-70 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border-2 border-gray-300 p-3 rounded-2xl max-w-[85%]">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <p className="text-sm">AI is thinking...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t-4 border-pink-400 flex-shrink-0">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your policy document..."
            className="flex-1 p-3 rounded-xl border-2 border-gray-300 text-gray-800 resize-none h-12 text-sm focus:outline-none focus:border-purple-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-xl font-black border-2 border-green-300 hover:bg-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg">📤</span>
          </button>
        </div>
        <p className="text-xs text-pink-200 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default ChatExpert;
