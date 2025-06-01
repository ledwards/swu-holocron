import React from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = React.createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export default SearchContext;