import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { deleteStudent } from '../store/studentSlice';
import { useNavigate } from 'react-router-dom';
import type { Student } from '../types/Student';
import StudentModal from './StudentModal';
import { Search, Plus, Edit2, Trash2, Users } from 'lucide-react';

const StudentList: React.FC = () => {
  const students = useSelector((state: RootState) => state.students.students);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterYear, setFilterYear] = useState<number | ''>('');
  
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const courses = useMemo(() => Array.from(new Set(students.map(s => s.course))), [students]);
  const years = useMemo(() => Array.from(new Set(students.map(s => s.yearOfAdmission))).sort((a,b)=>b-a), [students]);

  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(lowerTerm) ||
        s.course.toLowerCase().includes(lowerTerm) ||
        s.yearOfAdmission.toString().includes(lowerTerm)
      );
    }

    if (filterCourse) {
      result = result.filter(s => s.course === filterCourse);
    }
    if (filterYear) {
      result = result.filter(s => s.yearOfAdmission === filterYear);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, filterCourse, filterYear, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
  const currentStudents = filteredAndSortedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${name} from the system?`)) {
      dispatch(deleteStudent(id));
      setCurrentPage(1);
    }
  };

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getCourseBadgeColor = (course: string) => {
    const colors = ['badge-blue', 'badge-purple', 'badge-green', 'badge-orange'];
    let hash = 0;
    for (let i = 0; i < course.length; i++) hash = course.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="list-container">
      <div className="header-actions">
        <div>
          <h2>Students Directory</h2>
          <p className="subtitle">Manage and view all registered students</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/add')}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          Add Student
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>
        <select value={filterCourse} onChange={(e) => { setFilterCourse(e.target.value); setCurrentPage(1); }}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value ? Number(e.target.value) : ''); setCurrentPage(1); }}>
          <option value="">All Admission Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('course')}>
                Enrolled Course {sortField === 'course' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('yearOfAdmission')}>
                Year {sortField === 'yearOfAdmission' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">
                    <Users size={48} className="empty-icon" />
                    <h3>No students found</h3>
                    <p>Try adjusting your search or add a new student.</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentStudents.map(student => (
                <tr key={student.id} onClick={() => setSelectedStudent(student)} className="clickable-row">
                  <td className="student-name-cell">
                    <div className="avatar">{student.name.charAt(0).toUpperCase()}</div>
                    <div className="student-info">
                      <span className="name">{student.name}</span>
                      <span className="email">{student.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getCourseBadgeColor(student.course)}`}>
                      {student.course}
                    </span>
                  </td>
                  <td>{student.yearOfAdmission}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={(e) => { e.stopPropagation(); navigate(`/edit/${student.id}`); }}
                      title="Edit Student"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={(e) => handleDelete(student.id, student.name, e)}
                      title="Delete Student"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      )}

      {selectedStudent && (
        <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default StudentList;
