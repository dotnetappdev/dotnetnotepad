import React, { useState, useEffect, useRef } from 'react';
import './ProjectTemplateDialog.css';

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
}

interface ProjectTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (template: ProjectTemplate, projectName: string, dotnetVersion: string) => void;
}

const ProjectTemplateDialog: React.FC<ProjectTemplateDialogProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [projectName, setProjectName] = useState('MyProject');
  const [dotnetVersion, setDotnetVersion] = useState('8.0');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('console');
  const inputRef = useRef<HTMLInputElement>(null);

  const templates: ProjectTemplate[] = [
    {
      id: 'console',
      name: 'Console Application',
      description: 'A command-line application with basic console I/O',
      category: 'C#',
      language: 'csharp',
    },
    {
      id: 'webapi',
      name: 'ASP.NET Core Web API',
      description: 'RESTful API with Swagger/OpenAPI support',
      category: 'C#',
      language: 'csharp',
    },
    {
      id: 'classlib',
      name: 'Class Library',
      description: 'A reusable class library project',
      category: 'C#',
      language: 'csharp',
    },
    {
      id: 'python-console',
      name: 'Python Script',
      description: 'A basic Python script file',
      category: 'Python',
      language: 'python',
    },
    {
      id: 'javascript-node',
      name: 'Node.js Application',
      description: 'A Node.js application with package.json',
      category: 'JavaScript',
      language: 'javascript',
    },
    {
      id: 'typescript-node',
      name: 'TypeScript Node.js App',
      description: 'A Node.js application with TypeScript',
      category: 'TypeScript',
      language: 'typescript',
    },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleCreate = () => {
    const template = templates.find((t) => t.id === selectedTemplate);
    if (template && projectName.trim()) {
      onCreateProject(template, projectName.trim(), dotnetVersion);
      onClose();
      // Reset to defaults
      setProjectName('MyProject');
      setDotnetVersion('8.0');
      setSelectedTemplate('console');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ProjectTemplate[]>);

  const isCSharpTemplate = selectedTemplate === 'console' || selectedTemplate === 'webapi' || selectedTemplate === 'classlib';

  return (
    <div className="project-template-overlay" onClick={onClose}>
      <div className="project-template-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="project-template-header">
          <h2>Create New Project</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="project-template-content">
          <div className="project-template-form">
            <div className="form-group">
              <label htmlFor="project-name">Project Name</label>
              <input
                ref={inputRef}
                id="project-name"
                type="text"
                className="form-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter project name"
              />
            </div>

            {isCSharpTemplate && (
              <div className="form-group">
                <label htmlFor="dotnet-version">.NET Version</label>
                <select
                  id="dotnet-version"
                  className="form-select"
                  value={dotnetVersion}
                  onChange={(e) => setDotnetVersion(e.target.value)}
                >
                  <option value="6.0">.NET 6.0</option>
                  <option value="7.0">.NET 7.0</option>
                  <option value="8.0">.NET 8.0</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Select Template</label>
              <div className="template-list">
                {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                  <div key={category} className="template-category">
                    <div className="category-header">{category}</div>
                    {categoryTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`template-item ${selectedTemplate === template.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="template-name">{template.name}</div>
                        <div className="template-description">{template.description}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="project-template-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!projectName.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplateDialog;
