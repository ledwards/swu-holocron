import React from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
  setResultCount: (count: number) => void;
}

const SearchContext = React.createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  resultCount: 0,
  setResultCount: () => {},
});

export default SearchContext;