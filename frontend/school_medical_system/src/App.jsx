import React from 'react';
import Navbar from './components/navbar';
import Login from './pages/login';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Login />
    </div>
  );
}

export default App;
