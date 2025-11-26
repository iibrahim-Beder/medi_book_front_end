import React, { useState, useMemo } from "react";
import { Table, Button } from "react-bootstrap";
import DynamicEditModal from "../../../shared/DynamicEditModal";
import Pagination from "../../../shared/Pagination";
import ConditionsFilters from "./component/ConditionsFilters";
import { useTranslation } from "react-i18next";
import "../../Patient-management.css";
import PopupMessage from "../../../shared/PopupMessage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { 
  useGetPatientAllergiesQuery,
  useDeletePatientAllergyMutation,
  useUpdatePatientAllergyMutation,
  useAddPatientAllergyMutation 
} from "../../../../api/patientAllergiesApi";
import HighlightText from "../../../shared/HighlightText";
import ErrorLoading from "../../../shared/ErrorLoading";
import toast, { Toaster } from 'react-hot-toast';
import { formatDate } from "../../../shared/FormatDate";

const allergenOptions = [
  { id: 12, label: "12 - Penicillin" },
  { id: 13, label: "13 - Peanuts" },
  { id: 14, label: "14 - Dust mites" },
  { id: 15, label: "15 - Shellfish" },
  { id: 16, label: "16 - Latex" },
  { id: 17, label: "17 - Aspirin" },
  { id: 18, label: "18 - Insect stings" },
];

