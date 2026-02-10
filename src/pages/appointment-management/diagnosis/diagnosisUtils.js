

// diagnosisUtils.js

import { getStatusText } from "../../../api/PatientProfile/patientPrescriptionApi";

// Transform API data to match component structure
export const transformDiagnosisData = (diagnosis) => {
  // console.log('Original API diagnosis:', diagnosis);
  
  const transformed = {
    // Basic diagnosis info - using exact API field names
    id: diagnosis.diagnosisId || `diagnosis-${Date.now()}`,
    diagnosisId: diagnosis.diagnosisId,
    diagnosisName: diagnosis.diagnosisName,
    symptomsDescription: diagnosis.symptomsDescription,
    description: diagnosis.description,
    code: diagnosis.code,
    createdAt: diagnosis.createdAt,
  
    // Notes - ensure unique IDs
    notes: (diagnosis.diagnosisNoteOverviews || []).map((note, index) => ({
      id: note.id || `note-${diagnosis.diagnosisId}-${index}-${Date.now()}`,
      note: note.note,
      isNew: false,
      isExpanded: false
    })),
  
    // Conditions - ensure unique IDs
    conditions: (diagnosis.patientInternalMedicalConditionLinkOverViews || []).map((condition, index) => ({
      id: condition.id || `condition-${diagnosis.diagnosisId}-${index}-${Date.now()}`,
      medicalCondition: {name:condition.medicalConditionName,id:null },
      category: condition.categoryName,
      severity: condition.severity,
      notes: condition.notes,
      isNew: false,
      isActive: condition.isActive,
      isExpanded: false
    })),
  
    // Prescriptions - ensure unique IDs
    prescriptions: (diagnosis.prescriptionOverviews || []).map((prescription, index) => ({
      id: prescription.id || `prescription-${diagnosis.diagnosisId}-${index}-${Date.now()}`,
      title: prescription.title,
      status: getStatusText(prescription.status),
      notes: prescription.notes,
      type: "Medical",
      date: prescription.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      // Medications - ensure unique IDs
      recipes: (prescription.prescribedMedications || []).map((med, medIndex) => ({
        id: med.id || `med-${diagnosis.diagnosisId}-${index}-${medIndex}-${Date.now()}`,
        medication:{name: med.medicationName , id: med.medicationNameId},
        category: med.medicationCategoryName,
        dosage: med.dosage,
        durationInDays: med.durationInDays,
        instructions: med.instructions,
        startDate: med.startDate ? med.startDate.split('T')[0] : '', 
         endDate: med.endDate ? med.endDate.split('T')[0] : '',
        type: "medication",
        isNew: false,
        isExpanded: false
      })),
      isNew: false,
      isExpanded: false
    })),
  
    isNew: false,
    isExpanded: false
  };
 
  // console.log('Transformed diagnosis (WITH IDS):', transformed);
  return transformed;
};
export const removeNewChildren = (diagnosis) => {
  if (!diagnosis) return diagnosis;

  // Remove new notes
  const notes = (diagnosis.notes || []).filter(n => !n.isNew);

  // Remove new conditions
  const conditions = (diagnosis.conditions || []).filter(c => !c.isNew);

  // Remove new prescriptions
  const prescriptions = (diagnosis.prescriptions || []).map(p => ({
    ...p,
    recipes: (p.recipes || []).filter(r => !r.isNew),
    // remove prescription entirely if it was new
  })).filter(p => !p.isNew);

  return {
    ...diagnosis,
    notes,
    conditions,
    prescriptions
  };
};
