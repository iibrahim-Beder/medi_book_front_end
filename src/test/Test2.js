import { useState } from "react";
import { useGetSpecialtiesQuery } from "../api/doctor-information/specialtiesApi";
import SelectField from "../pages/ui/form-fields/SelectField";
import EditableList from "./EditableList";

export default function Test2() {
  const { data: specialties, isLoading } = useGetSpecialtiesQuery();

  const mappedOptions = specialties?.data?.map(s => ({
    value: s.specialtyID,
    label: s.specialtyName
  })) || [];
  

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
const ids = selectedSpecialty?.specialty?.map(s => s.value);
  console.log("selectedSpecialty",selectedSpecialty,ids);

  return (
    <div>
<EditableList
  title="Specialties"
  options={mappedOptions}
  isLoading={isLoading}
  selectName="specialty"
  selectLabel="Specialty"
  fieldKey="value"
  onChange={(items) =>
  setSelectedSpecialty((prev) => ({ ...prev, specialty: items }))
  }/>
    </div>
  );
}