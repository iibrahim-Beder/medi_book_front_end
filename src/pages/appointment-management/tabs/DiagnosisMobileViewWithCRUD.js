import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";

import { useGetPatientDiagnosesQuery } from "../../../api/patientDiagnosesApi";
import DiagnosisList from "../diagnosis/DiagnosisList";
import DiagnosisModal from "../diagnosis/DiagnosisModal";
import DeleteConfirmationPopup from "../diagnosis/DeleteConfirmationPopup";
import { useDiagnosisCRUD } from "../diagnosis/useDiagnosisCRUD";
import { transformDiagnosisData } from "../diagnosis/diagnosisUtils";
import ErrorLoading from "../../shared/ErrorLoading";
import { useDispatch } from "react-redux";
import { patientDiagnosesApi } from "../../../api/patientDiagnosesApi";

const DiagnosisMobileViewWithCRUD = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  const dispatch = useDispatch();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(3);
  const [totalCount, setTotalCount] = useState(0);

  // API Call
  const {
    data: diagnosesData,
    isLoading,
    error,
    isFetching,
    refetch
  } = useGetPatientDiagnosesQuery({
    patientId: PATIENT_ID,
    pageNumber: currentPage,
    pageSize: rowsPerPage
  });

  const [currentItems, setCurrentItems] = useState([]);

  const {
    selectedDiagnosis,
    editingDiagnosis,
    setEditingDiagnosis, 
    deletePopup,
    handleAddDiagnosis,
    handleEditDiagnosis,
    handleSaveDiagnosis,
    handleCancelEdit,
    handleSaveAndClose,
    handleShowDeleteConfirm,
    handleCloseDeleteConfirm,
    handleConfirmDelete,
    handleDeleteDiagnosis,
    isAdding,
    isUpdating,
    handleUpdateDiagnosis


  } = useDiagnosisCRUD(refetch, setCurrentItems,checkAndRefetch);
    console.log('isAdding:', isAdding, 'isUpdating:', isUpdating);
  useEffect(() => {
    if (diagnosesData?.data) {
      const transformedData = diagnosesData.data.map(transformDiagnosisData);
      setTotalCount(diagnosesData.totalCount);
      setCurrentItems(transformedData);
      console.log("Current Data:", currentItems);
    }
  }, [diagnosesData]);  
  useEffect(() => {
    console.log("Invalidating tags open " , currentItems.length);
    if (currentItems.length>3) {
        dispatch(patientDiagnosesApi.util.invalidateTags(["PatientDiagnoses"]))
        console.log("Invalidating tags open====== " , currentItems.length);
    }
    
  }, [currentPage]);
 

  function checkAndRefetch(isAdding=false) {
    if (isAdding) {
    setTotalCount(prev => prev + 1);
    return;
    }
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else {
      if ( currentItems.length === 1 && totalCount > 3) {
        refetch();
      }
    }
    setTotalCount(prev => prev - 1);
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
          <h6 className="table-subtitle">
            {t("Manage patient diagnoses and related information")}
          </h6>
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
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          totalPages={diagnosesData.totalPages || 1}
        />
      )}

      {/* Edit/Manage Modal */}
      {(selectedDiagnosis || editingDiagnosis) && (
        <DiagnosisModal
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