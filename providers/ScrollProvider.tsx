import { createContext, useContext, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

interface ScrollContextType {
  registerScrollView: (key: string, ref: React.RefObject<ScrollView>) => void;
  unregisterScrollView: (key: string) => void;
  syncScroll: (key: string, y: number) => void;
  currentScrollY: number;
}

const defaultContext: ScrollContextType = {
  registerScrollView: () => {},
  unregisterScrollView: () => {},
  syncScroll: () => {},
  currentScrollY: 0,
};

const ScrollContext = createContext<ScrollContextType>(defaultContext);

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollViewsRef = useRef<Map<string, React.RefObject<ScrollView>>>(new Map());
  const isScrollingRef = useRef<Set<string>>(new Set());
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const registerScrollView = (key: string, ref: React.RefObject<ScrollView>) => {
    scrollViewsRef.current.set(key, ref);
    // Set initial scroll position for newly registered views
    if (ref.current) {
      ref.current.scrollTo({ y: currentScrollY, animated: false });
    }
  };

  const unregisterScrollView = (key: string) => {
    scrollViewsRef.current.delete(key);
  };

  const syncScroll = (sourceKey: string, y: number) => {
    // Clear any pending timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Update scroll position state
    setCurrentScrollY(y);

    // If this view is already being scrolled programmatically, ignore the event
    if (isScrollingRef.current.has(sourceKey)) return;

    // Mark this view as the source of scrolling
    isScrollingRef.current.add(sourceKey);

    // Sync all other views
    scrollViewsRef.current.forEach((scrollRef, key) => {
      if (key !== sourceKey && scrollRef.current) {
        scrollRef.current.scrollTo({ y, animated: false });
      }
    });

    // Clear the scroll lock after a brief delay
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current.delete(sourceKey);
    }, 16);
  };

  const value = {
    registerScrollView,
    unregisterScrollView,
    syncScroll,
    currentScrollY,
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}