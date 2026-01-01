import React from "react";
import OtherMedicalConditionsTable from "./OtherMedicalConditionsTable";
import OtherMedicalConditionsMobileView from "./OtherMedicalConditionsMobileView";
import { useDevice } from "../../../../../../context/useIsMobile";

const OtherMedicalConditions = () => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <OtherMedicalConditionsMobileView /> : <OtherMedicalConditionsTable />}
    </div>
  );
};

export default OtherMedicalConditions;
