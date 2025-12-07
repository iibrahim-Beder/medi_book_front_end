// DiagnosisList.jsx
import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { MdExpandMore } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { formatDate } from "../../shared/utils";

const DiagnosisList = ({ isLoading, currentItems, onEditDiagnosis, t }) => {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (diagnosisId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [diagnosisId]: !prev[diagnosisId]
    }));
  };

  const truncateText = (text, maxLength = 70) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="mobile-view-card">
        <Card.Body style={{ padding: "15px" }}>
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={15} count={2} className="mb-2" />
          <Skeleton height={15} width="80%" className="mb-3" />
          <div className="row text-center mb-3">
            <div className="col-4">
              <Skeleton height={30} />
            </div>
            <div className="col-4">
              <Skeleton height={30} />
            </div>
            <div className="col-4">
              <Skeleton height={30} />
            </div>
          </div>
          <Skeleton
            height={35}
            width="100px"
            style={{ float: "right" }}
          />
        </Card.Body>
      </Card>
    ));
  }

  if (currentItems.length === 0) {
    return (
      <Card className="text-center py-5">
        <Card.Body>
          <p className="text-muted">{t("No diagnoses found")}</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {currentItems.map((disease) => (
        <Card
          key={disease.diagnosisId || disease.id}
          className="mobile-view-card"
        >
          <Card.Body style={{ padding: "15px" }}>
            <div className="custom-card-title">
              <h5 className="">{disease.diagnosisName}</h5>
              {disease.createdAt && (<div className="created-date"><small>Created:</small><small className="text-muted d-block">{formatDate(disease.createdAt)}</small></div>)}
            </div>
              {disease.code && (
                <small className="text-muted">Code: {disease.code}</small>
              )}
            {/* symptoms */}
           {disease.symptomsDescription &&  <div className="mb-3">
              <small className="text-muted d-block mb-1">
                {t("Symptoms")} :
              </small>
              <div className="expandable-content">
                <p title={disease.symptomsDescription} className="mb-0">
                  {truncateText(disease.symptomsDescription, 180)}
                </p>
              </div>
            </div>}
            {/* row */}
            <div className="row text-center mb-3">
              <div className="col-4">
                <div className="border-end">
                  <div className="fw-bold text-primary">
                    {disease.conditions?.length || 0}
                  </div>
                  <small className="text-muted">{t("Conditions")}</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border-end">
                  <div className="fw-bold text-primary">
                    {disease.notes?.length || 0}
                  </div>
                  <small className="text-muted">{t("Notes")}</small>
                </div>
              </div>
              <div className="col-4">
                <div className="fw-bold text-primary">
                  {disease.prescriptions?.length || 0}
                </div>
                <small className="text-muted">{t("Prescriptions")}</small>
              </div>
            </div>
            {/* diagnosis description */}
              {disease.description && ( <div className="mb-2">
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
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() =>
                    toggleDescription(disease.diagnosisId || disease.id)
                  }
                >
                  {expandedDescriptions[disease.diagnosisId || disease.id]
                    ? disease.description
                    : ""}
                </p>
              </div>
            </div> )}

            <Button
              className="view-btn btn btn-outline-primary btn-sm"
              style={{ float: "inline-end" }}
              variant="outline-primary"
              size="sm"
              onClick={() => onEditDiagnosis(disease)}
            >
              {t("Manage")}
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default DiagnosisList;