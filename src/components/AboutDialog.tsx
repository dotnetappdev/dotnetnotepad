import React, { useState, useEffect } from 'react';
import './AboutDialog.css';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [checking, setChecking] = useState(false);
  
  const currentVersion = '1.0.0.1';
  const copyrightYear = new Date().getFullYear();

  const checkForUpdates = async () => {
    setChecking(true);
    setUpdateStatus('Checking for updates...');
    
    try {
      // Check GitHub API for latest release
      const response = await fetch('https://api.github.com/repos/dotnetappdev/dotnetnotepad/releases/latest');
      
      if (response.ok) {
        const data = await response.json();
        const latestVersion = data.tag_name?.replace('v', '') || currentVersion;
        
        if (latestVersion === currentVersion) {
          setUpdateStatus('You have the latest version!');
        } else {
          setUpdateStatus(`New version available: ${latestVersion}`);
        }
      } else {
        setUpdateStatus('Unable to check for updates at this time.');
      }
    } catch (error) {
      console.error('Update check failed:', error);
      setUpdateStatus('Unable to check for updates. Please check your internet connection.');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setUpdateStatus('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="about-dialog-overlay" onClick={onClose}>
      <div className="about-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="about-dialog-header">
          <h2>About .NET Notepad</h2>
          <button className="about-dialog-close" onClick={onClose}>✕</button>
        </div>
        <div className="about-dialog-content">
          <div className="about-logo">
            <div className="about-logo-icon">.NET</div>
            <h1>.NET Notepad</h1>
          </div>
          
          <div className="about-info">
            <div className="about-version">
              <strong>Version:</strong> {currentVersion}
            </div>
            
            <div className="about-description">
              A comprehensive TypeScript-based .NET notepad application with VS Code-like features, 
              Monaco Editor, database connectivity, code execution, and multi-language support.
            </div>
            
            <div className="about-copyright">
              <strong>Copyright:</strong> © {copyrightYear} dotnetappdev. All rights reserved.
            </div>
            
            <div className="about-license">
              <strong>License:</strong> ISC License
            </div>
            
            <div className="about-links">
              <a 
                href="https://github.com/dotnetappdev/dotnetnotepad" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
              <a 
                href="https://github.com/dotnetappdev/dotnetnotepad/issues" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Report Issues
              </a>
            </div>
          </div>
          
          <div className="about-updates">
            <button 
              className="check-updates-btn" 
              onClick={checkForUpdates}
              disabled={checking}
            >
              {checking ? 'Checking...' : 'Check for Updates'}
            </button>
            {updateStatus && (
              <div className={`update-status ${updateStatus.includes('available') ? 'update-available' : ''}`}>
                {updateStatus}
              </div>
            )}
          </div>
        </div>
        <div className="about-dialog-footer">
          <button className="about-dialog-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
