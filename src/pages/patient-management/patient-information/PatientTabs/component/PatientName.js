import usePatientBasicInfo from "../patientBasicInfo/usePatientBasicInfo";

export default function PatientName() {
  const { patient, isLoading } = usePatientBasicInfo();

  if (isLoading) {
    return <span>loading...</span>;
  }

  return <>{patient?.name || "Unknown"}</>;
}
