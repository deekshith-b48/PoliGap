import { useState } from 'react';

function ChatButton({ onClick, hasDocument }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!hasDocument) return null;

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-primary text-white p-4 rounded-2xl shadow-glow btn-hover focus-ring group ai-glow"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        
        {/* AI indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ai-pulse border-2 border-white"></div>
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap shadow-soft animate-fadeInUp">
          Ask AI Expert
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-6 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default ChatButton;
