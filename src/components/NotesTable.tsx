import React from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

interface JobNote {
  companyName: string;
  createdAt: string;
  note?: string;
}

interface NotesTableProps {
  notes: JobNote[];
  loading: boolean;
  onDeleteNote: (companyName: string) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({ notes, loading, onDeleteNote }) => {
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
            <th style={{ whiteSpace: 'nowrap', minWidth: '140px' }}>Created At</th>
            <th>Note</th>
            <th style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, index) => (
            <tr key={index}>
              <td>
                <strong>{note.companyName}</strong>
              </td>
              <td style={{ whiteSpace: 'nowrap' }}>{formatDate(note.createdAt)}</td>
              <td>{note.note || 'No note'}</td>
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
  );
};

export default NotesTable; 