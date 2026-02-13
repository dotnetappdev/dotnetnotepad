import React, { useState } from 'react';
import './FileExplorer.css';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

interface ContextMenu {
  x: number;
  y: number;
  node: FileNode;
}

interface FileExplorerProps {
  onFileOpen: (path: string, content: string, language: string) => void;
  onSaveFile?: (path: string, content: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileOpen, onSaveFile }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderPath, setFolderPath] = useState('/workspace');

  // Sample file structure - in a real app, this would come from a file system API
  const [files] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [
        { name: 'Program.cs', type: 'file', path: '/src/Program.cs' },
        { name: 'Startup.cs', type: 'file', path: '/src/Startup.cs' },
        {
          name: 'Controllers',
          type: 'folder',
          path: '/src/Controllers',
          children: [
            { name: 'HomeController.cs', type: 'file', path: '/src/Controllers/HomeController.cs' },
            { name: 'UserController.cs', type: 'file', path: '/src/Controllers/UserController.cs' },
          ]
        },
        {
          name: 'Models',
          type: 'folder',
          path: '/src/Models',
          children: [
            { name: 'User.cs', type: 'file', path: '/src/Models/User.cs' },
            { name: 'Product.cs', type: 'file', path: '/src/Models/Product.cs' },
          ]
        }
      ]
    },
    {
      name: 'scripts',
      type: 'folder',
      path: '/scripts',
      children: [
        { name: 'setup.py', type: 'file', path: '/scripts/setup.py' },
        { name: 'deploy.sql', type: 'file', path: '/scripts/deploy.sql' },
        { name: 'test.vb', type: 'file', path: '/scripts/test.vb' },
        { name: 'app.js', type: 'file', path: '/scripts/app.js' },
        { name: 'main.ts', type: 'file', path: '/scripts/main.ts' },
        { name: 'algorithm.pseudo', type: 'file', path: '/scripts/algorithm.pseudo' },
      ]
    },
    { name: 'README.md', type: 'file', path: '/README.md' },
  ]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'cs': 'csharp',
      'py': 'python',
      'sql': 'sql',
      'vb': 'vb',
      'vbs': 'vbscript',
      'js': 'javascript',
      'ts': 'typescript',
      'json': 'json',
      'xml': 'xml',
      'html': 'html',
      'css': 'css',
      'md': 'markdown',
      'pseudo': 'plaintext',
      'txt': 'plaintext',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const getSampleContent = (path: string): string => {
    const filename = path.split('/').pop() || '';
    
    if (filename.endsWith('.cs')) {
      return `using System;
using System.Collections.Generic;
using System.Linq;

namespace MyApp
{
    public class ${filename.replace('.cs', '')}
    {
        public void Main()
        {
            Console.WriteLine("Hello from .NET!");
        }
    }
}`;
    } else if (filename.endsWith('.py')) {
      return `# Python Script
import os
import sys

def main():
    print("Hello from Python!")
    
if __name__ == "__main__":
    main()`;
    } else if (filename.endsWith('.sql')) {
      return `-- SQL Script
SELECT * FROM Users
WHERE IsActive = 1
ORDER BY CreatedDate DESC;

-- Create table example
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Price DECIMAL(18,2)
);`;
    } else if (filename.endsWith('.vb')) {
      return `' VB.NET Code
Imports System

Module Program
    Sub Main(args As String())
        Console.WriteLine("Hello from VB.NET!")
    End Sub
End Module`;
    } else if (filename.endsWith('.js')) {
      return `// JavaScript Code
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello from JavaScript!' });
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    res.status(201).json({ success: true, data });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});`;
    } else if (filename.endsWith('.ts')) {
      return `// TypeScript Code
interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
}

class UserService {
    private users: User[] = [];

    constructor() {
        this.initializeUsers();
    }

    private initializeUsers(): void {
        this.users = [
            { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() }
        ];
    }

    public getUsers(): User[] {
        return this.users;
    }

    public getUserById(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    public addUser(user: Omit<User, 'id'>): User {
        const newUser: User = {
            ...user,
            id: this.users.length + 1
        };
        this.users.push(newUser);
        return newUser;
    }
}

// Usage
const userService = new UserService();
console.log('All users:', userService.getUsers());

const newUser = userService.addUser({
    name: 'Bob Johnson',
    email: 'bob@example.com',
    createdAt: new Date()
});
console.log('New user added:', newUser);`;
    } else if (filename.endsWith('.pseudo')) {
      return `ALGORITHM: Binary Search
INPUT: sorted array A, target value T
OUTPUT: index of T in A, or -1 if not found

PROCEDURE BinarySearch(A, T):
    left ← 0
    right ← length(A) - 1
    
    WHILE left ≤ right DO
        mid ← floor((left + right) / 2)
        
        IF A[mid] = T THEN
            RETURN mid
        ELSE IF A[mid] < T THEN
            left ← mid + 1
        ELSE
            right ← mid - 1
        END IF
    END WHILE
    
    RETURN -1
END PROCEDURE

EXAMPLE:
A = [1, 3, 5, 7, 9, 11]
T = 7
Result = BinarySearch(A, T) = 3`;
    }
    
    return `// Sample file: ${filename}\n// Add your code here`;
  };

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'file') {
      const content = getSampleContent(node.path);
      const language = getLanguage(node.name);
      onFileOpen(node.path, content, language);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node,
    });
  };

  const handleNewFile = (parentPath: string) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const newPath = `${parentPath}/${fileName}`;
      onFileOpen(newPath, '', getLanguage(fileName));
    }
    setContextMenu(null);
  };

  const handleNewCodeFile = (parentPath: string) => {
    const fileType = prompt('Enter file type (cs, py, js, ts, sql, vb):', 'cs');
    if (fileType) {
      const fileName = prompt('Enter file name (without extension):', 'newfile');
      if (fileName) {
        const fullFileName = `${fileName}.${fileType}`;
        const newPath = `${parentPath}/${fullFileName}`;
        onFileOpen(newPath, '', getLanguage(fullFileName));
      }
    }
    setContextMenu(null);
  };

  const handleNewFolder = (parentPath: string) => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      console.log('Create folder:', `${parentPath}/${folderName}`);
      // In a real app, this would create the folder
    }
    setContextMenu(null);
  };

  const handleRename = (node: FileNode) => {
    const newName = prompt('Enter new name:', node.name);
    if (newName && newName !== node.name) {
      console.log('Rename:', node.path, 'to', newName);
      // In a real app, this would rename the file/folder
    }
    setContextMenu(null);
  };

  const handleDeleteFile = (path: string) => {
    if (confirm(`Delete ${path}?`)) {
      console.log('Delete file:', path);
      // In a real app, this would delete the file
    }
    setContextMenu(null);
  };

  const handleOpenFolder = () => {
    const folder = prompt('Enter folder path:', folderPath);
    if (folder) {
      setFolderPath(folder);
      setFolderOpen(true);
      // Expand the root folders by default
      const newExpanded = new Set(expanded);
      files.forEach(node => {
        if (node.type === 'folder') {
          newExpanded.add(node.path);
        }
      });
      setExpanded(newExpanded);
    }
  };

  const handleCloseFolder = () => {
    setFolderOpen(false);
    setExpanded(new Set());
  };

  const handleWorkspaceToggle = () => {
    const allExpanded = files.every(f => f.type === 'file' || expanded.has(f.path));
    const newExpanded = new Set<string>();
    if (!allExpanded) {
      files.forEach(node => {
        if (node.type === 'folder') {
          newExpanded.add(node.path);
        }
      });
    }
    setExpanded(newExpanded);
  };

  const filterNodes = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query) return nodes;
    
    return nodes.reduce((acc: FileNode[], node) => {
      if (node.type === 'file' && node.name.toLowerCase().includes(query.toLowerCase())) {
        acc.push(node);
      } else if (node.type === 'folder' && node.children) {
        const filteredChildren = filterNodes(node.children, query);
        if (filteredChildren.length > 0 || node.name.toLowerCase().includes(query.toLowerCase())) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          });
        }
      }
      return acc;
    }, []);
  };

  const renderNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expanded.has(node.path) || searchQuery !== '';
    const icon = node.type === 'folder' 
      ? (isExpanded ? '📂' : '📁')
      : '📄';

    return (
      <div key={node.path}>
        <div
          className="file-node"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              handleFileClick(node);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          <span className="icon">{icon}</span>
          <span className="name">{node.name}</span>
        </div>
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredFiles = filterNodes(files, searchQuery);

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <span>EXPLORER</span>
        {folderOpen && (
          <button 
            className="header-action" 
            onClick={handleCloseFolder}
            title="Close Folder"
          >
            ×
          </button>
        )}
      </div>
      {!folderOpen ? (
        <div className="folder-actions">
          <button className="open-folder-btn" onClick={handleOpenFolder}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5l.01 4zm0-6.49h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99z"/>
            </svg>
            Open Folder
          </button>
          <p className="folder-hint">You have not yet opened a folder.</p>
        </div>
      ) : (
        <>
          <div className="workspace-section">
            <div className="workspace-header" onClick={handleWorkspaceToggle}>
              <span className="workspace-icon">
                {files.every(f => f.type === 'file' || expanded.has(f.path)) ? '▼' : '▶'}
              </span>
              <span className="workspace-name">
                {folderPath.replace(/[/\\]+$/, '').split(/[/\\]/).filter(Boolean).pop() || 'WORKSPACE'}
              </span>
            </div>
            <div className="file-tree">
              {filteredFiles.map(node => renderNode(node))}
            </div>
          </div>
        </>
      )}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu(null)}
        >
          <div className="context-menu-item" onClick={() => handleNewFile(contextMenu.node.path)}>
            New File
          </div>
          <div className="context-menu-item" onClick={() => handleNewCodeFile(contextMenu.node.path)}>
            New Code File
          </div>
          <div className="context-menu-item" onClick={() => handleNewFolder(contextMenu.node.path)}>
            New Folder
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item" onClick={() => handleRename(contextMenu.node)}>
            Rename
          </div>
          <div className="context-menu-item" onClick={() => console.log('Copy')}>
            Copy
          </div>
          <div className="context-menu-item" onClick={() => console.log('Paste')}>
            Paste
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item" onClick={() => handleDeleteFile(contextMenu.node.path)}>
            Delete
          </div>
          <div className="context-menu-divider" />
          <div className="context-menu-item" onClick={handleCloseFolder}>
            Close Folder
          </div>
        </div>
      )}
    </div>
  );
};


export default FileExplorer;
