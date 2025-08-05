import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { 
  Clock, 
  PlusCircle, 
  Trash3, 
  EyeSlash, 
  Eye 
} from 'react-bootstrap-icons';

const HelpSection: React.FC = () => {
  const buttonHelps = [
    {
      icon: <PlusCircle className="text-success" size={20} />,
      title: "Add Applied Time",
      description: "Record when you applied to this job",
      context: "Shows when no note exists for a company"
    },
    {
      icon: <Clock className="text-primary" size={20} />,
      title: "Update Applied Time",
      description: "Update the application timestamp to now",
      context: "Shows when a note already exists"
    },
    {
      icon: <Trash3 className="text-danger" size={20} />,
      title: "Delete Note",
      description: "Remove the job application record",
      context: "Shows when a note already exists"
    },
    {
      icon: <EyeSlash className="text-warning" size={20} />,
      title: "Hide Company",
      description: "Hide this company from future job listings",
      context: "Always available - hides jobs from this company"
    },
    {
      icon: <Eye className="text-info" size={20} />,
      title: "Unhide Company",
      description: "Show this company in job listings again",
      context: "Shows when company is currently hidden"
    }
  ];

  return (
    <div>
      <h2 className="mb-4">Button Guide</h2>
      <p className="text-muted mb-4">
        These buttons appear on LinkedIn job detail pages to help you manage your job search.
      </p>
      
      <div className="row g-3">
        {buttonHelps.map((help, index) => (
          <div key={index} className="col-12">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    {help.icon}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-2 fw-bold">{help.title}</h6>
                    <p className="mb-2 text-muted small">{help.description}</p>
                    <Badge bg="light" text="dark" className="small">
                      {help.context}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Card className="mt-4 bg-light border-0">
        <Card.Body className="p-3">
          <h6 className="mb-2">💡 Pro Tips</h6>
          <ul className="small mb-0 ps-3">
            <li>Applied timestamps help track your job search progress</li>
            <li>Hidden companies won't show up in future searches</li>
            <li>All data is stored locally - your privacy is protected</li>
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HelpSection;