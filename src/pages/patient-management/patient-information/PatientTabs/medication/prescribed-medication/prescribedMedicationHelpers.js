import Skeleton from "react-loading-skeleton";

export const prescribedMedicationHelpers = (t) => {
  // Field mapping for highlight
  const fieldMapping = {
    medicationName: "MedicationName",
    dosage: "Dosage",
    instructions: "Instructions",
    diagnosisName: "DiagnosisName",
    prescriptionName: "PrescriptionName"
  };

  // Table headers translation
  const tableHeaders = {
    medication: t("PrescribedMedicationTable.medication"),
    dosage: t("PrescribedMedicationTable.dosage"),
    duration: t("PrescribedMedicationTable.duration"),
    instructions: t("PrescribedMedicationTable.instructions"),
    diagnosisName: t("PrescribedMedicationTable.diagnosis_name"),
    prescribedName: t("PrescribedMedicationTable.prescribed_name"),
    category: t("PrescribedMedicationTable.category"),
    createdAt: t("created_at")
  };

  // Mobile headers translation
  const mobileHeaders = {
    table_title: t("PrescribedMedicationMobileView.table_title"),
    table_subtitle: t("PrescribedMedicationMobileView.table_subtitle"),
    diagnosis_name: t("PrescribedMedicationMobileView.diagnosis_name"),
    prescribed_name: t("PrescribedMedicationMobileView.prescribed_name"),
    dosage: t("PrescribedMedicationMobileView.dosage"),
    duration: t("PrescribedMedicationMobileView.duration"),
    status: t("PrescribedMedicationMobileView.status"),
    instructions: t("PrescribedMedicationMobileView.instructions"),
    view_all_details: t("PrescribedMedicationMobileView.view_all_details"),
    close: t("PrescribedMedicationMobileView.close"),
    MedicationCategoryName: t("category"),
  };

  // Empty states translation
  const emptyStates = {
    noResults: (searchValue) => 
      searchValue 
        ? t('No results found for "{{search}}"', { search: searchValue })
        : t('No Prescribed Medications Found'),
    noMedications: t("No Prescribed Medications Found")
  };

  // Format duration display
  const formatDuration = (durationInDays) => {
    return `${durationInDays} ${t('PrescribedMedicationTable.days')}`;
  };

  const statusOptions = {
    active: t("PrescribedMedicationMobileView.status_options.active"),
    completed: t("PrescribedMedicationMobileView.status_options.completed"),
    cancelled: t("PrescribedMedicationMobileView.status_options.cancelled"),
    expired: t("PrescribedMedicationMobileView.status_options.expired")
  };

  return {
    fieldMapping,
    tableHeaders,
    mobileHeaders,
    emptyStates,
    formatDuration,
    statusOptions
  };
};

export const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index}>
          <td><Skeleton width={120} height={20} /></td>
          <td><Skeleton width={80} height={20} /></td>
          <td><Skeleton width={60} height={20} /></td>
          <td>
            <div className="d-flex align-items-center">
              <Skeleton width={200} height={20} />
              <Skeleton width={20} height={20} className="ms-2" />
            </div>
          </td>
          <td><Skeleton width={150} height={20} /></td>
          <td><Skeleton width={120} height={20} /></td>
          <td><Skeleton width={100} height={20} /></td>
          <td><Skeleton width={100} height={20} /></td>
        </tr>
      ))}
    </>
  );
};

export const MobileSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
    <div className="mobile-view-card card" style={{ marginBottom: "15px" }}>
      <div style={{ padding: "15px" }}>
        {/* Title */}
        <h5>
          <Skeleton width={140} height={18} />
        </h5>

        {/* Diagnosis */}
        <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={80} height={12} />
          </small>
          <Skeleton width={"90%"} height={14} />
        </div>

        {/* Prescribed */}
        <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={120} height={12} />
          </small>
          <Skeleton width={"90%"} height={14} />
        </div>

        {/* Dosage */}
        <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={60} height={12} />
          </small>
          <Skeleton width={"70%"} height={14} />
        </div>

        {/* Duration */}
        <div className="row text-center mb-3">
          <div className="col-12">
            <Skeleton width={60} height={18} />
            <small className="text-muted d-block mt-1">
              <Skeleton width={100} height={12} />
            </small>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={100} height={12} />
          </small>
          <Skeleton count={2} />
        </div>

        {/* Button */}
        <div className="d-flex justify-content-end">
          <Skeleton width={120} height={30} />
        </div>
      </div>
    </div>

      ))}
    </>
  );
};