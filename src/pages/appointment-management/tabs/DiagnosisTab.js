import {useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";

import DiagnosisList from "../diagnosis/DiagnosisList";
import DiagnosisModal from "../diagnosis/DiagnosisModal";
import DeleteConfirmationPopup from "../diagnosis/DeleteConfirmationPopup";
import { useDiagnosisCRUD } from "../diagnosis/useDiagnosisCRUD";
import { transformDiagnosisData } from "../diagnosis/diagnosisUtils";
import { useParams } from "react-router-dom";
import { useTimeSlotDetails } from "../../appointmentList/hooks/useTimeSlotDetails";
import ErrorPage from "../../notFound-pageError/ErrorPage";
import { useGetBookingOverviewForWebQuery } from "../../../api/doctor-information/timeSlotsApi";

const DiagnosisMobileView = () => {
  const { t } = useTranslation();

  // Pagination state
  const [showRowsPerPage, setshowRowsPerPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { appointmentId } = useParams();  
  // API Call

  const [currentItems, setCurrentItems] = useState([]);

  const {
    selectedDiagnosis,
    editingDiagnosis,
    setEditingDiagnosis, 
    deletePopup,
    handleAddDiagnosis,
    handleEditDiagnosis,
    handleCancelEdit,
    handleSaveAndClose,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
    handleDeleteDiagnosis,
    isAdding,
    isUpdating,
    handleUpdateDiagnosis,
    diagnosesData,
    isLoading,
    error,
    isFetching,
    refetch,
    setCurrentPage,
    setRowsPerPage,
    currentPage
  } = useDiagnosisCRUD(setCurrentItems,checkAndRefetch);

  const {
    patient,
} = useTimeSlotDetails(Number(appointmentId), useGetBookingOverviewForWebQuery);
  const[ lastPage,setLastPage] = useState (1);
  useEffect(() => {
  if (selectedDiagnosis === null && diagnosesData?.data) {
      const transformedData = diagnosesData.data.map(transformDiagnosisData);
      setTotalCount(diagnosesData.totalCount);
      setCurrentItems(transformedData);
    }
  }, [diagnosesData,selectedDiagnosis === null]);  
// Case 1: When page changes
// useEffect(() => {
//   if(lastPage!==currentPage){
//     if((showRowsPerPage>3&&totalCount>6) || 
//     (showRowsPerPage<3&&totalCount<6 && currentPage>lastPage)
//     ){setRowsPerPage(showRowsPerPage);}
//     else{setshowRowsPerPage(3);setRowsPerPage(3);};
//     setLastPage(currentPage);
//   }
// }, [currentPage]);


  function checkAndRefetch(isAdding=false) {
    if (isAdding) {
    setTotalCount(prev => prev + 1);
    setshowRowsPerPage(prev => prev + 1);
    return;
  }
  if(showRowsPerPage!==1){setshowRowsPerPage((prev )=> prev - 1);}
  setTotalCount(prev => prev - 1);
  if (currentItems.length === 1 && currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
    setshowRowsPerPage(1);
  } else {
    if ( currentItems.length === 1 && totalCount > showRowsPerPage) {
      refetch();
      setshowRowsPerPage(1);
    }
  }
};

if (error) {
    return (
      <div className="table-card w-100">
        <ErrorPage refetch={refetch} isFetching={isFetching} error={error} />
      </div>
    );
  }

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("Diagnosis")}</h3>
          <h6 className="table-subtitle">{patient.name}</h6>
        </div>
        <button
          onClick={handleAddDiagnosis}
          className="add-btn"
          disabled={isLoading}
        >
          {t("Add New Diagnosis")}
        </button>
      </div>

      <div className="p-2">
        <DiagnosisList
          isLoading={isLoading || isFetching}
          currentItems={currentItems}
          onEditDiagnosis={handleEditDiagnosis}
          t={t}
          handleAddDiagnosis={handleAddDiagnosis}
        />
      </div>

      {diagnosesData && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount || 0}
          rowsPerPage={showRowsPerPage}
          onPageChange={setCurrentPage}
          totalPages={diagnosesData.totalPages || 1}
        />
      )}

      {/* Edit/Manage Modal */}
      {(selectedDiagnosis || editingDiagnosis) && (
        <DiagnosisModal
          diagnosesData={diagnosesData}
          editingDiagnosis={editingDiagnosis}
          setEditingDiagnosis={setEditingDiagnosis}
          setCurrentItems={setCurrentItems}
          onUpdateDiagnosis={handleUpdateDiagnosis}
          onCancel={handleCancelEdit}
          onSave={handleSaveAndClose}
          onDelete={handleDeleteDiagnosis}
          isAdding={isAdding}
          isUpdating={isUpdating}
          t={t}
        />
      )}

      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <DeleteConfirmationPopup
          deletePopup={deletePopup}
          onClose={handleCloseDeleteConfirm}
          onConfirm={handleConfirmDelete}
          t={t}
        />
      )}
    </div>
  );
};

export default DiagnosisMobileView;