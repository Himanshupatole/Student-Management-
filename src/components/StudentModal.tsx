import React from 'react';
import type { Student } from '../types/Student';

interface StudentModalProps {
  student: Student;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{student.name}</h2>
        
        <div className="detail-grid">
          <div className="detail-item">
            <strong>Gender</strong>
            <span>{student.gender}</span>
          </div>
          <div className="detail-item">
            <strong>Date of Birth</strong>
            <span>{new Date(student.dob).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <strong>Course</strong>
            <span>{student.course}</span>
          </div>
          <div className="detail-item">
            <strong>Admission Year</strong>
            <span>{student.yearOfAdmission}</span>
          </div>
          <div className="detail-item">
            <strong>Email</strong>
            <span>{student.email}</span>
          </div>
          <div className="detail-item">
            <strong>Phone</strong>
            <span>{student.phone}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Address</h3>
          <p>{student.address.street}</p>
          <p>{student.address.city}, {student.address.state} - {student.address.postalCode}</p>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
