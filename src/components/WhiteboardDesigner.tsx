import React, { useState, useRef, useEffect } from 'react';
import './WhiteboardDesigner.css';

interface DrawElement {
  id: string;
  type: 'rect' | 'text' | 'line' | 'arrow';
  x: number;
  y: number;
  width?: number;
  height?: number;
  x2?: number;
  y2?: number;
  text?: string;
  color: string;
  strokeColor?: string;
}

interface WhiteboardDesignerProps {
  initialData?: string;
  onChange?: (data: string) => void;
}

const WhiteboardDesigner: React.FC<WhiteboardDesignerProps> = ({ initialData, onChange }) => {
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [currentTool, setCurrentTool] = useState<'select' | 'rect' | 'text' | 'line' | 'arrow'>('select');
  const [currentColor, setCurrentColor] = useState('#4CAF50');
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const onChangeRef = useRef(onChange);

  const generateId = (): string => {
    idCounter.current += 1;
    return `element_${Date.now()}_${idCounter.current}`;
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        setElements(data.elements || []);
      } catch (e) {
        console.error('Failed to parse whiteboard data', e);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (onChangeRef.current) {
      const data = JSON.stringify({ elements }, null, 2);
      onChangeRef.current(data);
    }
  }, [elements]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'select') {
      // Check if clicking on an element
      const clickedElement = elements.find(el => {
        if (el.type === 'rect') {
          return x >= el.x && x <= (el.x + (el.width || 0)) &&
                 y >= el.y && y <= (el.y + (el.height || 0));
        }
        return false;
      });
      setSelectedElement(clickedElement?.id || null);
    } else {
      setDrawing(true);
      setStartPos({ x, y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Show preview (not implemented for simplicity)
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: DrawElement = {
      id: generateId(),
      type: currentTool as any,
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      color: currentColor,
    };

    if (currentTool === 'rect') {
      newElement.width = Math.abs(x - startPos.x);
      newElement.height = Math.abs(y - startPos.y);
    } else if (currentTool === 'line' || currentTool === 'arrow') {
      newElement.x2 = x;
      newElement.y2 = y;
    } else if (currentTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        newElement.text = text;
        newElement.width = 200;
        newElement.height = 40;
      } else {
        setDrawing(false);
        return;
      }
    }

    setElements([...elements, newElement]);
    setDrawing(false);
  };

  const handleDeleteSelected = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement));
      setSelectedElement(null);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all elements?')) {
      setElements([]);
      setSelectedElement(null);
    }
  };

  const colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#FFEB3B', '#000000', '#FFFFFF'];

  return (
    <div className="whiteboard-designer">
      <div className="whiteboard-toolbar">
        <div className="tool-group">
          <button
            className={`tool-btn ${currentTool === 'select' ? 'active' : ''}`}
            onClick={() => setCurrentTool('select')}
            title="Select"
          >
            ↖️
          </button>
          <button
            className={`tool-btn ${currentTool === 'rect' ? 'active' : ''}`}
            onClick={() => setCurrentTool('rect')}
            title="Rectangle"
          >
            ⬜
          </button>
          <button
            className={`tool-btn ${currentTool === 'text' ? 'active' : ''}`}
            onClick={() => setCurrentTool('text')}
            title="Text"
          >
            T
          </button>
          <button
            className={`tool-btn ${currentTool === 'line' ? 'active' : ''}`}
            onClick={() => setCurrentTool('line')}
            title="Line"
          >
            ─
          </button>
          <button
            className={`tool-btn ${currentTool === 'arrow' ? 'active' : ''}`}
            onClick={() => setCurrentTool('arrow')}
            title="Arrow"
          >
            →
          </button>
        </div>

        <div className="color-picker">
          {colors.map(color => (
            <div
              key={color}
              className={`color-swatch ${currentColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #ccc' : 'none' }}
              onClick={() => setCurrentColor(color)}
            />
          ))}
        </div>

        <div className="action-buttons">
          <button className="tool-btn" onClick={handleDeleteSelected} disabled={!selectedElement}>
            🗑️ Delete
          </button>
          <button className="tool-btn" onClick={handleClearAll}>
            🧹 Clear All
          </button>
        </div>

        <div className="toolbar-info">
          {elements.length} element(s)
        </div>
      </div>

      <div
        ref={canvasRef}
        className="whiteboard-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {elements.map(el => {
          if (el.type === 'rect') {
            return (
              <div
                key={el.id}
                className={`whiteboard-element rect ${selectedElement === el.id ? 'selected' : ''}`}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  backgroundColor: el.color,
                  opacity: 0.7,
                }}
              />
            );
          } else if (el.type === 'text') {
            return (
              <div
                key={el.id}
                className={`whiteboard-element text ${selectedElement === el.id ? 'selected' : ''}`}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  color: el.color,
                }}
              >
                {el.text}
              </div>
            );
          } else if (el.type === 'line' || el.type === 'arrow') {
            const length = Math.sqrt(
              Math.pow((el.x2 || 0) - el.x, 2) + Math.pow((el.y2 || 0) - el.y, 2)
            );
            const angle = Math.atan2((el.y2 || 0) - el.y, (el.x2 || 0) - el.x);

            return (
              <div
                key={el.id}
                className={`whiteboard-element line ${selectedElement === el.id ? 'selected' : ''}`}
                style={{
                  left: el.x,
                  top: el.y,
                  width: length,
                  transform: `rotate(${angle}rad)`,
                  backgroundColor: el.color,
                }}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default WhiteboardDesigner;
