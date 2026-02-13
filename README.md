# .NET Notepad

A comprehensive TypeScript-based .NET notepad application with VS Code-like features, Monaco Editor, database connectivity, code execution, and multi-language support.

## 🌍 Platform Support

**Available on all major platforms:**
- 🪟 **Windows** - NSIS Installer and Portable EXE
- 🐧 **Linux** - AppImage (universal) and DEB packages
- 🍎 **macOS** - DMG disk image
- 🌐 **Web** - Run in any modern browser

All builds are automatically generated via GitHub Actions on every release.

## ✨ Key Features

### 🎨 Monaco Editor Integration
- **VS Code's Monaco Editor** with full local loading (no CDN dependencies)
- **Syntax highlighting** for C#, JavaScript, TypeScript, Python, VB.NET, VBScript, SQL, Pseudocode, XML, JSON, and more
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
- **Quick access** to commands:
  - New File, New Code File
  - New UML Diagram, New Whiteboard, New API Tester
  - New .NET Console App, New .NET Web API
  - Save, Execute Code, Open Folder
  - Toggle Database Panel, Close File
- **Command categories**: File, View, Run
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

### 🎨 UML Diagram Designer
- **Visual database schema designer** with drag-and-drop interface
- **Entity-Relationship modeling** (ERD)
- **Table creation** with columns, data types, and constraints
- **Primary Key & Foreign Key** support with visual indicators
- **Auto-increment and GUID** field options
- **Relationship mapping**: One-to-One, One-to-Many, Many-to-One, Many-to-Many
- **Visual relationship lines** connecting tables
- **SQL DDL generation**: Generate CREATE TABLE statements from diagrams
- **C# entity class generation**: Export as Entity Framework models
- **Drag tables** to reposition, zoom controls
- **Connection lines** automatically adjust when moving tables
- **Export/import** diagrams as JSON
- Create with **Ctrl+Alt+U** or Command Palette

### 🖍️ Whiteboard Designer
- **Freeform drawing canvas** for brainstorming and diagramming
- **Drawing tools**: Rectangle, Text, Line, Arrow
- **Color picker** with preset colors
- **Select tool** for moving and editing elements
- **Click and drag** to create shapes
- **Text editing** with inline text boxes
- **Element deletion** via context menu
- **Clear canvas** function
- **Visual feedback** during drawing
- **Export/save** whiteboard as JSON
- Great for **architecture diagrams**, **flowcharts**, and **wireframes**

### 🔌 API Tester (Postman-like)
- **HTTP client** for testing REST APIs
- **Multiple HTTP methods**: GET, POST, PUT, DELETE, PATCH
- **Request collections** to organize API calls
- **Headers management** with enable/disable toggles
- **Bearer token authentication** support
- **Request body editor** with syntax highlighting
- **Response viewer** with formatted JSON
- **Status code display** (200, 404, 500, etc.)
- **Response headers** inspection
- **Save and reuse** requests
- **Collection folders** for project organization
- **Quick request duplication**
- Create with **New API Tester** command

### 🏗️ .NET Project Templates
- **New .NET Console App** generator
  - Scaffolds complete console application
  - Program.cs with namespace and Main method
  - .csproj file with target framework
  - Choose .NET version (6.0, 7.0, 8.0)
  - Ready-to-run Hello World template
  
- **New .NET Web API** generator
  - Complete ASP.NET Core Web API project
  - Program.cs with middleware configuration
  - WeatherForecastController with CRUD endpoints
  - Swagger/OpenAPI integration
  - appsettings.json configuration
  - Entity model classes
  - Choose .NET version (6.0, 7.0, 8.0)
  - Production-ready project structure

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

## 🎯 Complete Feature List

### File Operations
- ✅ Create new files with language-specific templates
- ✅ Open and edit multiple files simultaneously
- ✅ Tab-based interface with active file highlighting
- ✅ Close individual tabs with × button
- ✅ Save files (Ctrl+S)
- ✅ File explorer with folder tree navigation
- ✅ Search/filter files in real-time
- ✅ Right-click context menu (New, Copy, Paste, Delete)
- ✅ Set workspace folder location

### Code Editor (Monaco)
- ✅ Syntax highlighting for 15+ languages
- ✅ IntelliSense with context-aware completions
- ✅ Dot notation support for C# (.NET types)
- ✅ LINQ method completions
- ✅ Line numbers and minimap
- ✅ Code folding
- ✅ Find and Replace (Ctrl+F, Ctrl+H)
- ✅ Format on type and paste
- ✅ Method signatures and documentation tooltips
- ✅ Snippet support with placeholders

