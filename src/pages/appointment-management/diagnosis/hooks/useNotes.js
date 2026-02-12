import { useCallback } from "react";
import { useAddDiagnosisNoteMutation, useUpdateDiagnosisNoteMutation, useDeleteDiagnosisNoteMutation } from "../../../../api/PatientProfile/patientDiagnosesApi";
import toast from "react-hot-toast";
export const useNotes = (editingDiagnosis, setEditingDiagnosis ,diagnosesData) => {
  const [addDiagnosisNote, { isLoading: isAddingNote }] = useAddDiagnosisNoteMutation();
  const [updateDiagnosisNote, { isLoading: isUpdatingNote }] = useUpdateDiagnosisNoteMutation();
  const [deleteDiagnosisNote, { isLoading: isDeletingNote }] = useDeleteDiagnosisNoteMutation();

  // === Notes Management ===
  const handleAddNote = useCallback(() => {
    if (!editingDiagnosis) return;
      if (editingDiagnosis.notes?.[0]?.isNew) {toast.error('Please save the previous note first'); return;}
    const newNote = {
      id: `note-${Date.now()}`,
      note: "",
      isNew: true,
      isExpanded: true,
    };
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: [newNote, ...(prev.notes || [])]
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleDeleteNote = useCallback(async (noteId) => {
  if (!editingDiagnosis|| isDeletingNote) return;
  const loadingToast = toast.loading('Deleting...');
  try {
    const note = editingDiagnosis.notes?.find(n => n.id === noteId);    
    if (note && !note.isNew) {
      const result = await deleteDiagnosisNote({diagnosisNoteId:noteId,diagnosisId:editingDiagnosis.diagnosisId}).unwrap();
      
      if (result?.succeeded) {           
        toast.success('Deleted Successfully');
        toast.dismiss(loadingToast);
      } else {
        toast.error(result?.message || 'Failed to delete');
        toast.dismiss(loadingToast);
        return; 
      }
    }

    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).filter(note => note.id !== noteId)
    }));

  } catch (error) {
    // console.error('Error deleting note:', error);
    toast.error(error?.data?.message || error?.message || 'Error deleting note');
  }
  toast.dismiss(loadingToast);
}, [editingDiagnosis, setEditingDiagnosis, deleteDiagnosisNote]);

  const handleUpdateNote = useCallback((noteId, field, value) => {
    if (!editingDiagnosis) return;
    setEditingDiagnosis(prev => ({
      ...prev,
      notes: (prev.notes || []).map(note =>
        note.id === noteId ? { ...note, [field]: value } : note
      )
    }));
  }, [editingDiagnosis, setEditingDiagnosis]);

const handleSaveNote = useCallback(async (noteId, noteData) => {
  if (!editingDiagnosis || isUpdatingNote || isAddingNote ) return;
  if (!noteData.note){ toast.error('Note cannot be empty'); return;}
  console.log('Editing Diagnosis:', editingDiagnosis, "noteId:", noteId, "noteData:", noteData);
        if(editingDiagnosis.isNew){
          setEditingDiagnosis(prev => ({...prev,notes: (prev.notes || []).map(note =>note.id === noteId ? { ...noteData, isNew: false, isExpanded: false } : note)}));
          return;
        }
      const loadingToast = toast.loading('Saving...');
  try {
    const note = editingDiagnosis.notes?.find(n => n.id === noteId);
    
    if (!note) {
      toast.error('Note not found');
      toast.dismiss(loadingToast);
      return;
    }

    let success = false;

    if (note.isNew) {
      const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        content: noteData.note
      };

      console.log('Add Diagnosis Note Payload:', payload);
      const result = await addDiagnosisNote(payload).unwrap();

      if (result?.succeeded) {           
        toast.success( result?.message || 'Saved Successfully');
        toast.dismiss(loadingToast);
        
        success = true;

        setEditingDiagnosis(prev => ({
          ...prev,
          notes: (prev.notes || []).map(note =>
            note.id === noteId 
              ? { 
                  ...noteData, 
                  id: result.data?.id || noteId,
                  isNew: false, 
                  isExpanded: false 
                }
              : note
          )
        }));
      } else {
        toast.error(result?.message || 'Failed to save');
        toast.dismiss(loadingToast);
      }
    } else {
      const originalnotes = diagnosesData?.data?.find(d => d.diagnosisId === editingDiagnosis.diagnosisId)?.diagnosisNoteOverviews?.find(n => n.id === noteId);
      console.log("originalnotes", originalnotes ,diagnosesData);
      if(originalnotes.note===noteData.note){
        toast.dismiss(loadingToast);
        toast('No changes');
        closeEditingNotesDiagnosis();
        return;
      }
      const payload = {
        diagnosisId: editingDiagnosis.diagnosisId,
        diagnosisNoteId: noteId,
        noteContent: noteData.note
      };

      console.log('Update Diagnosis Note Payload:', payload);
      const result = await updateDiagnosisNote(payload).unwrap();

      if (result?.succeeded) {           
        toast.success(result?.message || 'Saved Successfully');
        toast.dismiss(loadingToast);
        success = true;
        setEditingDiagnosis(prev => ({...prev,notes: (prev.notes || []).map(note =>note.id === noteId ? { ...note,note: noteData.note,isExpanded: false } : note)}));

      } else {
        toast.error(result?.message || 'Failed to save');
        toast.dismiss(loadingToast);
      }
    }

    return success;
  } catch (error) {
    console.error('Error saving note:', error);
    toast.error(error?.data?.title || 'Error saving note');
    toast.dismiss(loadingToast);
    return false;
  }
}, [editingDiagnosis, setEditingDiagnosis, addDiagnosisNote, updateDiagnosisNote,diagnosesData]);
 const closeEditingNotesDiagnosis = useCallback(() => {
          setEditingDiagnosis(prev => ({
          ...prev,
          notes: (prev.notes || []).map(note =>
            note.isExpanded ? { ...note, isExpanded: false } : note
          )
        }));
 })

  return {
    handleAddNote,
    handleDeleteNote,
    handleUpdateNote,
    handleSaveNote,
  };
};