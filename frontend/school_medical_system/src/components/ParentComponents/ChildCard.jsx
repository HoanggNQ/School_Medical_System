import React from 'react';

const ChildCard = ({ child }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{child.name}</h3>
          <p className="text-gray-500">{child.grade} • Age {child.age}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
          child.healthStatus === 'Healthy' 
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {child.healthStatus}
        </span>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors duration-200">
          <p className="text-sm text-gray-500">Upcoming Appointments</p>
          <p className="text-lg font-semibold text-gray-900">{child.upcomingAppointments}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors duration-200">
          <p className="text-sm text-gray-500">Recent Reports</p>
          <p className="text-lg font-semibold text-gray-900">{child.recentReports}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200">
          View Details
        </button>
        <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200">
          Schedule Check-up
        </button>
      </div>
    </div>
  );
};

export default ChildCard; 