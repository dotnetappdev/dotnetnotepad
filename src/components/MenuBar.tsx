import React, { useState } from 'react';
import './MenuBar.css';

interface OpenFile {
  path: string;
  content: string;
  language: string;
  isUmlDiagram?: boolean;
  isWhiteboard?: boolean;
  isApiTester?: boolean;
}

interface MenuBarProps {
  onNewFile: () => void;
  onNewUmlDiagram: () => void;
  onNewCodeFile: () => void;
  onNewWhiteboard: () => void;
  onNewApiTester: () => void;
  onNewDotnetConsole: () => void;
  onNewDotnetWebApi: () => void;
  onSaveFile: () => void;
  onOpenFolder: () => void;
  onToggleCommandPalette: () => void;
  onToggleSearch: () => void;
  onAbout: () => void;
  openFiles: OpenFile[];
  activeFile: string | null;
  onSwitchFile: (path: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onNewFile,
  onNewUmlDiagram,
  onNewCodeFile,
  onNewWhiteboard,
  onNewApiTester,
  onNewDotnetConsole,
  onNewDotnetWebApi,
  onSaveFile,
  onOpenFolder,
  onToggleCommandPalette,
  onToggleSearch,
  onAbout,
  openFiles,
  activeFile,
  onSwitchFile,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getFileDisplayName = (file: OpenFile): string => {
    const fileName = file.path.split('/').pop() || file.path;
    if (file.isUmlDiagram) return `📊 ${fileName}`;
    if (file.isWhiteboard) return `🎨 ${fileName}`;
    if (file.isApiTester) return `🔌 ${fileName}`;
    return `📄 ${fileName}`;
  };

  const menus = {
    File: [
      { label: 'New File', action: onNewFile, shortcut: 'Ctrl+N' },
      { label: 'New Code File', action: onNewCodeFile, shortcut: 'Ctrl+Alt+N' },
      { label: 'New UML Diagram', action: onNewUmlDiagram, shortcut: 'Ctrl+Alt+U' },
      { label: 'New Whiteboard', action: onNewWhiteboard, shortcut: '' },
      { label: 'New API Tester', action: onNewApiTester, shortcut: '' },
      { label: 'divider', action: () => {}, shortcut: '' },
      { label: 'New .NET Console App', action: onNewDotnetConsole, shortcut: '' },
      { label: 'New .NET Web API', action: onNewDotnetWebApi, shortcut: '' },
      { label: 'divider', action: () => {}, shortcut: '' },
      { label: 'Open Folder...', action: onOpenFolder, shortcut: 'Ctrl+O' },
      { label: 'Save', action: onSaveFile, shortcut: 'Ctrl+S' },
      { label: 'divider', action: () => {}, shortcut: '' },
      { label: 'Exit', action: () => console.log('Exit'), shortcut: 'Alt+F4' },
    ],
    Edit: [
      { label: 'Cut', action: () => console.log('Cut'), shortcut: 'Ctrl+X' },
      { label: 'Copy', action: () => console.log('Copy'), shortcut: 'Ctrl+C' },
      { label: 'Paste', action: () => console.log('Paste'), shortcut: 'Ctrl+V' },
      { label: 'divider', action: () => {}, shortcut: '' },
      { label: 'Find', action: onToggleSearch, shortcut: 'Ctrl+F' },
      { label: 'Replace', action: () => console.log('Replace'), shortcut: 'Ctrl+H' },
    ],
    View: [
      { label: 'Command Palette', action: onToggleCommandPalette, shortcut: 'Ctrl+Shift+P' },
      { label: 'Explorer', action: () => console.log('Explorer'), shortcut: 'Ctrl+Shift+E' },
      { label: 'Search', action: onToggleSearch, shortcut: 'Ctrl+Shift+F' },
      { label: 'divider', action: () => {}, shortcut: '' },
      { label: 'Terminal', action: () => console.log('Terminal'), shortcut: 'Ctrl+`' },
    ],
    Window: openFiles.length === 0 ? [
      { label: 'No files open', action: () => {}, shortcut: '', disabled: true },
    ] : openFiles.map((file, index) => ({
      label: getFileDisplayName(file),
      action: () => onSwitchFile(file.path),
      shortcut: index < 9 ? `Ctrl+${index + 1}` : '',
      isActive: file.path === activeFile,
    })),
    Help: [
      { label: 'Documentation', action: () => window.open('https://github.com/dotnetappdev/dotnetnotepad#readme', '_blank'), shortcut: 'F1' },
      { label: 'About', action: onAbout, shortcut: '' },
    ],
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuClick = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  return (
    <div className="menu-bar">
      {Object.entries(menus).map(([menuName, items]) => (
        <div key={menuName} className="menu-item">
          <div className="menu-label" onClick={() => toggleMenu(menuName)}>
            {menuName}
          </div>
          {activeMenu === menuName && (
            <div className="menu-dropdown">
              {items.map((item: any, idx) =>
                item.label === 'divider' ? (
                  <div key={idx} className="menu-divider" />
                ) : (
                  <div
                    key={idx}
                    className={`menu-dropdown-item ${item.isActive ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
                    onClick={() => !item.disabled && handleMenuClick(item.action)}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="shortcut">{item.shortcut}</span>}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;
