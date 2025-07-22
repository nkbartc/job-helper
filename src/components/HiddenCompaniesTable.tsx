import React, { useState, useMemo } from 'react';
import { Table, Button, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import { Eye, Search } from 'react-bootstrap-icons';

interface HiddenCompany {
  companyName: string;
  reason: string;
  hiddenAt: string;
}

interface HiddenCompaniesTableProps {
  hiddenCompanies: HiddenCompany[];
  loading: boolean;
  onUnhideCompany: (companyName: string) => void;
}

const HiddenCompaniesTable: React.FC<HiddenCompaniesTableProps> = ({ 
  hiddenCompanies, 
  loading, 
  onUnhideCompany 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) return hiddenCompanies;
    
    return hiddenCompanies.filter(company => 
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hiddenCompanies, searchTerm]);

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
                <th>Company Name</th>
                <th>Reason</th>
                <th style={{ whiteSpace: 'nowrap', minWidth: '140px' }}>Hidden At</th>
                <th style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr key={index}>
                  <td>
                    <span style={{ color: '#6c757d'}}>
                      {company.companyName}
                    </span>
                  </td>
                  <td>{company.reason}</td>
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
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default HiddenCompaniesTable; 