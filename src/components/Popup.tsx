import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotesTable from './NotesTable';
import AboutSection from './AboutSection';
import HelpSection from './HelpSection';
import HiddenCompaniesTable from './HiddenCompaniesTable';
import { useNotes } from '../hooks/useNotes';
import { useHiddenCompanies } from '../hooks/useHiddenCompanies';

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const { notes, loading, deleteNote } = useNotes();
  const { hiddenCompanies, loading: hiddenLoading, unhideCompany } = useHiddenCompanies();

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <div>
            <h2 className="mb-4">Job Notes</h2>
            <NotesTable 
              notes={notes} 
              loading={loading} 
              onDeleteNote={deleteNote} 
            />
          </div>
        );
      case 'hidden':
        return (
          <div>
            <h2 className="mb-4">Hidden Companies</h2>
            <HiddenCompaniesTable 
              hiddenCompanies={hiddenCompanies} 
              loading={hiddenLoading} 
              onUnhideCompany={unhideCompany} 
            />
          </div>
        );
      case 'help':
        return <HelpSection />;
      case 'about':
        return <AboutSection />;
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="d-flex h-100" style={{ overflow: 'hidden' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Popup; 