// DiagnosisList.jsx
import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import MuiButton from "@mui/material/Button";
import { MdExpandMore } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../shared/utils";
import DataEmptyComponent from "../../shared/DataEmptyComponent";
import CustomAccordion from "../../shared/CustomAccordion";
import TwoLevelAccordion from "../../shared/TwoLevelAccordion";
import CustomAccordionSkeleton from "../../shared/CustomAccordionSkeleton";

const DiagnosisList = ({
  isLoading,
  currentItems,
  onEditDiagnosis,
  handleAddDiagnosis,
  t,
}) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (diagnosisId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [diagnosisId]: !prev[diagnosisId],
    }));
  };

  if (isLoading ) {
    return Array.from({ length: 1 }).map((_, index) => (
      <Card key={index} className="mobile-view-card">
        <Card.Body style={{ padding: "15px" }}>
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={15} count={2} className="mb-2" />
          <Skeleton height={15} width="80%" className="mb-3" />
          <CustomAccordionSkeleton oneBtn={true} headar={true} number={3} className={"d-grid bg-transparent border-0  flex-grow-1 shadow-0 "}/>
          <CustomAccordionSkeleton oneBtn={true} headar={true} number={3} className={"d-grid bg-transparent border-0  flex-grow-1 shadow-0 "}/>
          <CustomAccordionSkeleton oneBtn={true} headar={true} number={3} className={"d-grid bg-transparent border-0  flex-grow-1 shadow-0 "}/>
          <Skeleton height={35} width="100px" style={{ float: "right" }} />
        </Card.Body>
      </Card>
    ));
  }

  if (currentItems.length === 0) {
    return (
      <div className="table-card">
        <DataEmptyComponent
          text={t("No Diagnosis Found for this patient on this booking")}
          title={t("No Diagnosis Found")}
          imgStyle={{ width: "100%", maxWidth: "300px" }}
          onClick={handleAddDiagnosis}
          btnText={t("Add Diagnosis")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 mobile-view ">
      {currentItems.map((disease, index) => (
        <Card
          key={disease.diagnosisId || disease.id}
          className="mobile-view-card mb-5"
          style={{
            border: index % 2 === 0 ? "1px solid #eee" : "1px solid #ddd",
          }}
        >
          <Card.Body style={{ padding: "15px" }}>
            <div className="custom-card-title">
              <h5 className="">{disease.diagnosisName}</h5>
            </div>
            {disease.createdAt && (
              <div className="created-date">
                <small>Created:</small>
                <small className="text-muted d-block">
                  {formatDate(disease.createdAt)}
                </small>
              </div>
            )}
            {disease.code && (
              <small className="text-muted">Code: {disease.code}</small>
            )}
            {/* symptoms */}
            {disease.symptomsDescription && (
              <div className="mb-3">
                <small className="text-muted d-block mb-1">
                  {t("Symptoms")} :
                </small>
                <div className="expandable-content">
                  <p title={disease.symptomsDescription} className="mb-0">
                    {disease.symptomsDescription}
                  </p>
                </div>
              </div>
            )}
            {/* diagnosis description */}
            {disease.description && (
              <div className="mb-2">
                <small
                  className="text-muted d-flex mb-1"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    toggleDescription(disease.diagnosisId || disease.id)
                  }
                >
                  {t("Diagnosis Description")} :
                  <button
                    className=""
                    onClick={() =>
                      toggleDescription(disease.diagnosisId || disease.id)
                    }
                    style={{
                      fontSize: "20px",
                      color: "#278fff",
                      padding: "3px 0 0",
                    }}
                  >
                    <MdExpandMore
                      onClick={() =>
                        toggleDescription(disease.diagnosisId || disease.id)
                      }
                      style={{
                        transform: expandedDescriptions[
                          disease.diagnosisId || disease.id
                        ]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </button>
                </small>
                <div
                  className={`expandable-content ${
                    expandedDescriptions[disease.diagnosisId || disease.id]
                      ? ""
                      : "p-0"
                  }`}
                >
                  <p
                    style={{
                      margin: "0",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {expandedDescriptions[disease.diagnosisId || disease.id]
                      ? disease.description
                      : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Conditions */}
            <div className="mb-4">
              <CustomAccordion
                addNewLabel={t("Add Condition")}
                titleBackgroundColor="var(--scbccolor)"
                title={t("Diagnosed Conditions")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={disease?.conditions || []}
                getItemTitle={(condition) =>
                  condition.medicalCondition.name +
                    " - " +
                    condition.severity +
                    " - " +
                    condition.isActive ||
                  condition.medicalCondition.name +
                    " - " +
                    condition.severity ||
                  condition.medicalCondition.name ||
                  "Condition"
                }
                itemType="conditions"
                formFields={[
                  {
                    label: t("Medical Condition"),
                    name: "medicalCondition",
                    type: "dropdown",
                    DropdownType: "disease",
                    required: true,
                    // half: true,
                  },
                  {
                    label: t("Category"),
                    name: "category",
                    type: "text",
                    // half: true,
                    disabled: true,
                  },
                  {
                    label: t("Severity"),
                    name: "severity",
                    type: "select",
                    options: ["Mild", "Moderate", "Severe"],
                    half: true,
                  },
                  {
                    label: t("Status"),
                    name: "isActive",
                    type: "select",
                    options: ["Active", "Inactive"],
                    half: true,
                  },
                  {
                    label: t("Notes"),
                    name: "notes",
                    type: "textarea",
                  },
                ]}
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <CustomAccordion
                addNewLabel={t("Add Note")}
                titleBackgroundColor="var(--scbccolor)"
                title={t("Notes")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                data={disease?.notes || []}
                getItemTitle={(note) => note.note || "Note"}
                itemType="notes"
                formFields={[
                  {
                    label: t("Note Content"),
                    name: "note",
                    type: "textarea",
                    required: true,
                  },
                ]}
                forceShowError={true}
              />
            </div>

            {/* Prescriptions */}
            <div className="mb-4">
              <TwoLevelAccordion
                addNewLabel={t("Add Prescription")}
                title={t("Prescriptions")}
                readOnly={true}
                backgroundColor="var(--scbccolor)"
                titleBackgroundColor="var(--scbccolor)"
                getItemTitleRecipe={(recipe) =>
                  recipe.medication.name || "medication"
                }
                data={disease?.prescriptions || []}
                itemType="prescriptions"
                formFields={[
                  {
                    label: t("Prescription Title"),
                    name: "title",
                    type: "text",
                    half: true,
                    required: true,
                    requiredErrorMessage: t("Prescription title is required"),
                  },
                  {
                    label: t("Status"),
                    name: "status",
                    type: "select",
                    options: ["Active", "Completed", "Cancelled", "Expired"],
                    half: true,
                  },
                  {
                    label: t("Note"),
                    name: "notes",
                    type: "textarea",
                  },
                ]}
                formFieldsRecipe={[
                  {
                    label: t("Medication"),
                    name: "medication",
                    type: "dropdown",
                    required: true,
                    requiredErrorMessage: t("Medication is required"),
                    // half: true,
                  },
                  {
                    label: t("category"),
                    name: "category",
                    type: "text",
                    disabled: true,
                    // half: true,
                  },
                  {
                    label: t("Dosage"),
                    name: "dosage",
                    half: true,
                    required: true,
                    requiredErrorMessage: t("Dosage is required"),
                  },
                  {
                    label: t("Duration (Days)"),
                    name: "durationInDays",
                    type: "number",
                    half: true,
                    required: true,
                    requiredErrorMessage: t("Duration is required"),
                  },
                  {
                    label: t("Start Date"),
                    name: "startDate",
                    type: "date",
                    half: true,
                  },
                  {
                    label: t("End Date"),
                    name: "endDate",
                    type: "date",
                    half: true,
                  },
                  {
                    label: t("Instructions"),
                    name: "instructions",
                    type: "textarea",
                  },
                ]}
                forceShowError={true}
              />
            </div>
            <MuiButton
              variant="contained"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
                backgroundColor: "#60a5fa",
                boxShadow: "none",
              }}
              className="view-btn btn btn-outline-primary btn-sm "
              style={{
                float: "inline-end",
                fontSize: "16px",
                fontWeight: "600",
                marginTop: "15px",
              }}
              size="sm"
              onClick={() => onEditDiagnosis(disease)}
            >
              {t("Manage Diagnosis")}
            </MuiButton>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default DiagnosisList;
