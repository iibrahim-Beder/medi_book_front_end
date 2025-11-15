// DoctorPatientNotes.jsx
import React, { useState, useEffect } from "react";
import CustomAccordion from "../../../shared/CustomAccordion";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import { useDevice } from "../../../../context/useIsMobile";
import { useTranslation } from "react-i18next";
import { useLazyGetDoctorPatientNotesQuery } from "../../../../api/doctorNotesApi";
import ConditionsFilters from "./component/ConditionsFilters";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DoctorPatientNotes = () => {
  const { t } = useTranslation();  
  const { isMobile } = useDevice();
  const PATIENT_ID = 4;

  // Filters states
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  };

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
  const [pageSize, setPageSize] = useState(10);

  // State to manage expanded items locally
  const [expandedItems, setExpandedItems] = useState({});

  // RTK Query for doctor notes
  const [triggerGetDoctorNotes, { 
    data: doctorNotesData, 
    isLoading, 
    isFetching, 
    error 
  }] = useLazyGetDoctorPatientNotesQuery();

  console.log("Doctor Notes Data:", doctorNotesData);

  useEffect(() => {
    setAppliedFilters(currentFilters);
    fetchDoctorNotes();
  }, [currentPage, appliedFilters, currentFilters.fromDate, currentFilters.toDate]);

  const fetchDoctorNotes = () => {
    const apiFilters = {
      ...appliedFilters,
      fromDate: formatDateForAPI(appliedFilters.fromDate),
      toDate: formatDateForAPI(appliedFilters.toDate),
    };

    console.log('API Filters for Doctor Notes:', apiFilters);
    
    // Remove undefined and empty values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    triggerGetDoctorNotes({
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    });
  };

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
      fromDate: null,
      toDate: null
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  // Note type options
  const noteTypeOptions = [
    { value: "Consultation", label: t("Consultation") },
    { value: "FollowUp", label: t("FollowUp") },
    { value: "Reminder", label: t("Reminder") },
    { value: "General", label: t("General") }
  ];

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return t('N/A');
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Fields used inside the accordion
  const notesFormFields = [
    {
      name: "noteType",
      label: t("Note Type"),
      type: "select",
      placeholder: t("Select note type"),
      options: noteTypeOptions,
      half: false,
      readOnly: false 
    },
    {
      name: "content", 
      label: t("Content"),
      type: "textarea",
      placeholder: t("Enter note content..."),
      half: false,
      readOnly: false 
    },
    {
      name: "createdAt",
      label: t("Created Date"),
      type: "text",
      placeholder: t("Created date"),
      half: true,
      readOnly: true 
    },
    {
      name: "lastModifiedAt",
      label: t("Last Modified"),
      type: "text",
      placeholder: t("Last modified date"), 
      half: true,
      readOnly: true 
    }
  ];

  // Fields used inside the modal
  const notestModalFields = [
    {
      name: "noteType",
      label: t("Note Type"),
      type: "select",
      placeholder: t("Select note type"),
      options: noteTypeOptions,
      half: false,   
      AllWidth: true
    },
    {
      name: "content", 
      label: t("Content"),
      type: "textarea",
      placeholder: t("Enter note content..."),
      half: false,
    }
  ];

  // Handle adding a new note
  const handleAddNote = () => {
    const newNote = {
      id: Date.now(), // Temporary unique ID
      noteType: "Consultation",
      content: "",
      createdAt: new Date().toISOString(),
      lastModifiedAt: new Date().toISOString(),
      isNew: true,
      displayCreatedAt: formatDateForDisplay(new Date().toISOString()),
      displayLastModifiedAt: formatDateForDisplay(new Date().toISOString())
    };
    
    setCurrentNote(newNote);
    setShowModal(true);
  };

  // Handle toggle expand/collapse - LOCAL STATE MANAGEMENT
  const handleToggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Handle inline updates from accordion fields
  const handleUpdateNote = (index, field, value) => {
    // This would typically call the update API
    console.log('Update note:', index, field, value);
    
    // If it's an expand/collapse action, handle locally
    if (field === "isExpanded") {
      handleToggleExpand(index);
    }
  };

  // Delete note by index
  const handleDeleteNote = (index) => {
    // This would typically call the delete API
    console.log('Delete note at index:', index);
  };

  // Save note from accordion (after inline edit)
  const handleSaveNote = (index, noteData) => {
    // This would typically call the update API
    console.log('Save note:', index, noteData);
  };

  // Save note from modal (add or edit)
  const handleSaveModal = () => {
    if (currentNote) {
      if (currentNote.isNew) {
        // Call add API mutation
        console.log('Add new note:', currentNote);
      } else {
        // Call update API mutation  
        console.log('Update note:', currentNote);
      }
      // Refresh data after mutation
      fetchDoctorNotes();
    }
    setShowModal(false);
    setCurrentNote(null);
  };

  // Open modal for editing selected note
  const handleEditWithModal = (index) => {
    const notes = doctorNotesData?.data || [];
    if (notes[index]) {
      const noteToEdit = notes[index];
      setCurrentNote({ 
        ...noteToEdit,
        displayCreatedAt: formatDateForDisplay(noteToEdit.createdAt),
        displayLastModifiedAt: formatDateForDisplay(noteToEdit.lastModifiedAt)
      });
      setShowModal(true);
    }
  };

  // Prepare data for accordion display from API data
  const accordionData = (doctorNotesData?.data || []).map((note, index) => ({
    ...note,
    title: note.noteType,
    date: formatDateForDisplay(note.lastModifiedAt || note.createdAt),
    displayCreatedAt: formatDateForDisplay(note.createdAt),
    displayLastModifiedAt: formatDateForDisplay(note.lastModifiedAt),
    // Add isExpanded from local state
    isExpanded: expandedItems[index] || false
  }));

  // Skeleton loading component
  const AccordionSkeleton = () => {
    return (
      <div className="table-card">
        <div className="accordion-header p-3 border-bottom">
          <Skeleton width={200} height={30} />
          <Skeleton width={150} height={20} className="mt-2" />
        </div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="accordion-item border-bottom p-3">
            <Skeleton width={150} height={20} />
            <Skeleton width={300} height={15} className="mt-2" />
            <Skeleton width={200} height={15} className="mt-1" />
          </div>
        ))}
      </div>
    );
  };

  // if (isLoading || isFetching) {
  //   return <AccordionSkeleton />;
  // }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {t('Common.error_loading_data')}
      </div>
    );
  }

  return (
    <div className="Accordion-section d-flex flex-column">
      {/* Filters Section */}
      <div className="mb-3">
        <ConditionsFilters
          searchTerm={currentFilters.searchText}
          setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchText: value }))}
          filterDateFrom={currentFilters.fromDate}
          setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
          filterDateTo={currentFilters.toDate}
          setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
          filterType={currentFilters.noteType}
          setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, noteType: value }))}
          onReset={handleResetFilters}
          onSearch={handleSearch}
          conditions={doctorNotesData?.data || []}
          showStatusFilter={false}
          showSeverityFilter={false}
          showConditionTypeFilter={true}
          conditionTypeOptions={noteTypeOptions}
          conditionTypeLabel={t("Note Type")}
        />
      </div>

      {isLoading || isFetching ? (
       <AccordionSkeleton />
      ) : (<>
      {/* Notes Accordion */}
      <div className={`table-card ${isMobile ? 'mobile-view' : ''}`}>
        <CustomAccordion
          title={t("Patient Notes")}
          addNewLabel={t("Add New Note")}
          data={accordionData}  
          formFields={notesFormFields}
          onAdd={handleAddNote}
          onDelete={handleDeleteNote}
          onUpdate={handleUpdateNote}
          onSave={handleSaveNote}
          accordioninnertitleSize=""
          noHedarBefore={true}
          onEditWithModal={handleEditWithModal}
          allowMultipleOpen={true} // Allow multiple accordions to be open
        />

        {/* Loading indicator during fetching */}
        {isFetching && (
          <div className="text-center p-2">
            <small className="text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              {t('Common.updating')}
            </small>
          </div>
        )}

        {/* No data message */}
        {accordionData.length === 0 && !isFetching && (
          <div className="text-center p-4">
            <p className="text-muted">{t('Common.no_data_available')}</p>
          </div>
        )}
      </div>
      
      </>)}


      {/* Modal used for adding and editing notes */}
      <DynamicEditModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentNote(null);
        }}
        
        onSave={handleSaveModal}
        record={currentNote}
        setRecord={setCurrentNote}
        fields={notestModalFields}
        title={currentNote?.isNew ? t("Add New Note") : t("Edit Note")}
      />
    </div>
  );
};

export default DoctorPatientNotes;