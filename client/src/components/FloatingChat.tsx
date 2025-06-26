import { useState, useRef, useEffect } from 'react';
import { navigateTo } from '../utils/navigation';
import { WebRTCClient } from '../webrtc';

interface Message {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: string;
}

type SessionStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'welcome' | 'chat' | 'call'>('welcome');
  const [isCallCollapsed, setIsCallCollapsed] = useState(false);
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
  
  // WebRTC and Call State
  const [isConnected, setIsConnected] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  
  const webrtcRef = useRef<WebRTCClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const syncCleanupRef = useRef<(() => void) | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (syncCleanupRef.current) {
        syncCleanupRef.current();
      }
    };
  }, []);

  // Listen for openFloatingChat events from the voice agent tool
  useEffect(() => {
    const handleOpenFloatingChat = (event: CustomEvent) => {
      const { mode: eventMode, message } = event.detail;
      
      setIsOpen(true);
      if (eventMode === 'call') {
        setMode('call');
        setIsCallCollapsed(false); // Ensure call is expanded when explicitly opened
        handleStartVoiceCall();
      } else {
        setMode(eventMode || 'welcome');
      }
      
      // If there's an initial message, add it to the chat
      if (message && eventMode === 'chat') {
        setTimeout(() => {
          handleSendMessage(message);
        }, 500);
      }
    };

    window.addEventListener('openFloatingChat', handleOpenFloatingChat as EventListener);
    
    return () => {
      window.removeEventListener('openFloatingChat', handleOpenFloatingChat as EventListener);
    };
  }, []);

  const addMessage = (from: 'user' | 'bot', text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      from,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    addMessage('user', text.trim());
    setInputValue('');

    if (isConnected && webrtcRef.current) {
      // Send via WebRTC if connected
      webrtcRef.current.sendTextMessage(text.trim(), 'user');
      setIsTyping(true);
      
      // Simulate response handling since we can't directly listen to WebRTC events
      // In a real implementation, you'd listen to the actual WebRTC response events
      setTimeout(() => {
        // Simulate AI response
        const responses = [
          `I understand you're asking about "${text}". Let me help you with that.`,
          `Thanks for your question about "${text}". I'm processing that information now.`,
          `I can help you with "${text}". Let me provide you with the relevant information.`,
          `Regarding "${text}", I have some insights that might be helpful.`
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('bot', randomResponse);
        setIsTyping(false);
      }, 2000);
      
    } else {
      // Fallback to simulated response
      setIsTyping(true);
      setTimeout(() => {
        let botResponse = `Thanks for your message: "${text}". I'm here to help!`;
        
        const lowerText = text.toLowerCase();
        if (lowerText.includes('product') || lowerText.includes('shop') || lowerText.includes('buy')) {
          botResponse = `I can help you with products! You can browse our products page or use voice commands for a more interactive experience.`;
        } else if (lowerText.includes('track') || lowerText.includes('order')) {
          botResponse = `To track your order, please provide your order number. You can also use our voice agent for faster assistance.`;
        } else if (lowerText.includes('return') || lowerText.includes('refund')) {
          botResponse = `I can help with returns and refunds. For the fastest service, try our voice agent - it can access your account details instantly.`;
        } else if (lowerText.includes('voice') || lowerText.includes('call')) {
          botResponse = `Great choice! Our voice agent provides the most personalized support. Click "Start Voice Call" to begin.`;
        }

        addMessage('bot', botResponse);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleStartVoiceCall = async () => {
    // Prevent multiple connections - kill any existing connection first
    if (webrtcRef.current) {
      console.log('Cleaning up existing WebRTC connection...');
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear any existing sync cleanup
    if (syncCleanupRef.current) {
      syncCleanupRef.current();
      syncCleanupRef.current = null;
    }

    try {
      setError(null);
      setSessionStatus('connecting');
      setElapsedTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      webrtcRef.current = new WebRTCClient({ 
        logSystemEvents: false,
        onConnectionEstablished: () => {
          // This callback is triggered when the data channel opens
          console.log('🎯 WebRTC connection established - triggering auto-collapse sequence');
          setIsConnected(true);
          setSessionStatus('listening');
          
          // Add call start message
          addMessage('bot', 'Voice call connected! I can hear you now. How can I help you today?');
          
          // Auto-collapse after a short delay to let user see the connection message
          console.log('⏰ Setting auto-collapse timer for 2.5 seconds');
          setTimeout(() => {
            console.log('🔄 Auto-collapse timer fired - collapsing call widget');
            setIsCallCollapsed(true);
          }, 2500);
        }
      });
      syncCleanupRef.current = setupWebRTCEventHandlers();
      
      await webrtcRef.current.initWebRTC();
      
      // Set mode to call but don't set connected state yet
      setMode('call');
      
      // Sync microphone mute state with WebRTC
      if (micMuted) {
        webrtcRef.current.setMicrophoneMuted(true);
      }
      
    } catch (err) {
      console.error('WebRTC connection failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
      setSessionStatus('idle');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Clean up the failed connection
      if (webrtcRef.current) {
        webrtcRef.current.cleanup();
        webrtcRef.current = null;
      }
      if (syncCleanupRef.current) {
        syncCleanupRef.current();
        syncCleanupRef.current = null;
      }
    }
  };

  const handleEndCall = () => {
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      webrtcRef.current = null;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (syncCleanupRef.current) {
      syncCleanupRef.current();
      syncCleanupRef.current = null;
    }
    
    setIsConnected(false);
    setSessionStatus('idle');
    setIsCallCollapsed(false);
    setMode('chat');
    
    // Add call end message
    const duration = formatTime(elapsedTime);
    addMessage('bot', `Voice call ended. Duration: ${duration}. Is there anything else I can help you with?`);
  };

  const setupWebRTCEventHandlers = (): (() => void) | null => {
    if (!webrtcRef.current) return null;

    // Since we can't directly modify the WebRTC class, we'll poll for status changes
    // In a real implementation, you'd extend WebRTCClient to emit custom events
    
    // For now, we'll simulate the event handling based on the WebRTC connection state
    const checkConnectionStatus = () => {
      if (!webrtcRef.current) return;
      
      // This is a simplified status check - in reality you'd want to listen to actual WebRTC events
      // The WebRTC client would need to be extended to emit events for:
      // - speech_started, speech_stopped, response_started, response_done, etc.
      
      // For demonstration, we'll simulate some status changes
      if (sessionStatus === 'connecting') {
        // Connection established, now listening
        setTimeout(() => {
          if (sessionStatus === 'connecting') {
            setSessionStatus('listening');
          }
        }, 2000);
      }
    };

    // Sync microphone mute state periodically
    const syncMicrophoneState = () => {
      if (webrtcRef.current) {
        const actualMutedState = webrtcRef.current.isMicrophoneMuted();
        if (actualMutedState !== micMuted) {
          setMicMuted(actualMutedState);
        }
      }
    };

    checkConnectionStatus();
    
    // Set up periodic sync for microphone state
    const syncInterval = setInterval(syncMicrophoneState, 1000);
    
    // Clean up interval when component unmounts or connection changes
    return () => {
      clearInterval(syncInterval);
    };
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    switch (sessionStatus) {
      case 'connecting': return 'Connecting...';
      case 'listening': return "I'm listening...";
      case 'speaking': return 'Speaking...';
      case 'thinking': return 'Thinking...';
      default: return 'Ready to connect';
    }
  };

  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'connecting': return '#ffc107';
      case 'listening': return '#28a745';
      case 'speaking': return '#007bff';
      case 'thinking': return '#6f42c1';
      default: return '#6c757d';
    }
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

  const handleStartVoiceFromWelcome = () => {
    handleStartVoiceCall();
  };

  const handleStartChatFromWelcome = () => {
    setMode('chat');
  };

  // Waveform component for voice call
  const Waveform = () => (
    <div className="flex items-center justify-center gap-1 h-12 mb-4">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`w-1.5 bg-blue-500 rounded-full transition-all duration-300 ${
            sessionStatus === 'listening' ? 'animate-pulse' : ''
          }`}
          style={{
            height: sessionStatus === 'listening' 
              ? `${Math.random() * 30 + 10}px` 
              : sessionStatus === 'speaking'
              ? `${Math.random() * 40 + 15}px`
              : '8px',
            animationDelay: `${i * 0.15}s`,
            backgroundColor: sessionStatus === 'speaking' ? '#10b981' : '#3b82f6'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed bottom-2.5 right-4 z-50">
      {/* Collapsed Call Widget */}
      {mode === 'call' && isCallCollapsed && (
        <div 
          className="mb-2.5 w-56 h-16 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 flex items-center justify-between px-4 transition-all duration-200 ease-in-out hover:shadow-xl cursor-pointer animate-bounce-in"
          onClick={() => setIsCallCollapsed(false)}
        >
          {/* Call Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: getStatusColor() }}
              />
              <span className="text-sm font-medium text-gray-700">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Mic Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newMutedState = !micMuted;
                setMicMuted(newMutedState);
                if (webrtcRef.current) {
                  webrtcRef.current.setMicrophoneMuted(newMutedState);
                }
              }}
              className={`p-2 rounded-full transition-colors ${
                micMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}
              title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {micMuted ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* End Call */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEndCall();
              }}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              title="End call"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.35-.12-.75-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.27-.27.36-.67.24-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z"/>
              </svg>
            </button>

            {/* Expand */}
            <button
              onClick={() => setIsCallCollapsed(false)}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors ml-1"
              title="Expand call"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Full Chat Widget */}
      {isOpen && !isCallCollapsed && (
        <div className="mb-2.5 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out transform">
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
                      onClick={handleStartVoiceFromWelcome}
                      disabled={sessionStatus === 'connecting'}
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer ${
                        sessionStatus === 'connecting' 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {sessionStatus === 'connecting' ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )}
                      {sessionStatus === 'connecting' ? 'Connecting...' : 'Start Voice Call'}
                    </button>
                    {sessionStatus !== 'connecting' && (
                      <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                        Recommended
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleStartChatFromWelcome}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.8-.45l-3.5 2.1a.5.5 0 01-.7-.65L7.5 18.5A8 8 0 1 1 21 12z" />
                    </svg>
                    Start Chat
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Voice calls provide faster, more personalized support
                </p>
              </div>
            </div>
          ) : mode === 'call' ? (
            // Voice Call Screen
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      F
                    </div>
                    {isConnected && (
                      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 block">Fathima - AI Assistant</span>
                    <span className="text-xs text-gray-500">{formatTime(elapsedTime)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsCallCollapsed(true)}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Minimize call"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Call Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                <div className="text-center mb-6">
                  <Waveform />
                  <p className="mt-2 text-sm text-gray-600 font-medium">{getStatusText()}</p>
                  <div className="flex items-center justify-center mt-2 gap-2">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: getStatusColor() }}
                    />
                    <span className="text-xs text-gray-500">
                      {isConnected ? 'Connected' : 'Connecting...'}
                    </span>
                  </div>
                  {error && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">⚠️ {error}</p>
                      <button
                        onClick={handleStartVoiceCall}
                        className="mt-1 text-xs text-red-700 underline hover:text-red-800 cursor-pointer"
                      >
                        Retry Connection
                      </button>
                    </div>
                  )}
                </div>

                {/* Call Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const newMutedState = !micMuted;
                      setMicMuted(newMutedState);
                      // Actually mute/unmute the microphone in WebRTC
                      if (webrtcRef.current) {
                        webrtcRef.current.setMicrophoneMuted(newMutedState);
                      }
                    }}
                    className={`p-3 rounded-full transition-colors ${
                      micMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {micMuted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                    title="End call"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.35-.12-.75-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.2c.27-.27.36-.67.24-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z"/>
                    </svg>
                  </button>

                  <button
                    onClick={() => setSpeakerOn(!speakerOn)}
                    className={`p-3 rounded-full transition-colors ${
                      speakerOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                    title={speakerOn ? 'Turn speaker off' : 'Turn speaker on'}
                  >
                    {speakerOn ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-3a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-3a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    onClick={() => setMode('chat')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    Switch to Chat
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Speak naturally - I can hear you and respond with voice or help with tasks
                  </p>
                </div>
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
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors cursor-pointer"
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
                    className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                  <button
                    onClick={handleStartVoiceCall}
                    disabled={sessionStatus === 'connecting'}
                    className={`p-2 rounded-lg transition-colors ${
                      sessionStatus === 'connecting'
                        ? 'border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer'
                    }`}
                    title={sessionStatus === 'connecting' ? 'Connecting...' : 'Start voice call'}
                  >
                    {sessionStatus === 'connecting' ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Button - only show when chat is closed and no collapsed call */}
      {!isOpen && !(mode === 'call' && isCallCollapsed) && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.8-.45l-3.5 2.1a.5.5 0 01-.7-.65L7.5 18.5A8 8 0 1 1 21 12z" />
          </svg>
        </button>
      )}
    </div>
  );
} 