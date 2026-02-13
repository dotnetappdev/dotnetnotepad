import React, { useState, useEffect } from 'react';
import MenuBar from './components/MenuBar';
import CommandPalette from './components/CommandPalette';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import BottomPanel from './components/BottomPanel';
import DatabasePanel from './components/DatabasePanel';
import UmlDiagramDesigner from './components/UmlDiagramDesigner';
import WhiteboardDesigner from './components/WhiteboardDesigner';
import ApiTester from './components/ApiTester';
import ProjectTemplateDialog, { ProjectTemplate } from './components/ProjectTemplateDialog';
import './App.css';

interface OpenFile {
  path: string;
  content: string;
  language: string;
  isUmlDiagram?: boolean;
  isWhiteboard?: boolean;
  isApiTester?: boolean;
}

interface QueryResult {
  columns: string[];
  rows: any[][];
}

const App: React.FC = () => {
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [showDatabase, setShowDatabase] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProjectTemplateDialog, setShowProjectTemplateDialog] = useState(false);
  const [workspaceFolder, setWorkspaceFolder] = useState('/workspace');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'u') {
        e.preventDefault();
        handleNewUmlDiagram();
      }
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'n') {
        e.preventDefault();
        handleNewCodeFile();
      }
      if (e.key === 'F5') {
        e.preventDefault();
        handleExecuteCode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, openFiles]);

  const handleFileOpen = (path: string, content: string, language: string) => {
    const existingFile = openFiles.find(f => f.path === path);
    if (!existingFile) {
      setOpenFiles([...openFiles, { path, content, language }]);
    }
    setActiveFile(path);
  };

  const handleFileClose = (path: string) => {
    const newFiles = openFiles.filter(f => f.path !== path);
    setOpenFiles(newFiles);
    if (activeFile === path) {
      setActiveFile(newFiles.length > 0 ? newFiles[0].path : null);
    }
  };

  const handleContentChange = (path: string, content: string) => {
    setOpenFiles(openFiles.map(f => 
      f.path === path ? { ...f, content } : f
    ));
  };

  const handleNewFile = () => {
    const fileName = prompt('Enter file name:', 'newfile.cs');
    if (fileName) {
      handleFileOpen(`${workspaceFolder}/${fileName}`, '', 'plaintext');
    }
  };

  const handleNewCodeFile = () => {
    const fileType = prompt('Enter file type (cs, py, js, ts, sql, vb):', 'cs');
    if (fileType) {
      const fileName = prompt('Enter file name (without extension):', 'newfile');
      if (fileName) {
        const fullFileName = `${fileName}.${fileType}`;
        const languageMap: { [key: string]: string } = {
          'cs': 'csharp',
          'py': 'python',
          'sql': 'sql',
          'vb': 'vb',
          'js': 'javascript',
          'ts': 'typescript',
        };
        const language = languageMap[fileType] || 'plaintext';
        handleFileOpen(`${workspaceFolder}/${fullFileName}`, '', language);
      }
    }
  };

  const handleNewUmlDiagram = () => {
    const fileName = prompt('Enter UML diagram name:', 'diagram');
    if (fileName) {
      const fullFileName = fileName.endsWith('.uml') ? fileName : `${fileName}.uml`;
      const initialData = JSON.stringify({ tables: [], relationships: [] }, null, 2);
      const newFile: OpenFile = {
        path: `${workspaceFolder}/${fullFileName}`,
        content: initialData,
        language: 'json',
        isUmlDiagram: true,
      };
      setOpenFiles([...openFiles, newFile]);
      setActiveFile(newFile.path);
    }
  };

  const handleNewWhiteboard = () => {
    const fileName = prompt('Enter whiteboard name:', 'whiteboard');
    if (fileName) {
      const fullFileName = fileName.endsWith('.whiteboard') ? fileName : `${fileName}.whiteboard`;
      const initialData = JSON.stringify({ elements: [] }, null, 2);
      const newFile: OpenFile = {
        path: `${workspaceFolder}/${fullFileName}`,
        content: initialData,
        language: 'json',
        isWhiteboard: true,
      };
      setOpenFiles([...openFiles, newFile]);
      setActiveFile(newFile.path);
    }
  };

  const handleNewDotnetConsole = () => {
    const projectName = prompt('Enter project name:', 'ConsoleApp');
    if (projectName) {
      const dotnetVersion = prompt('Enter .NET version (6.0, 7.0, 8.0):', '8.0') || '8.0';
      const programCs = `using System;

namespace ${projectName}
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            Console.WriteLine("Welcome to .NET Console Application");
            Console.WriteLine(".NET Version: ${dotnetVersion}");
            
            // Your code here
            
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}`;

      const csproj = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net${dotnetVersion.replace('.', '')}</TargetFramework>
    <RootNamespace>${projectName}</RootNamespace>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>`;

      // Create project files
      const projectFolder = `${workspaceFolder}/${projectName}`;
      handleFileOpen(`${projectFolder}/Program.cs`, programCs, 'csharp');
      handleFileOpen(`${projectFolder}/${projectName}.csproj`, csproj, 'xml');
      
      setConsoleOutput(prev => [
        ...prev,
        `\n.NET Console Application '${projectName}' created successfully!`,
        `Target Framework: .NET ${dotnetVersion}`,
        `Files: Program.cs, ${projectName}.csproj`,
      ]);
    }
  };

  const handleNewDotnetWebApi = () => {
    const projectName = prompt('Enter project name:', 'WebApiApp');
    if (projectName) {
      const dotnetVersion = prompt('Enter .NET version (6.0, 7.0, 8.0):', '8.0') || '8.0';
      const programCs = `using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();`;

      const weatherController = `using Microsoft.AspNetCore.Mvc;

namespace ${projectName}.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("{id}")]
        public ActionResult<WeatherForecast> GetById(int id)
        {
            var forecast = new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(id)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            };
            
            return Ok(forecast);
        }

        [HttpPost]
        public ActionResult<WeatherForecast> Create(WeatherForecast forecast)
        {
            return CreatedAtAction(nameof(GetById), new { id = 1 }, forecast);
        }
    }

    public class WeatherForecast
    {
        public DateOnly Date { get; set; }
        public int TemperatureC { get; set; }
        public int TemperatureF => 32 + (int)(TemperatureC * 1.8);
        public string? Summary { get; set; }
    }
}`;

      const csproj = `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net${dotnetVersion.replace('.', '')}</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>${projectName}</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="${dotnetVersion}.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>

