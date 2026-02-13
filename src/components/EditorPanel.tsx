import React, { useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './EditorPanel.css';

// Configure loader to use local Monaco
loader.config({ monaco });

interface OpenFile {
  path: string;
  content: string;
  language: string;
}

interface EditorPanelProps {
  openFiles: OpenFile[];
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  onFileClose: (path: string) => void;
  onContentChange: (path: string, content: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  openFiles,
  activeFile,
  onFileSelect,
  onFileClose,
  onContentChange,
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Configure Monaco for .NET IntelliSense
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ['node_modules/@types']
    });

    // Configure C# language features
    monaco.languages.registerCompletionItemProvider('csharp', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: 'Console.WriteLine',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'Console.WriteLine($1);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Writes a line to the console'
          },
          {
            label: 'public class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'public class ${1:ClassName}\n{\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a public class'
          },
          {
            label: 'using',
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: 'using ${1:System};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Add a using directive'
          },
          {
            label: 'async Task',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'public async Task ${1:MethodName}()\n{\n\t$0\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create an async method'
          },
          {
            label: 'IEnumerable',
            kind: monaco.languages.CompletionItemKind.Interface,
            insertText: 'IEnumerable<${1:T}>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Generic enumerable interface'
          },
        ];

        return { suggestions };
      },
    });
  };

  const activeFileObj = openFiles.find(f => f.path === activeFile);

  return (
    <div className="editor-panel">
      <div className="tabs">
        {openFiles.map(file => (
          <div
            key={file.path}
            className={`tab ${file.path === activeFile ? 'active' : ''}`}
            onClick={() => onFileSelect(file.path)}
          >
            <span className="tab-name">{file.path.split('/').pop()}</span>
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                onFileClose(file.path);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="editor-container">
        {activeFileObj ? (
          <Editor
            height="100%"
            language={activeFileObj.language}
            value={activeFileObj.content}
            theme="vs-dark"
            onChange={(value) => {
              if (value !== undefined) {
                onContentChange(activeFileObj.path, value);
              }
            }}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
              wordWrap: 'off',
              folding: true,
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              snippetSuggestions: 'top',
            }}
          />
        ) : (
          <div className="no-file-open">
            <h2>.NET Notepad</h2>
            <p>Open a file from the explorer to start editing</p>
            <div className="features">
              <h3>Features:</h3>
              <ul>
                <li>✓ Monaco Editor (VS Code-like editing)</li>
                <li>✓ File Explorer</li>
                <li>✓ C# Syntax Highlighting & IntelliSense</li>
                <li>✓ Multi-language Support (Python, VB, SQL, etc.)</li>
                <li>✓ Terminal & Debug Output</li>
                <li>✓ Database Connection & EF Query Execution</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
