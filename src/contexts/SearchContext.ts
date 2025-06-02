import React from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
  setResultCount: (count: number) => void;
  currentSearchResult?: number;
  setCurrentSearchResult?: (current: number) => void;
  setOnNavigateNext?: (fn: (() => void) | undefined) => void;
  setOnNavigatePrev?: (fn: (() => void) | undefined) => void;
}

const SearchContext = React.createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  resultCount: 0,
  setResultCount: () => {},
  currentSearchResult: 0,
  setCurrentSearchResult: () => {},
  setOnNavigateNext: () => {},
  setOnNavigatePrev: () => {},
});

export default SearchContext;