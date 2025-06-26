import { useState } from 'react';
import { navigateTo } from '../utils/navigation';
import { useCartContext } from '../context/CartContext';

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navigation({ currentPath, onNavigate }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCartContext();

  // ✅ Fix: cartCount is a number, not a function
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { path: '', label: 'Home' },
    { path: 'products', label: 'Products' },
    { path: 'util', label: 'Utilities' },
    { path: 'toolCheck', label: 'ToolCheck' }
  ];

  const handleNavigation = (path: string) => {
    navigateTo(path);
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <button
              onClick={() => handleNavigation('')}
              className="text-lg font-bold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Tomorrow
            </button>

            {/* Desktop Navigation & Cart */}
            <div className="flex items-center gap-4">
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

              {/* Mobile Menu Toggle */}
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
              <button
                onClick={() => handleNavigation('Cart')}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7"
                  />
                </svg>
                {/* ✅ FIXED: Don't call cartCount like a function */}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
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

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
