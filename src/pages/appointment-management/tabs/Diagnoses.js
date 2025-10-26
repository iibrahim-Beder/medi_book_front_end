import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import NestedAccordion from "../../shared/NestedAccordion";

const Diagnoses = () => {
  const { t } = useTranslation();
  const [diagnosesData, setDiagnosesData] = useState([
    {
      id: 1,
      DiagnosisName: t("Chronic Migraine"),
      SymptomsDescription: t("Severe headaches with nausea and sensitivity to light"),
      Description: t("Patient diagnosed with chronic migraine requiring medication management"),
      notes: [
        { id: 11, note: t("Patient requested reschedule") },
        { id: 12, note: t("Allergic to penicillin") }
      ],
      conditions: [
        {
          id: 201,
          MedicalCondition: t("Hypertension"),
          Severity: t("Moderate"),
          Notes: t("Requires regular monitoring"),
          isNew: false,
          isExpanded: false
        }
      ],
      prescriptions: [
        {
          id: 101,
          title: t("Pain Management Prescription"),
          status: t("Active"),
          note: t("For chronic migraine treatment"),
          type: t("Medical"),
          icon: "",
          date: "2025-09-13",
          content: t("Patient requires monitoring."),
          recipes: [
            {
              id: 1001,
              medication: t("Ibuprofen"),
              dosage: t("400mg"),
              durationInDays: 7,
              instructions: t("Take one tablet every 6 hours as needed for pain"),
              type: t("Follow-up"),
              icon: "",
              date: "2025-09-15",
              content: t("Blood test required")
            }
          ]
        }
      ]
    }
  ]);

  // === Diagnosed Conditions Management ===
  const handleAddCondition = useCallback((diagnosisIndex) => {
    const newCondition = {
      id: Date.now(),
      MedicalCondition: "",
      Severity: "",
      Notes: "",
      isNew: true,
      isExpanded: true,
    };

    setDiagnosesData(prev =>
      prev.map((diagnosis, i) =>
        i === diagnosisIndex
          ? {
              ...diagnosis,
              conditions: [
                newCondition,
                ...(diagnosis.conditions || []).map(c => ({
                  ...c,
                  isExpanded: false,
                })),
              ],
            }
          : diagnosis
      )
    );
    console.log(t("diagnosesData: "), diagnosesData); 
  }, [t, diagnosesData]);

  const handleDeleteCondition = useCallback((diagnosisIndex, conditionIndex) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            conditions: (diagnosis.conditions || []).filter((_, j) => j !== conditionIndex)
          }
        : diagnosis
    ));
  }, []);

  const handleUpdateCondition = useCallback((diagnosisIndex, conditionIndex, field, value) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            conditions: (diagnosis.conditions || []).map((condition, j) => 
              j === conditionIndex ? { ...condition, [field]: value } : condition
            )
          }
        : diagnosis
    ));
  }, []);

  const handleSaveCondition = useCallback((diagnosisIndex, conditionIndex, conditionData) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            conditions: (diagnosis.conditions || []).map((condition, j) => 
              j === conditionIndex ? { 
                ...conditionData, 
                isNew: false, 
                isExpanded: false
              } : condition
            )
          }
        : diagnosis
    ));
    console.log(t("diagnosesData: "), diagnosesData);
  }, [t, diagnosesData]);

  // Add a new diagnosis record
  const handleAddDiagnosis = useCallback(() => {
    const newDiagnosis = {
      id: Date.now(),
      DiagnosisName: "",
      SymptomsDescription: "",
      Description: "",
      type: "",
      icon: "",
      date: new Date().toISOString().split("T")[0],
      content: "",
      notes: [],
      conditions: [], 
      prescriptions: [],
      isNew: true,
      isExpanded: true,
    };

    setDiagnosesData(prev =>
      [
        newDiagnosis,
        ...prev.map(item => ({ ...item, isExpanded: false }))
      ]
    );
    console.log(t("diagnosesData after add : "), diagnosesData);
  }, [t, diagnosesData]);

  // Save a diagnosis
  const handleSaveDiagnosis = useCallback((index, diagnosisData) => {
    setDiagnosesData(prev => prev.map((item, i) => 
      i === index ? { 
        ...diagnosisData, 
        isNew: false, 
        isExpanded: false,
        notes: item.notes || [],
        conditions: item.conditions || [], 
        prescriptions: item.prescriptions || []
      } : item
    ));
    console.log(t("diagnosesData after save : "), diagnosesData);
  }, [t, diagnosesData]);

  // Delete a diagnosis by index
  const handleDeleteDiagnosis = useCallback((index) => {
    setDiagnosesData(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update a single field of a diagnosis
  const handleUpdateDiagnosis = useCallback((index, field, value) => {
    setDiagnosesData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  // Toggle expansion - allow only one open
  const handleToggleExpansion = useCallback((index) => {
    setDiagnosesData(prev =>
      prev.map((item, i) => ({
        ...item,
        isExpanded: i === index ? !item.isExpanded : false, 
      }))
    );
  }, []);

  // === Notes Management ===
  const handleAddNote = useCallback((diagnosisIndex, note) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            notes: [...(diagnosis.notes || []), { 
              id: Date.now(), 
              note 
            }]
          }
        : diagnosis
    ));
  }, []);

  const handleDeleteNote = useCallback((diagnosisIndex, noteIndex) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            notes: (diagnosis.notes || []).filter((_, j) => j !== noteIndex)
          }
        : diagnosis
    ));
  }, []);

  // === Prescriptions Management ===
  const handleAddPrescription = useCallback((diagnosisIndex) => {
    const newPrescription = {
      id: Date.now(),
      title: "",
      status: "",
      note: "",
      type: "",
      icon: "",
      date: new Date().toISOString().split("T")[0],
      content: "",
      recipes: [],
      isNew: true,
      isExpanded: true,
    };

    setDiagnosesData(prev =>
      prev.map((diagnosis, i) =>
        i === diagnosisIndex
          ? {
              ...diagnosis,
              prescriptions: [
                newPrescription,
                ...(diagnosis.prescriptions || []).map(p => ({
                  ...p,
                  isExpanded: false,
                })),
              ],
            }
          : diagnosis
      )
    );
  }, []);

  const handleDeletePrescription = useCallback((diagnosisIndex, prescriptionIndex) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            prescriptions: (diagnosis.prescriptions || []).filter((_, j) => j !== prescriptionIndex)
          }
        : diagnosis
    ));
  }, []);

  // Update a single field inside a prescription
  const handleUpdatePrescription = useCallback((diagnosisIndex, prescriptionIndex, field, value) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            prescriptions: (diagnosis.prescriptions || []).map((prescription, j) => 
              j === prescriptionIndex ? { ...prescription, [field]: value } : prescription
            )
          }
        : diagnosis
    ));
  }, []);

  // Save prescription while keeping nested recipes intact
  const handleSavePrescription = useCallback((diagnosisIndex, prescriptionIndex, prescriptionData) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            prescriptions: (diagnosis.prescriptions || []).map((prescription, j) => 
              j === prescriptionIndex ? { 
                ...prescriptionData, 
                isNew: false, 
                isExpanded: false,
                recipes: prescription.recipes || []
              } : prescription
            )
          }
        : diagnosis
    ));
  }, []);

  // === Recipes Management ===
  const handleAddRecipe = useCallback((diagnosisIndex, prescriptionIndex) => {
    const newRecipe = {
      id: Date.now(),
      medication: "",
      dosage: "",
      durationInDays: "",
      instructions: "",
      type: "",
      icon: "",
      date: new Date().toISOString().split("T")[0],
      content: "",
      isNew: true,
      isExpanded: true,
    };

    setDiagnosesData((prev) =>
      prev.map((diagnosis, i) =>
        i === diagnosisIndex
          ? {
              ...diagnosis,
              prescriptions: (diagnosis.prescriptions || []).map(
                (prescription, j) =>
                  j === prescriptionIndex
                    ? {
                        ...prescription,
                        recipes: [
                          newRecipe,
                          ...(prescription.recipes || []).map((r) => ({
                            ...r,
                            isExpanded: false,
                          })),
                        ],
                      }
                    : prescription
              ),
            }
        : diagnosis
      )
    );
  }, []);

  const handleDeleteRecipe = useCallback((diagnosisIndex, prescriptionIndex, recipeIndex) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            prescriptions: (diagnosis.prescriptions || []).map((prescription, j) => 
              j === prescriptionIndex 
                ? { 
                    ...prescription, 
                    recipes: (prescription.recipes || []).filter((_, k) => k !== recipeIndex)
                  }
                : prescription
            )
          }
        : diagnosis
    ));
  }, []);

  // Update a single field inside a recipe
  const handleUpdateRecipe = useCallback((diagnosisIndex, prescriptionIndex, recipeIndex, field, value) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            prescriptions: (diagnosis.prescriptions || []).map((prescription, j) => 
              j === prescriptionIndex 
                ? { 
                    ...prescription, 
                    recipes: (prescription.recipes || []).map((recipe, k) => 
                      k === recipeIndex ? { ...recipe, [field]: value } : recipe
                    )
                  }
                : prescription
            )
          }
        : diagnosis
    ));
  }, []);

  // Save recipe (finalizes and collapses it)
  const handleSaveRecipe = useCallback((diagnosisIndex, prescriptionIndex, recipeIndex, recipeData) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            prescriptions: (diagnosis.prescriptions || []).map((prescription, j) => 
              j === prescriptionIndex 
                ? { 
                    ...prescription, 
                    recipes: (prescription.recipes || []).map((recipe, k) => 
                      k === recipeIndex ? { 
                        ...recipeData, 
                        isNew: false, 
                        isExpanded: false 
                      } : recipe
                    )
                  }
                : prescription
            )
          }
        : diagnosis
    ));
  }, []);

  return (
    <div
      className="dc-yourdetails dc-tabsinfo nested-accordion table-card"
    >
      <NestedAccordion
        backgroundColor="var(--cardcolor)"
        title={t("Diagnostic information")}
        addNewLabel={t("Add Diagnostic")}
        data={diagnosesData}
        formFields={[
          {
            name: "DiagnosisName",
            type: "text",
            placeholder: t("Diagnosis Name"),
            half: true,
            label: t("Diagnosis Name"),
          },
          {
            name: "SymptomsDescription",
            type: "text",
            placeholder: t("Symptoms Description"),
            half: true,
            label: t("Symptoms Description"),
          },
          {
            name: "Description",
            type: "textarea",
            placeholder: t("Diagnosis Description"),
            label: t("Diagnosis Description"),
          },
        ]}
        onAdd={handleAddDiagnosis}
        onDelete={handleDeleteDiagnosis}
        onUpdate={handleUpdateDiagnosis}
        onSave={handleSaveDiagnosis}
        onToggleExpansion={handleToggleExpansion}
        // Notes functions
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        // Conditions functions
        onAddCondition={handleAddCondition}
        onDeleteCondition={handleDeleteCondition}
        onUpdateCondition={handleUpdateCondition}
        onSaveCondition={handleSaveCondition}
        // Prescriptions functions
         formFieldsPrescription={[
          { 
            name: "title", 
            type: "text", 
            placeholder: t("Prescription Title"), 
            half: true,
            label: t("Prescription Title"),
          },
          { 
            name: "status",   
            type: "select",
            options: [t("Active"), t("Completed"), t("Cancelled"), t("Expired")],
            placeholder: t("select Status"), 
            half: true,
            label: t("Prescription Status"),
          },
          { 
            name: "note", 
            type: "textarea", 
            placeholder: t("Prescription note"),
            label: t("Prescription Note"),
          },
        ]}
        onAddPrescription={handleAddPrescription}
        onDeletePrescription={handleDeletePrescription}
        onUpdatePrescription={handleUpdatePrescription}
        onSavePrescription={handleSavePrescription}
        onAddRecipe={handleAddRecipe}
        onDeleteRecipe={handleDeleteRecipe}
        onUpdateRecipe={handleUpdateRecipe}
        onSaveRecipe={handleSaveRecipe}
        // Prescription form fields
        formFieldsRecipe={[
  { 
    name: "medication", 
    type: "dropdown",
    placeholder: t("Select Medication"),
    options: [ 
      t("Ibuprofen"),
      t("Paracetamol"), 
      t("Amoxicillin"),
      t("Aspirin"),
      t("Metformin"),
      t("Atorvastatin"),
      t("Lisinopril"),
      t("Levothyroxine"),
      t("Amlodipine"),
      t("Omeprazole")
    ],
    label: t("Medication"),
    half: true
  },
  { 
    name: "dosage", 
    type: "text",
    placeholder: t("Dosage"), 
    half: true,
    label: t("Dosage")
  },
  { 
    name: "durationInDays", 
    type: "number",
    placeholder: t("Duration (Days)"), 
    half: true,
    label: t("Duration (Days)")
  },
  { 
    name: "instructions", 
    type: "textarea",
    placeholder: t("Instructions"),
    label: t("Instructions")
  },
]}
      />
    </div>
  );
};

export default Diagnoses;