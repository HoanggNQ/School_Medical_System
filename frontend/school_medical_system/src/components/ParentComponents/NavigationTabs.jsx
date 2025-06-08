import React from 'react';

const NavigationTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="sticky top-[73px] bg-gray-50 py-4 z-40 mb-8">
      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default NavigationTabs; 