</Project>`;

      const appsettings = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`;

      // Create project files
      const projectFolder = `${workspaceFolder}/${projectName}`;
      handleFileOpen(`${projectFolder}/Program.cs`, programCs, 'csharp');
      handleFileOpen(`${projectFolder}/Controllers/WeatherForecastController.cs`, weatherController, 'csharp');
      handleFileOpen(`${projectFolder}/${projectName}.csproj`, csproj, 'xml');
      handleFileOpen(`${projectFolder}/appsettings.json`, appsettings, 'json');
      
      setConsoleOutput(prev => [
        ...prev,
        `\n.NET Web API Application '${projectName}' created successfully!`,
        `Target Framework: .NET ${dotnetVersion}`,
        `Files: Program.cs, WeatherForecastController.cs, ${projectName}.csproj, appsettings.json`,
        `API includes: Swagger UI, GET and POST endpoints`,
      ]);
    }
  };

  const handleNewApiTester = () => {
    const fileName = prompt('Enter API test file name:', 'api-test');
    if (fileName) {
      const fullFileName = fileName.endsWith('.apitest') ? fileName : `${fileName}.apitest`;
      const initialData = JSON.stringify({
        collections: [],
        requests: [],
        bearerToken: ''
      }, null, 2);
      const newFile: OpenFile = {
        path: `${workspaceFolder}/${fullFileName}`,
        content: initialData,
        language: 'json',
        isApiTester: true,
      };
      setOpenFiles([...openFiles, newFile]);
      setActiveFile(newFile.path);
    }
  };

  const sanitizePackageName = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  };

  const handleCreateProjectFromTemplate = (template: ProjectTemplate, projectName: string, dotnetVersion: string) => {
    const projectFolder = `${workspaceFolder}/${projectName}`;

    if (template.id === 'console') {
      const programCs = `using System;

namespace ${projectName}
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            Console.WriteLine("Welcome to .NET Console Application");
            Console.WriteLine(".NET Version: ${dotnetVersion}");
            
            // Your code here
            
            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}`;

      const csproj = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net${dotnetVersion.replace('.', '')}</TargetFramework>
    <RootNamespace>${projectName}</RootNamespace>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>`;

      handleFileOpen(`${projectFolder}/Program.cs`, programCs, 'csharp');
      handleFileOpen(`${projectFolder}/${projectName}.csproj`, csproj, 'xml');
      
      setConsoleOutput(prev => [
        ...prev,
        `\n.NET Console Application '${projectName}' created successfully!`,
        `Target Framework: .NET ${dotnetVersion}`,
        `Files: Program.cs, ${projectName}.csproj`,
      ]);
    } else if (template.id === 'webapi') {
      const programCs = `using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();`;

      const weatherController = `using Microsoft.AspNetCore.Mvc;

namespace ${projectName}.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("{id}")]
        public ActionResult<WeatherForecast> GetById(int id)
        {
            var forecast = new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(id)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            };
            
            return Ok(forecast);
        }

        [HttpPost]
        public ActionResult<WeatherForecast> Create(WeatherForecast forecast)
        {
            return CreatedAtAction(nameof(GetById), new { id = 1 }, forecast);
        }
    }

    public class WeatherForecast
    {
        public DateOnly Date { get; set; }
        public int TemperatureC { get; set; }
        public int TemperatureF => 32 + (int)(TemperatureC * 1.8);
        public string? Summary { get; set; }
    }
}`;

      const csproj = `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net${dotnetVersion.replace('.', '')}</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>${projectName}</RootNamespace>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="${dotnetVersion}.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>

