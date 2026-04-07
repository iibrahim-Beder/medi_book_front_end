import { useParams } from "react-router-dom";
import usePatientBasicInfo from "../patientBasicInfo/usePatientBasicInfo";

export default function PatientName() {
    const { patientId } = useParams();
    const numericPatientId = Number(patientId);
  const { patient, isLoading } = usePatientBasicInfo(numericPatientId);

  if (isLoading) {
    return <span>loading...</span>;
  }

  return <>{patient?.name || "Unknown"}</>;
}
