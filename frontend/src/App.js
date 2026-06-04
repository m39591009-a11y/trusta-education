import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import Students from './pages/Students';
import Groups from './pages/Groups';
import Teachers from './pages/Teachers';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import Debtors from './pages/Debtors';
import Finance from './pages/Finance';
import Settings from './pages/Settings';
import TeacherPanel from './pages/TeacherPanel';
import AdminPanel from './pages/AdminPanel';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <OwnerDashboard /> : <Navigate to="/login" />} />
        <Route path="/students" element={token ? <Students /> : <Navigate to="/login" />} />
        <Route path="/groups" element={token ? <Groups /> : <Navigate to="/login" />} />
        <Route path="/teachers" element={token ? <Teachers /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={token ? <Attendance /> : <Navigate to="/login" />} />
        <Route path="/payments" element={token ? <Payments /> : <Navigate to="/login" />} />
        <Route path="/debtors" element={token ? <Debtors /> : <Navigate to="/login" />} />
        <Route path="/finance" element={token ? <Finance /> : <Navigate to="/login" />} />
        <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/teacher" element={token ? <TeacherPanel /> : <Navigate to="/login" />} />
        <Route path="/teacher/groups" element={token ? <TeacherPanel /> : <Navigate to="/login" />} />
        <Route path="/teacher/schedule" element={token ? <TeacherPanel /> : <Navigate to="/login" />} />
        <Route path="/admin-panel" element={token ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;