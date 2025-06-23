import { useEffect, useRef, useState } from 'react';
import { WebRTCClient } from '../webrtc';
import './RealtimeCall.css';
import Altair from './altrail';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export function RealtimeCall() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [outOfBandPrompt, setOutOfBandPrompt] = useState('');
  const [sendAsSystem, setSendAsSystem] = useState(false);
  const [autoContinueAfterSystem, setAutoContinueAfterSystem] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [logSystemEvents, setLogSystemEvents] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const webrtcRef = useRef<WebRTCClient | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup WebRTC on unmount
      webrtcRef.current?.cleanup();
    };
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      setSessionStatus('connecting');
      webrtcRef.current = new WebRTCClient({ logSystemEvents });
      await webrtcRef.current.initWebRTC();
      setIsConnected(true);
      setSessionStatus('listening');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
      setSessionStatus('idle');
    }
  };

  const handleDisconnect = () => {
    webrtcRef.current?.cleanup();
    webrtcRef.current = null;
    setIsConnected(false);
    setSessionStatus('idle');
    setMessages([]);
  };

  const addMessage = (type: 'user' | 'assistant' | 'system', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendText = () => {
    if (!textInput.trim() || !webrtcRef.current) return;
    const role = sendAsSystem ? 'assistant' : 'user';
    
    addMessage(role, textInput);
    webrtcRef.current.sendTextMessage(textInput, role);
    
    if (sendAsSystem && autoContinueAfterSystem) {
      setTimeout(() => {
        if (webrtcRef.current) {
          webrtcRef.current.sendTextMessage('continue.', 'user');
        }
      }, 100);
    }
    
    setTextInput('');
  };

  const handleSendOutOfBand = () => {
    if (!outOfBandPrompt.trim() || !webrtcRef.current) return;
    webrtcRef.current.sendOutOfBandRequest(outOfBandPrompt, { topic: 'custom' });
    setOutOfBandPrompt('');
  };

  const handleQuickTest = () => {
    if (!webrtcRef.current) return;
    addMessage('user', 'Please log hello to the console');
    webrtcRef.current.sendTextMessage('Please log hello to the console', 'user');
  };

  const handleSystemContextTest = () => {
    if (!webrtcRef.current) return;
    webrtcRef.current.sendTextMessage('You are now in testing mode. Be extra helpful and mention that you are in testing mode in your responses.', 'assistant');
    setTimeout(() => {
      if (webrtcRef.current) {
        addMessage('user', 'Hello, how are you?');
        webrtcRef.current.sendTextMessage('Hello, how are you?', 'user');
      }
    }, 100);
  };

  const handleContinueConversation = () => {
    if (!webrtcRef.current) return;
    addMessage('user', 'Please continue our conversation based on the context provided.');
    webrtcRef.current.sendTextMessage('Please continue our conversation based on the context provided.', 'user');
  };

  const handleTriggerResponse = () => {
    if (!webrtcRef.current) return;
    webrtcRef.current.triggerResponse();
  };

  const handleClassificationTest = () => {
    if (!webrtcRef.current) return;
    const prompt = `
Analyze the conversation so far. If it is related to support, output
"support". If it is related to sales, output "sales". If it's related to 
testing or development, output "testing".
    `;
    webrtcRef.current.sendOutOfBandRequest(prompt, { topic: 'classification' });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const handleLogSystemEventsChange = (enabled: boolean) => {
    setLogSystemEvents(enabled);
    if (webrtcRef.current) {
      webrtcRef.current.setLogSystemEvents(enabled);
    }
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

  return (
    <div className="realtime-call">
      {/* Compact Call Interface */}
      <div className="call-interface">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="profile-image">
              <img src="/ai-fathima-dp.png" alt="Fathima" />
            </div>
            {isConnected && (
              <div className={`waveform-animation ${isAnimating ? 'active' : ''}`}>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            )}
          </div>
          <div className="contact-details">
            <h1>Fathima</h1>
            <p className="subtitle">Intelligent Assistant</p>
            <div className="status-indicator">
              <div 
                className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}
                style={{ backgroundColor: getStatusColor() }}
              />
              <span className="status-text">{getStatusText()}</span>
            </div>
          </div>
        </div>
        
        
        
      </div>
      <Altair/>

      {/* Transcript Feed - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="transcript-feed">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Advanced Controls Toggle */}
      {isConnected && (
        <>
          <div className="controls-toggle">
            <button 
              onClick={() => setShowControls(!showControls)}
              className="toggle-link"
            >
              {showControls ? '▼ Hide Controls' : '▶ Show Controls'}
            </button>
          </div>

          {showControls && (
            <div className="text-controls">
              <h3>Send Text Message</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSendText)}
                  placeholder="Type your message here..."
                  className="text-input"
                />
                <button onClick={handleSendText} disabled={!textInput.trim()}>
                  Send
                </button>
              </div>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={sendAsSystem}
                    onChange={(e) => setSendAsSystem(e.target.checked)}
                  />
                  Send as system (discrete context)
                </label>
                {sendAsSystem && (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={autoContinueAfterSystem}
                      onChange={(e) => setAutoContinueAfterSystem(e.target.checked)}
                    />
                    Auto-continue conversation after system message
                  </label>
                )}
              </div>

              <h3>Out-of-Band Requests</h3>
              <div className="input-group">
                <input
                  type="text"
                  value={outOfBandPrompt}
                  onChange={(e) => setOutOfBandPrompt(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSendOutOfBand)}
                  placeholder="Enter custom prompt for out-of-band request..."
                  className="text-input"
                />
                <button onClick={handleSendOutOfBand} disabled={!outOfBandPrompt.trim()}>
                  Send OOB
                </button>
              </div>

              <h3>Quick Tests</h3>
              <div className="quick-buttons">
                <button onClick={handleQuickTest} className="test-button">
                  Test Tool Call (Log Hello)
                </button>
                <button onClick={handleSystemContextTest} className="test-button">
                  Test System Context
                </button>
                <button onClick={handleContinueConversation} className="test-button">
                  Continue Conversation
                </button>
                <button onClick={handleTriggerResponse} className="test-button">
                  Trigger Response
                </button>
                <button onClick={handleClassificationTest} className="test-button">
                  Test Classification (Out-of-Band)
                </button>
              </div>

              <h3>System Logging</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={logSystemEvents}
                    onChange={(e) => handleLogSystemEventsChange(e.target.checked)}
                  />
                  Log System Events (WebRTC events, responses, etc.)
                </label>
              </div>
            </div>
            
          )}

          
        </>
        
      )}
      <div className="call-controls">
          {!isConnected ? (
            <button onClick={handleConnect} className="call-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="white"/>
              </svg>
            </button>
          ) : (
            <button onClick={handleDisconnect} className="disconnect-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="white"/>
              </svg>
            </button>
          )}
        </div>
    </div>
  );
} 