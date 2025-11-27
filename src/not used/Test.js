import React, { useState } from 'react';
import DropdownWithSearch from '../pages/shared/DropdownWithSearch';

const PatientForm = () => {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedAllergy, setSelectedAllergy] = useState(null);

  const handleMedicationChange = (medication) => {
    console.log('Selected Medication:', medication);
    setSelectedMedication(medication);
  };

  const handleDiseaseChange = (disease) => {
    console.log('Selected Disease:', disease);
    setSelectedDisease(disease);
  };

  const handleAllergyChange = (allergy) => {
    console.log('Selected Allergy:', allergy);
    setSelectedAllergy(allergy);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>بيانات المريض</h2>
      
      <DropdownWithSearch 
        type="medication"
        value={selectedMedication}
        onChange={handleMedicationChange}
      />

      <DropdownWithSearch 
        type="disease"
        value={selectedDisease}
        onChange={handleDiseaseChange}
      />

      <DropdownWithSearch 
        type="allergy"
        value={selectedAllergy}
        onChange={handleAllergyChange}
      />

      {/* عرض البيانات المختارة */}
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>البيانات المختارة:</h3>
        <p><strong>الدواء:</strong> {selectedMedication ? selectedMedication.name : 'لم يتم الاختيار'}</p>
        <p><strong>المرض:</strong> {selectedDisease ? selectedDisease.name : 'لم يتم الاختيار'}</p>
        <p><strong>الحساسية:</strong> {selectedAllergy ? selectedAllergy.name : 'لم يتم الاختيار'}</p>
      </div>
    </div>
  );
};

export default PatientForm;