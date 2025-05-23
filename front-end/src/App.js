// import './App.css';
// import { Routes, Route } from 'react-router-dom';
// import HomePage from './Pages/Website/HomePage';
// import AboutPage from './Pages/Website/AboutPage';
// import Specialists from './Pages/Website/Specialists';
// import ProtectedRoute from './Components/ProtectedRoute';
// import AdminLogin from './Pages/Auth/AdminLogin';
// import PatientLogin from './Pages/Auth/PatientLogin';
// import PatientRegister from './Pages/Auth/PatientRegister';
// import DoctorLogin from './Pages/Auth/DoctorLogin';
// import DoctorRegister from './Pages/Auth/DoctorRegister';
// import PatientDashboard from './Pages/Dashboard/Patient/PatientDashboard';
// import DoctorDashboard from './Pages/Dashboard/Doctor/DoctorDashboard';
// import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard';
// import ManageDomains from './Pages/Dashboard/Admin/ManageDomain/ManageDomains';
// import Profile from './Pages/Dashboard/Admin/Profile';
// import ManageDoctors from './Pages/Dashboard/Admin/ManageDoctor/ManageDoctors';
// import DomainDetail from './Pages/Dashboard/Admin/ManageDomain/DomainDetail';
// import ManageTests from './Pages/Dashboard/Admin/ManageTests/ManageTests';
// import TestDetail from './Pages/Dashboard/Admin/ManageTests/TestDetail';
// import QuestionDetail from './Pages/Dashboard/Admin/ManageTests/QuestionDetail';

// import ProfileDoctor from './Pages/Dashboard/Doctor/Profile/ProfileDoctor';
// import ManageBookingSchedule from './Pages/Dashboard/Doctor/ManageBookingSchedule/ManageBookingSchedule';
// import ViewListAppointment from './Pages/Dashboard/Doctor/ManageBookingSchedule/ViewListAppointment';
// import GenerateSessions from './Pages/Dashboard/Doctor/ManageBookingSchedule/GenerateSessions';

// import CreateSession from './Pages/Dashboard/Doctor/ManageBookingSchedule/CreateSession';


// import ProfilePatient from './Pages/Dashboard/Patient/Profile/ProfilePatient';

// function App() {
//   return (
//     <div className="App">
//       <Routes>
//         {/* Admin */}
//         <Route path="/login/admin" element={<AdminLogin />} />
//         {/* Public Routes */}
//         <Route path="/" element={<HomePage />} />
//         <Route path="/specialists" element={<Specialists />} />
//         <Route path="/about" element={<AboutPage />} />
//         {/* Patient Auth Routes */}
//         <Route path="/patient/login" element={<PatientLogin />} />
//         <Route path="/patient/signup" element={<PatientRegister />} />
//         {/* Doctor Auth Routes */}
//         <Route path="/doctor/login" element={<DoctorLogin />} />
//         <Route path="/doctor/signup" element={<DoctorRegister />} />
//         {/* Protected Dashboard Routes */}
//         <Route path="/patient/dashboard" element={<ProtectedRoute allowedUserType="patient"><PatientDashboard /></ProtectedRoute>} />
//         <Route path="/doctor/dashboard" element={<ProtectedRoute allowedUserType="doctor"><DoctorDashboard /></ProtectedRoute>} />
//         <Route path="/admin/dashboard" element={<ProtectedRoute allowedUserType="admin"><AdminDashboard /></ProtectedRoute>} />
//         <Route path="/admin/manage-domains" element={<ProtectedRoute allowedUserType="admin"><ManageDomains /></ProtectedRoute>} />
//         <Route path="/admin/profile" element={<ProtectedRoute allowedUserType="admin"><Profile /></ProtectedRoute>} />
//         <Route path="/admin/manage-doctors" element={<ProtectedRoute allowedUserType="admin"><ManageDoctors /></ProtectedRoute>} />
//         <Route path="/admin/manage-domains/:DomainID" element={<ProtectedRoute allowedUserType="admin"><DomainDetail /></ProtectedRoute>} />
//         <Route path="/admin/manage-tests" element={<ProtectedRoute allowedUserType="admin"><ManageTests /></ProtectedRoute>} />
//         <Route path="/admin/manage-tests/:TestID" element={<ProtectedRoute allowedUserType="admin"><TestDetail /></ProtectedRoute>} />
//         <Route path="/admin/manage-questions/:QuestionID" element={<ProtectedRoute allowedUserType="admin"><QuestionDetail /></ProtectedRoute>} />
//         <Route path="/doctor/profileDoctor" element={<ProtectedRoute allowedUserType="doctor"><ProfileDoctor /></ProtectedRoute>} />
//         <Route path="/doctor/manage-booking-schedule" element={<ProtectedRoute allowedUserType="doctor"><ManageBookingSchedule /></ProtectedRoute>} />
//         <Route path="/doctor/ViewListAppointment" element={<ProtectedRoute allowedUserType="doctor"><ViewListAppointment /></ProtectedRoute>} />
        
