import React from "react";
import { useDevice } from "../../../../../context/useIsMobile";
import PrescriptionsTable from "./PrescriptionsDesktopTable";
import PrescriptionsMobileView from "./PrescriptionsMobileView";


const Prescriptions = () => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <PrescriptionsMobileView /> : <PrescriptionsTable />}
    </div>
  );
};

export default Prescriptions;
