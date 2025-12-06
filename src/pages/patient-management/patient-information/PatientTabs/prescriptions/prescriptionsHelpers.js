import Skeleton from "react-loading-skeleton";

export const prescriptionsHelpers = (t) => {
  // Field mapping for highlight
  const fieldMapping = {
    title: "Title",
    note: "Note",
    diagnosisName: "DiagnosisName"
  };

  // Table headers translation 
  const tableHeaders = {
    prescription_title: t("PrescriptionsTable.prescription_title"),
    note: t("PrescriptionsTable.note"),
    status: t("PrescriptionsTable.status"),
    diagnosis_name: t("PrescriptionsTable.diagnosis_name"),
    medication: t("PrescriptionsTable.medication"),
    view: t("PrescriptionsTable.view"),
    created_at: t("created_at")
  };

  // Mobile headers translation
  const mobileHeaders = {
    table_title: t('PrescriptionsMobileView.table_title'),
    table_subtitle: t('PrescriptionsMobileView.table_subtitle'),
    diagnosis: t('PrescriptionsMobileView.diagnosis'),
    note: t('PrescriptionsMobileView.note'),
    status: t('PrescriptionsMobileView.status'),
    medications: t('PrescriptionsMobileView.medications'),
    view_all_details: t('PrescriptionsMobileView.view_all_details'),
    close: t('PrescriptionsMobileView.close'),
    diagnosis_name: t('PrescriptionsMobileView.diagnosis_name'),
    prescription_note: t('PrescriptionsMobileView.prescription_note'),
    medication_name: t('PrescriptionsMobileView.medication_name'),
    dosage: t('PrescriptionsMobileView.dosage'),
    duration: t('PrescriptionsMobileView.duration'),
    instructions: t('PrescriptionsMobileView.instructions')
  };

  // Status options
  const statusOptions = {
    active: t("PrescriptionsTable.status_options.active"),
    completed: t("PrescriptionsTable.status_options.completed"),
    cancelled: t("PrescriptionsTable.status_options.cancelled"),
    expired: t("PrescriptionsTable.status_options.expired")
  };

  // Mobile status options
  const mobileStatusOptions = {
    active: t("PrescriptionsMobileView.status_options.active"),
    completed: t("PrescriptionsMobileView.status_options.completed"),
    cancelled: t("PrescriptionsMobileView.status_options.cancelled"),
    expired: t("PrescriptionsMobileView.status_options.expired")
  };

  // Filter configurations
  const filterConfigs = [
    {
      name: "status",
      label: "Status",
      data: ["active", "completed", "cancelled", "expired"].map((opt) => ({
        key: opt,
        label: statusOptions[opt],
      })),
    },
  ];

  // Form fields for CustomAccordion
  const medicationFields = [
    {
      name: "medicationName",
      placeholder: t("PrescriptionsTable.medication_name"),
      label: t("PrescriptionsTable.medication"),
    },
    {
      name: "dosage",
      placeholder: t("PrescriptionsTable.dosage"),
      half: true,
      label: t("PrescriptionsTable.dosage"),
    },
    {
      name: "duration",
      placeholder: t("PrescriptionsTable.duration"),
      half: true,
      label: t("PrescriptionsTable.duration"),
    },
    {
      name: "instructions",
      type: "textarea",
      placeholder: t("PrescriptionsTable.instructions"),
      label: t("PrescriptionsTable.instructions"),
    },
  ];

  // Mobile form fields
  const mobileMedicationFields = [
    {
      label: t('PrescriptionsMobileView.medication_name'),
      name: "medicationName",
      placeholder: t('PrescriptionsMobileView.medication'),
    },
    { 
      label: t('PrescriptionsMobileView.dosage'), 
      name: "dosage", 
      half: true 
    },
    { 
      label: t('PrescriptionsMobileView.duration'), 
      name: "duration", 
      half: true 
    },
    {
      label: t('PrescriptionsMobileView.instructions'),
      name: "instructions",
      type: "textarea",
      placeholder: t('PrescriptionsMobileView.instructions'),
    },
  ];

  // Empty states translation
  const emptyStates = {
    noResults: (searchValue) => 
      searchValue 
        ? t('PrescriptionsTable.no_results_for_search', { search: searchValue })
        : t('PrescriptionsTable.no_records_found'),
    noPrescriptions: t('PrescriptionsMobileView.no_prescriptions_found')
  };

  return {
    fieldMapping,
    tableHeaders,
    mobileHeaders,
    statusOptions,
    mobileStatusOptions,
    filterConfigs,
    medicationFields,
    mobileMedicationFields,
    emptyStates
  };
};

// Skeleton loading component 
export const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index}>
          <td><Skeleton width={150} height={20} /></td>
          <td>
            <div className="d-flex align-items-center">
              <Skeleton width={200} height={20} />
              <Skeleton width={20} height={20} className="ms-2" />
            </div>
          </td>
          <td><Skeleton width={80} height={20} /></td>
          <td><Skeleton width={120} height={20} /></td>
          <td><Skeleton width={80} height={20} /></td>
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

        {/* sub title */}
        <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={80} height={12} />
          </small>
          <Skeleton width={"90%"} height={14} />
        </div>
        {/* row */}
        <div className="row text-center mb-3">
          <div className="col-6">
            <Skeleton width={60} height={18} />
            <small className="text-muted d-block mt-1">
              <Skeleton width={100} height={12} />
            </small>
          </div>
          <div className="col-6">
            <Skeleton width={60} height={18} />
            <small className="text-muted d-block mt-1">
              <Skeleton width={100} height={12} />
            </small>
          </div>
        </div>  
        {/* notes */}
         <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={80} height={12} />
          </small>
          <Skeleton width={"90%"} height={14} />
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