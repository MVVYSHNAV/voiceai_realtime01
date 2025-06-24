/**
 * Navigate to a specific route using proper URL routing
 * @param path - The path to navigate to (e.g., '', 'products', 'util')
 * @param params - Optional query parameters
 */
export function navigateTo(path: string, params?: Record<string, string | number>): void {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Build the URL
  let url = `/${cleanPath}`;
  
  // Add query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  // Use pushState for proper routing
  window.history.pushState({}, '', url);
  
  // Dispatch a custom event to notify listeners
  window.dispatchEvent(new PopStateEvent('popstate'));
  
  // Also dispatch a custom locationchange event for additional reliability
  window.dispatchEvent(new CustomEvent('locationchange', { detail: { url, path: cleanPath, params } }));
}

/**
 * Get the current route path
 * @returns The current path without leading slash
 */
export function getCurrentPath(): string {
  const path = window.location.pathname;
  return path === '/' ? '' : path.slice(1);
}

/**
 * Get current URL search parameters
 * @returns URLSearchParams object
 */
export function getSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

/**
 * Get a specific query parameter value
 * @param key - The parameter key
 * @returns The parameter value or null if not found
 */
export function getQueryParam(key: string): string | null {
  return getSearchParams().get(key);
}

/**
 * Navigate back in browser history
 */
export function goBack(): void {
  window.history.back();
}

/**
 * Navigate forward in browser history
 */
export function goForward(): void {
  window.history.forward();
}

/**
 * Replace the current route without adding to history
 * @param path - The path to replace with
 * @param params - Optional query parameters
 */
export function replacePath(path: string, params?: Record<string, string | number>): void {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  let url = `/${cleanPath}`;
  
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  window.history.replaceState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
  
  // Also dispatch a custom locationchange event for additional reliability
  window.dispatchEvent(new CustomEvent('locationchange', { detail: { url, path: cleanPath, params } }));
}

/**
 * Check if the current path matches the given path
 * @param path - The path to check against
 * @returns True if the paths match
 */
export function isCurrentPath(path: string): boolean {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return getCurrentPath() === cleanPath;
}

/**
 * Add a listener for route changes
 * @param callback - Function to call when route changes
 * @returns Cleanup function to remove the listener
 */
export function onRouteChange(callback: (path: string) => void): () => void {
  const handlePopState = () => {
    callback(getCurrentPath());
  };

  window.addEventListener('popstate', handlePopState);

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
} 