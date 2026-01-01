import React from "react";
import DiagnosedConditionsTable from "./DiagnosedConditionsTable";
import DiagnosedConditionsMobileView from "./DiagnosedConditionsMobileView";
import { useDevice } from "../../../../../../context/useIsMobile";

const DiagnosedConditions = () => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <DiagnosedConditionsMobileView /> : <DiagnosedConditionsTable />}
    </div>
  );
};

export default DiagnosedConditions;
