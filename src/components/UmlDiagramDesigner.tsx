import React, { useState, useRef, useEffect } from 'react';
import './UmlDiagramDesigner.css';

interface Column {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isAutoIncrement?: boolean;
  isGuid?: boolean;
  foreignKeyReference?: string; // Format: "TableName.ColumnName"
}

interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: Column[];
}

interface Relationship {
  id: string;
  fromTableId: string;
  fromColumnId: string;
  toTableId: string;
  toColumnId: string;
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  direction: 'unidirectional' | 'bidirectional';
}

interface UmlDiagramDesignerProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

// SQL Standard Data Types
const SQL_DATA_TYPES = [
  // Numeric Types
  'int', 'bigint', 'smallint', 'tinyint', 'bit',
  'decimal', 'numeric', 'money', 'smallmoney',
  'float', 'real',
  
  // String Types
  'char', 'varchar', 'text',
  'nchar', 'nvarchar', 'ntext',
  
  // Date/Time Types
  'date', 'time', 'datetime', 'datetime2',
  'smalldatetime', 'datetimeoffset', 'timestamp',
  
  // Binary Types
  'binary', 'varbinary', 'image',
  
  // Other Types
  'uniqueidentifier', 'sql_variant', 'xml',
  'json', 'geography', 'geometry', 'hierarchyid'
];

