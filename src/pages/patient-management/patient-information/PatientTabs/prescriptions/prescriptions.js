import React from "react";
import { useDevice } from "../../../../../context/useIsMobile";
import PrescriptionsTable from "./PrescriptionsDesktopTable";
import PrescriptionsMobileView from "./PrescriptionsMobileView";


const Prescriptions = ({patientId}) => {
  const {isMobile} = useDevice();

  return (
    <div>
      {isMobile ? <PrescriptionsMobileView patientId={patientId} /> : <PrescriptionsTable patientId={patientId}/>}
    </div>
  );
};

export default Prescriptions;
