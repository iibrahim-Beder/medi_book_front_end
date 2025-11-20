import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Pagination";
import "react-loading-skeleton/dist/skeleton.css";

import { useGetPatientDiagnosesQuery } from "../../../api/patientDiagnosesApi";
import DiagnosisList from "../diagnosis/DiagnosisList";
import DiagnosisModal from "../diagnosis/DiagnosisModal";
import DeleteConfirmationPopup from "../diagnosis/DeleteConfirmationPopup";
import { useDiagnosisCRUD } from "../diagnosis/useDiagnosisCRUD";
import { transformDiagnosisData } from "../diagnosis/diagnosisUtils";

const DiagnosisMobileViewWithCRUD = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // API Call
  const {
    data: diagnosesData,
    isLoading,
    error,
    refetch
  } = useGetPatientDiagnosesQuery({
    patientId: PATIENT_ID,
    pageNumber: currentPage,
    pageSize: rowsPerPage
  });

  // Use custom hook for CRUD operations
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
  } = useDiagnosisCRUD(refetch);

  const currentItems = diagnosesData?.data?.map(transformDiagnosisData) || [];


  if (error) {
    return (
      <div className="table-container mobile-view-card">
        <div className="text-center text-danger py-5">
          <p>Error loading diagnoses</p>
          <Button onClick={refetch} variant="primary">
            Retry
          </Button>
        </div>
      </div>
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
          isLoading={isLoading}
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