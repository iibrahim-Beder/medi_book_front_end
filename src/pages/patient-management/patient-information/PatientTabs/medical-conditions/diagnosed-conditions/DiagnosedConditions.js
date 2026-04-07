import React from "react";
import DiagnosedConditionsTable from "./DiagnosedConditionsTable";
import DiagnosedConditionsMobileView from "./DiagnosedConditionsMobileView";
import { useDevice } from "../../../../../../context/useIsMobile";

const DiagnosedConditions = ({patientId}) => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <DiagnosedConditionsMobileView patientId={patientId} /> : <DiagnosedConditionsTable patientId={patientId} />}
    </div>
  );
};

export default DiagnosedConditions;
