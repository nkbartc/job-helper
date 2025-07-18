import React from 'react';
import { Card } from 'react-bootstrap';
import { Person, Linkedin } from 'react-bootstrap-icons';

const AboutSection: React.FC = () => {
  return (
    <div>
      <h2 className="mb-4">About</h2>
      <Card>
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <Person className="me-2" size={24} />
            <h5 className="mb-0">Author</h5>
          </div>
          <p className="mb-3"><strong>Bart Chou</strong></p>
          
          <div className="d-flex align-items-center">
            <Linkedin className="me-2" size={24} />
            <h6 className="mb-0">LinkedIn</h6>
          </div>
          <a 
            href="https://www.linkedin.com/in/bart-chou/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            https://www.linkedin.com/in/bart-chou/
          </a>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AboutSection; 