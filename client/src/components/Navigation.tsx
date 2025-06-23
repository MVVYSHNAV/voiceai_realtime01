import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { navigateTo } from '../utils/navigation';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navigation({ currentPath, onNavigate }: NavigationProps) {
  const { getCartItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { path: '', label: 'Home' },
    { path: 'products', label: 'Products' },
    { path: 'util', label: 'Utilities' },
  ];

  const handleNavigation = (path: string) => {
    navigateTo(path);
    onNavigate(path);
    setIsMenuOpen(false); // Close menu on navigation
  };

  return (
    <>
      {/* Minimal Top Bar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <button 
              onClick={() => handleNavigation('')}
              className="text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Voice Agent
            </button>
            
            {/* Right Side - Menu + Cart */}
            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`text-sm font-medium transition-colors ${
                      currentPath === item.path 
                        ? 'text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Cart Icon */}
              {getCartItemCount() > 0 && (
                <div className="relative">
                  <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7" />
                    </svg>
                    <span>{getCartItemCount()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === item.path 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
} 