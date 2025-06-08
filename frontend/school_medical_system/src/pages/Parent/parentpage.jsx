import React, { useState } from 'react';
import Header from '../../components/ParentComponents/Header';
import NavigationTabs from '../../components/ParentComponents/NavigationTabs';
import WelcomeSection from '../../components/ParentComponents/WelcomeSection';
import ChildCard from '../../components/ParentComponents/ChildCard';
import QuickActions from '../../components/ParentComponents/QuickActions';
import OverviewContent from '../../components/ParentComponents/TabContents/OverviewContent';
import MedicineRequestContent from '../../components/ParentComponents/TabContents/MedicineRequestContent';
import { MedicineRequestProvider } from '../../services/medicineRequestService';

const ParentPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMedicineRequest, setShowMedicineRequest] = useState(false);

  // Mock data - in real app, this would come from an API
  const parentData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    children: [
      {
        id: 1,
        name: "Emma Johnson",
        age: 10,
        grade: "5th Grade",
        healthStatus: "Healthy",
        upcomingAppointments: 1,
        recentReports: 2
      },
      {
        id: 2,
        name: "James Johnson",
        age: 8,
        grade: "3rd Grade",
        healthStatus: "Check-up needed",
        upcomingAppointments: 2,
        recentReports: 1
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'records', label: 'Health Records' },
    { id: 'notifications', label: 'Notifications' }
  ];

  const handleQuickAction = (actionId) => {
    if (actionId === 'medicine-request') {
      setShowMedicineRequest(true);
    }
  };

  const handleBackToMain = () => {
    setShowMedicineRequest(false);
  };

  const renderContent = () => {
    if (showMedicineRequest) {
      return (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Medicine Requests</h2>
            <button 
              onClick={handleBackToMain}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>
          <MedicineRequestProvider>
            <MedicineRequestContent />
          </MedicineRequestProvider>
        </div>
      );
    }

    return (
      <>
        <NavigationTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Tab Content */}
        {(() => {
          switch (activeTab) {
            case 'overview':
              return <OverviewContent />;
            case 'appointments':
              return <div>Appointments Content (Coming Soon)</div>;
            case 'records':
              return <div>Medical Records Content (Coming Soon)</div>;
            case 'notifications':
              return <div>Notifications Content (Coming Soon)</div>;
            default:
              return <div className="p-6">Content for {activeTab} tab</div>;
          }
        })()}

        {/* Children Cards Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Children</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {parentData.children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <QuickActions onActionClick={handleQuickAction} />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <Header email={parentData.email} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <WelcomeSection name={parentData.name} />
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ParentPage;