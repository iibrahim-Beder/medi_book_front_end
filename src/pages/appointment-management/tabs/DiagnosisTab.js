import {useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";

import { useGetPatientDiagnosesQuery } from "../../../api/PatientProfile/patientDiagnosesApi";
import DiagnosisList from "../diagnosis/DiagnosisList";
import DiagnosisModal from "../diagnosis/DiagnosisModal";
import DeleteConfirmationPopup from "../diagnosis/DeleteConfirmationPopup";
import { useDiagnosisCRUD } from "../diagnosis/useDiagnosisCRUD";
import { transformDiagnosisData } from "../diagnosis/diagnosisUtils";
import ErrorLoading from "../../shared/ErrorLoading";
import { useDispatch } from "react-redux";
import { patientDiagnosesApi } from "../../../api/PatientProfile/patientDiagnosesApi";
import PatientName from "../../patient-management/patient-information/PatientTabs/component/PatientName";

const DiagnosisMobileViewWithCRUD = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  // Pagination state
  const [showRowsPerPage, setshowRowsPerPage] = useState(3);
  const [totalCount, setTotalCount] = useState(0);

  // API Call

  const [currentItems, setCurrentItems] = useState([]);
  const [isChange, setIsChange] = useState(false);

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
  } = useDiagnosisCRUD(setCurrentItems,checkAndRefetch,setIsChange);
  const[ lastPage,setLastPage] = useState (1);
  useEffect(() => {
    if (diagnosesData?.data) {
      const transformedData = diagnosesData.data.map(transformDiagnosisData);
      setTotalCount(diagnosesData.totalCount);
      setCurrentItems(transformedData);
      console.log("Current Data:", currentItems, "isChange", isChange);
      setIsChange(false);
    }
  }, [diagnosesData]);  
// Case 1: When page changes
useEffect(() => {
  if (isChange) {
    console.log("Page changed → invalidate");
    dispatch(patientDiagnosesApi.util.invalidateTags(["PatientDiagnoses"]));
  }
  if(lastPage!==currentPage){
    if((showRowsPerPage>3&&totalCount>6) || 
    (showRowsPerPage<3&&totalCount<6 && currentPage>lastPage)
    ){setRowsPerPage(showRowsPerPage);}
    else{setshowRowsPerPage(3);setRowsPerPage(3);};
    setLastPage(currentPage);
  }
}, [currentPage]);

// Case 2: When component unmounts
useEffect(() => {
  return () => {
    if (isChange) {
      console.log("Component unmounted → invalidate");
      // dispatch(patientDiagnosesApi.util.invalidateTags(["PatientDiagnoses"]));
    }
  };
}, [isChange]);


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
    setshowRowsPerPage(3);
  } else {
    if ( currentItems.length === 1 && totalCount > showRowsPerPage) {
      refetch();
      setshowRowsPerPage(3);
    }
  }
};

if (error) {
    return (
     <ErrorLoading isError={error} refetch={refetch} />
    );
  }

  return (
    <div className="table-container mobile-view-card">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("Diagnosis")}</h3>
          <h6 className="table-subtitle"><PatientName/></h6>
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
          setIsChange={setIsChange}
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

export default DiagnosisMobileViewWithCRUD;