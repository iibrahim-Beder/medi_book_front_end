import CustomAccordion from "../../../../shared/CustomAccordion";
import ConditionsFilters from "../component/ConditionsFilters";
import Pagination from "../../../../shared/Pagination";
import { useTranslation } from "react-i18next";
import { usePatientNotes } from "./useDoctorNotes";
import { patientNotesHelpers, createIndexBasedHandlers } from "./doctorNotesHelpers";
import CustomAccordionSkeleton from "../../../../shared/CustomAccordionSkeleton";

const PatientNotes = ({ patientId = 4, isMobile = false }) => {
  const { t } = useTranslation();
  
  const {
    // State
    localNotes,
    currentFilters,
    currentPage,
    notesResponse,
    isLoading,
    isError,
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

    isFetching
  } = usePatientNotes(isMobile,patientId);

  const {
    notesFormFields,
    filterConfigs,
    emptyStates
  } = patientNotesHelpers(t);

  // if (true) return PatientNotesSkeleton();
  if (isError) return <div>{emptyStates.error}</div>;
  return (
    <div className="Accordion-section d-flex flex-column">
      <div className="mb-3">
        <ConditionsFilters
          searchTerm={currentFilters.searchText}
          setSearchTerm={(value) => setCurrentFilters(prev => ({ ...prev, searchText: value }))}
          filterType={currentFilters.noteType}
          setFilterType={(value) => setCurrentFilters(prev => ({ ...prev, noteType: value }))}
          filterDateFrom={currentFilters.fromDate}
          setFilterDateFrom={(date) => setCurrentFilters(prev => ({ ...prev, fromDate: date }))}
          filterDateTo={currentFilters.toDate}
          setFilterDateTo={(date) => setCurrentFilters(prev => ({ ...prev, toDate: date }))}
          onReset={handleResetFilters}
          onSearch={handleSearch}
          conditions={localNotes}
          filterConfigs={filterConfigs}
        />
      </div>
     { (isLoading||isFetching)?(<CustomAccordionSkeleton/>):(
      <div className="table-card flex-grow-1">
        <CustomAccordion
          title={t("Patient Notes")}
          addNewLabel={t("Add New Note")}
          data={localNotes}
          formFields={notesFormFields}
          onAdd={handleAddNote}
          {...createIndexBasedHandlers(localNotes, {
            onDelete: handleDeleteNote,
            onUpdate: handleUpdateNote,
            onSave: handleSaveSingleNote,
            onCancel: handleCancelNote,
          })}
          accordioninnertitleSize=""
          noHedarBefore={true}
          showSingleSaveButton={true}
          getItemTitle={(note) => note.noteType ? `${note.noteType}: ${note.content}` : "New Note"}
          isUpdateOut={true}
        />
      </div>
     )}


      {notesResponse && notesResponse.data && notesResponse.data.length > 0 && (
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalItems={notesResponse.totalCount || 0}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={notesResponse.totalPages || 1}
          />
        </div>
      )}
    </div>
  );
};

export default PatientNotes;