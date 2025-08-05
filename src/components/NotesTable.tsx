import React, { useState, useMemo } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup, Collapse } from 'react-bootstrap';
import { Trash, Search, ChevronDown, ChevronRight } from 'react-bootstrap-icons';

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
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

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

  const toggleExpanded = (companyName: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(companyName)) {
      newExpanded.delete(companyName);
      // If we're collapsing and currently editing, cancel edit
      if (editingNote === companyName) {
        handleEditCancel();
      }
    } else {
      newExpanded.add(companyName);
    }
    setExpandedNotes(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
                <th style={{ width: '35%', minWidth: '150px', maxWidth: '200px' }}>Company Name</th>
                <th style={{ width: '25%', minWidth: '120px', maxWidth: '160px' }}>Note</th>
                <th style={{ width: '20%', whiteSpace: 'nowrap', minWidth: '140px' }}>Applied At</th>
                <th style={{ width: '20%', whiteSpace: 'nowrap', minWidth: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.map((note, index) => (
                <React.Fragment key={index}>
                  {/* Main row */}
                  <tr>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#0a66c2' }} title={note.companyName}>{note.companyName}</strong>
                    </td>
                    <td style={{ maxWidth: '160px' }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div 
                          className="flex-grow-1"
                          style={{ 
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s ease',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          onClick={() => toggleExpanded(note.companyName)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Click to expand/collapse note"
                        >
                          {note.note ? (
                            <span>{truncateText(note.note, 30)}</span>
                          ) : (
                            <span className="text-muted">No note</span>
                          )}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpanded(note.companyName)}
                          className="p-1 ms-2 flex-shrink-0"
                          title={expandedNotes.has(note.companyName) ? "Collapse" : "Expand"}
                        >
                          {expandedNotes.has(note.companyName) ? 
                            <ChevronDown size={16} /> : 
                            <ChevronRight size={16} />
                          }
                        </Button>
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(note.createdAt)}</td>
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
                  
                  {/* Expanded row */}
                  {expandedNotes.has(note.companyName) && (
                    <tr>
                      <td colSpan={4} className="p-0" style={{ borderTop: 'none' }}>
                        <Collapse in={expandedNotes.has(note.companyName)}>
                          <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', margin: '4px' }}>
                            <div className="mb-2">
                              <strong className="text-muted small">Full Note:</strong>
                            </div>
                            {editingNote === note.companyName ? (
                              <div className="d-flex gap-2">
                                <Form.Control
                                  as="textarea"
                                  rows={4}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, note.companyName)}
                                  placeholder="Enter note..."
                                  style={{ 
                                    resize: 'vertical', 
                                    minHeight: '100px',
                                    width: '100%'
                                  }}
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
                                  minHeight: '60px',
                                  padding: '12px',
                                  backgroundColor: 'white',
                                  borderRadius: '4px',
                                  border: '1px solid #dee2e6',
                                  transition: 'border-color 0.2s ease',
                                  whiteSpace: 'pre-wrap',
                                  lineHeight: '1.5'
                                }}
                                onClick={() => handleEditStart(note.companyName, note.note || '')}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#0a66c2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#dee2e6';
                                }}
                                title="Click to edit note"
                              >
                                {note.note || (
                                  <span className="text-muted">Click to add note...</span>
                                )}
                              </div>
                            )}
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default NotesTable; 