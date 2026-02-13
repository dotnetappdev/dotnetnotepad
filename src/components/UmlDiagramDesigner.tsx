import React, { useState, useRef, useEffect } from 'react';
import './UmlDiagramDesigner.css';

interface Column {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
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
}

interface UmlDiagramDesignerProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

const UmlDiagramDesigner: React.FC<UmlDiagramDesignerProps> = ({ initialData, onChange }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
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

    // Calculate arrow angle
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowLength = 10;
    const arrowAngle = Math.PI / 6;

    return (
      <g key={rel.id}>
        <path
          d={path}
          stroke="#4CAF50"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      </g>
    );
  };

  return (
    <div className="uml-diagram-designer">
      <div className="uml-toolbar">
        <button className="toolbar-btn" onClick={handleAddTable}>
          ➕ Add Table
        </button>
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
                <div key={col.id} className="table-column">
                  {col.isPrimaryKey && <span className="pk-icon" title="Primary Key">🔑</span>}
                  {col.isForeignKey && <span className="fk-icon" title="Foreign Key">🔗</span>}
                  <span className="column-name">{col.name}</span>
                  <span className="column-type">{col.type}</span>
                </div>
              ))}
            </div>
            <div className="table-actions">
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
                      <input
                        type="text"
                        className="column-type-input"
                        value={col.type}
                        onChange={(e) => handleUpdateColumn(col.id, { type: e.target.value })}
                        placeholder="Type"
                      />
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
    </div>
  );
};

export default UmlDiagramDesigner;
