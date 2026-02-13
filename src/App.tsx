import React, { useState } from 'react';
import FileExplorer from './components/FileExplorer';
import EditorPanel from './components/EditorPanel';
import BottomPanel from './components/BottomPanel';
import DatabasePanel from './components/DatabasePanel';
import './App.css';

interface OpenFile {
  path: string;
  content: string;
  language: string;
}

const App: React.FC = () => {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [showDatabase, setShowDatabase] = useState(false);

  const handleFileOpen = (path: string, content: string, language: string) => {
    const existingFile = openFiles.find(f => f.path === path);
    if (!existingFile) {
      setOpenFiles([...openFiles, { path, content, language }]);
    }
    setActiveFile(path);
  };

  const handleFileClose = (path: string) => {
    const newFiles = openFiles.filter(f => f.path !== path);
    setOpenFiles(newFiles);
    if (activeFile === path) {
      setActiveFile(newFiles.length > 0 ? newFiles[0].path : null);
    }
  };

  const handleContentChange = (path: string, content: string) => {
    setOpenFiles(openFiles.map(f => 
      f.path === path ? { ...f, content } : f
    ));
  };

  const activeFileObj = openFiles.find(f => f.path === activeFile);

  return (
    <div className="app">
      <div className="top-bar">
        <div className="title">.NET Notepad</div>
        <button 
          className="db-button" 
          onClick={() => setShowDatabase(!showDatabase)}
        >
          {showDatabase ? 'Hide' : 'Show'} Database
        </button>
      </div>
      <div className="main-container">
        <div className="sidebar">
          <FileExplorer onFileOpen={handleFileOpen} />
        </div>
        <div className="content">
          <EditorPanel
            openFiles={openFiles}
            activeFile={activeFile}
            onFileSelect={setActiveFile}
            onFileClose={handleFileClose}
            onContentChange={handleContentChange}
          />
          <BottomPanel />
        </div>
        {showDatabase && (
          <div className="database-panel">
            <DatabasePanel />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
