import React, { useState } from 'react';
import './FileExplorer.css';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

interface FileExplorerProps {
  onFileOpen: (path: string, content: string, language: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileOpen }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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

  const renderNode = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expanded.has(node.path);
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

  return (
    <div className="file-explorer">
      <div className="explorer-header">EXPLORER</div>
      <div className="file-tree">
        {files.map(node => renderNode(node))}
      </div>
    </div>
  );
};

export default FileExplorer;
