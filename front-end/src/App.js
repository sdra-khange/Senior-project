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
import Dashboard from './Pages/Dashboard/Admin/AdminDashboard';
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
import PatientDoctorsList from './Pages/Dashboard/Patient/Booking details/PatientDoctorsList';
import PatientDoctorDetails from './Pages/Dashboard/Patient/Booking details/PatientDoctorDetails';
import PatientAppointments from './Pages/Dashboard/Patient/PatientAppointments/PatientAppointments';
import ManageContent from './Pages/Dashboard/Doctor/ManageContent/ManageContent';
import ContentPage from './Pages/Dashboard/Doctor/ManageContent/ContentPage';
import { useParams } from 'react-router-dom';
import LiveKitRoomComponent from "./Components/livekit/LiveKitRoom";
import CreateRoom from './Pages/Dashboard/Doctor/Room/CreateRoom';
import JoinRoom from './Pages/Dashboard/Doctor/Room/JoinRoom';
import ListRooms from './Pages/Dashboard/Doctor/Room/ListRooms';
import PatientJoinRoom from './Pages/Dashboard/Patient/Room/JoinRoom';
import PatientListRooms from './Pages/Dashboard/Patient/Room/ListRooms';
import ChatDoctor from './Pages/Dashboard/Doctor/Chat/ChatDoctor';
import ChatPatient from './Pages/Dashboard/Patient/Chat/ChatPatient';
import { ChatProvider } from './contexts/ChatContext';


function VideoCallPage() {
  const { roomName } = useParams();
  
  if (!roomName) {
    return <div>Invalid room name</div>;
  }

  return <LiveKitRoomComponent roomName={roomName} />;
}

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <Routes>
          {/* Video Call Routes */}
          <Route path="/doctor/room/call/:roomName" element={
            <ProtectedRoute allowedUserType="doctor">
              <VideoCallPage />
            </ProtectedRoute>
          } />
          <Route path="/patient/video-call/:roomName" element={
            <ProtectedRoute allowedUserType="patient">
              <VideoCallPage />
            </ProtectedRoute>
          } />

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
          {/* <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedUserType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } /> */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedUserType="admin">
              <Dashboard  />
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
          <Route path="/doctor/ManageContent" element={
            <ProtectedRoute allowedUserType="doctor">
              <ManageContent />
            </ProtectedRoute>
          } />
          <Route path="/doctor/ManageContent" element={
            <ProtectedRoute allowedUserType="doctor">
              <ContentPage />
            </ProtectedRoute>
          } />
          <Route path="/doctor/room/create" element={
            <ProtectedRoute allowedUserType="doctor">
              <CreateRoom />
            </ProtectedRoute>
          } />
          <Route path="/doctor/room/join" element={
            <ProtectedRoute allowedUserType="doctor">
              <JoinRoom />
            </ProtectedRoute>
          } />
          <Route path="/doctor/room/list" element={
            <ProtectedRoute allowedUserType="doctor">
              <ListRooms />
            </ProtectedRoute>
          } />
          <Route path="/doctor/chat" element={
            <ProtectedRoute allowedUserType="doctor">
              <ChatDoctor />
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
          <Route path="/patient/PatientDoctorsList" element={
            <ProtectedRoute allowedUserType="patient">
              <PatientDoctorsList />
            </ProtectedRoute>
          } />
          <Route path="/patient/PatientDoctorsList/:id" element={
            <ProtectedRoute allowedUserType="patient">
              <PatientDoctorDetails />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedUserType="patient">
              <PatientAppointments />
            </ProtectedRoute>
          } />
          <Route path="/patient/room/join" element={
            <ProtectedRoute allowedUserType="patient">
              <PatientJoinRoom />
            </ProtectedRoute>
          } />
          <Route path="/patient/room/list" element={
            <ProtectedRoute allowedUserType="patient">
              <PatientListRooms />
            </ProtectedRoute>
          } />
          <Route path="/patient/chat" element={
            <ProtectedRoute allowedUserType="patient">
              <ChatPatient />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </ChatProvider>
  );
}

export default App;