### Code Execution
- ✅ Execute C#, JavaScript, Python, SQL code
- ✅ F5 keyboard shortcut for quick run
- ✅ Green Play (▶), Yellow Pause (⏸), Red Stop (⏹) buttons
- ✅ Real-time execution state feedback
- ✅ Simulated compilation and build process
- ✅ Console output with timestamps
- ✅ Execution time display

### Visual Designers
- ✅ UML/ERD Diagram Designer
  - Create database schemas visually
  - Add tables with columns and data types
  - Define Primary Keys, Foreign Keys
  - Set constraints (Auto-increment, GUID)
  - Draw relationships between tables
  - Generate SQL DDL statements
  - Export as Entity Framework C# classes
  - Zoom and pan controls
  - Drag to reposition tables

- ✅ Whiteboard/Drawing Canvas
  - Freeform drawing for brainstorming
  - Rectangle, Line, Arrow, Text tools
  - Color picker with presets
  - Select and move elements
  - Delete elements
  - Clear canvas
  - Save/export designs

- ✅ API Tester (Postman alternative)
  - Test REST APIs
  - Support for GET, POST, PUT, DELETE, PATCH
  - Request collections and folders
  - Custom headers with enable/disable
  - Bearer token authentication
  - JSON request body editor
  - Response viewer with formatting
  - Status codes and headers display
  - Save and reuse requests

### Database Tools
- ✅ Connect to SQL Server, PostgreSQL, SQLite
- ✅ Connection string templates
- ✅ Browse database tables
- ✅ Click table to generate SELECT query
- ✅ Execute SQL queries
- ✅ Grid view (table format)
- ✅ Text view (tab-separated)
- ✅ Toggle between views
- ✅ Row count display
- ✅ EF Core LINQ examples

### .NET Project Scaffolding
- ✅ Generate .NET Console Application
  - Choose .NET version (6.0, 7.0, 8.0)
  - Program.cs with Main method
  - .csproj project file
  - Namespace and basic structure
  
- ✅ Generate ASP.NET Core Web API
  - Choose .NET version
  - Complete project structure
  - Controllers with CRUD endpoints
  - Swagger/OpenAPI integration
  - appsettings.json
  - Entity models

### Bottom Panel (4 Tabs)
- ✅ **Terminal** - Interactive CLI
  - Commands: help, clear, dotnet, ls, pwd
  - Simulated .NET SDK
  
- ✅ **Debug Output** - Debug messages with timestamps
  
- ✅ **Console** - Code execution output
  - Timestamps and execution time
  - Formatted results
  
- ✅ **Results** - Database query results
  - Grid View (sortable table)
  - Text View (tab-separated)
  - Row count

### User Interface
- ✅ VS Code-like menu bar (File, Edit, View, Help)
- ✅ Command Palette (Ctrl+Shift+P)
- ✅ Dark theme
- ✅ Sidebar file explorer
- ✅ Collapsible bottom panel
- ✅ Resizable panels
- ✅ Status indicators
- ✅ Visual feedback for user actions

### Keyboard Shortcuts
- ✅ Ctrl+N - New File
- ✅ Ctrl+Alt+N - New Code File
- ✅ Ctrl+Alt+U - New UML Diagram
- ✅ Ctrl+S - Save
- ✅ Ctrl+O - Open Folder
- ✅ Ctrl+Shift+P - Command Palette
- ✅ F5 - Execute Code
- ✅ Ctrl+F - Find
- ✅ Ctrl+H - Replace
- ✅ And more...

## 📸 Screenshots

