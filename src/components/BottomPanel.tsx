import React, { useState, useRef, useEffect } from 'react';
import './BottomPanel.css';

type TabType = 'terminal' | 'debug' | 'console';

const BottomPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '> .NET Notepad Terminal',
    '> Type commands here...',
    '',
  ]);
  const [debugOutput, setDebugOutput] = useState<string[]>([
    '[Debug] Application started',
    '[Debug] Waiting for debug session...',
  ]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    'Console Output',
    'Application initialized',
  ]);
  const [command, setCommand] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput, debugOutput, consoleOutput]);

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

  const addConsoleMessage = (message: string) => {
    setConsoleOutput([...consoleOutput, message]);
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
              {consoleOutput.map((line, index) => (
                <div key={index} className="output-line">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <div className="console-controls">
              <button onClick={() => addConsoleMessage('Hello from Console!')}>
                Add Console Log
              </button>
              <button onClick={() => setConsoleOutput([])}>Clear</button>
            </div>
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
      </div>
      <div className="panel-content">{renderContent()}</div>
    </div>
  );
};

export default BottomPanel;
