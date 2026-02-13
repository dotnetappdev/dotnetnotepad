import React, { useState } from 'react';
import './SearchPanel.css';

interface SearchPanelProps {
  onSearch: (query: string) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-panel">
      <input
        type="text"
        className="search-input"
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {searchQuery && (
        <button
          className="search-clear"
          onClick={() => handleSearch('')}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchPanel;
