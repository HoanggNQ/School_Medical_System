import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/login';
import Signup from './pages/Signup/signup';
import BackToLogin from './pages/Signup/backToLogin';
import ParentPage from './pages/Parent/parentpage';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/parentpage" replace />} />
          <Route path="/parentpage" element={<ParentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/backtologin" element={<BackToLogin />} />
          <Route path="*" element={<Navigate to="/parentpage" replace />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
