import { useState } from "react";
import { useGetSpecialtiesQuery } from "../api/doctor-information/specialtiesApi";
import SelectField from "../pages/ui/form-fields/SelectField";

export default function Test2() {
  const { data: specialties, isLoading } = useGetSpecialtiesQuery();

  const mappedOptions = specialties?.data?.map(s => ({
    value: s.specialtyID,
    label: s.specialtyName
  })) || [];

  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  console.log("selectedSpecialty",selectedSpecialty);

  return (
    <div>
      <SelectField
        value={selectedSpecialty}
        name="specialty"
        label="Specialty"
        options={mappedOptions}
        onChange={(e) => setSelectedSpecialty(e.target.value)}
      />

      <h1>Test2</h1>
    </div>
  );
}