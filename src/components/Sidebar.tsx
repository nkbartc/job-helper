import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="sidebar">
      <div className="p-3 border-bottom">
        <h5 className="mb-0">Job Notes Saver</h5>
      </div>
      <nav className="nav flex-column">
        <button
          className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => onTabChange('notes')}
          style={{
            color: activeTab === 'notes' ? 'white' : '#495057',
            backgroundColor: activeTab === 'notes' ? '#0a66c2' : 'transparent',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            padding: '10px 15px'
          }}
          onFocus={(e) => {
            if (activeTab !== 'notes') {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }
          }}
          onBlur={(e) => {
            if (activeTab !== 'notes') {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#495057';
            }
          }}
        >
          📝 Notes
        </button>
        <button
          className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => onTabChange('about')}
          style={{
            color: activeTab === 'about' ? 'white' : '#495057',
            backgroundColor: activeTab === 'about' ? '#0a66c2' : 'transparent',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            padding: '10px 15px'
          }}
          onFocus={(e) => {
            if (activeTab !== 'about') {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }
          }}
          onBlur={(e) => {
            if (activeTab !== 'about') {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#495057';
            }
          }}
        >
          ℹ️ About
        </button>
        <button
          className={`nav-link ${activeTab === 'hidden' ? 'active' : ''}`}
          onClick={() => onTabChange('hidden')}
          style={{
            color: activeTab === 'hidden' ? 'white' : '#495057',
            backgroundColor: activeTab === 'hidden' ? '#0a66c2' : 'transparent',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            padding: '10px 15px'
          }}
          onFocus={(e) => {
            if (activeTab !== 'hidden') {
              e.target.style.backgroundColor = '#e9ecef';
              e.target.style.color = '#495057';
            }
          }}
          onBlur={(e) => {
            if (activeTab !== 'hidden') {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#495057';
            }
          }}
        >
          🙈 Hidden Companies
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 