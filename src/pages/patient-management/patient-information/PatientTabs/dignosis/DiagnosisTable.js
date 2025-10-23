import React from "react";
import DiagnosisMobileView from "./DiagnosisMobileView";
import DiagnosisDesktopTable from "./DiagnosisDesktopTable";
import { useDevice } from "../../../../../context/useIsMobile";

const DiagnosisTable = () => {
  const isMobile = useDevice();

  return (
    <div>
      {isMobile ? <DiagnosisMobileView /> : <DiagnosisDesktopTable />}
    </div>
  );
};

export default DiagnosisTable;
