import React, { useState, useMemo } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { Trash, Search } from 'react-bootstrap-icons';

interface JobNote {
  companyName: string;
  createdAt: string;
  note?: string;
}

interface NotesTableProps {
  notes: JobNote[];
  loading: boolean;
  onDeleteNote: (companyName: string) => void;
  onUpdateNote: (companyName: string, note: string) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({ notes, loading, onDeleteNote, onUpdateNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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

  // Filter notes based on search term (company name only)
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) return notes;
    
    return notes.filter(note => 
      note.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const handleEditStart = (companyName: string, currentNote: string) => {
    setEditingNote(companyName);
    setEditValue(currentNote || '');
  };

  const handleEditSave = (companyName: string) => {
    onUpdateNote(companyName, editValue);
    setEditingNote(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingNote(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, companyName: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave(companyName);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

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
    <div>
      {/* Search Bar */}
      <div className="mb-3">
        <InputGroup>
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search by company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="outline-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </InputGroup>
        {searchTerm && (
          <small className="text-muted">
            Showing {filteredNotes.length} of {notes.length} notes
          </small>
        )}
      </div>

      {/* Results Message */}
      {searchTerm && filteredNotes.length === 0 && (
        <Alert variant="warning" className="text-center">
          <p className="mb-0">No companies found matching "{searchTerm}"</p>
        </Alert>
      )}

      {/* Table */}
      {filteredNotes.length > 0 && (
        <div className="table-container">
          <Table striped hover responsive>
            <thead className="table-light">
              <tr>
                <th>Company Name</th>
                <th style={{ whiteSpace: 'nowrap', minWidth: '140px' }}>Applied At</th>
                <th>Note</th>
                <th style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((note, index) => (
                <tr key={index}>
                  <td>
                    <strong style={{ color: '#0a66c2' }}>{note.companyName}</strong>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(note.createdAt)}</td>
                  <td>
                    {editingNote === note.companyName ? (
                      <div className="d-flex gap-2">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => handleKeyPress(e, note.companyName)}
                          placeholder="Enter note..."
                          style={{ resize: 'vertical', minHeight: '60px' }}
                          autoFocus
                        />
                        <div className="d-flex flex-column gap-1">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleEditSave(note.companyName)}
                            title="Save (Enter)"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleEditCancel}
                            title="Cancel (Esc)"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="position-relative"
                        style={{ 
                          cursor: 'pointer',
                          minHeight: '24px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onClick={() => handleEditStart(note.companyName, note.note || '')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        title="Click to edit note"
                      >
                        {note.note || (
                          <span className="text-muted">Click to add note...</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDeleteNote(note.companyName)}
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
      )}
    </div>
  );
};

export default NotesTable; 