import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        {/* <Navbar /> Uncomment if you want the navbar */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