const AllergyTable = () => {
  const { t } = useTranslation();
  const PATIENT_ID = 4;

  // Format date for API
  const formatDateForAPI = (date) => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const [currentFilters, setCurrentFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    dateNoted: ""
  });

  const [appliedFilters, setAppliedFilters] = useState({
    searchValue: "",
    isActive: "All",
    severity: "",
    dateNoted: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Modal and UI state
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // RTK Query with caching
  const queryArgs = useMemo(() => {
    const apiFilters = {
      ...appliedFilters,
      dateNoted: formatDateForAPI(appliedFilters.dateNoted),
      isActive: appliedFilters.isActive === "All" ? undefined : 
                appliedFilters.isActive === "Active" ? true :
                appliedFilters.isActive === "Inactive" ? false : undefined
    };

    // Remove undefined and empty values
    Object.keys(apiFilters).forEach(key => {
      if (apiFilters[key] === undefined || apiFilters[key] === "") {
        delete apiFilters[key];
      }
    });

    return {
      patientId: PATIENT_ID,
      filter: apiFilters,
      pageNumber: currentPage,
      pageSize: pageSize
    };
  }, [appliedFilters, currentPage]);

  const {
    data: allergiesData,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetPatientAllergiesQuery(queryArgs, {
    // refetchOnFocus: false,
    // refetchOnReconnect: true,
  });

  // Mutations
  const [deletePatientAllergy, { isLoading: isDeleting }] = useDeletePatientAllergyMutation();
  const [updatePatientAllergy, { isLoading: isUpdating }] = useUpdatePatientAllergyMutation();
  const [addPatientAllergy, { isLoading: isAdding }] = useAddPatientAllergyMutation();

  // Trigger refetch after save/delete
  const triggerRefetch = () => {
    refetch();
  };

  const handleSearch = (filters) => {
    setCurrentPage(1);
    if (filters && typeof filters === "object") {
      const mappedFilters = {
        ...currentFilters,
        ...filters,
        isActive: filters.status ?? currentFilters.isActive,
        status: undefined
      };

      setAppliedFilters(mappedFilters);
      setCurrentFilters(mappedFilters);
    } else {
      setAppliedFilters(currentFilters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchValue: "",
      isActive: "All",
      severity: "",
      dateNoted: ""
    };
    setCurrentFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setCurrentPage(1);
  };

  // Template for new record
  const emptyRecord = {
    allergenId: null,
    allergenLabel: "",
    severity: "",
    isActive: true,
    dateNoted: "",
    reaction: "",
    notes: ""
  };

  const handleAddNew = () => {
    setSelectedRecord({ ...emptyRecord });
    setIsAddMode(true);
    setShowModal(true);
  };

  const handleEdit = (entry) => {
    setSelectedRecord({ ...entry });
    setIsAddMode(false);
    setShowModal(true);
  };

  const handleDeleteInModal = () => {
    if (selectedRecord) {
      setRecordToDelete(selectedRecord);
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setRecordToDelete(null);
  };

  // Field mapping for highlight
  const fieldMapping = {
    allergenName: "AllergenName",
    reaction: "Reaction", 
    notes: "Notes"
  };

  ///// ====== API functions ===== \\\\\\

  // Handle Save (Add/Update)
  const handleSave = async () => {
    if (!selectedRecord || isDeleting || isUpdating || isAdding) return;
    
    if (!selectedRecord.allergenId) {
      toast.error('Please select an allergen.');
      return;
    }

    if (!selectedRecord.severity) {
      toast.error('Please select severity.');
      return;
    }

    console.log('Saving record:', selectedRecord);
    const loadingToast = toast.loading('Saving...');

    if (isAddMode) {
      try {
        const addData = {
          ...selectedRecord,
          dateNoted: formatDateForAPI(selectedRecord.dateNoted)
        };

        console.log('Sending add data:', addData);

        const res = await addPatientAllergy({ 
          patientId: PATIENT_ID, 
          ...addData 
        }).unwrap();
        
        if (res?.succeeded) {
          toast.success(res.message || "Added Successfully");
          toast.dismiss(loadingToast);
          setShowModal(false);
          setSelectedRecord(null);
          triggerRefetch();
        } else {
          console.error("Failed to add", res);
          toast.dismiss(loadingToast);
          toast.error(res.message || "Failed to add");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Add error:', error);
        toast.error(error?.data?.message || "Error adding allergy record.");
      }
    } else {
      try {
        const updateData = {
          ...selectedRecord,
          dateNoted: formatDateForAPI(selectedRecord.dateNoted)
        };

        console.log('Sending update data:', updateData);

        const res = await updatePatientAllergy({ 
          allergyId: selectedRecord.id, 
          patientId: PATIENT_ID, 
          updates: updateData 
        }).unwrap();
        
        if (res?.succeeded) {
          console.log("Updated Successfully");
          toast.success(res.message || "Updated Successfully");
          toast.dismiss(loadingToast);
          setShowModal(false);
          setSelectedRecord(null);
          triggerRefetch();
        } else {
          console.error("Failed to update", res);
          toast.dismiss(loadingToast);
          toast.error(res.message || "Failed to update");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Update error:', error);
        toast.error(error?.data?.message || "Error updating allergy record.");
      }
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    
    const loadingToast = toast.loading('Deleting...');
    try {
      const res = await deletePatientAllergy({ 
        allergyId: recordToDelete.id, 
        patientId: PATIENT_ID 
      }).unwrap();
      
      if (res?.succeeded) {
        console.log("Deleted Successfully");
        toast.success(res.message || "Deleted Successfully");
        toast.dismiss(loadingToast);
        
        setShowPopup(false);
        setRecordToDelete(null);
        setShowModal(false);
        triggerRefetch();
      } else {
        console.error("Failed to delete", res);
        toast.dismiss(loadingToast);
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error?.data?.message || "Error deleting this allergy record.");
      setShowPopup(false);
    }
  };

  return (
    <div className="table-container">
      <div className="table-header" style={{ marginBottom: "10px" }}>
        <div>
          <h3 className="table-title">{t("AllergyTable.table_title")}</h3>
          <h6 className="table-subtitle">{t("AllergyTable.table_subtitle")}</h6>
        </div>
        <div>
          <button className="add-btn" onClick={handleAddNew}>
            {t("AllergyTable.add_allergen")}
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="mb-20 p-3">
          <ConditionsFilters
            searchPlaceholder="Search allergens..."
            searchTerm={currentFilters.searchValue}
            setSearchTerm={(value) =>
              setCurrentFilters((prev) => ({ ...prev, searchValue: value }))
            }
            filterConfigs={[
              {
                name: "status",
                label: "Status",
                data: ["All", "Active", "Inactive"].map((opt) => ({
                  key: opt,
                  label: opt,
                })),
              },
              {
                name: "severity",
                label: "Severity",
                data: ["Mild", "Moderate", "Severe"].map((opt) => ({
                  key: opt,
                  label: opt,
                })),
              },
            ]}
            filterDateFrom={
              currentFilters.dateNoted
                ? new Date(currentFilters.dateNoted)
                : null
            }
            setFilterDateFrom={(date) =>
              setCurrentFilters((prev) => ({
                ...prev,
                dateNoted: date ? date.toISOString() : "",
              }))
            }
            filterDateTo={null}
            setFilterDateTo={() => {}}
            onReset={handleResetFilters}
            onSearch={handleSearch}
            conditions={allergiesData?.data || []}
          />
        </div>
        <div className="p-3">
          <div className="scrol patientTable" style={{ overflow: "auto" }}>
            <Table className="data-table align-middle table-hover">
              <thead>
                <tr>
                  <th>{t("AllergyTable.allergen")}</th>
                  <th>{t("AllergyTable.severity")}</th>
                  <th>{t("AllergyTable.active")}</th>
                  <th>{t("AllergyTable.date_noted")}</th>
                  <th>{t("AllergyTable.reaction")}</th>
                  <th>{t("AllergyTable.notes")}</th>
                  <th>{t("AllergyTable.last_updated")}</th>
                  <th>{t("created_at")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton width={120} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                      <td><Skeleton width={60} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={150} height={15} /></td>
                      <td><Skeleton width={200} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={100} height={15} /></td>
                      <td><Skeleton width={80} height={15} /></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan="9" className="text-center text-danger">
                      <ErrorLoading isError={error} refetch={refetch} />
                    </td>
                  </tr>
                ) : allergiesData?.data && allergiesData.data.length > 0 ? (
                  allergiesData.data.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <HighlightText
                          text={entry.allergenName}
                          searchTerm={allergiesData.searchTerm}
                          matchedFields={entry.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.allergenName}
                        />
                      </td>
                      <td>
                        {t(`AllergyTable.severity_options.${entry.severity}`)}
                      </td>
                      <td>
                        <span>
                          {entry.isActive
                            ? t("AllergyTable.active_options.Active")
                            : t("AllergyTable.active_options.Inactive")}
                        </span>
                      </td>
                      <td>{formatDate(entry.dateNoted)}</td>
                      <td>
                        <HighlightText
                          text={entry.reaction}
                          searchTerm={allergiesData.searchTerm}
                          matchedFields={entry.highlightInfo?.matchedFields || []}
                          fieldName={fieldMapping.reaction}
                        />
                      </td>
                      <td>
                        {entry.notes ? (
                          <HighlightText
                            text={
                              entry.notes.length > 50
                                ? `${entry.notes.substring(0, 50)}...`
                                : entry.notes
                            }
                            searchTerm={allergiesData.searchTerm}
                            matchedFields={entry.highlightInfo?.matchedFields || []}
                            fieldName={fieldMapping.notes}
                          />
                        ) : (
                          "-"
                        )}
                      </td> 
                      <td>{formatDate(entry.updatedAt)}</td>
                      <td>{formatDate(entry.createdAt)}</td>
                      <td>
                        <Button
                          className="view-btn"
                          variant=""
                          size="sm"
                          style={{
                            color: "#007bff",
                            backgroundColor: "transparent",
                          }}
                          onClick={() => handleEdit(entry)}
                        >
                          {t("AllergyTable.manage")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      {appliedFilters.searchValue
                        ? t("AllergyTable.no_results_for_search", {
                            search: appliedFilters.searchValue,
                          })
                        : t("AllergyTable.no_records_found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {allergiesData && allergiesData.data && allergiesData.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={allergiesData.totalCount || 0}
              rowsPerPage={pageSize}
              onPageChange={setCurrentPage}
              totalPages={allergiesData.totalPages || 1}
            />
          )}
        </div>
      </div>

      <DynamicEditModal
        addMode={isAddMode}
        onDelete={handleDeleteInModal}
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        record={selectedRecord}
        setRecord={setSelectedRecord}
        fields={[
          {
            name: "severity",
            label: t("AllergyTable.severity"),
            type: "select",
            options: [
              { value: "Mild", label: t("AllergyTable.severity_options.Mild") },
              {
                value: "Moderate",
                label: t("AllergyTable.severity_options.Moderate"),
              },
              {
                value: "Severe",
                label: t("AllergyTable.severity_options.Severe"),
              },
            ],
            placeholder: t("AllergyTable.select_severity"),
          },
          {
            name: "isActive",
            label: t("AllergyTable.active"),
            type: "select",
            options: [
              { value: true, label: t("AllergyTable.active_options.Active") },
              {
                value: false,
                label: t("AllergyTable.active_options.Inactive"),
              },
            ],
            placeholder: t("AllergyTable.select_active_status"),
          },
          {
            name: "dateNoted",
            label: t("AllergyTable.date_noted"),
            type: "date",
            placeholder: t("AllergyTable.select_date"),
          },
          {
            name: "reaction",
            label: t("AllergyTable.reaction"),
            type: "text",
            placeholder: t("AllergyTable.enter_reaction"),
          },
          {
            name: "notes",
            label: t("AllergyTable.notes"),
            type: "textarea",
            placeholder: t("AllergyTable.enter_notes"),
          },
        ]}
        title={
          isAddMode
            ? t("AllergyTable.add_allergen")
            : t("AllergyTable.edit_allergen")
        }
        dropdownOptions={allergenOptions}
        dropdownField="allergenId"
        dropdownLabel={t("AllergyTable.allergen")}
      />

      {/* Delete confirmation popup */}
      {showPopup && recordToDelete && (
        <PopupMessage
          type="danger"
          title={t("AllergyTable.confirm_delete_title")}
          message={t("AllergyTable.confirm_delete_message", {
            allergen: recordToDelete.allergenName || recordToDelete.allergenId,
          })}
          buttons={[
            {
              text: t("Cancel"),
              onClick: handleClosePopup,
              variant: "secondary",
            },
            {
              text: t("Delete"),
              onClick: handleConfirmDelete,
              variant: "danger",
              disabled: isDeleting
            },
          ]}
          onClose={handleClosePopup}
        />
      )}

      <Toaster
        position="top-right"
        reverseOrder={true}
      />
    </div>
  );
};

export default AllergyTable;