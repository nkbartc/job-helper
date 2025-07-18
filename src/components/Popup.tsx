import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

interface JobNote {
  companyName: string;
  createdAt: string;
  note?: string;
}

const Popup: React.FC = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState<JobNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const result = await chrome.storage.local.get(['jobNotes']);
      const notesData = result.jobNotes || {};
      
      // Convert object to array for table display
      const notesArray = Object.entries(notesData).map(([companyName, data]: [string, any]) => ({
        companyName,
        createdAt: data.createdAt,
        note: data.note || ''
      }));
      
      setNotes(notesArray);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteNote = async (companyName: string) => {
    if (window.confirm(`Are you sure you want to delete the note for ${companyName}?`)) {
      try {
        const result = await chrome.storage.local.get(['jobNotes']);
        const notesData = result.jobNotes || {};
        delete notesData[companyName];
        await chrome.storage.local.set({ jobNotes: notesData });
        await loadNotes(); // Reload the notes
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const renderNotesTable = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (notes.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          <p className="mb-0">No notes found. Start by adding notes from LinkedIn Jobs pages.</p>
        </Alert>
      );
    }

    return (
      <div className="table-container">
        <Table striped hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Company Name</th>
              <th>Created At</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={index}>
                <td>
                  <strong>{note.companyName}</strong>
                </td>
                <td>{formatDate(note.createdAt)}</td>
                <td>{note.note || 'No note'}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteNote(note.companyName)}
                    title="Delete note"
                  >
                    <Trash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <div>
            <h2 className="mb-4">Job Notes</h2>
            {renderNotesTable()}
          </div>
        );
      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  return (
    <div className="d-flex h-100">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="p-3 border-bottom">
          <h5 className="mb-0">Job Notes Saver</h5>
        </div>
        <nav className="nav flex-column">
          <button
            className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📝 Notes
          </button>
          {/* Add more nav items here in the future */}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Popup; 