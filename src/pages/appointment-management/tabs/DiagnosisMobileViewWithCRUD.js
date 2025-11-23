import React, { use, useEffect, useState } from "react";
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
const DiagnosisMobileViewWithCRUD = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(3);

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
    handleUpdateDiagnosis
  } = useDiagnosisCRUD(refetch, setCurrentItems); 

  useEffect(() => {
    if (diagnosesData?.data) {
      const transformedData = diagnosesData.data.map(transformDiagnosisData);
      setCurrentItems(transformedData);
      console.log("Updated currentItems from API:", transformedData);
    }
  }, [diagnosesData]);
  useEffect(() => {
    if(currentItems.length === 0)refetch(); 
  }, [handleConfirmDelete]);

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
          totalItems={diagnosesData.totalCount || 0}
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