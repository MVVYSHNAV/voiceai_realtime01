import { RealtimeCall } from './RealtimeCall';
import { navigateTo } from '../utils/navigation';

export function Homepage() {
  const handleGetStarted = () => {
    // Navigate to products page
    navigateTo('products');
  };

  const handleLearnMore = () => {
    // Scroll to the voice agent section
    const voiceAgentSection = document.querySelector('.voice-agent-section');
    if (voiceAgentSection) {
      voiceAgentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="py-32 px-4 text-center bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6 text-gray-900">
            Voice Agent
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Reimagined</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the future of AI conversation with our advanced voice agent. 
            Natural, intelligent, and always ready to help.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={handleGetStarted}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-all duration-200"
            >
              Get Started
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-transparent text-gray-900 border border-gray-300 px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 tracking-tight">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-6">🎤</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Natural Voice</h3>
              <p className="text-gray-600 text-base leading-6">Advanced speech recognition and synthesis for natural conversations</p>
            </div>
            <div className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-6">🧠</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart AI</h3>
              <p className="text-gray-600 text-base leading-6">Powered by cutting-edge AI models for intelligent responses</p>
            </div>
            <div className="text-center p-8 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Real-time</h3>
              <p className="text-gray-600 text-base leading-6">Instant responses with low-latency voice processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight text-gray-900">Built with Modern Technology</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our voice agent leverages the latest in AI and web technologies 
                to deliver an exceptional user experience. From WebRTC for 
                real-time communication to advanced language models for 
                intelligent responses.
              </p>
              <ul className="space-y-3">
                <li className="text-base text-gray-600 flex items-center">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  WebRTC for real-time audio
                </li>
                <li className="text-base text-gray-600 flex items-center">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  OpenAI Realtime API
                </li>
                <li className="text-base text-gray-600 flex items-center">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  Advanced tool calling
                </li>
                <li className="text-base text-gray-600 flex items-center">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  Secure token-based authentication
                </li>
              </ul>
            </div>
            <div className="flex justify-center items-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <div className="text-4xl font-bold text-white">AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 text-center bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">Ready to Experience the Future?</h2>
          <p className="text-xl text-gray-600">Try our voice agent below and see the magic happen</p>
        </div>
      </section>

      {/* Voice Agent Section */}
      <section className="py-12 bg-gray-50 voice-agent-section">
        <div className="container mx-auto px-4">
          <RealtimeCall />
        </div>
      </section>
    </div>
  );
} 