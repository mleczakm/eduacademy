import { ConversationProvider, useConversation } from '@elevenlabs/react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

const ChatContent = () => {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs'),
    onMessage: (message) => {
      console.log('Received message:', message);
      // Only add agent messages here, user messages are added locally in handleSubmit
      if (message.role === 'agent') {
        setLocalMessages(prev => [...prev, {
          role: 'agent',
          text: message.message
        }]);
      }
    },
    onError: (error) => console.error('ElevenLabs Error:', error),
    textOnly: true,
  });
  const { sendUserMessage, status } = conversation;

  useEffect(() => {
    if (status === 'disconnected') {
      console.log('Starting session...');
      conversation.startSession({
        agentId: "agent_2501ktwm893ffmwt20a3v29eg57q",
        textOnly: true,
      });
    }
  }, [status, conversation]);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest' 
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inputValue.trim()) return;

    try {
      if (status === 'disconnected') {
        console.log('Starting session (from handleSubmit)...');
        await conversation.startSession({
          agentId: "agent_2501ktwm893ffmwt20a3v29eg57q",
          textOnly: true,
        });
      }
      
      if (sendUserMessage) {
        console.log('Sending message:', inputValue);
        const textToSend = inputValue;
        setInputValue('');
        
        // Add user message to local state immediately
        setLocalMessages(prev => [...prev, {
          role: 'user',
          text: textToSend
        }]);

        await sendUserMessage(textToSend);
      } else {
        console.warn('sendUserMessage is not available');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-teal-100/50 w-full overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-brandPrimary text-white px-5 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
            🐨
          </div>
          <div>
            <h4 className="font-bold text-base">Asystent Akademii</h4>
            <span className="text-xs text-teal-100 flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full inline-block ${status === 'connected' ? 'bg-green-400' : status === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'}`}></span> {status === 'connected' ? 'Chętnie doradzę' : status === 'connecting' ? 'Łączenie...' : 'Rozłączony'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-stone-50/50 text-sm">
        {localMessages.length === 0 ? (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex-shrink-0 flex items-center justify-center text-lg mt-0.5">
              🐨
            </div>
            <div className="bg-white border border-slate-100 text-slate-700 p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] leading-relaxed">
              Cześć! Pomagam dobrać najciekawsze zajęcia i warsztaty w Future Edu Academy. Dla kogo dziś szukasz inspiracji? 😊
            </div>
          </div>
        ) : (
          localMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-lg mt-0.5 ${
                  isUser ? 'bg-amber-100' : 'bg-teal-100'
                }`}>
                  {isUser ? '👩' : '🐨'}
                </div>
                <div className={`p-3.5 rounded-2xl shadow-sm max-w-[85%] leading-relaxed ${
                  isUser 
                    ? 'bg-brandPrimary text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Opisz swoje potrzeby..."
          className="flex-grow bg-slate-50 border border-transparent rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brandPrimary focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={status === 'connecting'}
          className={`bg-brandPrimary hover:bg-brandPrimaryDark text-white p-3 rounded-2xl transition flex-shrink-0 ${status === 'connecting' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export const ChatInterface = () => {
  return (
    <ConversationProvider
    >
      <ChatContent />
    </ConversationProvider>
  );
};
