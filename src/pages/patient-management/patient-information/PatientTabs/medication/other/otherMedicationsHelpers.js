import { formatDate } from "../../../../../shared/utils";
import Skeleton from "react-loading-skeleton";

export const otherMedicationsHelpers = (t) => {
  // Field mapping for highlight
  const fieldMapping = {
    medicationName: "MedicationName",
    dosage: "Dosage",
    instructions: "Instructions",
    frequency: "Frequency",
    route: "Route"
  };

  // Table headers translation
  const tableHeaders = {
    medication: t("Othermedications.medication"),
    medicationCategory: t("Othermedications.medicationCategory"),
    startDate: t("Othermedications.start_date"),
    endDate: t("Othermedications.end_date"),
    status: t("Othermedications.status"),
    actions: t("Othermedications.actions")
  };

  // Form fields configuration for modal
  const fields = [
    { 
      name: "medicationName", 
      label: t('Othermedications.medication'), 
      type: "dropdown", 
      placeholder: t('Othermedications.enter_medication'),
      // required: true
    },
    { 
      name: "medicationCategory", 
      label: t('Othermedications.medicationCategory'), 
      type: "text", 
      placeholder: t('Othermedications.medicationCategory') ,
      disabled: true
    },
      { 
      name: "isActive", 
      label: t('Othermedications.status'), 
      type: "select", 
      options: [
        { value: true, label: t('Common.status_options.active') },
        { value: false, label: t('Common.status_options.inactive') }
      ], 
      placeholder: t('Othermedications.select_status') 
    },
    { 
      name: "startDate", 
      label: t('Othermedications.start_date'), 
      type: "date", 
      placeholder: t('Othermedications.select_start_date'),
    },
    { 
      name: "endDate", 
      label: t('Othermedications.end_date'), 
      type: "date", 
      placeholder: t('Othermedications.select_end_date') 
    },
  ];

  // Filter configurations
  const filterConfigs = [
    {
      name: "isActive",
      label: "Status",
      data: ["All", "Active", "Inactive"].map((opt) => ({
        key: opt,
        label: opt,
      })),
    },
  ];

  // Empty states translation
  const emptyStates = {
    noResults: (searchValue) => 
      searchValue 
        ? t('Othermedications.no_results_for_search', { search: searchValue })
        : t('Othermedications.no_records_found')
  };

  return {
    fieldMapping,
    tableHeaders,
    fields,
    filterConfigs,
    emptyStates,
    formatDate
  };
};

// Skeleton loading component for table rows
export const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index}>
          <td><Skeleton width={120} height={20} /></td>
          <td><Skeleton width={80} height={20} /></td>
          <td><Skeleton width={60} height={20} /></td>
          <td><Skeleton width={80} height={20} /></td>
          <td>
            <div className="d-flex align-items-center">
              <Skeleton width={200} height={20} />
              <Skeleton width={20} height={20} className="ms-2" />
            </div>
          </td>
          <td><Skeleton width={100} height={20} /></td>
          <td><Skeleton width={100} height={20} /></td>
          <td><Skeleton width={60} height={20} /></td>
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

        {/* Diagnosis */}
        <div className="mb-2">
          <small className="text-muted d-block mb-1">
            <Skeleton width={80} height={12} />
          </small>
          <Skeleton width={"90%"} height={14} />
        </div>
        {/* Duration */}
        <div className="row text-center mb-3">
          <div className="col-4 p-0">
            <Skeleton width={60} height={18} />
            <small className="text-muted d-block mt-1">
              <Skeleton width={100} height={12} />
            </small>
          </div>
          <div className="col-4 p-0">
            <Skeleton width={60} height={18} />
            <small className="text-muted d-block mt-1">
              <Skeleton width={100} height={12} />
            </small>
          </div>
          <div className="col-4 p-0">
            <Skeleton width={60} height={18} />
            <small className="text-muted d-block mt-1">
              <Skeleton width={100} height={12} />
            </small>
          </div>
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



export const validatePatientMedicationForm = (record) => {
  console.log("===record", record);
  if (!record.medicationNameId && !record.medicationName) {
    return "Please select a medication.";
  }
  if (!record.startDate) {
    return "Please select start date.";
  }
  return null;
};

export const buildPatientMedicationUpdatePayload = (original, updated) => {
  const payload = {};

  if (updated.medicationNameId !== original.medicationId) {
    payload.medicationNameId = updated.medicationNameId;
  }

  if (updated.startDate !== original.startDate) {
    payload.startDate = updated.startDate || null;
  }

  if (updated.endDate !== original.endDate) {
    payload.endDate = updated.endDate || null;
  }

  if (updated.isActive !== original.isActive) {
    payload.isActive = updated.isActive;
  }

  return payload;
};
