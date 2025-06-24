import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import VerificationForm from '@/components/auth/VerificationForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import UserManagement from '@/components/admin/UserManagement';
import VaccinationManagement from '@/components/admin/VaccinationManagement';
import MedicineManagement from '@/components/nurse/MedicineManagement';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import TestSidebar from './components/layout/TestSidebar';
import StudentHealthProfile from './components/student/StudentHealthProfile';
import StudentVaccinationHistory from './components/student/StudentVaccinationHistory';
import StudentAppointments from './components/student/StudentAppointments';
import ParentChildrenHealth from './components/parent/ParentChildrenHealth';
import ParentVaccinationSchedule from './components/parent/ParentVaccinationSchedule';
import ParentNotifications from './components/parent/ParentNotifications';
import CampaignManagement from '@/components/admin/CampaignManagement';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login');
  const [verificationEmail, setVerificationEmail] = useState('');

  const switchToRegister = () => setCurrentForm('register');
  const switchToLogin = () => setCurrentForm('login');
  const switchToForgotPassword = () => setCurrentForm('forgot');
  const switchToVerification = (email) => {
    setVerificationEmail(email);
    setCurrentForm('verification');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img alt="Medical background pattern" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1652652128622-6d24fe5739bb" />
      </div>

      <div className="absolute top-10 left-10 animate-float">
        <div className="w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      </div>
      <div className="absolute top-1/2 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <AnimatePresence mode="wait">
        {currentForm === 'login' && (
          <LoginForm
            key="login"
            onSwitchToRegister={switchToRegister}
            onSwitchToForgotPassword={switchToForgotPassword}
          />
        )}
        {currentForm === 'register' && (
          <RegisterForm
            key="register"
            onSwitchToLogin={switchToLogin}
            onSwitchToVerification={switchToVerification}
          />
        )}
        {currentForm === 'verification' && (
          <VerificationForm
            key="verification"
            email={verificationEmail}
            onSwitchToLogin={switchToLogin}
          />
        )}
        {currentForm === 'forgot' && (
          <ForgotPasswordForm
            key="forgot"
            onSwitchToLogin={switchToLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  console.log(user);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    toast({
      title: "Truy cập bị từ chối",
      description: "Bạn không có quyền truy cập trang này.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname.substring(1);
    setActiveTab(path || 'dashboard');
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <TestSidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gradient-bg text-white">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-center p-8 bg-white/10 rounded-xl shadow-2xl glass-effect"
    >
      <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
      <p className="text-2xl mb-2">Trang không tìm thấy</p>
      <p className="text-lg mb-6">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
      <Button onClick={() => window.history.back()} className="btn-primary">
        Quay lại
      </Button>
    </motion.div>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-64">
    <p className="text-gray-500 text-lg">{title} đang được phát triển...</p>
  </div>
);


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />

      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SCHOOL_NURSE', 'STUDENT', 'PARENT']} />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />


          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
            <Route path="users" element={<UserManagement />} />
          </Route>



          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'SCHOOL_NURSE']} />}>
            <Route path="vaccinations" element={<VaccinationManagement />} />
          </Route>


          <Route element={<ProtectedRoute allowedRoles={['SCHOOL_NURSE']} />}>
            <Route path="medicines" element={<MedicineManagement />} />
            {/* <Route path="health-records" element={<PlaceholderPage title="Trang hồ sơ sức khỏe" />} /> */}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
            <Route path="reports" element={<PlaceholderPage title="Trang báo cáo" />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="settings" element={<PlaceholderPage title="Trang cài đặt" />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>

            <Route path="health-profile" element={<StudentHealthProfile />} />
            <Route path="vaccination-history" element={<StudentVaccinationHistory />} />
            <Route path="appointments" element={<StudentAppointments />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>

            <Route path="children-health" element={<ParentChildrenHealth />} />
            <Route path="vaccination-schedule" element={<ParentVaccinationSchedule />} />
            <Route path="notifications" element={<ParentNotifications />} />
            {/* <Route path="notifications" element={<ParentNotifications />} /> */}

          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="campaigns" element={<CampaignManagement />} />
            {/* <Route path="campaigns" element={<CampaignManagement />} /> */}
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function Root() {
  return (
    <AuthProvider>
      <Router>
        <App />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default Root;