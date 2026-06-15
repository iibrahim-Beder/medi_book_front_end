import Skeleton from "react-loading-skeleton";
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import CustomAccordion from '../../../../shared/CustomAccordion';
import { usePrescriptions } from "./usePrescriptions";
import { isHasMatched } from "../component/helpers";
export const prescriptionsHelpers = (t) => {
  // Field mapping for highlight
  const fieldMapping = {
    title: "Title",
    note: "Notes",
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
      half: true
    },
    {
      name: "categoryName",
      placeholder: t("PrescriptionsTable.category_name"),
      label: t("PrescriptionsTable.category_name"),
      half: true
    },
    {
      name: "dosage",
      placeholder: t("PrescriptionsTable.dosage"),
      half: true,
      label: t("PrescriptionsTable.dosage"),
    },
    {
      name: "durationInDays",
      placeholder: t("PrescriptionsTable.duration"),
      half: true,
      label: t("PrescriptionsTable.duration"),
    },
    {
      name: "startDate",
      placeholder: t("start date"),
      half: true,
      label: t("start date"),
    },
    {
      name: "endDate",
      placeholder: t("end date"),
      half: true,
      label: t("end date"),
    },
    {
      name: "instructions",
      type: "textarea",
      placeholder: t("PrescriptionsTable.instructions"),
      label: t("PrescriptionsTable.instructions"),
    },
  ];


  // Empty states translation
  const emptyStates = {
    noResults: (searchValue) => 
      searchValue 
        ? t('No results found for "{{search}}"', { search: searchValue })
        : t('No Prescriptions Found'),
    noPrescriptions: t('No Prescriptions Found')
  };

  return {
    fieldMapping,
    tableHeaders,
    mobileHeaders,
    statusOptions,
    mobileStatusOptions,
    filterConfigs,
    medicationFields,
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


export const hasHiddenMatch = (prescription, field, value, searchTerm) => {
  if (!prescription) return false; 
  if (!value || value.length <= 45 || !searchTerm) return false;

const hasFieldMatch = prescription.highlightInfo?.matchedFields?.some(
  m => m.field.toLowerCase() === field.toLowerCase()
);


  if (!hasFieldMatch) return false;

  const lowerValue = value.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  const matchIndex = lowerValue.indexOf(lowerSearch);

  return matchIndex >= 45;
};

export const PrescriptionsModal = ({ 
  show, 
  onHide, 
  type, 
  data,
  formFields,
  title ,
  searchTerm
}) => {

  const { t } = useTranslation();
  
  const getModalTitle = () => {
    switch(type) {
      case 'prescribedMedication':
        return t('PrescriptionsTable.medication_details');
      default:
        return title || t('Details');
    }
  };
  
  const getModalContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted">{t('PrescriptionsTable.no_medication_data')}</p>
        </div>
      );
    }
    
    switch(type) {
      case 'prescribedMedication':
        return (
          <CustomAccordion
            getItemTitle={(medication) => medication.medicationName || "Medication"}
            readOnly={true}
            backgroundColor="var(--scbccolor)"
            data={data}
            formFields={formFields}
            isHasMatched={isHasMatched}
            searchTerm={searchTerm}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg"
      centered
      className="diagnosis-modal pr-0"
    >
      <Modal.Header className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          {getModalTitle()}
        </Modal.Title>
        <button
          type="button"
          className="btn-close-custom"
          onClick={onHide}
        >
          <MdClose size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div className="modal-content-custom">
          {getModalContent()}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <button
          onClick={onHide}
          className="dc-btn dc-cancel-btn"
        >
          {t('Close')}
        </button>
      </Modal.Footer>
    </Modal>
  );
};


export const CustomAccordionToMobileexport = ({ 
  selectedPrescription,
  searchTerm
}) => {
  const { transformMedicationData } = usePrescriptions();
  const { t } = useTranslation();
  const { mobileHeaders, medicationFields } = prescriptionsHelpers(t);

  const data = selectedPrescription?.prescribedMedications
    ? transformMedicationData(selectedPrescription.prescribedMedications)
    : [];

  return (
    <CustomAccordion
      getItemTitle={(medication) =>
        medication.medicationName || "Medication"
      }
      titleBackgroundColor="var(--scbccolor)"
      title={mobileHeaders.medications}
      readOnly={true}
      backgroundColor="var(--scbccolor)"
      data={data}
      formFields={medicationFields}
      isHasMatched={isHasMatched}
      searchTerm={searchTerm}
    />
  );
};
