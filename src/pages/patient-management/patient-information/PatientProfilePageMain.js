// src/pages/PatientProfilePageMain.jsx

import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PatientBasicInfo from "./PatientTabs/patientBasicInfo/PatientBasicInfo";
import DoctorPatientNotes from "./PatientTabs/doctor-patient-notes-list/DoctorPatientNotes";
import AppointmentsTable from "./PatientTabs/AppointmentsTable";
import AllergyTable from "./PatientTabs/allergy/AllergyTable";
import MedicalHistoryTable from "./PatientTabs/medical-history/MedicalHistoryTable";
import MedicalConditions from "./PatientTabs/medical-conditions/MedicalConditions";
import Medications from "./PatientTabs/medication/Medications";
import PatientReviewsCards from "./PatientTabs/PatientReviewsCards";
import PatientNotificationsCards from "./PatientTabs/PatientNotificationsCards";
import DiagnosisTable from "./PatientTabs/dignosis/Diagnosis";
import Prescriptions from "./PatientTabs/prescriptions/prescriptions";
import { useDevice } from "../../../context/useIsMobile";
import AllergyMobileView from "./PatientTabs/allergy/AllergyMobileView";
import MedicalHistoryMobileView from "./PatientTabs/medical-history/MedicalHistoryMobileView";

export default function PatientProfilePageMain() {
  const { patientId } = useParams();
  const numericPatientId = Number(patientId);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { isMobile } = useDevice();

  const defaultTab = "BasicInfo";
  const activeTab = searchParams.get("tab") || defaultTab;

  const setActiveTab = (tabKey) => {
    setSearchParams({ tab: tabKey }); 
  };

  const padding =
    activeTab === "Medications" || activeTab === "MedicalConditions";

  const tabs = [
    { key: "BasicInfo", label: t("BasicInfo") },
    { key: "PatientNotificationsCards", label: t("Notifications") },
    { key: "Appointments", label: t("Appointments") },
    { key: "Reviews", label: t("Reviews") },
    { key: "MedicalHistoryTable", label: t("Medical History") },
    { key: "MedicalConditions", label: t("Medical Conditions") },
    { key: "Allergy", label: t("Allergies") },
    { key: "Diagnosis", label: t("Diagnosis") },
    { key: "Medications", label: t("medications") },
    { key: "PrescriptionsTable", label: t("Prescriptions") },
    { key: "DoctorPatientNotes", label: t("Notes") },
  ];

  return (
    <div className="col-12">
      <div className="dc-haslayout dc-dbsectionspace accordion-table ">
        <div className="dc-dashboardbox dc-dashboardtabsholder setting">

          {/* Tabs */}
          <div className="dc-dashboardtabs" style={{ width: "20%" }}>
            <ul className="dc-tabstitle nav navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <a
                    href={`?tab=${tab.key}`}
                    className={activeTab === tab.key ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(tab.key);
                    }}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div
            className={`dc-tabscontent tab-content table-container-style ${
              padding ? "tab-content-two-tabs" : ""
            }`}
            style={{ width: "80%", justifyContent: "center" }}
          >
            {activeTab === "BasicInfo" && (
              <PatientBasicInfo patientId={numericPatientId} />
            )}
            {activeTab === "Appointments" && (
              <AppointmentsTable patientId={numericPatientId} />
            )}
            {activeTab === "DoctorPatientNotes" && (
              <DoctorPatientNotes patientId={numericPatientId} />
            )}
            {activeTab === "MedicalHistoryTable" &&
              (isMobile ? (
                <MedicalHistoryMobileView patientId={numericPatientId} />
              ) : (
                <MedicalHistoryTable patientId={numericPatientId} />
              ))}
            {activeTab === "Allergy" &&
              (isMobile ? (
                <AllergyMobileView patientId={numericPatientId} />
              ) : (
                <AllergyTable patientId={numericPatientId} />
              ))}
            {activeTab === "Diagnosis" && (
              <DiagnosisTable patientId={numericPatientId} />
            )}
            {activeTab === "PrescriptionsTable" && (
              <Prescriptions patientId={numericPatientId} />
            )}
            {activeTab === "Medications" && (
              <Medications patientId={numericPatientId} />
            )}
            {activeTab === "MedicalConditions" && (
              <MedicalConditions patientId={numericPatientId} />
            )}
            {activeTab === "Reviews" && (
              <PatientReviewsCards patientId={numericPatientId} />
            )}
            {activeTab === "PatientNotificationsCards" && (
              <PatientNotificationsCards patientId={numericPatientId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}