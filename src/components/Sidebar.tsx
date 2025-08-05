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

  const getButtonStyle = (tabId: string) => ({
    color: activeTab === tabId ? 'white' : '#495057',
    backgroundColor: activeTab === tabId ? '#0a66c2' : 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    padding: '10px 15px'
  });

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>, tabId: string) => {
    if (activeTab !== tabId) {
      const target = e.target as HTMLButtonElement;
      target.style.backgroundColor = '#e9ecef';
      target.style.color = '#495057';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>, tabId: string) => {
    if (activeTab !== tabId) {
      const target = e.target as HTMLButtonElement;
      target.style.backgroundColor = 'transparent';
      target.style.color = '#495057';
    }
  };

  return (
    <div className="sidebar">
      <div className="p-3 border-bottom">
        <h5 className="mb-0">Job Notes Saver</h5>
      </div>
      <nav className="nav flex-column">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={getButtonStyle(tab.id)}
            onFocus={(e) => handleFocus(e, tab.id)}
            onBlur={(e) => handleBlur(e, tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 