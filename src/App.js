
import { Routes, Route } from "react-router-dom";
import Navbar from './pages/navbar/Navbar';
import './App.css';
import './assets/css/font-awesome.min.css';
import Sidebar from './pages/sidbar/Sidebar';
import  { useState, useEffect } from "react";
import DashboardMain from './pages/dashbord/DashboardMain';
import Acco from './pages/profile-settings/ProfileSettings';
import LocationMain from "./pages/location-settings/LocationMain";
import SecuritySettings from "./pages/securty/MainSecuritySettings";
import MainAppointtmentList2 from "./pages/appointmentList/MainAppointmentList";
import MakeSlostMain from "./pages/making-slots/MakeSlostMain";
import { useTranslation } from "react-i18next";
import DoctorRegistration from './pages/doctor-registration/DoctorRegistration';
import MessagesPage from "./pages/messages/MessagesPage";
import AppointmentManagementMain from "./pages/appointment-management/AppointmentmanagementMain";
import PatientManagement from "./pages/patient-management/patients-home-page/PatientManagement";
import PatientProfilePageMain from "./pages/patient-management/patient-information/PatientProfilePageMain";
import Test from './not used/Test';
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import DoctorFinancialDashboard from "./pages/doctor-financial-dashboard/DoctorFinancialDashboard";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/login/ForgotPassword";
import 'react-loading-skeleton/dist/skeleton.css';
import NotificationsPage from "./pages/notifications/NotificationsPageMain";
import { audioService } from "./pages/notifications/audioService";
import { signalRService } from "./api/chat/ChatSignalRService";
import { useMessageListener } from "./pages/messages/components/ToastMrssage";


function App() {
window.addEventListener("click", () => {
  audioService.init();
}, { once: true });
const soundsConfig = {
  notification: '/sounds/notification.mp3',
  messageArrived: '/sounds/message-arrives.wav',
  sendMessage: '/sounds/Send-message.wav',
  writing: '/sounds/writing.mp3',
  messageArrivedChatIn: '/sounds/message-arrived-chatIn.mp3'
};
audioService.init(soundsConfig);
useMessageListener();
  // language in html
const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;

    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl"; 
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n.language]);


//this loading for preloader 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20);
    return () => clearTimeout(timer);
  }, []);
  
// signalR chat connection
   useEffect(() => {
      // if (userId) {
        signalRService.startConnection(1);
      // }
  
      return () => {
        signalRService.stopConnection();
      };
    // }, [userId]);
    }, []);
      console.log('SignalR Connection State:', signalRService.connection ? signalRService.connection.state : 'Disconnected');

  return (
    <div className="dc-userlogin">
      {/* {loading && (
        <div className="preloader-outer">
          <div className="wt-preloader-holder">
            <div className="wt-loader"></div>
          </div>
        </div>
      )} */}
      {/* {!loading && ( */}
        <Routes>
          <Route path="/registration" element={<DoctorRegistration />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/*"
            element={
              <div>
                <Navbar />
                <Sidebar />
                <div className="contentdiv">
                  <Routes>
                    <Route path="dashboard" element={<DashboardMain />} />
                    <Route
                      path="appointment-list"
                      element={<MainAppointtmentList2 />}
                    />
                    <Route
                      path="appointment-location"
                      element={<LocationMain />}
                    />
                    <Route path="Messages" element={<MessagesPage />} />
                    <Route
                      path="manage-patients"
                      element={<PatientManagement />}
                    />
                    <Route path="how-v1" element={<Test />} />
                    <Route
                      path="manage-financial"
                      element={<DoctorFinancialDashboard />}
                    />
                    <Route
                      path="Generate-Doctor-Slots"
                      element={<MakeSlostMain />}
                    />
                    <Route
                      path="security-settings"
                      element={<SecuritySettings />}
                    />
                    <Route path="account-settings" element={<Acco />} />
                    <Route
                      path="pationt-information"
                      element={<PatientProfilePageMain />}
                    />
                    <Route
                      path="appointment-management"
                      element={<AppointmentManagementMain />}
                    />
                    <Route
                      path="notifications"
                      element={<NotificationsPage />}
                    />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      {/* )} */}
        </div>
  );
}

export default App;
