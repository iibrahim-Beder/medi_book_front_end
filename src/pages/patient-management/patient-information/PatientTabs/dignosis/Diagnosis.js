import React from "react";
import DiagnosisMobileView from "./DiagnosisMobileView";
import DiagnosisDesktopTable from "./DiagnosisDesktopTable";
import { useDevice } from "../../../../../context/useIsMobile";

const DiagnosisTable = ({patientId}) => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <DiagnosisMobileView patientId={patientId}/> : <DiagnosisDesktopTable patientId={patientId} />}
    </div>
  );
};

export default DiagnosisTable;
