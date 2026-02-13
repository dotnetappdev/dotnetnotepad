import React, { useState } from 'react';
import './DatabasePanel.css';

interface QueryResult {
  columns: string[];
  rows: any[][];
}

const DatabasePanel: React.FC = () => {
  const [connectionString, setConnectionString] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    if (!connectionString.trim()) {
      setError('Please enter a connection string');
      return;
    }
    // Simulate connection
    setIsConnected(true);
    setError(null);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionString('');
    setQueryResult(null);
  };

  const handleExecuteQuery = () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    // Simulate query execution with sample data
    setError(null);
    
    if (query.toLowerCase().includes('select')) {
      // Simulate SELECT query result
      setQueryResult({
        columns: ['Id', 'Name', 'Email', 'CreatedDate'],
        rows: [
          [1, 'John Doe', 'john@example.com', '2024-01-15'],
          [2, 'Jane Smith', 'jane@example.com', '2024-01-16'],
          [3, 'Bob Johnson', 'bob@example.com', '2024-01-17'],
        ],
      });
    } else if (query.toLowerCase().includes('insert')) {
      setQueryResult({
        columns: ['Result'],
        rows: [['1 row(s) affected']],
      });
    } else if (query.toLowerCase().includes('update')) {
      setQueryResult({
        columns: ['Result'],
        rows: [['2 row(s) affected']],
      });
    } else if (query.toLowerCase().includes('delete')) {
      setQueryResult({
        columns: ['Result'],
        rows: [['1 row(s) affected']],
      });
    } else {
      setQueryResult({
        columns: ['Result'],
        rows: [['Query executed successfully']],
      });
    }
  };

  const handleEFQuery = () => {
    // Simulate EF Core query
    setQuery(`// EF Core Query Example
var users = await dbContext.Users
    .Where(u => u.IsActive)
    .OrderBy(u => u.CreatedDate)
    .ToListAsync();`);
  };

  return (
    <div className="database-panel">
      <div className="db-header">DATABASE</div>
      
      <div className="connection-section">
        <h3>Connection</h3>
        {!isConnected ? (
          <>
            <input
              type="text"
              className="connection-input"
              placeholder="Server=localhost;Database=MyDb;..."
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
            />
            <button className="connect-btn" onClick={handleConnect}>
              Connect
            </button>
          </>
        ) : (
          <div className="connected-status">
            <span className="status-icon">✓</span>
            <span>Connected</span>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      {isConnected && (
        <>
          <div className="query-section">
            <h3>Query</h3>
            <textarea
              className="query-input"
              placeholder="Enter SQL query or EF Core LINQ query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={6}
            />
            <div className="query-buttons">
              <button className="execute-btn" onClick={handleExecuteQuery}>
                Execute
              </button>
              <button className="ef-btn" onClick={handleEFQuery}>
                EF Core Example
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {queryResult && (
            <div className="results-section">
              <h3>Results</h3>
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="results-info">
                {queryResult.rows.length} row(s) returned
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DatabasePanel;
