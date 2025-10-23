import React from "react";
import DiagnosisMobileView from "./DiagnosisMobileView";
import DiagnosisDesktopTable from "./DiagnosisDesktopTable";
import useIsMobile from "../../../../../hooks/useIsMobile";

const DiagnosisTable = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <DiagnosisMobileView /> : <DiagnosisDesktopTable />}
    </div>
  );
};

export default DiagnosisTable;
