import { useEffect, useRef, useState } from 'react';
import { WebRTCClient } from './webrtc';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [outOfBandPrompt, setOutOfBandPrompt] = useState('');
  const [sendAsSystem, setSendAsSystem] = useState(false);
  const [autoContinueAfterSystem, setAutoContinueAfterSystem] = useState(true);
  const [showControls, setShowControls] = useState(false);
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
      webrtcRef.current = new WebRTCClient();
      await webrtcRef.current.initWebRTC();
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnected(false);
    }
  };

  const handleDisconnect = () => {
    webrtcRef.current?.cleanup();
    webrtcRef.current = null;
    setIsConnected(false);
  };

  const handleSendText = () => {
    if (!textInput.trim() || !webrtcRef.current) return;
    const role = sendAsSystem ? 'assistant' : 'user';
    webrtcRef.current.sendTextMessage(textInput, role);
    
    // If sending as system and auto-continue is enabled, send a follow-up user message
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
    webrtcRef.current.sendTextMessage('Please log hello to the console', 'user');
  };

  const handleSystemContextTest = () => {
    if (!webrtcRef.current) return;
    // Add assistant context first
    webrtcRef.current.sendTextMessage('You are now in testing mode. Be extra helpful and mention that you are in testing mode in your responses.', 'assistant');
    // Then send a user message
    setTimeout(() => {
      if (webrtcRef.current) {
        webrtcRef.current.sendTextMessage('Hello, how are you?', 'user');
      }
    }, 100);
  };

  const handleContinueConversation = () => {
    if (!webrtcRef.current) return;
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

  return (
    <div className="container">
      <h1>Voice Agent Demo</h1>
      
      <div className="controls">
        {!isConnected ? (
          <button onClick={handleConnect}>
            Connect to Voice Agent
          </button>
        ) : (
          <button onClick={handleDisconnect}>
            Disconnect
          </button>
        )}
      </div>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {isConnected && (
        <>
          <div className="status">
            Connected! Start speaking or use controls below...
          </div>

          <div className="controls-toggle">
            <button 
              onClick={() => setShowControls(!showControls)}
              className="toggle-button"
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
            </div>
          )}
        </>
      )}

      <style>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: system-ui, sans-serif;
        }

        .controls {
          margin: 2rem 0;
        }

        button {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          cursor: pointer;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          margin: 0.5rem;
        }

        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .error {
          color: red;
          margin: 1rem 0;
          padding: 1rem;
          background: #ffebee;
          border-radius: 5px;
        }

        .status {
          margin: 1rem 0;
          padding: 1rem;
          background: #e3f2fd;
          border-radius: 5px;
        }

        .controls-toggle {
          margin: 1rem 0;
          text-align: center;
        }

        .toggle-button {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.2s ease;
        }

        .toggle-button:hover {
          background: #e9e9e9;
          border-color: #bbb;
        }

        .text-controls {
          margin: 2rem 0;
          padding: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f9f9f9;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .text-controls h3 {
          margin: 1rem 0 0.5rem 0;
          color: #333;
        }

        .input-group {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .checkbox-group {
          margin: 0.5rem 0 1rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
        }

        .text-input {
          flex: 1;
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .quick-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .test-button {
          background: #28a745;
          padding: 0.75rem 1.5rem;
          font-size: 0.9rem;
        }

        .test-button:hover {
          background: #218838;
        }
      `}</style>
    </div>
  );
}

export default App; 