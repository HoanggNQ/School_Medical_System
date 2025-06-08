import React from 'react';

const OverviewContent = () => {
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      description: 'Dental Check-up scheduled for Emma',
      date: '2024-02-15',
      status: 'upcoming'
    },
    {
      id: 2,
      type: 'vaccination',
      description: 'James completed annual flu shot',
      date: '2024-02-10',
      status: 'completed'
    },
    {
      id: 3,
      type: 'report',
      description: 'Health examination report available for Emma',
      date: '2024-02-08',
      status: 'new'
    }
  ];

  // Mock data for health updates
  const healthUpdates = [
    {
      id: 1,
      childName: 'Emma',
      update: 'Vision screening due next month',
      priority: 'medium'
    },
    {
      id: 2,
      childName: 'James',
      update: 'Allergy medication needs renewal',
      priority: 'high'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700">Total Appointments</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">5</p>
          <p className="text-sm text-blue-600 mt-1">2 upcoming this month</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-green-700">Health Forms</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">8</p>
          <p className="text-sm text-green-600 mt-1">All up to date</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-purple-700">Vaccinations</h3>
          <p className="text-3xl font-bold text-purple-900 mt-2">12/14</p>
          <p className="text-sm text-purple-600 mt-1">2 upcoming</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-1">
                <p className="text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                activity.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Updates */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Updates</h3>
        <div className="space-y-4">
          {healthUpdates.map((update) => (
            <div 
              key={update.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-200 transition-colors duration-200"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{update.childName}</p>
                <p className="text-gray-600 mt-1">{update.update}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                update.priority === 'high' ? 'bg-red-100 text-red-800' :
                update.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {update.priority.charAt(0).toUpperCase() + update.priority.slice(1)} Priority
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left">
          <h4 className="font-semibold text-gray-900">Schedule Appointment</h4>
          <p className="text-sm text-gray-500 mt-1">Book medical visits</p>
        </button>
        <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left">
          <h4 className="font-semibold text-gray-900">Update Health Forms</h4>
          <p className="text-sm text-gray-500 mt-1">Keep records current</p>
        </button>
        <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left">
          <h4 className="font-semibold text-gray-900">View Reports</h4>
          <p className="text-sm text-gray-500 mt-1">Access medical history</p>
        </button>
        <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-left">
          <h4 className="font-semibold text-gray-900">Emergency Contacts</h4>
          <p className="text-sm text-gray-500 mt-1">Update contact info</p>
        </button>
      </div>
    </div>
  );
};

export default OverviewContent; 