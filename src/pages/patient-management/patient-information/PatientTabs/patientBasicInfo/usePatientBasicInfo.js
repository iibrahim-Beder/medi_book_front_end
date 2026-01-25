import { useEffect, useState } from "react";
import { useGetPatientBasicInfoQuery } from "../../../../../api/patientApi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export const PATIENT_ID = 4;

export default function usePatientBasicInfo() {
  const [longLoading, setLongLoading] = useState(false);

  const {
    data: patient,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPatientBasicInfoQuery(PATIENT_ID, {
    refetchOnMountOrArgChange: true,
  });

  // Long Loading Logic
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setLongLoading(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setLongLoading(false);
    }
  }, [isLoading]);

  return {
    patient,
    isLoading,
    isError,
    error,
    refetch,
    longLoading,
  };
}



export const patientSkeletonTheme = (longLoading) => {
  return (
  <>
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
                ⏳ loading takes longer than usual...
              </div>
            )}
          </div>
        {/* </div> */}
      </SkeletonTheme>
        </div>
  </>
  )

};