import React, { useState, useRef, useEffect } from 'react';
import './ApiTester.css';

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Header[];
  body?: string;
  collectionId?: string;
}

interface Collection {
  id: string;
  name: string;
  requests: string[]; // Request IDs
}

interface ApiTesterProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

const ApiTester: React.FC<ApiTesterProps> = ({ initialData, onChange }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [bearerToken, setBearerToken] = useState<string>('');
  const [response, setResponse] = useState<{ status: number; data: any; headers: Record<string, string> } | null>(null);
  const [loading, setLoading] = useState(false);
  const idCounter = useRef(0);
  const onChangeRef = useRef(onChange);

  const generateId = (prefix: string): string => {
    idCounter.current += 1;
    return `${prefix}_${Date.now()}_${idCounter.current}`;
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        setCollections(data.collections || []);
        setRequests(data.requests || []);
        setBearerToken(data.bearerToken || '');
      } catch (e) {
        console.error('Failed to parse API tester data', e);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (onChangeRef.current) {
      const data = JSON.stringify({ collections, requests, bearerToken }, null, 2);
      onChangeRef.current(data);
    }
  }, [collections, requests, bearerToken]);

  const handleNewRequest = () => {
    const name = prompt('Enter request name:', 'New Request');
    if (name) {
      const newRequest: ApiRequest = {
        id: generateId('req'),
        name,
        method: 'GET',
        url: 'https://api.example.com/endpoint',
        headers: [
          { id: generateId('hdr'), key: 'Content-Type', value: 'application/json', enabled: true }
        ],
      };
      setRequests([...requests, newRequest]);
      setActiveRequest(newRequest.id);
    }
  };

  const handleNewCollection = () => {
    const name = prompt('Enter collection name:', 'New Collection');
    if (name) {
      const newCollection: Collection = {
        id: generateId('col'),
        name,
        requests: [],
      };
      setCollections([...collections, newCollection]);
    }
  };

  const handleSendRequest = async () => {
    const request = requests.find(r => r.id === activeRequest);
    if (!request) return;

    setLoading(true);
    setResponse(null);

    try {
      const headers: Record<string, string> = {};
      request.headers.filter(h => h.enabled && h.key).forEach(h => {
        headers[h.key] = h.value;
      });

      if (bearerToken && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
      }

      const fetchOptions: RequestInit = {
        method: request.method,
        headers,
      };

      if (request.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        fetchOptions.body = request.body;
      }

      const res = await fetch(request.url, fetchOptions);
      const data = await res.json().catch(async () => await res.text());
      
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        data,
        headers: responseHeaders,
      });

      // Auto-extract bearer token from login responses
      if (request.url.toLowerCase().includes('login') || request.url.toLowerCase().includes('auth')) {
        if (typeof data === 'object' && (data.token || data.access_token || data.bearerToken)) {
          const token = data.token || data.access_token || data.bearerToken;
          setBearerToken(token);
          alert('Bearer token automatically saved!');
        }
      }
    } catch (error: any) {
      setResponse({
        status: 0,
        data: { error: error.message },
        headers: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = (updates: Partial<ApiRequest>) => {
    if (activeRequest) {
      setRequests(requests.map(r => r.id === activeRequest ? { ...r, ...updates } : r));
    }
  };

  const handleAddHeader = () => {
    if (activeRequest) {
      const request = requests.find(r => r.id === activeRequest);
      if (request) {
        const newHeader: Header = {
          id: generateId('hdr'),
          key: '',
          value: '',
          enabled: true,
        };
        handleUpdateRequest({ headers: [...request.headers, newHeader] });
      }
    }
  };

  const handleUpdateHeader = (headerId: string, updates: Partial<Header>) => {
    if (activeRequest) {
      const request = requests.find(r => r.id === activeRequest);
      if (request) {
        handleUpdateRequest({
          headers: request.headers.map(h => h.id === headerId ? { ...h, ...updates } : h)
        });
      }
    }
  };

  const handleDeleteHeader = (headerId: string) => {
    if (activeRequest) {
      const request = requests.find(r => r.id === activeRequest);
      if (request) {
        handleUpdateRequest({
          headers: request.headers.filter(h => h.id !== headerId)
        });
      }
    }
  };

  const activeReq = requests.find(r => r.id === activeRequest);

  return (
    <div className="api-tester">
      <div className="api-sidebar">
        <div className="sidebar-header">
          <h3>Collections</h3>
          <button onClick={handleNewCollection} title="New Collection">➕</button>
        </div>
        <div className="collections-list">
          {collections.map(col => (
            <div key={col.id} className="collection-item">
              <div className="collection-name">📁 {col.name}</div>
            </div>
          ))}
        </div>
        <div className="sidebar-header">
          <h3>Requests</h3>
          <button onClick={handleNewRequest} title="New Request">➕</button>
        </div>
        <div className="requests-list">
          {requests.map(req => (
            <div
              key={req.id}
              className={`request-item ${activeRequest === req.id ? 'active' : ''}`}
              onClick={() => setActiveRequest(req.id)}
            >
              <span className={`method-badge ${req.method.toLowerCase()}`}>{req.method}</span>
              <span className="request-name">{req.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="api-main">
        <div className="api-toolbar">
          <div className="bearer-token-section">
            <label>Bearer Token:</label>
            <input
              type="text"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="Auto-saved from login responses"
            />
          </div>
        </div>

        {activeReq ? (
          <div className="api-request-panel">
            <div className="request-controls">
              <select
                value={activeReq.method}
                onChange={(e) => handleUpdateRequest({ method: e.target.value as any })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
              <input
                type="text"
                value={activeReq.url}
                onChange={(e) => handleUpdateRequest({ url: e.target.value })}
                placeholder="Enter request URL"
              />
              <button onClick={handleSendRequest} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>

            <div className="request-tabs">
              <div className="tab active">Headers</div>
              {(activeReq.method === 'POST' || activeReq.method === 'PUT' || activeReq.method === 'PATCH') && (
                <div className="tab">Body</div>
              )}
            </div>

            <div className="headers-section">
              <div className="headers-header">
                <button onClick={handleAddHeader}>+ Add Header</button>
              </div>
              <div className="headers-list">
                {activeReq.headers.map(header => (
                  <div key={header.id} className="header-row">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={(e) => handleUpdateHeader(header.id, { enabled: e.target.checked })}
                    />
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => handleUpdateHeader(header.id, { key: e.target.value })}
                      placeholder="Key"
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => handleUpdateHeader(header.id, { value: e.target.value })}
                      placeholder="Value"
                    />
                    <button onClick={() => handleDeleteHeader(header.id)}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {(activeReq.method === 'POST' || activeReq.method === 'PUT' || activeReq.method === 'PATCH') && (
              <div className="body-section">
                <textarea
                  value={activeReq.body || ''}
                  onChange={(e) => handleUpdateRequest({ body: e.target.value })}
                  placeholder="Request body (JSON)"
                />
              </div>
            )}

            {response && (
              <div className="response-section">
                <div className="response-header">
                  <h3>Response</h3>
                  <span className={`status-badge status-${Math.floor(response.status / 100)}`}>
                    {response.status}
                  </span>
                </div>
                <pre className="response-body">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No Request Selected</h2>
            <p>Create a new request or select one from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTester;
