import React from 'react'
import { useNavigate } from 'react-router-dom';

  const BackToLogin = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/Login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Expired or Access Denied</h2>
        <p className="text-gray-600 mb-6">
          Please log in to access the School Medical System.
        </p>
        <button
          onClick={handleBackToLogin}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default BackToLogin