import React from 'react';

const WelcomeSection = ({ name }) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900">Welcome, {name}</h2>
      <p className="text-gray-600 mt-2">Manage your children's health records and appointments</p>
    </div>
  );
};

export default WelcomeSection; 