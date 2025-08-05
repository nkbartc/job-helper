import React, { useState, useMemo } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup, Collapse } from 'react-bootstrap';
import { Eye, Search, ChevronDown, ChevronRight } from 'react-bootstrap-icons';

interface HiddenCompany {
  companyName: string;
  reason: string;
  hiddenAt: string;
}

interface HiddenCompaniesTableProps {
  hiddenCompanies: HiddenCompany[];
  loading: boolean;
  onUnhideCompany: (companyName: string) => void;
  onUpdateReason: (companyName: string, reason: string) => void;
}

const HiddenCompaniesTable: React.FC<HiddenCompaniesTableProps> = ({ 
  hiddenCompanies, 
  loading, 
  onUnhideCompany,
  onUpdateReason 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingReason, setEditingReason] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(new Set());

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return hiddenCompanies;
    
    return hiddenCompanies.filter(company => 
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hiddenCompanies, searchTerm]);

  const handleEditStart = (companyName: string, currentReason: string) => {
    setEditingReason(companyName);
    setEditValue(currentReason || '');
  };

  const handleEditSave = (companyName: string) => {
    onUpdateReason(companyName, editValue);
    setEditingReason(null);
    setEditValue('');
  };

  const handleEditCancel = () => {
    setEditingReason(null);
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
    const newExpanded = new Set(expandedReasons);
    if (newExpanded.has(companyName)) {
      newExpanded.delete(companyName);
      // If we're collapsing and currently editing, cancel edit
      if (editingReason === companyName) {
        handleEditCancel();
      }
    } else {
      newExpanded.add(companyName);
    }
    setExpandedReasons(newExpanded);
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

  if (hiddenCompanies.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <p className="mb-0">No hidden companies. Companies you hide from LinkedIn Jobs will appear here.</p>
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
            placeholder="Search hidden companies..."
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
            Showing {filteredCompanies.length} of {hiddenCompanies.length} hidden companies
          </small>
        )}
      </div>

      {/* Results Message */}
      {searchTerm && filteredCompanies.length === 0 && (
        <Alert variant="warning" className="text-center">
          <p className="mb-0">No hidden companies found matching "{searchTerm}"</p>
        </Alert>
      )}

      {/* Table */}
      {filteredCompanies.length > 0 && (
        <div className="table-container">
          <Table striped hover responsive>
            <thead className="table-light">
              <tr>
                <th style={{ width: '25%', minWidth: '150px', maxWidth: '180px' }}>Company Name</th>
                <th style={{ width: '35%', minWidth: '180px', maxWidth: '220px' }}>Reason</th>
                <th style={{ width: '20%', whiteSpace: 'nowrap', minWidth: '140px' }}>Hidden At</th>
                <th style={{ width: '20%', whiteSpace: 'nowrap', minWidth: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <React.Fragment key={index}>
                  {/* Main row */}
                  <tr>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#6c757d'}} title={company.companyName}>
                        {company.companyName}
                      </span>
                    </td>
                    <td style={{ maxWidth: '220px' }}>
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
                          onClick={() => toggleExpanded(company.companyName)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          title="Click to expand/collapse reason"
                        >
                          {company.reason ? (
                            <span>{truncateText(company.reason, 40)}</span>
                          ) : (
                            <span className="text-muted">No reason</span>
                          )}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => toggleExpanded(company.companyName)}
                          className="p-1 ms-2 flex-shrink-0"
                          title={expandedReasons.has(company.companyName) ? "Collapse" : "Expand"}
                        >
                          {expandedReasons.has(company.companyName) ? 
                            <ChevronDown size={16} /> : 
                            <ChevronRight size={16} />
                          }
                        </Button>
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(company.hiddenAt)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => onUnhideCompany(company.companyName)}
                        title="Unhide company"
                      >
                        <Eye /> Unhide
                      </Button>
                    </td>
                  </tr>
                  
                  {/* Expanded row */}
                  {expandedReasons.has(company.companyName) && (
                    <tr>
                      <td colSpan={4} className="p-0" style={{ borderTop: 'none' }}>
                        <Collapse in={expandedReasons.has(company.companyName)}>
                          <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', margin: '4px' }}>
                            <div className="mb-2">
                              <strong className="text-muted small">Full Reason:</strong>
                            </div>
                            {editingReason === company.companyName ? (
                              <div className="d-flex gap-2">
                                <Form.Control
                                  as="textarea"
                                  rows={4}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => handleKeyPress(e, company.companyName)}
                                  placeholder="Enter reason..."
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
                                    onClick={() => handleEditSave(company.companyName)}
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
                                onClick={() => handleEditStart(company.companyName, company.reason)}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = '#0a66c2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = '#dee2e6';
                                }}
                                title="Click to edit reason"
                              >
                                {company.reason || (
                                  <span className="text-muted">Click to add reason...</span>
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

export default HiddenCompaniesTable; 