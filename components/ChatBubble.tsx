import React from 'react';
import { Message } from '../types';
import { Bot, User, Clock } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === 'model';

  // Basic formatting for the demo: handle bolding and newlines
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Very basic bold parser for **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={i} className="min-h-[1.2em]">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${
          isBot ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'
        }`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
            isBot 
              ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
              : 'bg-indigo-600 text-white rounded-tr-none'
          }`}>
             {isBot ? (
                // For bot, we render somewhat raw to support the formatting helper
                <div className="space-y-1">{formatText(message.content)}</div>
             ) : (
                message.content
             )}
          </div>
          
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 px-1">
             <Clock size={10} />
             <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
