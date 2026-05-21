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
import DashboardUnCompleteRegistration from "./pages/dashbord/DashboardUnCompleteRegistration";
import ProtectedRoute from "./redux/routes/ProtectedRoute";
import LogoutPopupMessage from "./pages/logout/LogoutPopupMessage";
import Loader from "./pages/shared/Loader";
import { useDoctorRegistration } from "./pages/doctor-registration/hooks/useDoctorRegistration";
import NotFoundPage from "./pages/notFound-pageError/NotFoundPage";
import ErrorPage from "./pages/notFound-pageError/ErrorPage";


function App() {

  const [openStepRegister, setOpenStepRegister] = useState(false);
  const [showPopupClose, setShowPopupClose] = useState(false);

useEffect(() => {
  const initAudio = () => {
    audioService.init();
  };

  window.addEventListener("click", initAudio, { once: true });

  return () => {
    window.removeEventListener("click", initAudio);
  };
}, []);
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
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "auto";
  }

  return () => {
    document.documentElement.style.overflow = "auto";
  };
}, [openStepRegister]);
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") {
      setOpenStepRegister(false);
      setShowPopupClose(false);
    }
  };

  window.addEventListener("keydown", handleEsc);

  return () => {
    window.removeEventListener("keydown", handleEsc);
  };
}, []);
const {    doctorCurrentStepNumber,isCurrentStepLoading,currentStepError ,refetchCurrentStep,isFetching ,isCurrentStepError } =useDoctorRegistration();
let completeRegistration =doctorCurrentStepNumber===6 ;

if(isCurrentStepLoading ){
    return <Loader/>
  }
  if(currentStepError ||isCurrentStepError ){
    return <ErrorPage refetch={refetchCurrentStep} isFetching={isFetching} nameVariable={true} error={currentStepError}/>
  }
  return (
    <div className="dc-userlogin">
      {/* {!loading && ( */}
        <ScrollToTop />              
        <Routes>
          {/* <Route path="/registration" element={<DoctorRegistration />} /> */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Authentication" element={<Authentication />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
              <div>
                <Navbar setShowPopupClose={setShowPopupClose} />
                <Sidebar setOpenStepRegister={setOpenStepRegister} setShowPopupClose={setShowPopupClose} />
                {openStepRegister && (
                  <div className=" custom-modal-overlay registration-popup d-flex justify-content-center align-items-center  fade-in">
                      
                      <div className="custom-modal-content position-relative scale-in"    onClick={(e) => e.stopPropagation()}>
                        
                        <button
                          className="btn-close custom-close-btn"
                          onClick={() => setOpenStepRegister(false)}
                        ><IoIosCloseCircleOutline/></button>

                        <DoctorRegistration setOpenStepRegister={setOpenStepRegister} openStepRegister={openStepRegister} />

                      </div>

                    </div>
                )}            
                <div className="contentdiv">
                  <Routes>
                    <Route path="/" element={completeRegistration ? <DashboardMain /> :<DashboardUnCompleteRegistration  setOpenStepRegister={setOpenStepRegister}/>} />
                <Route path="how-v2" element={<DashboardMain />} />
                <Route path="how-v1" element={<DashboardUnCompleteRegistration  setOpenStepRegister={setOpenStepRegister}/>} />
                    <Route path="dashboard" element={ completeRegistration ? <DashboardMain /> :<DashboardUnCompleteRegistration  setOpenStepRegister={setOpenStepRegister}/>} />
                    <Route
                      path="appointments"
                      element={<AppointmentsPage />}
                    />
                    <Route
                      path="appointment-location"
                      element={<LocationMain />}
                    />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="home-v1" element={<Test />} />

                    <Route path="chat" element={<MessagesPage />} />
                    <Route path="chat/:chatId" element={<MessagesPage />} />
                    <Route
                      path="patients"
                      element={<PatientManagement />}
                    />
                    <Route
                      path="manage-financial"
                      element={<DoctorFinancialDashboard />}
                    />
                    <Route
                      path="Generate-Doctor-Slots"
                      element={<WeeklyTimeSlots />}
                    />
                    <Route
                      path="settings"
                      element={<SecuritySettings />}
                    />
                    <Route path="account-information" element={<Acco />} />
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
            </ProtectedRoute>
            }
          />
        </Routes>
      {/* )} */}
      { showPopupClose && <LogoutPopupMessage setShowPopupClose={setShowPopupClose} />}
        </div>
  );
}

export default App;
