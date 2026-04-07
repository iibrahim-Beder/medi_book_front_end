import { useTranslation } from 'react-i18next';
import ErrorLoading from '../../../../shared/ErrorLoading';
import usePatientBasicInfo, { patientSkeletonTheme } from './usePatientBasicInfo';

export default function PatientBasicInfo({patientId}) {
  const { t } = useTranslation();

  const { 
    patient,
    isLoading,
    isError,
    error,
    refetch,
    longLoading,
  } = usePatientBasicInfo(patientId); 
  if (isLoading ) {
    return (
      patientSkeletonTheme(longLoading)
    );
  }

  if (isError) {
    return (
      <div className="dc-dashboardbox cardInfo PatientBasicInfo">
            <ErrorLoading isError={isError} refetch={refetch} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="dc-dashboardbox cardInfo PatientBasicInfo">
        <div className="dc-user-header">
          <div className="dc-title">
            <h3>📭 No patient data available</h3>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="dc-dashboardbox cardInfo PatientBasicInfo">
      {/* Header */}
      <div className="dc-user-header">
        <div>
          <figure className="dc-user-img">
            <img
              src={patient?.image || "/images/feedback/user-img.jpg"}
              alt={t("PatientBasicInfo.patient_image_alt")}
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = "/images/feedback/user-img.jpg";
              }}
            />
          </figure>
        </div>
        <div className="dc-title">
          <h3>
            {patient.name} 
            {patient.verified && <i className="fa fa-check-circle" style={{ color: '#4CAF50' }}></i>}
          </h3>
          <span>{patient.city}</span>
        </div>
      </div>

      <div className="dc-user-details" style={{ width: "96%" }}>
        {/* ================= Basic Info Section ================= */}
        <div className="ml-0">
          <div className="dc-user-info">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.full_name")}</h4>
              <span>{patient.name}</span>
            </div>
          </div>
          <div className="dc-user-info mt-0">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.date_of_birth")}</h4>
              <span>
                {patient.birthDate} ({t("PatientBasicInfo.age")}: {patient.age})
              </span>
            </div>
          </div>
          <div className="dc-user-info">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.gender")}</h4>
              <span>{patient.gender}</span>
            </div>
          </div>
          <div className="dc-user-info">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.phone")}</h4>
              <span>{patient.phone}</span>
            </div>
          </div>
          <div className="dc-user-info">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.email")}</h4>
              <span style={{ overflowWrap: "break-word" }}>{patient.email}</span>
            </div>
          </div>
          <div className="dc-user-info" style={{ gridColumn: "span 2" }}>
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.address")}</h4>
              <span>{patient.address}</span>
            </div>
          </div>
        </div>

        {/* ================= Health Status Section ================= */}
        <div
          className="dc-tabscontenttitle dc-tabscontenttitle-delete-before dc-addnew m-0"
          style={{ backgroundColor: "transparent" }}
        >
          <hr />
        </div>
        <div className="ml-0">
          <div className="dc-user-info">
            <div className="dc-title">
              <h4 style={{ font: "18px / 22px 'Open Sans', sans-serif", margin: "0 0 9px" }}>
                {t("PatientBasicInfo.chronic_diseases")}
              </h4>
              <span style={{ font: "14px / 20px 'Open Sans', sans-serif" }}>
                {patient.chronic && patient.chronic.length > 0 ? (
                  patient.chronic.map((d, i) => (
                    <div s className="mb-2" key={i}>
                      • {d}
                    </div>
                  ))
                ) : (
                  <div  className="mb-2">
                    • No chronic diseases
                  </div>
                )}
              </span>
            </div>
          </div>
          <div className="dc-user-info mt-0">
            <div className="dc-title">
              <h4 style={{ font: "18px / 22px 'Open Sans', sans-serif", margin: "0 0 9px" }}>
                {t("PatientBasicInfo.allergies")}
              </h4>
              <span>
                {t("PatientBasicInfo.allergies_drug")}: {patient.allergies.drug} |{" "}
                {t("PatientBasicInfo.allergies_food")}: {patient.allergies.food}
              </span>
            </div>
          </div>
          <div className="dc-user-info" style={{ gridColumn: "span 2" }}>
            <div className="dc-title">
              <h4 style={{ font: "18px / 22px 'Open Sans', sans-serif", margin: "0 0 9px" }}>
                {t("PatientBasicInfo.medications")}
              </h4>
              <span style={{ font: "14px / 20px 'Open Sans', sans-serif" }}>
                {patient.medicines && patient.medicines.length > 0 ? (
                  patient.medicines.map((m, i) => (
                    <div  className="mb-2" key={i}>
                      • {m}
                    </div>
                  ))
                ) : (
                  <div  className="mb-2">
                    • No medications
                  </div>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ================= Visits Section ================= */}
        <div
          className="dc-tabscontenttitle dc-tabscontenttitle-delete-before dc-addnew m-0"
          style={{ backgroundColor: "transparent" }}
        >
          <hr />
        </div>
        <div className="ml-0">
          <div className="dc-user-info">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.last_visit")}</h4>
              <span>{patient.lastVisit}</span>
            </div>
          </div>
          <div className="dc-user-info mt-0">
            <div className="dc-title">
              <h4>{t("PatientBasicInfo.next_visit")}</h4>
              <span>{patient.nextVisit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}