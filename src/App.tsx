import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <header className="main-header">
            <div className="header-content">
              <Link to="/" className="logo">
                <h1>Student Management</h1>
              </Link>
            </div>
          </header>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<StudentList />} />
              <Route path="/add" element={<StudentForm />} />
              <Route path="/edit/:id" element={<StudentForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