**Main Interface with Menu System**
![Main UI](https://github.com/user-attachments/assets/cbc2fa65-43cf-4fc6-b954-906810263ada)

**File Explorer with Project Files**
![File Explorer](https://github.com/user-attachments/assets/d2be5a61-a94a-4ddb-a464-140f6d03f570)

**C# Editor with Syntax Highlighting**
![C# Editor](https://github.com/user-attachments/assets/e08a4495-a4a0-4ac5-90d1-dc1b462df42e)

**Code Execution with Console Output**
![Execute Code](https://github.com/user-attachments/assets/f6f2cabe-e0ad-424d-89bd-06a47a766ee6)

**Command Palette - All Available Commands**
![Command Palette](https://github.com/user-attachments/assets/18234c7a-34d3-4106-a054-2ba3581ce9a1)

**UML Diagram Designer - Visual Database Schema**
![UML Designer](https://github.com/user-attachments/assets/1d3c3172-3f66-4179-abc2-7b0eb92dc2c8)

**Whiteboard Designer - Freeform Drawing Canvas**
![Whiteboard](https://github.com/user-attachments/assets/25183255-2293-4bff-b585-83236f245643)

**API Tester - REST API Testing Tool**
![API Tester](https://github.com/user-attachments/assets/39c682cf-7dfb-40d3-822a-f30c588058f4)

**Multi-File Support with Tabs**
![Multi-File](https://github.com/user-attachments/assets/c7110699-7542-4e4a-9430-8dfab1fd70c9)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/dotnetappdev/dotnetnotepad.git
cd dotnetnotepad

# Install dependencies
npm install
```

## 🎯 Quick Start Guide

### First Time Setup
1. Run `npm start` to launch the application
2. Application opens at `http://localhost:3000`
3. You'll see a VS Code-like interface with file explorer on the left

### Creating Your First File
1. Click **File** → **New Code File** (or press `Ctrl+Alt+N`)
2. Choose file type: `cs` for C#
3. Enter file name: `HelloWorld`
4. Start coding with full IntelliSense support

### Running Code
1. Write some C# code (e.g., `Console.WriteLine("Hello!");`)
2. Press **F5** or click the green **Play button (▶)**
3. See output in the **Console** tab at the bottom

### Creating a .NET Project
1. Press **Ctrl+Shift+P** to open Command Palette
2. Select **"New .NET Console App"** or **"New .NET Web API"**
3. Enter project name and select .NET version
4. Multiple files are created with complete project structure

### Designing a Database
1. Press **Ctrl+Alt+U** to create a UML diagram
2. Click **"Add Table"** to create entities
3. Add columns with data types
4. Connect tables with relationships
5. Click **"Generate SQL"** to get CREATE statements

### Testing APIs
1. Open Command Palette (`Ctrl+Shift+P`)
2. Select **"New API Tester"**
3. Create a request with URL and method
4. Add headers if needed
5. Click **"Send Request"** to test

## 💻 Usage

### Supported File Types & Languages

| File Extension | Language | Features |
|---------------|----------|----------|
| `.cs` | C# | Full IntelliSense, dot notation, LINQ, snippets |
| `.csproj` | XML | Project configuration files |
| `.js` | JavaScript | Syntax highlighting, code completion |
| `.ts` | TypeScript | Type checking, IntelliSense |
| `.py` | Python | Syntax highlighting, execution support |
| `.sql` | SQL | Query execution, results grid/text view |
| `.vb` | VB.NET | Visual Basic .NET support |
| `.vbs` | VBScript | VBScript syntax |
| `.json` | JSON | Formatting, validation |
| `.xml` | XML | Syntax highlighting |
| `.html` | HTML | Web markup |
| `.css` | CSS | Styling |
| `.md` | Markdown | Documentation |
| `.txt` | Plain Text | Basic text editing |
| `.pseudo` | Pseudocode | Algorithm documentation |
| `.uml` | UML Diagram | Visual database designer |
| `.whiteboard` | Whiteboard | Drawing canvas |
| `.apitest` | API Test | REST API testing |

### Development Mode
```bash
npm start
```
Application opens at `http://localhost:3000`

### Production Build

#### Web Version
```bash
npm run build
```
Creates optimized bundle in `dist/` directory

#### Desktop Applications

Build for all platforms:
```bash
npm run dist
```

Build for specific platforms:
```bash
# Windows (exe and portable)
npm run dist:win

# Linux (AppImage and deb)
npm run dist:linux

# macOS (dmg)
npm run dist:mac
```

Built applications will be in the `release/` directory.

## 🚀 Automated Builds and Releases

This project includes automated builds for all major platforms via GitHub Actions.

### Creating a Release

1. **Tag your release:**
   ```bash
   git tag v1.0.0.1
   git push origin v1.0.0.1
   ```

2. **GitHub Actions will automatically:**
   - Build the web version (ZIP file)
   - Build Windows executables (NSIS installer and portable exe)
   - Build Linux packages (AppImage and DEB)
   - Build macOS disk image (DMG)
   - Create a GitHub release with all binaries attached

3. **Manual trigger:**
   You can also trigger builds manually from the Actions tab in GitHub.

### Available Downloads

After a release is created, users can download:
- **Web Version**: `dotnetnotepad-web.zip` - Extract and host anywhere
- **Windows**: `.NET Notepad Setup.exe` - Full installer
- **Windows Portable**: `.NET Notepad.exe` - No installation required
- **Linux AppImage**: `.NET Notepad.AppImage` - Universal Linux binary
- **Linux DEB**: `dotnetnotepad_*.deb` - For Debian/Ubuntu
- **macOS**: `.NET Notepad.dmg` - Disk image for Mac


## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New File |
| `Ctrl+Alt+N` | New Code File (with language selector) |
| `Ctrl+Alt+U` | New UML Diagram |
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
│   │   ├── MenuBar.tsx              # VS Code-style menu
│   │   ├── CommandPalette.tsx       # Quick command access
│   │   ├── FileExplorer.tsx         # File tree with search
│   │   ├── SearchPanel.tsx          # File search component
│   │   ├── EditorPanel.tsx          # Monaco editor wrapper
│   │   ├── BottomPanel.tsx          # Terminal/Debug/Console/Results
│   │   ├── DatabasePanel.tsx        # Database connectivity
│   │   ├── UmlDiagramDesigner.tsx   # Visual ERD designer
│   │   ├── WhiteboardDesigner.tsx   # Freeform drawing canvas
│   │   └── ApiTester.tsx            # Postman-like API tester
│   ├── App.tsx                      # Main application
│   ├── App.css                      # Main styles
│   ├── index.tsx                    # Entry point
│   └── index.html                   # HTML template
├── webpack.config.js                # Webpack config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies
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

### UML Diagram Designer
1. Press **Ctrl+Alt+U** or use Command Palette → "New UML Diagram"
2. Enter diagram name (e.g., "database-schema")
3. Use **"Add Table"** button to create entities
4. **Add columns** with data types (int, varchar, datetime, etc.)
5. Mark **Primary Keys** (🔑) and **Foreign Keys** (🔗)
6. Set **Auto Increment** or **GUID** options
7. **Drag tables** to arrange layout
8. Click **"Add Relationship"** to connect tables
9. Choose relationship type (One-to-One, One-to-Many, etc.)
10. **Generate SQL**: Creates DDL statements for database
11. **Generate C# Entities**: Creates Entity Framework model classes
12. **Clear All**: Reset the diagram
13. **Save** with Ctrl+S

### Whiteboard Designer
1. Use Command Palette → "New Whiteboard"
2. Select drawing tool:
   - **Select** (👆) - Move and edit elements
   - **Rectangle** (▢) - Draw boxes
   - **Text** (T) - Add text labels
   - **Line** (─) - Draw straight lines
   - **Arrow** (→) - Draw directional arrows
3. Choose color from palette
4. Click and drag to create shapes
5. Click text elements to edit content
6. Right-click elements to delete
7. Use **Clear Canvas** to start over
8. Save with Ctrl+S

### API Tester
1. Use Command Palette → "New API Tester"
2. Click **"New Collection"** to organize requests
3. Click **"New Request"** to create API call
4. Set HTTP method (GET, POST, PUT, DELETE, PATCH)
5. Enter URL (e.g., `https://api.example.com/users`)
6. Add headers:
   - Click **"Add Header"**
   - Enter key (e.g., "Content-Type") and value (e.g., "application/json")
   - Toggle enable/disable
7. Set Bearer Token (optional) for authentication
8. For POST/PUT: Enter JSON body in editor
9. Click **"Send Request"**
10. View response:
    - Status code (200, 404, etc.)
    - Response body (formatted JSON)
    - Response headers
11. Save requests to collections for reuse
12. Duplicate requests with **"Duplicate"** button

### .NET Project Creation

#### Creating Console App
1. Use Command Palette → "New .NET Console App"
2. Enter project name (e.g., "MyConsoleApp")
3. Choose .NET version (6.0, 7.0, or 8.0)
4. Generated files:
   - `Program.cs` - Main entry point with namespace and Main method
   - `{ProjectName}.csproj` - Project configuration
5. Code is ready to execute with F5
6. Includes Console.ReadKey() for terminal pause

#### Creating Web API
1. Use Command Palette → "New .NET Web API"
2. Enter project name (e.g., "MyWebApi")
3. Choose .NET version (6.0, 7.0, or 8.0)
4. Generated files:
   - `Program.cs` - Web host configuration with Swagger
   - `Controllers/WeatherForecastController.cs` - Sample CRUD endpoints
   - `{ProjectName}.csproj` - Web project configuration
   - `appsettings.json` - Application settings
5. Includes GET, GET by ID, and POST endpoints
6. Swagger UI configured at `/swagger`

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
