
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
import { useTranslation } from "react-i18next";
import DoctorRegistration from './pages/doctor-registration/DoctorRegistration';
import MessagesPage from "./pages/messages/MessagesPage";
import AppointmentManagementMain from "./pages/appointment-management/AppointmentmanagementMain";
import PatientManagement from "./pages/patient-management/patients-home-page/PatientManagement";
import PatientProfilePageMain from "./pages/patient-management/patient-information/PatientProfilePageMain";
import Test from './test/Test';
import Test2, { DashboardUnCompleteRegistration } from './test/Test2';
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
import { useMessageListener } from "./pages/messages/hooks/useMessageListener";
import ReviewsPage from "./pages/reviews/ReviewsPage";
import AppointmentsPage from "./pages/appointmentList/AppointmentsPage";
import WeeklyTimeSlots from "./pages/making-slots/WeeklyTimeSlot";
import ScrollToTop from "./context/ScrollToTop";
import Authentication from "./pages/login/Authentication";
import ShiftsManagement from "./pages/shifts-management/ShiftsManagement";
import { IoIosCloseCircleOutline } from "react-icons/io";


function App() {

  const [openStepRegister, setOpenStepRegister] = useState(false);

  window.addEventListener("click", () => {
  audioService.init();
}, { once: true });
const soundsConfig = {
  notification: '/sounds/notification.mp3',
  messageArrived: '/sounds/message-arrives.wav',
  sendMessage: '/sounds/send-message.mp3',
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
  useEffect(() => {
  if (openStepRegister) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [openStepRegister]);

let completeRegistration =false ;
// let completeRegistration = localStorage.getItem('completeRegistration');

  return (
    <div className="dc-userlogin">
      {/* {!loading && ( */}
        <ScrollToTop />              
        <Routes>
          <Route path="/registration" element={<DoctorRegistration />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Authentication" element={<Authentication />} />
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/*"
            element={
              <div>
                <Navbar />
                <Sidebar setOpenStepRegister={setOpenStepRegister} />
                {openStepRegister && (
                    <div className=" custom-modal-overlay registration-popup d-flex justify-content-center align-items-center  fade-in" onClick={() => setOpenStepRegister(false)}>
                      
                      <div className="custom-modal-content position-relative scale-in"    onClick={(e) => e.stopPropagation()}>
                        
                        <button
                          className="btn-close custom-close-btn"
                          onClick={() => setOpenStepRegister(false)}
                        ><IoIosCloseCircleOutline/></button>

                        <DoctorRegistration currentStepFromParent={openStepRegister} />

                      </div>

                    </div>
                )}            
                <div className="contentdiv">
                  <Routes>
                <Route path="how-v1" element={<Test setOpenStepRegister={setOpenStepRegister} />} />
                    <Route path="dashboard" element={ completeRegistration ? <DashboardMain /> :<DashboardUnCompleteRegistration />} />
                    <Route
                      path="appointments"
                      element={<AppointmentsPage />}
                    />
                    <Route
                      path="appointment-location"
                      element={<LocationMain />}
                    />
                    <Route path="chat" element={<MessagesPage />} />
                    <Route path="chat/:chatId" element={<MessagesPage />} />
                    <Route
                      path="patients"
                      element={<PatientManagement />}
                    />
                    <Route path="how-v2" element={<Test2 />} />
                    <Route
                      path="manage-financial"
                      element={<DoctorFinancialDashboard />}
                    />
                    <Route
                      path="Generate-Doctor-Slots"
                      element={<WeeklyTimeSlots />}
                    />
                    <Route
                      path="security-settings"
                      element={<SecuritySettings />}
                    />
                    <Route path="account-settings" element={<Acco />} />
                    <Route
                      path="pationt-information/:patientId"
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
                    <Route
                      path="shifts-management"
                      element={<ShiftsManagement />}
                    />
                    <Route
                      path="reviews"
                      element={<ReviewsPage />}
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
