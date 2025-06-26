// hooks/useRouter.ts
import { useEffect, useState } from 'react';
import { getCurrentPath, onRouteChange } from '../utils/navigation';

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());

  useEffect(() => {
    const cleanup = onRouteChange(setCurrentPath);
    return cleanup;
  }, []);

  const navigate = (path: string, params?: Record<string, string | number>) => {
    window.scrollTo(0, 0); // optional: scroll to top
    import('../utils/navigation').then(nav => nav.navigateTo(path, params));
  };

  return { currentPath, navigate };
}
