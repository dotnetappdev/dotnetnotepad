import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import SearchPanel from './SearchPanel';
import './Sidebar.css';

interface SidebarProps {
  onFileOpen: (path: string, content: string, language: string) => void;
  onSaveFile?: (path: string, content: string) => void;
}

type TabType = 'explorer' | 'search';

const Sidebar: React.FC<SidebarProps> = ({ onFileOpen, onSaveFile }) => {
  const [activeTab, setActiveTab] = useState<TabType>('explorer');

  return (
    <div className="sidebar-container">
      <div className="activity-bar">
        <button
          className={`activity-bar-item ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
          title="Explorer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8l2 2h8v14H3V3z" />
          </svg>
        </button>
        <button
          className={`activity-bar-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
          title="Search"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
      <div className="sidebar-content">
        {activeTab === 'explorer' && (
          <FileExplorer onFileOpen={onFileOpen} onSaveFile={onSaveFile} />
        )}
        {activeTab === 'search' && (
          <div className="search-view">
            <div className="explorer-header">SEARCH</div>
            <SearchPanel onSearch={(query) => {
              // TODO: Implement actual search functionality across workspace files
              console.log('Search:', query);
            }} />
            <div className="search-results">
              <p className="search-placeholder">Search files in your workspace...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
