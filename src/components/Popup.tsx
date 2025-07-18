import React, { useState } from 'react';
import Sidebar from './Sidebar';
import NotesTable from './NotesTable';
import AboutSection from './AboutSection';
import { useNotes } from '../hooks/useNotes';

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const { notes, loading, deleteNote } = useNotes();

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
      case 'about':
        return <AboutSection />;
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="d-flex h-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Popup; 