import CustomAccordion from "../../../../shared/CustomAccordion";
import ConditionsFilters from "../component/ConditionsFilters";
import Pagination from "../../../../shared/Pagination";
import { useTranslation } from "react-i18next";
import { usePatientNotes } from "./useDoctorNotes";
import { patientNotesHelpers, createIndexBasedHandlers } from "./doctorNotesHelpers";
import CustomAccordionSkeleton from "../../../../shared/CustomAccordionSkeleton";
import DataEmptyComponent from "../../../../shared/DataEmptyComponent";

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

  const isFilterEmpty =
    !currentFilters.searchText &&
    !currentFilters.noteType &&
    !currentFilters.fromDate &&
    !currentFilters.toDate;

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
      <div className="table-card flex-grow-1">
      {localNotes.length === 0 && !isFetching ? (
        isFilterEmpty ? (
          <DataEmptyComponent imgStyle={{ maxWidth: "300px" }} title="No Notes Found" text="No Notes Found"/>
        ) : (
          <DataEmptyComponent
           imgStyle={{ maxWidth: "200px" }} title="No Notes Found" text="No Notes Found Based on Filters" 
                btnText="Clear Filters"
                onClick={handleResetFilters}
          />
        )
      ) : (
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
          getItemTitle={(note) =>
            note.noteType ? `${note.noteType}: ${note.content}` : "New Note"
          }
          forceShowError={true}
          isFetching={isLoading || isFetching}
        />
      )}
      </div>


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