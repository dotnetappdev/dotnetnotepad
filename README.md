# .NET Notepad

A comprehensive TypeScript-based .NET notepad application with VS Code-like features, Monaco Editor, database connectivity, code execution, and multi-language support.

## ✨ Key Features

### 🎨 Monaco Editor Integration
- **VS Code's Monaco Editor** with full local loading (no CDN dependencies)
- **Syntax highlighting** for C#, JavaScript, TypeScript, Python, VB.NET, VBScript, SQL, Pseudocode, and more
- **IntelliSense with dot notation** - Type `.` after variables to see context-aware suggestions
- **Line numbers, minimap, and code folding**
- **Multi-file tabs** with close buttons
- **Format on type** and paste

### 🎯 Enhanced .NET IntelliSense
- **Dot notation support**: Type `Console.` to see WriteLine, Write, ReadLine methods
- **LINQ completions**: After collections, see Where, Select, OrderBy, ToList, Count, Any, etc.
- **Method signatures and documentation** for all suggestions
- **Snippet support** with placeholders for quick code generation
- Supports .NET 8, 9, 10, and Framework

### ⚡ Visual Studio-Style Execution Controls
- **Green Play button (▶)** - Start code execution
- **Yellow Pause button (⏸)** - Pause running code (appears when executing)
- **Red Stop button (⏹)** - Stop execution (appears when executing)
- **F5 keyboard shortcut** for quick execution
- **Real-time execution state** with visual feedback

### 📁 File Management
- **Left sidebar explorer** with expandable folder tree
- **Search panel** at top with real-time file filtering
- **Right-click context menu**: New File, Copy, Paste, Delete
- **Workspace folder setting** via Open Folder command
- **File save** (Ctrl+S) with keyboard shortcut
- **Multiple file tabs** with active highlighting

### 🎮 VS Code-Like Menu System
- **File Menu**: New File (Ctrl+N), Open Folder (Ctrl+O), Save (Ctrl+S), Exit
- **Edit Menu**: Cut, Copy, Paste, Find (Ctrl+F), Replace (Ctrl+H)
- **View Menu**: Command Palette (Ctrl+Shift+P), Explorer, Search, Terminal
- **Help Menu**: Documentation, About
- All with keyboard shortcuts

### ⌨️ Command Palette
- **Ctrl+Shift+P** to open
- **Keyboard navigation** with arrow keys
- **Quick access** to commands: New File, Save, Execute Code, Open Folder, etc.
- **Escape** to close

### 🖥️ Bottom Panel (4 Tabs)
1. **Terminal** - Interactive CLI
   - Commands: help, clear, dotnet, ls, pwd
   - Simulated .NET SDK version reporting
   
2. **Debug Output** - Debug messages with timestamps
   
3. **Console** - Code execution output
   - Timestamps and execution time
   - Formatted results
   
4. **Results** - Database query results (SSMS-style)
   - **Grid View**: Formatted table with sortable columns
   - **Text View**: Tab-separated values for copy/paste
   - **Toggle buttons** to switch between views
   - **Row count** display

### 🗄️ Database Features
- **Multiple database support**: SQL Server, PostgreSQL, SQLite
- **Database type selector** with connection string templates
- **Table browser**: Lists all tables - click to generate SELECT queries
- **Query execution** with formatted results
- **Grid and Text views** like SQL Server Management Studio
- **EF Core LINQ** query examples

### 🚀 Code Execution
- **Execute button** or F5 to run code
- **Multi-language support**: C#, SQL, Python, JavaScript
- **Simulated C# execution**: Compilation, build, run cycle
- **SQL query results**: Display in dedicated Results tab
- **Console output**: Timestamped execution logs

### 📦 Sample Files Included
- **C# files**: Program.cs, Startup.cs, Controllers, Models
- **JavaScript**: app.js (Express.js server example)
- **TypeScript**: main.ts (UserService with interfaces)
- **Python**: setup.py
- **SQL**: deploy.sql
- **VB.NET**: test.vb
- **Pseudocode**: algorithm.pseudo (binary search example)

## 📸 Screenshots

