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
          <div className="content-wrapper">
            <div className="content-header">
              <h2>Job Notes</h2>
            </div>
            <div className="content-body">
              <NotesTable 
                notes={notes} 
                loading={loading} 
                onDeleteNote={deleteNote} 
              />
            </div>
          </div>
        );
      case 'hidden':
        return (
          <div className="content-wrapper">
            <div className="content-header">
              <h2>Hidden Companies</h2>
            </div>
            <div className="content-body">
              <HiddenCompaniesTable 
                hiddenCompanies={hiddenCompanies} 
                loading={hiddenLoading} 
                onUnhideCompany={unhideCompany} 
              />
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="content-wrapper">
            <div className="content-header">
              <h2>Button Guide</h2>
            </div>
            <div className="content-body scrollable-content">
              <HelpSection />
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="content-wrapper">
            <div className="content-header">
              <h2>About</h2>
            </div>
            <div className="content-body scrollable-content">
              <AboutSection />
            </div>
          </div>
        );
      default:
        return (
          <div className="content-wrapper">
            <div className="content-body d-flex align-center justify-center">
              <p className="text-muted">Select a tab from the sidebar</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Popup;