//         <Route path="/doctor/generate-sessions" element={
//               <ProtectedRoute allowedUserType="doctor">
//                 <GenerateSessions />
//               </ProtectedRoute>
//             } />
//             <Route path="/doctor/create-session" element={
//               <ProtectedRoute allowedUserType="doctor">
//                 <CreateSession />
//               </ProtectedRoute>
//             } />
//         <Route path="/patient/profilePatient" element={<ProtectedRoute allowedUserType="patient"><ProfilePatient /></ProtectedRoute>} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/Website/HomePage';
import AboutPage from './Pages/Website/AboutPage';
import Specialists from './Pages/Website/Specialists';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminLogin from './Pages/Auth/AdminLogin';
import PatientLogin from './Pages/Auth/PatientLogin';
import PatientRegister from './Pages/Auth/PatientRegister';
import DoctorLogin from './Pages/Auth/DoctorLogin';
import DoctorRegister from './Pages/Auth/DoctorRegister';
import PatientDashboard from './Pages/Dashboard/Patient/PatientDashboard';
import DoctorDashboard from './Pages/Dashboard/Doctor/DoctorDashboard';
import AdminDashboard from './Pages/Dashboard/Admin/AdminDashboard';
import ManageDomains from './Pages/Dashboard/Admin/ManageDomain/ManageDomains';
import Profile from './Pages/Dashboard/Admin/Profile';
import ManageDoctors from './Pages/Dashboard/Admin/ManageDoctor/ManageDoctors';
import DomainDetail from './Pages/Dashboard/Admin/ManageDomain/DomainDetail';
import ManageTests from './Pages/Dashboard/Admin/ManageTests/ManageTests';
import TestDetail from './Pages/Dashboard/Admin/ManageTests/TestDetail';
import QuestionDetail from './Pages/Dashboard/Admin/ManageTests/QuestionDetail';

import ProfileDoctor from './Pages/Dashboard/Doctor/Profile/ProfileDoctor';
import TherapySessionManager from './Pages/Dashboard/Doctor/TherapySessionManager/TherapySessionManager';
import ProfilePatient from './Pages/Dashboard/Patient/Profile/ProfilePatient';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/specialists" element={<Specialists />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Authentication Routes */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/signup" element={<PatientRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/signup" element={<DoctorRegister />} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedUserType="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-domains" element={
          <ProtectedRoute allowedUserType="admin">
            <ManageDomains />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute allowedUserType="admin">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-doctors" element={
          <ProtectedRoute allowedUserType="admin">
            <ManageDoctors />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-domains/:DomainID" element={
          <ProtectedRoute allowedUserType="admin">
            <DomainDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-tests" element={
          <ProtectedRoute allowedUserType="admin">
            <ManageTests />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-tests/:TestID" element={
          <ProtectedRoute allowedUserType="admin">
            <TestDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-questions/:QuestionID" element={
          <ProtectedRoute allowedUserType="admin">
            <QuestionDetail />
          </ProtectedRoute>
        } />
        
        {/* Doctor Protected Routes */}
        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedUserType="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor/profileDoctor" element={
          <ProtectedRoute allowedUserType="doctor">
            <ProfileDoctor />
          </ProtectedRoute>
        } />
        <Route path="/doctor/therapy-sessions" element={
          <ProtectedRoute allowedUserType="doctor">
            <TherapySessionManager />
          </ProtectedRoute>
        } />
        
        {/* Patient Protected Routes */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedUserType="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient/profilePatient" element={
          <ProtectedRoute allowedUserType="patient">
            <ProfilePatient />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;