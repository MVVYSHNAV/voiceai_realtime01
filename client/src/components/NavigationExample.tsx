import { navigateTo, goBack, goForward, getCurrentPath, isCurrentPath } from '../utils/navigation';

/**
 * Example component demonstrating how to use navigation utilities
 * This can be used in any component throughout the application
 */
export function NavigationExample() {
  const currentPath = getCurrentPath();

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Navigation Utilities Example</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Current Path: <code className="bg-gray-100 px-2 py-1 rounded text-gray-900 font-mono text-xs">/{currentPath}</code>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Direct Navigation */}
        <button
          onClick={() => navigateTo('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isCurrentPath('') 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Go to Home
        </button>

        <button
          onClick={() => navigateTo('products')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isCurrentPath('products') 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Go to Products
        </button>

        {/* History Navigation */}
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          ← Back
        </button>

        <button
          onClick={goForward}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Forward →
        </button>
      </div>

      {/* Dynamic Navigation */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Dynamic Navigation:</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter path (e.g., products)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                navigateTo(target.value);
                target.value = '';
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              navigateTo(input.value);
              input.value = '';
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Navigate
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter or click Navigate to go to the entered path</p>
      </div>

      {/* Code Example */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Usage Examples:</h4>
        <pre className="text-xs text-gray-600 overflow-x-auto font-mono">
{`// Import the utility functions
import { navigateTo, goBack, getCurrentPath } from '../utils/navigation';

// Navigate to a specific page
navigateTo('products');
navigateTo(''); // Home page

// Go back/forward in history
goBack();
goForward();

// Get current path
const currentPath = getCurrentPath();

// Check if on specific path
if (isCurrentPath('products')) {
  // Do something when on products page
}`}
        </pre>
      </div>
    </div>
  );
} 