const UmlDiagramDesigner: React.FC<UmlDiagramDesignerProps> = ({ initialData, onChange }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; columnId: string; tableId: string } | null>(null);
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<Partial<Relationship> | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);

  const generateId = (prefix: string): string => {
    idCounterRef.current += 1;
    return `${prefix}_${Date.now()}_${idCounterRef.current}`;
  };

  const onChangeRef = useRef(onChange);
  
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        setTables(data.tables || []);
        setRelationships(data.relationships || []);
      } catch (e) {
        console.error('Failed to parse UML data', e);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (onChangeRef.current) {
      const data = JSON.stringify({ tables, relationships }, null, 2);
      onChangeRef.current(data);
    }
  }, [tables, relationships]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedTable(null);
    }
  };

  const handleAddTable = () => {
    const newTable: Table = {
      id: generateId('table'),
      name: 'NewTable',
      x: 100,
      y: 100,
      columns: [
        {
          id: generateId('col'),
          name: 'Id',
          type: 'int',
          isPrimaryKey: true,
          isForeignKey: false,
        },
      ],
    };
    setTables([...tables, newTable]);
    setEditingTable(newTable);
    setShowTableEditor(true);
  };

  const handleTableMouseDown = (e: React.MouseEvent, tableId: string) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('table-header')) {
      e.stopPropagation();
      setDraggingTable(tableId);
      setSelectedTable(tableId);
      const table = tables.find(t => t.id === tableId);
      if (table && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left - table.x,
          y: e.clientY - rect.top - table.y,
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingTable && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      setTables(tables.map(t => 
        t.id === draggingTable ? { ...t, x, y } : t
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingTable(null);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable({ ...table });
    setShowTableEditor(true);
  };

  const handleSaveTable = () => {
    if (editingTable) {
      const existingIndex = tables.findIndex(t => t.id === editingTable.id);
      if (existingIndex >= 0) {
        const newTables = [...tables];
        newTables[existingIndex] = editingTable;
        setTables(newTables);
      } else {
        setTables([...tables, editingTable]);
      }
      
      // Update relationships based on foreign keys
      updateRelationships(editingTable);
    }
    setShowTableEditor(false);
    setEditingTable(null);
  };

  const updateRelationships = (table: Table) => {
    // Remove old relationships for this table
    const filteredRelationships = relationships.filter(
      r => r.fromTableId !== table.id
    );

    // Add new relationships based on foreign keys
    const newRelationships: Relationship[] = [];
    table.columns.forEach(col => {
      if (col.isForeignKey && col.foreignKeyReference) {
        const [refTableName, refColumnName] = col.foreignKeyReference.split('.');
        const refTable = tables.find(t => t.name === refTableName);
        const refColumn = refTable?.columns.find(c => c.name === refColumnName);
        
        if (refTable && refColumn) {
          newRelationships.push({
            id: generateId('rel'),
            fromTableId: table.id,
            fromColumnId: col.id,
            toTableId: refTable.id,
            toColumnId: refColumn.id,
            relationshipType: 'many-to-one', // Default
            direction: 'unidirectional', // Default
          });
        }
      }
    });

    setRelationships([...filteredRelationships, ...newRelationships]);
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Delete this table?')) {
      setTables(tables.filter(t => t.id !== tableId));
      setRelationships(relationships.filter(
        r => r.fromTableId !== tableId && r.toTableId !== tableId
      ));
      setSelectedTable(null);
    }
  };

  const handleAddColumn = () => {
    if (editingTable) {
      const newColumn: Column = {
        id: generateId('col'),
        name: 'NewColumn',
        type: 'varchar(50)',
        isPrimaryKey: false,
        isForeignKey: false,
      };
      setEditingTable({
        ...editingTable,
        columns: [...editingTable.columns, newColumn],
      });
    }
  };

  const handleUpdateColumn = (columnId: string, updates: Partial<Column>) => {
    if (editingTable) {
      setEditingTable({
        ...editingTable,
        columns: editingTable.columns.map(col =>
          col.id === columnId ? { ...col, ...updates } : col
        ),
      });
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (editingTable) {
      setEditingTable({
        ...editingTable,
        columns: editingTable.columns.filter(col => col.id !== columnId),
      });
    }
  };

  const handleColumnContextMenu = (e: React.MouseEvent, tableId: string, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tableId,
      columnId,
    });
  };

  const handleSetPrimaryKey = () => {
    if (contextMenu) {
      const table = tables.find(t => t.id === contextMenu.tableId);
      if (table) {
        const updatedTable = {
          ...table,
          columns: table.columns.map(col => ({
            ...col,
            isPrimaryKey: col.id === contextMenu.columnId ? !col.isPrimaryKey : col.isPrimaryKey,
          })),
        };
        setTables(tables.map(t => t.id === contextMenu.tableId ? updatedTable : t));
      }
    }
    setContextMenu(null);
  };

  const handleQuickAddColumn = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      const newColumn: Column = {
        id: generateId('col'),
        name: 'NewField',
        type: 'varchar(50)',
        isPrimaryKey: false,
        isForeignKey: false,
      };
      const updatedTable = {
        ...table,
        columns: [...table.columns, newColumn],
      };
      setTables(tables.map(t => t.id === tableId ? updatedTable : t));
    }
  };

  const handleQuickDeleteColumn = (tableId: string, columnId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.columns.length > 1) {
      const updatedTable = {
        ...table,
        columns: table.columns.filter(col => col.id !== columnId),
      };
      setTables(tables.map(t => t.id === tableId ? updatedTable : t));
    }
  };

  const handleSaveDiagram = () => {
    const data = JSON.stringify({ tables, relationships }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.uml.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadDiagram = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setTables(data.tables || []);
          setRelationships(data.relationships || []);
        } catch (error) {
          alert('Failed to load diagram file');
        }
      };
      reader.readAsText(file);
    }
  };

  const drawRelationshipLine = (rel: Relationship) => {
    const fromTable = tables.find(t => t.id === rel.fromTableId);
    const toTable = tables.find(t => t.id === rel.toTableId);
    
    if (!fromTable || !toTable) return null;

    const fromColumn = fromTable.columns.find(c => c.id === rel.fromColumnId);
    const toColumn = toTable.columns.find(c => c.id === rel.toColumnId);
    
    if (!fromColumn || !toColumn) return null;

    const fromColumnIndex = fromTable.columns.indexOf(fromColumn);
    const toColumnIndex = toTable.columns.indexOf(toColumn);

    // Calculate positions (approximate)
    const fromX = fromTable.x + 150;
    const fromY = fromTable.y + 40 + (fromColumnIndex * 25) + 12;
    const toX = toTable.x;
    const toY = toTable.y + 40 + (toColumnIndex * 25) + 12;

    // Calculate control points for curved line
    const midX = (fromX + toX) / 2;
    const path = `M ${fromX} ${fromY} Q ${midX} ${fromY}, ${midX} ${(fromY + toY) / 2} T ${toX} ${toY}`;

    // Determine line color and style based on relationship type
    const lineColor = rel.relationshipType === 'one-to-one' ? '#4CAF50' :
                      rel.relationshipType === 'one-to-many' ? '#2196F3' :
                      rel.relationshipType === 'many-to-one' ? '#FF9800' : '#9C27B0';

    // Markers for different relationship types
    const markerEnd = rel.relationshipType === 'one-to-many' ? 'url(#arrowhead-many)' : 
                      rel.relationshipType === 'many-to-one' ? 'url(#arrowhead)' :
                      'url(#arrowhead)';
    
    const markerStart = rel.direction === 'bidirectional' ? 'url(#arrowhead-reverse)' : '';

    return (
      <g key={rel.id} onClick={() => {
        setEditingRelationship(rel);
        setShowRelationshipDialog(true);
      }} style={{ cursor: 'pointer' }}>
        <path
          d={path}
          stroke={lineColor}
          strokeWidth="2"
          fill="none"
          markerEnd={markerEnd}
          markerStart={markerStart}
        />
        {rel.relationshipType === 'many-to-many' && (
          <circle cx={midX} cy={(fromY + toY) / 2} r="4" fill={lineColor} />
        )}
      </g>
    );
  };

  return (
    <div className="uml-diagram-designer">
      <div className="uml-toolbar">
        <button className="toolbar-btn" onClick={handleAddTable}>
          ➕ Add Table
        </button>
        <button className="toolbar-btn" onClick={handleSaveDiagram}>
          💾 Save Diagram
        </button>
        <label className="toolbar-btn" style={{ cursor: 'pointer' }}>
          📂 Load Diagram
          <input
            type="file"
            accept=".json,.uml"
            onChange={handleLoadDiagram}
            style={{ display: 'none' }}
          />
        </label>
        <div className="toolbar-info">
          {tables.length} table(s) | {relationships.length} relationship(s)
        </div>
      </div>
      
      <div
        ref={canvasRef}
        className="uml-canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg className="relationship-layer">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#4CAF50" />
            </marker>
            <marker
              id="arrowhead-many"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#2196F3" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="#2196F3" strokeWidth="2" />
            </marker>
            <marker
              id="arrowhead-reverse"
              markerWidth="10"
              markerHeight="10"
              refX="1"
              refY="3"
              orient="auto"
            >
              <polygon points="10 0, 0 3, 10 6" fill="#4CAF50" />
            </marker>
          </defs>
          {relationships.map(rel => drawRelationshipLine(rel))}
        </svg>

        {tables.map(table => (
          <div
            key={table.id}
            className={`uml-table ${selectedTable === table.id ? 'selected' : ''}`}
            style={{ left: table.x, top: table.y }}
            onMouseDown={(e) => handleTableMouseDown(e, table.id)}
            onDoubleClick={() => handleEditTable(table)}
          >
            <div className="table-header">
              {table.name}
            </div>
            <div className="table-columns">
              {table.columns.map(col => (
                <div 
                  key={col.id} 
                  className="table-column"
                  onContextMenu={(e) => handleColumnContextMenu(e, table.id, col.id)}
                >
                  {col.isPrimaryKey && <span className="pk-icon" title="Primary Key">🔑</span>}
                  {col.isForeignKey && <span className="fk-icon" title="Foreign Key">🔗</span>}
                  {col.isAutoIncrement && <span className="auto-icon" title="Auto Increment">🔢</span>}
                  {col.isGuid && <span className="guid-icon" title="GUID">🆔</span>}
                  <span className="column-name">{col.name}</span>
                  <span className="column-type">{col.type}</span>
                  <button
                    className="column-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickDeleteColumn(table.id, col.id);
                    }}
                    title="Delete Column"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="table-actions">
              <button
                className="table-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickAddColumn(table.id);
                }}
                title="Add Column"
              >
                ➕
              </button>
              <button
                className="table-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTable(table);
                }}
              >
                ✏️
              </button>
              <button
                className="table-action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTable(table.id);
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showTableEditor && editingTable && (
        <div className="table-editor-overlay">
          <div className="table-editor">
            <div className="editor-header">
              <h3>Edit Table</h3>
              <button className="close-btn" onClick={() => setShowTableEditor(false)}>✕</button>
            </div>
            
            <div className="editor-content">
              <div className="form-group">
                <label>Table Name:</label>
                <input
                  type="text"
                  value={editingTable.name}
                  onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                />
              </div>

              <div className="columns-section">
                <div className="section-header">
                  <h4>Columns</h4>
                  <button className="add-btn" onClick={handleAddColumn}>+ Add Column</button>
                </div>
                
                <div className="columns-list">
                  {editingTable.columns.map(col => (
                    <div key={col.id} className="column-editor">
                      <input
                        type="text"
                        className="column-name-input"
                        value={col.name}
                        onChange={(e) => handleUpdateColumn(col.id, { name: e.target.value })}
                        placeholder="Column name"
                      />
                      <select
                        className="column-type-input"
                        value={col.type}
                        onChange={(e) => handleUpdateColumn(col.id, { type: e.target.value })}
                      >
                        {SQL_DATA_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={col.isPrimaryKey}
                          onChange={(e) => handleUpdateColumn(col.id, { isPrimaryKey: e.target.checked })}
                        />
                        PK
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={col.isForeignKey}
                          onChange={(e) => handleUpdateColumn(col.id, { isForeignKey: e.target.checked })}
                        />
                        FK
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={col.isAutoIncrement || false}
                          onChange={(e) => handleUpdateColumn(col.id, { isAutoIncrement: e.target.checked })}
                        />
                        Auto++
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={col.isGuid || false}
                          onChange={(e) => handleUpdateColumn(col.id, { isGuid: e.target.checked })}
                        />
                        GUID
                      </label>
                      {col.isForeignKey && (
                        <input
                          type="text"
                          className="fk-reference-input"
                          value={col.foreignKeyReference || ''}
                          onChange={(e) => handleUpdateColumn(col.id, { foreignKeyReference: e.target.value })}
                          placeholder="Table.Column"
                        />
                      )}
                      <button
                        className="delete-column-btn"
                        onClick={() => handleDeleteColumn(col.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="editor-footer">
              <button className="cancel-btn" onClick={() => setShowTableEditor(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveTable}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className="context-menu"
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 2000 }}
          onClick={() => setContextMenu(null)}
        >
          <div className="context-menu-item" onClick={handleSetPrimaryKey}>
            Toggle Primary Key
          </div>
        </div>
      )}

      {showRelationshipDialog && editingRelationship && (
        <div className="table-editor-overlay">
          <div className="table-editor" style={{ width: '500px' }}>
            <div className="editor-header">
              <h3>Edit Relationship</h3>
              <button className="close-btn" onClick={() => setShowRelationshipDialog(false)}>✕</button>
            </div>
            
            <div className="editor-content">
              <div className="form-group">
                <label>Relationship Type:</label>
                <select
                  value={editingRelationship.relationshipType || 'many-to-one'}
                  onChange={(e) => {
                    const updatedRel = { ...editingRelationship, relationshipType: e.target.value as any };
                    setEditingRelationship(updatedRel);
                    if (editingRelationship.id) {
                      setRelationships(relationships.map(r =>
                        r.id === editingRelationship.id ? updatedRel as Relationship : r
                      ));
                    }
                  }}
                >
                  <option value="one-to-one">One-to-One</option>
                  <option value="one-to-many">One-to-Many</option>
                  <option value="many-to-one">Many-to-One</option>
                  <option value="many-to-many">Many-to-Many</option>
                </select>
              </div>

              <div className="form-group">
                <label>Direction:</label>
                <select
                  value={editingRelationship.direction || 'unidirectional'}
                  onChange={(e) => {
                    const updatedRel = { ...editingRelationship, direction: e.target.value as any };
                    setEditingRelationship(updatedRel);
                    if (editingRelationship.id) {
                      setRelationships(relationships.map(r =>
                        r.id === editingRelationship.id ? updatedRel as Relationship : r
                      ));
                    }
                  }}
                >
                  <option value="unidirectional">Unidirectional (→)</option>
                  <option value="bidirectional">Bidirectional (↔)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Color Legend:</label>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  <div style={{ color: '#4CAF50' }}>● One-to-One (Green)</div>
                  <div style={{ color: '#2196F3' }}>● One-to-Many (Blue)</div>
                  <div style={{ color: '#FF9800' }}>● Many-to-One (Orange)</div>
                  <div style={{ color: '#9C27B0' }}>● Many-to-Many (Purple)</div>
                </div>
              </div>
            </div>

            <div className="editor-footer">
              <button className="cancel-btn" onClick={() => setShowRelationshipDialog(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UmlDiagramDesigner;