</Project>`;

      const appsettings = `{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`;

      handleFileOpen(`${projectFolder}/Program.cs`, programCs, 'csharp');
      handleFileOpen(`${projectFolder}/Controllers/WeatherForecastController.cs`, weatherController, 'csharp');
      handleFileOpen(`${projectFolder}/${projectName}.csproj`, csproj, 'xml');
      handleFileOpen(`${projectFolder}/appsettings.json`, appsettings, 'json');
      
      setConsoleOutput(prev => [
        ...prev,
        `\n.NET Web API Application '${projectName}' created successfully!`,
        `Target Framework: .NET ${dotnetVersion}`,
        `Files: Program.cs, WeatherForecastController.cs, ${projectName}.csproj, appsettings.json`,
        `API includes: Swagger UI, GET and POST endpoints`,
      ]);
    } else if (template.id === 'classlib') {
      const classCs = `namespace ${projectName}
{
    public class Class1
    {
        public string GetMessage()
        {
            return "Hello from ${projectName} library!";
        }
    }
}`;

      const csproj = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net${dotnetVersion.replace('.', '')}</TargetFramework>
    <RootNamespace>${projectName}</RootNamespace>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>`;

      handleFileOpen(`${projectFolder}/Class1.cs`, classCs, 'csharp');
      handleFileOpen(`${projectFolder}/${projectName}.csproj`, csproj, 'xml');
      
      setConsoleOutput(prev => [
        ...prev,
        `\n.NET Class Library '${projectName}' created successfully!`,
        `Target Framework: .NET ${dotnetVersion}`,
        `Files: Class1.cs, ${projectName}.csproj`,
      ]);
    } else if (template.id === 'python-console') {
      const mainPy = `# ${projectName} - Python Application
def main():
    print("Hello from Python!")
    print("Welcome to ${projectName}")
    
    # Your code here
    
    print("\\nExecution completed.")

if __name__ == "__main__":
    main()`;

      handleFileOpen(`${projectFolder}/main.py`, mainPy, 'python');
      
      setConsoleOutput(prev => [
        ...prev,
        `\nPython Application '${projectName}' created successfully!`,
        `Files: main.py`,
      ]);
    } else if (template.id === 'javascript-node') {
      const indexJs = `// ${projectName} - Node.js Application
console.log('Hello from Node.js!');
console.log('Welcome to ${projectName}');

// Your code here

console.log('\\nExecution completed.');`;

      const packageJson = `{
  "name": "${sanitizePackageName(projectName)}",
  "version": "1.0.0",
  "description": "Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`;

      handleFileOpen(`${projectFolder}/index.js`, indexJs, 'javascript');
      handleFileOpen(`${projectFolder}/package.json`, packageJson, 'json');
      
      setConsoleOutput(prev => [
        ...prev,
        `\nNode.js Application '${projectName}' created successfully!`,
        `Files: index.js, package.json`,
      ]);
    } else if (template.id === 'typescript-node') {
      const indexTs = `// ${projectName} - TypeScript Node.js Application
console.log('Hello from TypeScript!');
console.log('Welcome to ${projectName}');

// Your code here

console.log('\\nExecution completed.');`;

      const packageJson = `{
  "name": "${sanitizePackageName(projectName)}",
  "version": "1.0.0",
  "description": "TypeScript Node.js application",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}`;

      const tsconfigJson = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`;

      handleFileOpen(`${projectFolder}/src/index.ts`, indexTs, 'typescript');
      handleFileOpen(`${projectFolder}/package.json`, packageJson, 'json');
      handleFileOpen(`${projectFolder}/tsconfig.json`, tsconfigJson, 'json');
      
      setConsoleOutput(prev => [
        ...prev,
        `\nTypeScript Node.js Application '${projectName}' created successfully!`,
        `Files: src/index.ts, package.json, tsconfig.json`,
      ]);
    }
  };

  const handleSaveFile = () => {
    if (activeFile) {
      const file = openFiles.find(f => f.path === activeFile);
      if (file) {
        console.log('Saving file:', activeFile, file.content);
        alert(`File saved: ${activeFile}`);
      }
    }
  };

  const handleOpenFolder = () => {
    const folder = prompt('Enter workspace folder path:', workspaceFolder);
    if (folder) {
      setWorkspaceFolder(folder);
      console.log('Workspace folder set to:', folder);
    }
  };

  const handleExecuteCode = () => {
    const file = openFiles.find(f => f.path === activeFile);
    if (file) {
      handleExecute(file.content, file.language);
    }
  };

  const handleExecute = (code: string, language: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [
      ...prev,
      `\n[${timestamp}] Executing ${language} code...`,
    ]);

    // Simulate code execution
    if (language === 'csharp') {
      // Simulate .NET code execution
      setConsoleOutput(prev => [
        ...prev,
        'Compiling C# code...',
        'Build succeeded.',
        'Running application...',
        '',
        '--- Output ---',
        'Hello from .NET!',
        'Application completed successfully.',
        `Execution time: ${Math.floor(Math.random() * 100)}ms`,
      ]);
    } else if (language === 'sql') {
      // Simulate SQL execution and show results in Results tab
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      setQueryResults({
        columns: ['Id', 'Name', 'Email', 'CreatedDate'],
        rows: [
          [1, 'John Doe', 'john@example.com', twoDaysAgo.toISOString().split('T')[0]],
          [2, 'Jane Smith', 'jane@example.com', yesterday.toISOString().split('T')[0]],
          [3, 'Bob Johnson', 'bob@example.com', today.toISOString().split('T')[0]],
        ],
      });
      
      setConsoleOutput(prev => [
        ...prev,
        'Executing SQL query...',
        '3 row(s) affected',
        'Query completed successfully.',
      ]);
    } else if (language === 'python') {
      setConsoleOutput(prev => [
        ...prev,
        '--- Output ---',
        'Hello from Python!',
        'Execution completed.',
      ]);
    } else if (language === 'javascript') {
      setConsoleOutput(prev => [
        ...prev,
        '--- Output ---',
        'Hello from JavaScript!',
        'Execution completed.',
      ]);
    } else {
      setConsoleOutput(prev => [
        ...prev,
        `Language ${language} execution not yet implemented.`,
        'Code would be executed here...',
      ]);
    }
  };

  const commands = [
    { id: 'new-file', label: 'New File', action: handleNewFile, category: 'File' },
    { id: 'new-code-file', label: 'New Code File', action: handleNewCodeFile, category: 'File' },
    { id: 'new-uml-diagram', label: 'New UML Diagram', action: handleNewUmlDiagram, category: 'File' },
    { id: 'new-whiteboard', label: 'New Whiteboard', action: handleNewWhiteboard, category: 'File' },
    { id: 'new-api-tester', label: 'New API Tester', action: handleNewApiTester, category: 'File' },
    { id: 'new-project', label: 'New Project...', action: () => setShowProjectTemplateDialog(true), category: 'File' },
    { id: 'new-dotnet-console', label: 'New .NET Console App', action: handleNewDotnetConsole, category: 'File' },
    { id: 'new-dotnet-webapi', label: 'New .NET Web API', action: handleNewDotnetWebApi, category: 'File' },
    { id: 'save-file', label: 'Save File', action: handleSaveFile, category: 'File' },
    { id: 'open-folder', label: 'Open Folder', action: handleOpenFolder, category: 'File' },
    { id: 'toggle-database', label: 'Toggle Database Panel', action: () => setShowDatabase(!showDatabase), category: 'View' },
    { id: 'close-file', label: 'Close File', action: () => activeFile && handleFileClose(activeFile), category: 'File' },
    { id: 'execute-code', label: 'Execute Code', action: handleExecuteCode, category: 'Run' },
  ];

  const activeFileObj = openFiles.find(f => f.path === activeFile);

  return (
    <div className="app">
      <MenuBar
        onNewFile={handleNewFile}
        onNewCodeFile={handleNewCodeFile}
        onNewUmlDiagram={handleNewUmlDiagram}
        onNewWhiteboard={handleNewWhiteboard}
        onNewApiTester={handleNewApiTester}
        onNewDotnetConsole={() => setShowProjectTemplateDialog(true)}
        onNewDotnetWebApi={() => setShowProjectTemplateDialog(true)}
        onSaveFile={handleSaveFile}
        onOpenFolder={handleOpenFolder}
        onToggleCommandPalette={() => setShowCommandPalette(true)}
        onToggleSearch={() => setShowSearch(!showSearch)}
      />
      <div className="main-container">
        <Sidebar onFileOpen={handleFileOpen} onSaveFile={handleSaveFile} />
        <div className="content">
          {activeFileObj?.isUmlDiagram ? (
            <UmlDiagramDesigner
              initialData={activeFileObj.content}
              onChange={(data) => handleContentChange(activeFileObj.path, data)}
            />
          ) : activeFileObj?.isWhiteboard ? (
            <WhiteboardDesigner
              initialData={activeFileObj.content}
              onChange={(data) => handleContentChange(activeFileObj.path, data)}
            />
          ) : activeFileObj?.isApiTester ? (
            <ApiTester
              initialData={activeFileObj.content}
              onChange={(data) => handleContentChange(activeFileObj.path, data)}
            />
          ) : (
            <EditorPanel
              openFiles={openFiles}
              activeFile={activeFile}
              onFileSelect={setActiveFile}
              onFileClose={handleFileClose}
              onContentChange={handleContentChange}
              onExecute={handleExecute}
            />
          )}
          <BottomPanel 
            consoleOutput={consoleOutput} 
            queryResults={queryResults}
          />
        </div>
        {showDatabase && (
          <div className="database-panel">
            <DatabasePanel />
          </div>
        )}
      </div>
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
      />
      <ProjectTemplateDialog
        isOpen={showProjectTemplateDialog}
        onClose={() => setShowProjectTemplateDialog(false)}
        onCreateProject={handleCreateProjectFromTemplate}
      />
    </div>
  );
};

export default App;
