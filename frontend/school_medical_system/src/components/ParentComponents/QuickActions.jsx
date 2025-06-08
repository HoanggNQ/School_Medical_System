import React from 'react';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    { id: 'medicine-request', label: 'Request Medicine' },
    { id: 'health-form', label: 'Submit Health Form' },
    { id: 'nurse-contact', label: 'Contact School Nurse' },
    { id: 'medical-history', label: 'View Medical History' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(action => (
          <button 
            key={action.id}
            onClick={() => onActionClick && onActionClick(action.id)}
            className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex items-center justify-center text-gray-700 hover:text-blue-600"
          >
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;