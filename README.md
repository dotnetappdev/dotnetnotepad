# .NET Notepad

A TypeScript-based .NET notepad application with VS Code-like features, including Monaco Editor, file explorer, database connectivity, and multi-language support.

## Features

### 🎨 Monaco Editor
- **VS Code-like editing experience** with Monaco Editor integration
- Full syntax highlighting and code completion
- Minimap, line numbers, and code folding
- Multiple file tabs support

### 📁 File Explorer
- Left sidebar file explorer with folder navigation
- Sample project structure with expandable folders
- Quick file opening with single click
- Support for multiple file types

### 💻 Multi-Language Support
Full syntax highlighting and IntelliSense for:
- **C#** (.NET 8, .NET 9, .NET 10, .NET Framework)
- **Python**
- **VB.NET**
- **VBScript**
- **SQL**
- And more...

### 🔧 Bottom Panel (VS Code-style)
Three integrated tabs:
1. **Terminal** - Interactive command-line interface
   - Execute commands
   - View .NET SDK information
   - File system navigation
   
2. **Debug Output** - Debugging information display
   - Debug messages with timestamps
   - Breakpoint information
   
3. **Console** - Application console output
   - Console logs and messages
   - Clear output functionality

### 🗄️ Database Connectivity
- Connect to databases with connection strings
- Execute SQL queries
- View formatted query results in tables
- Entity Framework Core query examples
- Support for SELECT, INSERT, UPDATE, DELETE operations

### 🎯 .NET IntelliSense
Intelligent code completion for C# including:
- `Console.WriteLine` snippets
- Class and method templates
- `async Task` patterns
- `IEnumerable<T>` and other generic types
- Using directives

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dotnetappdev/dotnetnotepad.git
cd dotnetnotepad
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode
Start the development server with hot reload:
```bash
npm start
```
The application will open automatically at `http://localhost:3000`

### Build for Production
Create an optimized production build:
```bash
npm build
```

## Project Structure

```
dotnetnotepad/
├── src/
│   ├── components/
│   │   ├── FileExplorer.tsx       # File explorer component
│   │   ├── FileExplorer.css
│   │   ├── EditorPanel.tsx        # Monaco editor integration
│   │   ├── EditorPanel.css
│   │   ├── BottomPanel.tsx        # Terminal/Debug/Console tabs
│   │   ├── BottomPanel.css
│   │   ├── DatabasePanel.tsx      # Database connectivity
│   │   └── DatabasePanel.css
│   ├── App.tsx                    # Main application component
│   ├── App.css
│   ├── index.tsx                  # Application entry point
│   └── index.html                 # HTML template
├── webpack.config.js              # Webpack configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json
└── README.md
```

## Technologies Used

- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **Monaco Editor** - VS Code's editor component
- **Webpack** - Module bundler
- **CSS** - Styling

## Features in Detail

### File Explorer
- Click folders to expand/collapse
- Click files to open them in the editor
- Multiple files can be open simultaneously
- Each file maintains its own state

### Editor
- Syntax highlighting for all major languages
- Auto-completion and IntelliSense
- Format on type and paste
- Code folding and minimap
- Tab-based multi-file editing

### Terminal
Available commands:
- `help` - Show available commands
- `clear` - Clear terminal output
- `dotnet` - Show .NET SDK information
- `ls` - List files
- `pwd` - Print working directory

### Database Panel
1. Click "Show Database" button in the top bar
2. Enter a connection string
3. Click "Connect"
4. Enter SQL queries or use EF Core examples
5. Click "Execute" to run queries
6. View formatted results in the table

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

dotnetappdev