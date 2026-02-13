# Building Desktop Applications

## Overview

.NET Notepad can be packaged as a desktop application for Windows, Linux, and Mac using Electron. This guide explains how to create executables and installers for each platform.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- For Windows: Windows 10 or later
- For Linux: Ubuntu 18.04+ or equivalent
- For Mac: macOS 10.13 or later

## Setup for Desktop Build

### 1. Install Electron and Builder Tools

```bash
npm install --save-dev electron electron-builder
```

### 2. Create Electron Main Process File

Create `electron.js` in the project root:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### 3. Update package.json

Add the following to `package.json`:

```json
{
  "main": "electron.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "NODE_ENV=development electron .",
    "pack": "electron-builder --dir",
    "dist": "npm run build && electron-builder",
    "dist:win": "npm run build && electron-builder --win",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:linux": "npm run build && electron-builder --linux"
  },
  "build": {
    "appId": "com.dotnetappdev.dotnetnotepad",
    "productName": ".NET Notepad",
    "copyright": "Copyright © 2026 dotnetappdev",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron.js",
      "package.json"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns",
      "category": "public.app-category.developer-tools"
    },
    "linux": {
      "target": [
        "AppImage",
        "deb",
        "rpm"
      ],
      "icon": "assets/icon.png",
      "category": "Development"
    }
  }
}
```

## Building Executables

### Windows

To build a Windows executable (.exe) and installer:

```bash
npm run dist:win
```

This creates:
- Portable executable: `release/.NET Notepad Setup 1.0.0.1.exe`
- NSIS installer for easy installation

The installer will:
- Install the application to Program Files
- Create desktop and start menu shortcuts
- Support uninstallation via Windows Settings

### Linux

To build Linux packages:

```bash
npm run dist:linux
```

This creates:
- **AppImage**: `release/.NET Notepad-1.0.0.1.AppImage` (universal, no installation needed)
- **DEB package**: `release/dotnetnotepad_1.0.0.1_amd64.deb` (for Debian/Ubuntu)
- **RPM package**: `release/dotnetnotepad-1.0.0.1.x86_64.rpm` (for Fedora/RedHat)

#### Installation on Linux

**AppImage (Universal):**
```bash
chmod +x '.NET Notepad-1.0.0.1.AppImage'
./.NET\ Notepad-1.0.0.1.AppImage
```

**Debian/Ubuntu:**
```bash
sudo dpkg -i dotnetnotepad_1.0.0.1_amd64.deb
```

**Fedora/RedHat:**
```bash
sudo rpm -i dotnetnotepad-1.0.0.1.x86_64.rpm
```

### macOS

To build a macOS application:

```bash
npm run dist:mac
```

This creates:
- **DMG installer**: `release/.NET Notepad-1.0.0.1.dmg`

#### Installation on macOS

1. Open the DMG file
2. Drag .NET Notepad to Applications folder
3. Launch from Applications or Spotlight

**Note**: First launch may require right-click → Open due to Gatekeeper security.

## Web Version

The web version continues to work without any changes:

```bash
npm start
```

Access at `http://localhost:3000`

## Cross-Platform Building

To build for all platforms at once:

```bash
npm run dist
```

**Note**: Building for macOS requires a Mac. Building for Windows on Linux/Mac requires Wine.

## Application Icons

Create icons for each platform:

1. **Windows**: `assets/icon.ico` (256x256 px)
2. **macOS**: `assets/icon.icns` (512x512 px)
3. **Linux**: `assets/icon.png` (512x512 px)

Use an icon generation tool or online service to create proper formats.

## Code Signing (Optional but Recommended)

### Windows
```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}
```

### macOS
```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

## Auto-Update Configuration

The "Check for Updates" feature in the About dialog already checks GitHub releases. To enable automatic background updates:

1. Publish releases on GitHub with version tags (e.g., `v1.0.0.1`)
2. Attach platform-specific installers to each release
3. The app will detect new versions and prompt users to download

## Distribution

### GitHub Releases
1. Tag version: `git tag v1.0.0.1`
2. Push tag: `git push origin v1.0.0.1`
3. Create release on GitHub
4. Upload built installers as release assets

### Alternative Distribution
- Microsoft Store (Windows)
- Snap Store (Linux)
- Mac App Store (macOS)

## Troubleshooting

### Windows Security Warning
Add code signing certificate or distribute via Microsoft Store.

### macOS Gatekeeper
Sign app with Apple Developer certificate or notarize.

### Linux Permissions
Ensure AppImage has executable permissions: `chmod +x file.AppImage`

## Support

For issues or questions:
- GitHub Issues: https://github.com/dotnetappdev/dotnetnotepad/issues
- Documentation: https://github.com/dotnetappdev/dotnetnotepad#readme
