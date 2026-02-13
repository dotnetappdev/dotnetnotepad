import React, { useState, useRef, useEffect } from 'react';
import './BottomPanel.css';

type TabType = 'terminal' | 'debug' | 'console' | 'results';

interface QueryResult {
  columns: string[];
  rows: any[][];
}

interface BottomPanelProps {
  consoleOutput?: string[];
  queryResults?: QueryResult | null;
}

const BottomPanel: React.FC<BottomPanelProps> = ({ consoleOutput = [], queryResults = null }) => {
  const [activeTab, setActiveTab] = useState<TabType>('console');
  const [viewMode, setViewMode] = useState<'grid' | 'text'>('grid');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> .NET Notepad Terminal',
    '> Type commands here...',
    '',
  ]);
  const [debugOutput, setDebugOutput] = useState<string[]>([
    '[Debug] Application started',
    '[Debug] Waiting for debug session...',
  ]);
  const [command, setCommand] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput, debugOutput, consoleOutput]);

  useEffect(() => {
    if (consoleOutput.length > 0) {
      setActiveTab('console');
    }
  }, [consoleOutput]);

  useEffect(() => {
    if (queryResults) {
      setActiveTab('results');
    }
  }, [queryResults]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newOutput = [...terminalOutput, `$ ${command}`];

    // Simulate command execution
    if (command.toLowerCase() === 'clear') {
      setTerminalOutput([]);
    } else if (command.toLowerCase() === 'help') {
      newOutput.push('Available commands:');
      newOutput.push('  help     - Show this help message');
      newOutput.push('  clear    - Clear terminal');
      newOutput.push('  dotnet   - Show .NET CLI info');
      newOutput.push('  ls       - List files');
      newOutput.push('  pwd      - Print working directory');
      setTerminalOutput(newOutput);
    } else if (command.toLowerCase().startsWith('dotnet')) {
      newOutput.push('.NET SDK Version: 8.0.100');
      newOutput.push('Runtime: .NET 8.0, .NET 9.0, .NET 10.0');
      newOutput.push('Framework: .NET Framework 4.8');
      newOutput.push('Ready for development!');
      setTerminalOutput(newOutput);
    } else if (command.toLowerCase() === 'ls') {
      newOutput.push('src/');
      newOutput.push('scripts/');
      newOutput.push('README.md');
      setTerminalOutput(newOutput);
    } else if (command.toLowerCase() === 'pwd') {
      newOutput.push('/home/workspace/dotnetnotepad');
      setTerminalOutput(newOutput);
    } else {
      newOutput.push(`Command not found: ${command}`);
      newOutput.push('Type "help" for available commands');
      setTerminalOutput(newOutput);
    }

    setCommand('');
  };

  const addDebugMessage = (message: string) => {
    setDebugOutput([...debugOutput, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'terminal':
        return (
          <div className="terminal-content">
            <div className="output">
              {terminalOutput.map((line, index) => (
                <div key={index} className="output-line">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleCommand} className="command-input">
              <span className="prompt">$</span>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Type a command..."
                autoFocus
              />
            </form>
          </div>
        );
      case 'debug':
        return (
          <div className="debug-content">
            <div className="output">
              {debugOutput.map((line, index) => (
                <div key={index} className="output-line">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <div className="debug-controls">
              <button onClick={() => addDebugMessage('Breakpoint hit at line 42')}>
                Add Debug Message
              </button>
            </div>
          </div>
        );
      case 'console':
        return (
          <div className="console-content">
            <div className="output">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((line, index) => (
                  <div key={index} className="output-line">
                    {line}
                  </div>
                ))
              ) : (
                <>
                  <div className="output-line">Console Output</div>
                  <div className="output-line">Ready to execute code...</div>
                </>
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="results-content">
            <div className="results-toolbar">
              <button 
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'text' ? 'active' : ''}`}
                onClick={() => setViewMode('text')}
              >
                Text
              </button>
            </div>
            {queryResults ? (
              viewMode === 'grid' ? (
                <div className="grid-view">
                  <table className="results-table">
                    <thead>
                      <tr>
                        {queryResults.columns.map((col, idx) => (
                          <th key={idx}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResults.rows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="results-footer">
                    {queryResults.rows.length} row(s) returned
                  </div>
                </div>
              ) : (
                <div className="text-view">
                  <pre>
                    {queryResults.columns.join('\t')}{'\n'}
                    {queryResults.columns.map(() => '---------').join('\t')}{'\n'}
                    {queryResults.rows.map(row => row.join('\t')).join('\n')}
                    {'\n\n'}({queryResults.rows.length} row(s) affected)
                  </pre>
                </div>
              )
            ) : (
              <div className="no-results">
                <p>No query results to display</p>
                <p>Execute a SQL query to see results here</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bottom-panel">
      <div className="panel-tabs">
        <div
          className={`panel-tab ${activeTab === 'terminal' ? 'active' : ''}`}
          onClick={() => setActiveTab('terminal')}
        >
          Terminal
        </div>
        <div
          className={`panel-tab ${activeTab === 'debug' ? 'active' : ''}`}
          onClick={() => setActiveTab('debug')}
        >
          Debug Output
        </div>
        <div
          className={`panel-tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </div>
        <div
          className={`panel-tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results {queryResults && `(${queryResults.rows.length})`}
        </div>
      </div>
      <div className="panel-content">{renderContent()}</div>
    </div>
  );
};

export default BottomPanel;
