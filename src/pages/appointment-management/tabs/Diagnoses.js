import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../../MainCss.css";
import NestedAccordion from "../../shared/NestedAccordion";

const Diagnoses = () => {
  const { t } = useTranslation();
const [diagnosesData, setDiagnosesData] = useState([
  {
    id: 1,
    DiagnosisName: "Chronic Migraine", 
    SymptomsDescription: "Severe headaches with nausea and sensitivity to light",
    Description: "Patient diagnosed with chronic migraine requiring medication management",
    notes: [
      { id: 11, note: "Patient requested reschedule" },
      { id: 12, note: "Allergic to penicillin" }
    ],
    conditions: [
      {
        id: 201,
        MedicalCondition: "Hypertension",
        Severity: "Moderate",
        Notes: "Requires regular monitoring",
        isNew: false,
        isExpanded: false
      }
    ],
    prescriptions: [
      {
        id: 101,
        type: "Medical",
        icon: "",
        date: "2025-09-13",
        content: "Patient requires monitoring.",
        recipes: [
          {
            id: 1001,
            type: "Follow-up",
            icon: "",
            date: "2025-09-15",
            content: "Blood test required"
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
                  isExpanded: false, // Set isExpanded to false for existing conditions
                })),
              ],
            }
          : diagnosis
      )
    );

    console.log("Added condition:", newCondition);
  }, []);

  const handleDeleteCondition = useCallback((diagnosisIndex, conditionIndex) => {
    setDiagnosesData(prev => prev.map((diagnosis, i) => 
      i === diagnosisIndex 
        ? { 
            ...diagnosis, 
            conditions: (diagnosis.conditions || []).filter((_, j) => j !== conditionIndex)
          }
        : diagnosis
    ));
    console.log("Deleted condition:", conditionIndex);
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
    console.log("Updated condition:", { diagnosisIndex, conditionIndex, field, value });
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
    console.log("Saved condition:", conditionData);
  }, []);

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
      ...prev.map(item => ({ ...item, isExpanded: false })) // close all other items
    ]
  );
}, []);


  // Save a diagnosis (marks as not new and collapses it)
 const handleSaveDiagnosis = useCallback((index, diagnosisData) => {
  setDiagnosesData(prev => prev.map((item, i) => 
    i === index ? { 
      ...diagnosisData, 
      isNew: false, 
      isExpanded: false,
      // Preserve nested data
      notes: item.notes || [],
      conditions: item.conditions || [], 
      prescriptions: item.prescriptions || []
    } : item
  ));
  console.log("Saved diagnosis:", diagnosisData);
}, []);

  // Delete a diagnosis by index
  const handleDeleteDiagnosis = useCallback((index) => {
    setDiagnosesData(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Update a single field of a diagnosis
  const handleUpdateDiagnosis = useCallback((index, field, value) => {
    setDiagnosesData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    console.log("Updated diagnosis:", { index, field, value }); 
  }, []);

// Toggle expansion - allow only one open
const handleToggleExpansion = useCallback((index) => {
  setDiagnosesData(prev =>
    prev.map((item, i) => ({
      ...item,
      isExpanded: i === index ? !item.isExpanded : false, 
    }))
  );
  console.log("Toggled expansion for diagnosis:", index);
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
    console.log("Added note:", note);
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
    console.log("Deleted note:", noteIndex);
  }, []);

  // === Prescriptions Management ===
 const handleAddPrescription = useCallback((diagnosisIndex) => {
  const newPrescription = {
    id: Date.now(),
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
                isExpanded: false, // close all other prescriptions
              })),
            ],
          }
        : diagnosis
    )
  );

  console.log("Added prescription:", newPrescription);
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
    console.log("Deleted prescription:", prescriptionIndex);
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
    console.log("Updated prescription:", { diagnosisIndex, prescriptionIndex, field, value });
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
    console.log("Saved prescription:", prescriptionData);
  }, []);

  // === Recipes Management ===
 const handleAddRecipe = useCallback((diagnosisIndex, prescriptionIndex) => {
  const newRecipe = {
    id: Date.now(),
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
                          isExpanded: false, // close all other recipes
                        })),
                      ],
                    }
                  : prescription
            ),
          }
        : diagnosis
    )
  );

  console.log("Added recipe:", newRecipe);
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
    console.log("Deleted recipe:", recipeIndex);
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
    console.log("Updated recipe:", { diagnosisIndex, prescriptionIndex, recipeIndex, field, value });
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
    console.log("Saved recipe:", recipeData);
  }, []);

  
   return (
     <div
       className="dc-yourdetails dc-tabsinfo nested-accordion"
       style={{
         backgroundColor: "var(--cardcolor)",
         padding: "20px",
         borderRadius: "8px",
         height: "100%",
         boxShadow: "0 0 7px #eee",
       }}
     >
       <NestedAccordion
         backgroundColor="var(--cardcolor)"
         title="Diagnostic information"
         addNewLabel="Add Diagnostic"
         data={diagnosesData}
         formFields={[
           {
             name: "DiagnosisName",
             type: "text",
             placeholder: "Diagnosis Name",
             half: true,
           },
           {
             name: "SymptomsDescription",
             type: "text",
             placeholder: "Symptoms Description",
             half: true,
           },
           {
             name: "Description",
             type: "textarea",
             placeholder: "Diagnosis Description",
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
         onAddPrescription={handleAddPrescription}
         onDeletePrescription={handleDeletePrescription}
         onUpdatePrescription={handleUpdatePrescription}
         onSavePrescription={handleSavePrescription}
         onAddRecipe={handleAddRecipe}
         onDeleteRecipe={handleDeleteRecipe}
         onUpdateRecipe={handleUpdateRecipe}
         onSaveRecipe={handleSaveRecipe}
       />
     </div>
   );
};

export default Diagnoses;
