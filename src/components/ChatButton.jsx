import { useState } from 'react';

function ChatButton({ onClick, hasDocument }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!hasDocument) return null; // Only show when document is uploaded

  return (
    <div className="fixed right-6 bottom-6 z-40">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full border-4 border-purple-300 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all transform group"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-2xl group-hover:animate-bounce">💬</span>
        </div>
      </button>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border-2 border-purple-400 shadow-[4px_4px_0px_0px_#a855f7]">
          Chat with AI Expert
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-black border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default ChatButton;
