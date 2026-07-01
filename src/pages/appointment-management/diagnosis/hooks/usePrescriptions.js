import { useCallback } from "react";
import {
  useAddPatientPrescriptionMutation, useUpdatePatientPrescriptionMutation, useDeletePatientPrescriptionMutation
} from "../../../../api/PatientProfile/patientPrescriptionApi";

import { BsFillInfoCircleFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { buildPrescriptionsUpdatePayload } from "../handlerUtils";
import { getErrorMessage } from "../../../utils/api-errors";
export const usePrescriptions = (editingDiagnosis, setEditingDiagnosis,diagnosesData) => {
  const [addPatientPrescription, { isLoading: isAddingPrescription }] = useAddPatientPrescriptionMutation();
  const [updatePatientPrescription, { isLoading: isUpdatingPrescription  }] =  useUpdatePatientPrescriptionMutation();
  const [deletePatientPrescription, { isLoading: isDeletingPrescription }] = useDeletePatientPrescriptionMutation(); 

  // === Prescriptions Management ===
  const handleAddPrescription = useCallback(() => {
    if (!editingDiagnosis) return;
   if (editingDiagnosis.prescriptions?.[0]?.isNew) {toast.error('Please save the previous prescription first'); return;}
    const newPrescription = {
      id: `prescription-${Date.now()}`,
      title: "",
      status: "Active",
      notes: "",
      type: "Medical",
      date: new Date().toISOString().split("T")[0],
      recipes: [],
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
    prescriptions: [
      newPrescription,
      ...(prev.prescriptions?.map(p => ({ ...p, isExpanded: false })) || [])
    ]
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

   const handleDeletePrescription = useCallback(async (prescriptionId) => {
  if (!editingDiagnosis||isDeletingPrescription) return;

  if (editingDiagnosis.isNew) {
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter(prescription => prescription.id !== prescriptionId)
    }))
  };

  const loadingToast = toast.loading('Deleting...');
  try {
    const prescription = editingDiagnosis.prescriptions?.find(p => p.id === prescriptionId);
    
    if (!prescription) {
      toast.error('Prescription not found');
      return;
    }

    if (!prescription.isNew) {
      const diagnosisId = editingDiagnosis.diagnosisId;
      const result = await deletePatientPrescription({prescriptionId,diagnosisId}).unwrap();
      
      if (result?.succeeded) {
        toast.success('Deleted Successfully');
      } else {
        toast.error('Failed to delete');
        return; 
      }
    }

    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter(prescription => prescription.id !== prescriptionId)
    }));

  } catch (error) {
    console.error('Error deleting prescription:', error);
    toast.error(error?.data?.message || 'Error deleting prescription');
  }finally {
    toast.dismiss(loadingToast);
  }
   }, [editingDiagnosis, setEditingDiagnosis, deletePatientPrescription]);

  const handleUpdatePrescription = useCallback((prescriptionId, field, value) => {
    if (!editingDiagnosis) return;
    if(field === 'cancel' || value === 'cancel'){
      const oldPrescription = diagnosesData?.data?.find(d => d.diagnosisId === editingDiagnosis.diagnosisId)?.prescriptionOverviews?.find(p => p.id === prescriptionId);
      console.log('oldPrescription', oldPrescription,"diagnosesData",diagnosesData);
      if (oldPrescription) {
        setEditingDiagnosis(prev => ({
          ...prev,
          prescriptions: (prev.prescriptions || []).map(prescription =>
            prescription.id === prescriptionId ? { ...prescription, title: oldPrescription.title, status: oldPrescription.status, notes: oldPrescription.notes,isExpanded: false } : prescription
          )
        }));
      }
      return
    }
    setEditingDiagnosis(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).map(prescription =>
        prescription.id === prescriptionId ? { ...prescription, [field]: value } : prescription
      )
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

  const handleSavePrescription = useCallback(async (prescriptionId, prescriptionData) => {
    console.log('Saving prescription:', prescriptionData);
    if (!editingDiagnosis|| isAddingPrescription|| isUpdatingPrescription) return;
    if (!prescriptionData.title){ toast.error('Prescription title is required'); return false;};
    if (!prescriptionData.status){ toast.error('Prescription title is required'); return false;};
    if (editingDiagnosis.isNew) {
      setEditingDiagnosis(prev => ({
        ...prev,
        prescriptions: (prev.prescriptions || []).map(prescription =>
          prescription.id === prescriptionId ? { ...prescriptionData, isNew: false, isExpanded: false } : prescription
        )
      }));
      return;
    }
    const loadingToast = toast.loading('Saving...');
      try {
    const prescription = editingDiagnosis.prescriptions?.find(p => p.id === prescriptionId);
    
    if (!prescription) {
      toast.error('Prescription not found');
      return false;
    }

    let success = false;

    if (prescription.isNew) {
      const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        prescriptionData: {
          title: prescriptionData.title,
          notes: prescriptionData.notes,
          status: prescriptionData.status,
          prescribedMedications: (prescriptionData.recipes || [])
          .filter(med => !med.isNew)
          .map(med => ({
            medicationId: med.medication.id,
            medication: med.medication, 
            startDate: med.startDate || new Date().toISOString(),
            endDate: (() => {
              const start = new Date(med.startDate || new Date());
              start.setDate(start.getDate() + (parseInt(med.durationInDays, 10) || 0));
              return start.toISOString();
            })(),
            dosage: med.dosage,
            durationInDays: parseInt(med.durationInDays) || 0,
            instructions: med.instructions
          }))
        }
      };

      console.log('Add Patient Prescription Payload:', payload);
      const result = await addPatientPrescription(payload).unwrap();
      if (result?.succeeded) { 
          console.log('Add Patient Prescription Result:', result);
        toast.success( "Saved Prescription Successfully");
        success = true;
      
        
        const accepted = result?.meta?.results?.PrescribedMedications.accepted || [];
        const rejected = result?.meta?.results?.PrescribedMedications.rejected || [];
        const acceptedIds = accepted.map(item => item.itemId);
      
        const filteredPrescriptions = (prescriptionData.recipes || []).filter(
          med => acceptedIds.includes(med.medication.id)
        );
        if (result?.meta?.hasRejections) {
          
          console.log('Filtered Prescriptions:', filteredPrescriptions, "Accepted",accepted, "Rejected", rejected);
        rejected.forEach(item => {
          const rejectedMed = (prescriptionData.recipes || []).find(
            med => med.medication.id === item.itemId
          );
      
          const medName = rejectedMed ? rejectedMed.medication.name : "therapy medication";
      
          toast(
            `${medName}, failed: ${item.reason}`,
            {
              icon: <BsFillInfoCircleFill style={{ fontSize: "large" }} />,
              duration: 15000,
            }
          );
        });
      
      }
      
        setEditingDiagnosis(prev => ({
          ...prev,
          prescriptions: (prev.prescriptions || []).map(prescription =>
            prescription.id === prescriptionId
              ? {
                  ...prescriptionData,
                  recipes: filteredPrescriptions, 
                  id: result.data.id,
                  isNew: false,
                  isExpanded: false
                }
              : prescription
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to save');
      }
    } else {

       const originalRecord = diagnosesData?.data?.find(
       record => record.id === editingDiagnosis.diagnosisId
       ).prescriptionOverviews?.find(p => p.id === prescriptionId);
       console.log("diagnosesData",diagnosesData,'===originalRecord:', originalRecord);
       if (!originalRecord) {
       console.error('Original record not found');
       toast.error('error saving diagnosis');
       toast.dismiss(loadingToast);
       // return false;
       }
       const prescriptionPayload = buildPrescriptionsUpdatePayload(originalRecord, prescriptionData);
       console.log('===prescriptionPayload:', prescriptionPayload);
       if (!Object.keys(prescriptionPayload).length) {
       toast.dismiss(loadingToast);
       toast("No changes detected");
       closeCloseExpandedPrescription();
       return false;
      }
       const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        prescriptionId: prescriptionId, 
        updates:prescriptionPayload
      };

      console.log('Update Patient Prescription Payload:', payload);
      const result = await updatePatientPrescription(payload).unwrap();
        console.log('Update Patient Prescription Result:', result);
      if (result?.succeeded) {
        toast.success(result?.message || 'Saved Successfully');
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          prescriptions: (prev.prescriptions || []).map(p =>
            p.id === prescriptionId 
              ? { ...prescriptionData, isExpanded: false }
              : p
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to save');
      }
    }

    return success;
  } catch (error) {
    console.error('Error saving prescription:', error);
    toast.error(getErrorMessage(error));
    return false;
  }finally{
    toast.dismiss(loadingToast);
  }
}, [editingDiagnosis, setEditingDiagnosis, addPatientPrescription, updatePatientPrescription,isAddingPrescription,isUpdatingPrescription,diagnosesData]);

const closeCloseExpandedPrescription = () => {
  setEditingDiagnosis(prev => ({
    ...prev,
    prescriptions: (prev.prescriptions || []).map(prescription =>
      prescription.isExpanded ? { ...prescription, isExpanded: false } : prescription
    )
  }));
};
  return {
    handleAddPrescription,
    handleDeletePrescription,
    handleUpdatePrescription,
    handleSavePrescription,
  };
};