**Main Interface with Menu System**
![Main UI](https://github.com/user-attachments/assets/902cc816-7a2e-440d-957b-6f55c545c35c)

**Command Palette**
![Command Palette](https://github.com/user-attachments/assets/b13e9de0-b9a3-43a3-887a-de5b50ecb01c)

**Code Execution with Console Output**
![Execute Code](https://github.com/user-attachments/assets/8c2d6bbb-c098-462a-b593-cd12a6f68e44)

**SQL Results - Grid View**
![Grid View](https://github.com/user-attachments/assets/66d62d06-8166-458a-8e39-ffb066038737)

**SQL Results - Text View**
![Text View](https://github.com/user-attachments/assets/b0427b46-9903-4fcc-8959-52d526723c0d)

**JavaScript Editor**
![JavaScript](https://github.com/user-attachments/assets/70782907-94dc-477c-b0a3-1c58cb2d4b31)

**TypeScript Editor**
![TypeScript](https://github.com/user-attachments/assets/eb61ef5c-6d30-45a9-813e-b8773b7150a4)

**C# Editor with IntelliSense**
![C# Editor](https://github.com/user-attachments/assets/65682b2b-758f-49b9-b198-fe2523a722d2)

**Database Query Execution**
![Database](https://github.com/user-attachments/assets/e4a39bc0-e844-423e-bf86-8a574b3092fa)

**Multi-File Support**
![Multi-File](https://github.com/user-attachments/assets/4d484f0e-a309-40d7-a811-d9ea8533368c)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/dotnetappdev/dotnetnotepad.git
cd dotnetnotepad

# Install dependencies
npm install
```

## 💻 Usage

### Development Mode
```bash
npm start
```
Application opens at `http://localhost:3000`

### Production Build
```bash
npm run build
```
Creates optimized bundle in `dist/` directory

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New File |
| `Ctrl+O` | Open Folder |
| `Ctrl+S` | Save File |
| `Ctrl+Shift+P` | Command Palette |
| `F5` | Execute Code |
| `Ctrl+F` | Find |
| `Ctrl+H` | Replace |
| `Ctrl+Shift+F` | Search Files |
| `Ctrl+Shift+E` | Focus Explorer |
| `Ctrl+\`` | Toggle Terminal |

## 📁 Project Structure

```
dotnetnotepad/
├── src/
│   ├── components/
│   │   ├── MenuBar.tsx           # VS Code-style menu
│   │   ├── CommandPalette.tsx    # Quick command access
│   │   ├── FileExplorer.tsx      # File tree with search
│   │   ├── SearchPanel.tsx       # File search component
│   │   ├── EditorPanel.tsx       # Monaco editor wrapper
│   │   ├── BottomPanel.tsx       # Terminal/Debug/Console/Results
│   │   └── DatabasePanel.tsx     # Database connectivity
│   ├── App.tsx                   # Main application
│   ├── index.tsx                 # Entry point
│   └── index.html                # HTML template
├── webpack.config.js             # Webpack config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## 🛠️ Technologies

- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **Monaco Editor** - VS Code's editor (local loading)
- **Webpack 5** - Module bundler
- **monaco-editor-webpack-plugin** - Monaco integration

## 📖 Using the Application

### File Operations
1. Click folders in explorer to expand/collapse
2. Click files to open in editor
3. Right-click for context menu (New, Copy, Delete)
4. Use search panel to filter files

### Code Execution
1. Open a file (C#, SQL, Python, JavaScript)
2. Click **green Play button (▶)** or press **F5**
3. View output in Console tab
4. For SQL, results appear in Results tab with Grid/Text views
5. Click **Pause** or **Stop** buttons when code is running

### Database Queries
1. Click "Show Database" in top right
2. Select database type (SQL Server, PostgreSQL, SQLite)
3. Enter connection string
4. Click "Connect"
5. Browse tables or write SQL queries
6. Click "Execute" or use Play button
7. View results in Results tab
8. Toggle between Grid and Text views

### Command Palette
1. Press **Ctrl+Shift+P**
2. Type command name
3. Use arrow keys to navigate
4. Press Enter to execute
5. Press Escape to close

## 🎨 Customization

The application uses VS Code's dark theme by default. All components are styled with CSS and can be customized in their respective `.css` files.

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES2020 support required.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

ISC

## 👤 Author

**dotnetappdev**

---

Made with ❤️ using TypeScript and React
