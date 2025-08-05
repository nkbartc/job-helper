import React from 'react';
import { Card } from 'react-bootstrap';
import { Person, Linkedin, Github, Globe } from 'react-bootstrap-icons';

const AboutSection: React.FC = () => {
  const links = [
    {
      icon: <Linkedin className="text-primary" size={20} />,
      label: "LinkedIn Profile",
      url: "https://www.linkedin.com/in/bart-chou/",
      description: "Connect with me professionally"
    },
    {
      icon: <Github className="text-dark" size={20} />,
      label: "GitHub",
      url: "https://github.com/nkbartc",
      description: "Check out my projects"
    },
    {
      icon: <Globe className="text-info" size={20} />,
      label: "Privacy Policy",
      url: "https://nkbartc.github.io/job-notes-privacy-policy/",
      description: "Learn about data privacy"
    }
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <Card className="card-custom border-0 mb-4">
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-3">
              <Person className="text-primary me-3" size={28} />
              <div>
                <h5 className="mb-1 fw-medium">Bart Chou</h5>
                <p className="text-muted mb-0 fs-sm">Extension Developer</p>
              </div>
            </div>
            
            <p className="text-secondary mb-3">
              Job Notes Saver helps job seekers organize their LinkedIn job search with 
              privacy-focused, local-only data storage. Track applications, hide unwanted 
              companies, and manage your job search efficiently.
            </p>

            <div className="row g-3">
              {links.map((link, index) => (
                <div key={index} className="col-12">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center p-3 text-decoration-none border rounded"
                    style={{ 
                      borderColor: 'var(--border-light)',
                      transition: 'all var(--transition-fast)',
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.backgroundColor = 'var(--background-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-light)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="me-3">
                      {link.icon}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-medium">{link.label}</h6>
                      <p className="mb-0 text-muted fs-sm">{link.description}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card className="card-custom border-0" style={{ background: 'var(--background-light)' }}>
          <Card.Body className="p-4">
            <h6 className="mb-3 fw-medium">🔒 Privacy Features</h6>
            <div className="row g-2">
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span className="fs-sm">All data stored locally in your browser</span>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span className="fs-sm">No external servers or data transmission</span>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span className="fs-sm">Full control over your job search data</span>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <span className="text-success me-2">✓</span>
                  <span className="fs-sm">Open source and transparent</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AboutSection;