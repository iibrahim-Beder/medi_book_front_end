import React from "react";
import OtherMedicalConditionsTable from "./OtherMedicalConditionsTable";
import OtherMedicalConditionsMobileView from "./OtherMedicalConditionsMobileView";
import { useDevice } from "../../../../../../context/useIsMobile";

const OtherMedicalConditions = ({patientId}) => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <OtherMedicalConditionsMobileView patientId={patientId} /> : <OtherMedicalConditionsTable patientId={patientId} />}
    </div>
  );
};

export default OtherMedicalConditions;
