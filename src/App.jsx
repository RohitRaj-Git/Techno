import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public & Auth Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import DesignPreview from './pages/DesignPreview';

// Auth Guard
import AuthGuard from './components/AuthGuard';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import GuardianLayout from './layouts/GuardianLayout';

// Patient Portal Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PrescriptionUpload from './pages/patient/PrescriptionUpload';
import PrescriptionReview from './pages/patient/PrescriptionReview';
import MedicineSchedule from './pages/patient/MedicineSchedule';
import MedicineHistory from './pages/patient/MedicineHistory';
import MedicineSafety from './pages/patient/MedicineSafety';
import PatientProfile from './pages/patient/PatientProfile';

// Guardian Portal Pages
import GuardianDashboard from './pages/guardian/GuardianDashboard';
import MedicationMonitoring from './pages/guardian/MedicationMonitoring';
import TelegramSimulation from './pages/guardian/TelegramSimulation';
import PatientDetails from './pages/guardian/PatientDetails';
import GuardianProfile from './pages/guardian/GuardianProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/preview" element={<DesignPreview />} />

        {/* Patient Portal Routes (Protected) */}
        <Route path="/patient" element={<AuthGuard><PatientLayout /></AuthGuard>}>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="upload" element={<PrescriptionUpload />} />
          <Route path="review" element={<PrescriptionReview />} />
          <Route path="schedule" element={<MedicineSchedule />} />
          <Route path="history" element={<MedicineHistory />} />
          <Route path="safety" element={<MedicineSafety />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Guardian Portal Routes (Protected) */}
        <Route path="/guardian" element={<AuthGuard><GuardianLayout /></AuthGuard>}>
          <Route index element={<Navigate to="/guardian/dashboard" replace />} />
          <Route path="dashboard" element={<GuardianDashboard />} />
          <Route path="monitoring" element={<MedicationMonitoring />} />
          <Route path="telegram" element={<TelegramSimulation />} />
          <Route path="alerts" element={<Navigate to="/guardian/telegram" replace />} />
          <Route path="patient" element={<PatientDetails />} />
          <Route path="profile" element={<GuardianProfile />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
