import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser } from 'react-icons/fa6';
import { useGetPatientBasicInfoQuery } from '../../../../api/patientApi';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const PATIENT_ID = 4;

export default function PatientBasicInfo() {
  const { t } = useTranslation();
    const [longLoading, setLongLoading] = useState(false);

  const { 
    data: patient, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useGetPatientBasicInfoQuery(PATIENT_ID, {
    // Optional:  setting this to true will refetch the query when the query key changes
    refetchOnMountOrArgChange: true,
    // pollingInterval: 30000, // refetch every 30 seconds
  });


  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setLongLoading(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setLongLoading(false);
    }
  }, [isLoading]);

 
  if (isLoading ) {
    return (
      <div className="dc-dashboardbox cardInfo PatientBasicInfo" style={{ padding: '1.5rem' }}>
    <SkeletonTheme baseColor="#e3e3e3" highlightColor="#f7f7f7">
      {/* <div className="dc-dashboardbox cardInfo PatientBasicInfo" style={{ padding: '1.5rem' }}> */}
        <div className="dc-user-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Skeleton  width={120} height={120}  />

          <div style={{ flex: 1 }}>
            <Skeleton height={20} width="50%" />
            <Skeleton height={15} width="30%" />
          </div>
        </div>

        <div className="dc-user-details" style={{ paddingTop: '1.5rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ marginBottom: '1.2rem' , display: 'flex', justifyContent: 'space-between'}}>
              <div style={{width: '50%'}}>
              <Skeleton height={14} width="40%" style={{ marginBottom: '4px' }} />
              <Skeleton height={18} width={ i === 2 ? "80%" : "50%"}/>
              </div>
              <div style={{width: '50%'}} >
              <Skeleton height={14} width="40%" style={{ marginBottom: '4px' }} />
              <Skeleton height={18} width={ i === 3 ? "70%" : "50%"} />
              </div>
            
            </div>
          ))}

          <hr style={{ margin: '1.5rem 0', opacity: 0.4 }} />

             {[...Array(2)].map((_, i) => (
            <div key={i} style={{ marginBottom: '1.2rem' , display: 'flex', justifyContent: 'space-between'}}>
              <div style={{width: '50%'}}>
              <Skeleton height={14} width="40%" style={{ marginBottom: '4px' }} />
              <Skeleton height={18} width={ i === 1 ? "80%" : "50%"}/>
              </div>
              <div style={{width: '50%'}} >
              <Skeleton height={14} width="40%" style={{ marginBottom: '4px' }} />
              <Skeleton height={18} width={ i === 0 ? "70%" : "50%"} />
              </div>
            
            </div>
          ))}
          <hr style={{ margin: '1.5rem 0', opacity: 0.4 }} />

          <div style={{  display: 'flex', justifyContent: 'space-between'}}>
      <div style={{width: '50%'}}>
              <Skeleton height={14} width="40%" style={{ marginBottom: '4px' }} />
              <Skeleton height={18} width= "80%" />
              </div>
              <div style={{width: '50%'}} >
              <Skeleton height={14} width="40%" style={{ marginBottom: '4px' }} />
              <Skeleton height={18} width="50%" />
              </div></div>

          {longLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#555', fontSize: '14px' }}>
              ⏳ Downloading takes longer than usual...
            </div>
          )}
        </div>
      {/* </div> */}
    </SkeletonTheme>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dc-dashboardbox cardInfo PatientBasicInfo">
        <div className="dc-user-header">
          <div className="dc-title">
            <h3 style={{ color: 'red' }}>❌ Error loading data</h3>
            <span>{error?.data?.message || 'An error occurred while connecting to the server.'}</span>
          </div>
        </div>
        <div className="dc-user-details" style={{ textAlign: 'center', padding: '2rem' }}>
          <button
            onClick={refetch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            🔄 Retry
          </button>
        </div>
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
              src={patient.image} 
              alt={t("PatientBasicInfo.patient_image_alt")} 
              onError={(e) => {
                e.target.src = 'images/feedback/user-img.jpg';
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
                    <div style={{ whiteSpace: "pre" }} className="mb-2" key={i}>
                      • {d}
                    </div>
                  ))
                ) : (
                  <div style={{ whiteSpace: "pre" }} className="mb-2">
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
                    <div style={{ whiteSpace: "pre" }} className="mb-2" key={i}>
                      • {m}
                    </div>
                  ))
                ) : (
                  <div style={{ whiteSpace: "pre" }} className="mb-2">
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

        {/* Refresh Button */}
        {/* <div className="dc-tabscontenttitle dc-tabscontenttitle-delete-before dc-addnew m-0">
          <hr />
        </div>
        <div className="ml-0" style={{ textAlign: 'center', padding: '1rem' }}>
          <button 
            onClick={refetch}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
          </button>
        </div> */}
      </div>
    </div>
  );
}