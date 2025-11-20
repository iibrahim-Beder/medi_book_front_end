// PatientDiagnosesTable.js
import React, { useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import { useGetPatientDiagnosesQuery, useDeletePatientDiagnosisMutation } from "../api/patientDiagnosesApi";
import { useTranslation } from "react-i18next";
import Pagination from "../pages/shared/Pagination";
import toast from 'react-hot-toast';

const PatientDiagnosesTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");

  const queryArgs = useMemo(() => ({
    patientId: PATIENT_ID,
    filter: {
      searchValue: searchValue
    },
    pageNumber: currentPage,
    pageSize: pageSize
  }), [searchValue, currentPage]);

  const {
    data: diagnosesData,
    isLoading,
    error,
    refetch
  } = useGetPatientDiagnosesQuery(queryArgs);
  console.log('Diagnoses Data:', diagnosesData);

  const [deleteDiagnosis] = useDeletePatientDiagnosisMutation();

  const handleDelete = async (diagnosisId) => {
    try {
      const res = await deleteDiagnosis(diagnosisId).unwrap();
      if (res?.succeeded) {
        toast.success("Diagnosis deleted successfully");
        refetch();
      }
    } catch (error) {
      toast.error("Error deleting diagnosis");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div>
          <h3 className="table-title">{t("Patient Diagnoses")}</h3>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search diagnoses..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="table-card">
        <Table className="data-table">
          <thead>
            <tr>
              <th>{t("Diagnosis Name")}</th>
              <th>{t("Code")}</th>
              <th>{t("Symptoms")}</th>
              <th>{t("Description")}</th>
              <th>{t("Created At")}</th>
              <th>{t("Prescriptions")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center text-danger">
                  Error loading diagnoses
                </td>
              </tr>
            ) : diagnosesData?.data?.length > 0 ? (
              diagnosesData.data.map((diagnosis) => (
                <tr key={diagnosis.id}>
                  <td>{diagnosis.diagnosisName}</td>
                  <td>{diagnosis.code}</td>
                  <td title={diagnosis.symptomsDescription}>
                    {diagnosis.symptomsDescription?.substring(0, 50)}
                    {diagnosis.symptomsDescription?.length > 50 && '...'}
                  </td>
                  <td title={diagnosis.description}>
                    {diagnosis.description?.substring(0, 50)}
                    {diagnosis.description?.length > 50 && '...'}
                  </td>
                  <td>{formatDate(diagnosis.createdAt)}</td>
                  <td>
                    {diagnosis.prescriptionOverviews.length > 0 ? (
                      `${diagnosis.prescriptionOverviews.length} prescriptions`
                    ) : (
                      "No prescriptions"
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(diagnosis.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No diagnoses found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        {diagnosesData && diagnosesData.data && diagnosesData.data.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={diagnosesData.totalCount || 0}
            rowsPerPage={pageSize}
            onPageChange={setCurrentPage}
            totalPages={diagnosesData.totalPages || 1}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDiagnosesTable;