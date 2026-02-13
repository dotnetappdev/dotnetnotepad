import React, { useState, useEffect } from 'react';
import MenuBar from './components/MenuBar';
import CommandPalette from './components/CommandPalette';
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
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [workspaceFolder, setWorkspaceFolder] = useState('/workspace');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, openFiles]);

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

  const handleNewFile = () => {
    const fileName = prompt('Enter file name:', 'newfile.cs');
    if (fileName) {
      handleFileOpen(`${workspaceFolder}/${fileName}`, '', 'plaintext');
    }
  };

  const handleSaveFile = () => {
    if (activeFile) {
      const file = openFiles.find(f => f.path === activeFile);
      if (file) {
        console.log('Saving file:', activeFile, file.content);
        alert(`File saved: ${activeFile}`);
      }
    }
  };

  const handleOpenFolder = () => {
    const folder = prompt('Enter workspace folder path:', workspaceFolder);
    if (folder) {
      setWorkspaceFolder(folder);
      console.log('Workspace folder set to:', folder);
    }
  };

  const commands = [
    { id: 'new-file', label: 'New File', action: handleNewFile, category: 'File' },
    { id: 'save-file', label: 'Save File', action: handleSaveFile, category: 'File' },
    { id: 'open-folder', label: 'Open Folder', action: handleOpenFolder, category: 'File' },
    { id: 'toggle-database', label: 'Toggle Database Panel', action: () => setShowDatabase(!showDatabase), category: 'View' },
    { id: 'close-file', label: 'Close File', action: () => activeFile && handleFileClose(activeFile), category: 'File' },
  ];

  const activeFileObj = openFiles.find(f => f.path === activeFile);

  return (
    <div className="app">
      <MenuBar
        onNewFile={handleNewFile}
        onSaveFile={handleSaveFile}
        onOpenFolder={handleOpenFolder}
        onToggleCommandPalette={() => setShowCommandPalette(true)}
        onToggleSearch={() => setShowSearch(!showSearch)}
      />
      <div className="main-container">
        <div className="sidebar">
          <FileExplorer onFileOpen={handleFileOpen} onSaveFile={handleSaveFile} />
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
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
      />
    </div>
  );
};

export default App;
