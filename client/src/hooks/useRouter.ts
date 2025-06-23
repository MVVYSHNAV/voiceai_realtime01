import { useState, useEffect } from 'react';
import { getCurrentPath, onRouteChange, navigateTo } from '../utils/navigation';

export function useRouter() {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Set initial path using utility function
    setCurrentPath(getCurrentPath());

    // Listen for route changes using utility function
    const cleanup = onRouteChange((newPath) => {
      setCurrentPath(newPath);
    });

    // Cleanup listener on unmount
    return cleanup;
  }, []);

  // Use the utility function for navigation
  const navigate = (path: string) => {
    navigateTo(path);
  };

  return { currentPath, navigate };
} 