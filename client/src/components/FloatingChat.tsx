import { useState, useRef, useEffect } from 'react';
import { navigateTo } from '../utils/navigation';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'welcome' | 'chat'>('welcome');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'bot',
      text: "Hello! I'm Fathima, your AI assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for openFloatingChat events from the voice agent tool
  useEffect(() => {
    const handleOpenFloatingChat = (event: CustomEvent) => {
      const { mode: eventMode, message } = event.detail;
      
      setIsOpen(true);
      setMode(eventMode || 'welcome');
      
      // If there's an initial message, add it to the chat
      if (message && eventMode === 'chat') {
        setTimeout(() => {
          handleSendMessage(message);
        }, 500); // Small delay to ensure chat is open
      }
    };

    window.addEventListener('openFloatingChat', handleOpenFloatingChat as EventListener);
    
    return () => {
      window.removeEventListener('openFloatingChat', handleOpenFloatingChat as EventListener);
    };
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response with more helpful responses
    setTimeout(() => {
      let botResponse = `Thanks for your message: "${text}". I'm here to help!`;
      
      // Add contextual responses based on user input
      const lowerText = text.toLowerCase();
      if (lowerText.includes('product') || lowerText.includes('shop') || lowerText.includes('buy')) {
        botResponse = `I can help you with products! You can browse our products page or use voice commands on the homepage for a more interactive experience.`;
      } else if (lowerText.includes('track') || lowerText.includes('order')) {
        botResponse = `To track your order, please provide your order number. You can also use our voice agent on the homepage for faster assistance.`;
      } else if (lowerText.includes('return') || lowerText.includes('refund')) {
        botResponse = `I can help with returns and refunds. For the fastest service, try our voice agent on the homepage - it can access your account details instantly.`;
      } else if (lowerText.includes('voice') || lowerText.includes('call')) {
        botResponse = `Great choice! Our voice agent provides the most personalized support. Click "Start Voice Call" or visit the homepage to begin.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: 'bot',
        text: botResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    'Track my order',
    'Return an item',
    'Product support',
    'Account help'
  ];

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleStartVoiceCall = () => {
    // Navigate to homepage where the voice agent is available
    navigateTo('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-2.5 right-4 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-2.5 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {mode === 'welcome' ? (
            // Welcome Screen
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    F
                  </div>
                  <span className="font-semibold text-gray-900">Fathima - Support</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Welcome Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                    F
                  </div>
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hi! I'm Fathima</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-xs">
                  I'm here to help you with any questions or concerns. Choose your preferred way to connect with me.
                </p>

                <div className="space-y-2.5 w-full">
                  <div className="relative">
                    <button
                      onClick={handleStartVoiceCall}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Start Voice Call
                    </button>
                    <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                      Recommended
                    </div>
                  </div>

                  <button
                    onClick={() => setMode('chat')}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.8-.45l-3.5 2.1a.5.5 0 01-.7-.65L7.5 18.5A8 8 0 1221 12z" />
                    </svg>
                    Start Chat
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Voice calls provide faster, more personalized support
                </p>
              </div>
            </div>
          ) : (
            // Chat Screen
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    F
                  </div>
                  <span className="font-semibold text-gray-900">Fathima - Support</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {message.from === 'bot' && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                          F
                        </div>
                      )}
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          message.from === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-end gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        F
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 text-sm"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                  <button
                    onClick={handleStartVoiceCall}
                    className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                    title="Start voice call"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Button - only show when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.8-.45l-3.5 2.1a.5.5 0 01-.7-.65L7.5 18.5A8 8 0 1221 12z" />
          </svg>
        </button>
      )}
    </div>
  );
} 