import React, { useState } from 'react';
import './MenuBar.css';

interface MenuBarProps {
  onNewFile: () => void;
  onSaveFile: () => void;
  onOpenFolder: () => void;
  onToggleCommandPalette: () => void;
  onToggleSearch: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onNewFile,
  onSaveFile,
  onOpenFolder,
  onToggleCommandPalette,
  onToggleSearch,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = {
    File: [
      { label: 'New File', action: onNewFile, shortcut: 'Ctrl+N' },
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
    Help: [
      { label: 'Documentation', action: () => console.log('Docs'), shortcut: 'F1' },
      { label: 'About', action: () => console.log('About'), shortcut: '' },
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
              {items.map((item, idx) =>
                item.label === 'divider' ? (
                  <div key={idx} className="menu-divider" />
                ) : (
                  <div
                    key={idx}
                    className="menu-dropdown-item"
                    onClick={() => handleMenuClick(item.action)}
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
