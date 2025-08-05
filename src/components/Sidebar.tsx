import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabItem {
  id: string;
  icon: string;
  label: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabItem[] = [
    { id: 'notes', icon: '📝', label: 'Notes' },
    { id: 'hidden', icon: '🙈', label: 'Hidden Companies' },
    { id: 'help', icon: '❓', label: 'Help' },
    { id: 'about', icon: 'ℹ️', label: 'About' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h5>Job Notes Saver</h5>
      </div>
      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <span className="icon" style={{ fontSize: '1.1em' }}>{tab.icon}</span>
            <span className="label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;