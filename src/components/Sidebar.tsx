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
        >
          📝 Notes
        </button>
        <button
          className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => onTabChange('about')}
        >
          ℹ️ About
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 