import { useState, useMemo, useCallback,useEffect } from "react";
import { 
  useGetDoctorPatientNotesQuery,
  useAddDoctorPatientNoteMutation,
  useUpdateDoctorPatientNoteMutation,
  useDeleteDoctorPatientNoteMutation 
} from '../../../../../api/PatientProfile/doctorNotesApi';
import toast from 'react-hot-toast';


export const usePatientNotes = (isMobile = false,patientId) => {

  const [localNotes, setLocalNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  
  const [currentFilters, setCurrentFilters] = useState({
    searchText: "",
    noteType: "",
    fromDate: null,
    toDate: null
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    searchText: "",
    noteType: "",
    fromDate: null,
    toDate: null
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = isMobile ? 5 : 5;

  // Helper function to format date for API
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      fromDate: formatDateForAPI(currentFilters.fromDate),
      toDate: formatDateForAPI(currentFilters.toDate),
    };

    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    return {
      patientId: patientId,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [appliedFilters, currentPage, pageSize]);

  // RTK Query hooks
  const { 
    data: notesResponse, 
    isLoading, 
    isError,
    isFetching,
    refetch 
  } = useGetDoctorPatientNotesQuery(queryArgs);
  
  const [addNoteMutation, { isLoading: isAddingNote }] = useAddDoctorPatientNoteMutation();
  const [updateNoteMutation, { isLoading: isUpdatingNote }] = useUpdateDoctorPatientNoteMutation();
  const [deleteNoteMutation, { isLoading: isDeletingNote }] = useDeleteDoctorPatientNoteMutation();

  // Sync data from API to local state
  useEffect(() => {
    if (notesResponse?.succeeded && notesResponse.data) {
      const formattedNotes = notesResponse.data.map(note => ({
        ...note,
        displayCreatedAt: formatDateForDisplay(note.createdAt),
        displayLastModifiedAt: formatDateForDisplay(note.lastModifiedAt),
        isExpanded: false,
        hasUnsavedChanges: false,
        isTemp: false
      }));
      setLocalNotes(formattedNotes);
    }
  }, [notesResponse]);

  
  const handleSearch = (filters) => {
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
      setAppliedFilters(filters);
      setCurrentFilters(filters);
    } else {
      setAppliedFilters(currentFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchText: "",
      noteType: "",
      dateFrom: null,
      dateTo: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  const handleAddNote = useCallback(() => {
    // Check if there's already a new unsaved note
    if (localNotes.some(note => note.isNew)) {
      toast.error('Please save the previous note first');
      return;
    }

    const newNote = {
      id: `temp-${Date.now()}`,
      noteType: "Communication",
      content: "",
      createdAt: new Date().toISOString(),
      lastModifiedAt:"",
      isExpanded: true, // Expanded by default for new notes
      isNew: true,
      isTemp: true,
      displayCreatedAt: formatDateForDisplay(new Date().toISOString()),
      displayLastModifiedAt: "",
      hasUnsavedChanges: true
    };

    setLocalNotes(prev => [newNote, ...prev]);
  }, [localNotes]);

  // Handle inline updates from accordion fields 
  const handleUpdateNote = useCallback((noteId, field, value) => {
    setLocalNotes(prev => prev.map((note) => {
      if (note.id === noteId) {
        const updatedNote = {
          ...note,
          [field]: value,
          hasUnsavedChanges: true
        };
        
        return updatedNote;
      }
      return note;
    }));
  }, [localNotes]);

  const handleDeleteNote = useCallback(async (noteId) => {
    if (isDeletingNote) return;

    const noteToDelete = localNotes.find(note => note.id === noteId);
    if (!noteToDelete) return;

    const loadingToast = toast.loading('Deleting...');

    try {
      if (!noteToDelete.isTemp) {
        const result = await deleteNoteMutation(noteId).unwrap();
        
        if (result?.succeeded) {
          toast.success('Deleted Successfully');
        } else {
          toast.error(result?.message || 'Failed to delete');
          toast.dismiss(loadingToast);
          return;
        }
      }

      // Remove from local state
      setLocalNotes(prev => prev.filter(note => note.id !== noteId));
      
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Error deleting note');
    }
    
    toast.dismiss(loadingToast);
  }, [localNotes, isDeletingNote, deleteNoteMutation]);

  const handleSaveSingleNote = useCallback(async (noteId, noteData) => {
    if (isUpdatingNote || isAddingNote) return;

    const noteToSave = localNotes.find(note => note.id === noteId);
    if (!noteToSave) return;

    // Validation
    if (!noteData.content || noteData.content.trim() === '') {
      toast.error('Note content cannot be empty');
      return;
    }

    if (!noteData.noteType) {
      toast.error('Please select a note type');
      return;
    }

    const loadingToast = toast.loading('Saving...');

    try {
      let result;
      let success = false;

      if (noteToSave.isTemp) {
        // Create new note
        result = await addNoteMutation({
          patientId: patientId,
          noteData: {
            noteType: noteData.noteType,
            content: noteData.content
          }
        }).unwrap();

        if (result?.succeeded) {
          toast.success(result?.message || 'Saved Successfully');
          success = true;
        } else {
          toast.error(result?.message || 'Failed to save');
        }
      } else {
        // Update existing note
        result = await updateNoteMutation({
          noteId: noteId,
          updates: {
            noteType: noteData.noteType,
            content: noteData.content
          }
        }).unwrap();
        console.log("result",result);

        if (result?.succeeded) {
          toast.success(result?.message || 'Saved Successfully');
          success = true;
        } else {
          toast.error(result?.message || 'Failed to save');
        }
      }

      if (success) {
        // Update local state
        setLocalNotes(prev => prev.map(note => {
          if (note.id === noteId) {
            return {
              ...noteData,
              id: result.data?.id || noteId, 
              isExpanded: false,
              isNew: false,
              isTemp: false,
              hasUnsavedChanges: false,
              displayLastModifiedAt: formatDateForDisplay(new Date().toISOString())
            };
          }
          return note;
        }));
      }

    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error?.data?.message || 'Error saving note');
    }
    
    toast.dismiss(loadingToast);
  }, [localNotes, isUpdatingNote, isAddingNote, addNoteMutation, updateNoteMutation, refetch]);

  const handleCancelNote = useCallback((noteId) => {
    const note = localNotes.find(n => n.id === noteId);
    if (note && note.isNew) {
      setLocalNotes(prev => prev.filter(n => n.id !== noteId));
    } else {
      setLocalNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, isExpanded: false, hasUnsavedChanges: false }
          : note
      ));
    }
  }, [localNotes]);
useEffect(() => {
  if (notesResponse?.data) {
    const notes = notesResponse.data.map(note => ({
      ...note,
      displayCreatedAt: formatDateForDisplay(note.createdAt),
      displayLastModifiedAt: formatDateForDisplay(note.lastModifiedAt),
      hasUnsavedChanges: false
    }));
    setLocalNotes(notes);
  }
}, [notesResponse]);

  const accordionData = localNotes.map(note => ({
    ...note,
    title: note.noteType,
    date: formatDateForDisplay(note.lastModifiedAt || note.createdAt),
    displayCreatedAt: note.displayCreatedAt || formatDateForDisplay(note.createdAt),
    displayLastModifiedAt: note.displayLastModifiedAt || formatDateForDisplay(note.lastModifiedAt),
    hasUnsavedChanges: note.hasUnsavedChanges || false
  }));


  return {
    // State
    isFetching, 
    localNotes: accordionData,
    currentFilters,
    appliedFilters,
    currentPage,
    showModal,
    currentNote,
    notesResponse,
    isLoading,
    isError,
    isAddingNote,
    isUpdatingNote,
    isDeletingNote,
    pageSize,
    
    // Actions
    handleSearch,
    handleResetFilters,
    handleAddNote,
    handleUpdateNote,
    handleDeleteNote,
    handleSaveSingleNote,
    handleCancelNote,
    setCurrentPage,
    setCurrentFilters,
    setShowModal,
    setCurrentNote,
    refetch,
    
    // Utilities
    formatDateForDisplay
  };
};