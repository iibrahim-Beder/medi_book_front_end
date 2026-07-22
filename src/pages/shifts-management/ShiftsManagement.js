import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import useShift from "./hooks/useShift";
import ShiftForm from "./components/ShiftForm";
import Loader from "../shared/Loader";
import ShiftStep from "../doctor-registration/steps/ShiftStep";
import { useSearchParams } from "react-router-dom";
export default function ShiftsManagement() {
    
  const [searchParams, setSearchParams] = useSearchParams();

  const { t } = useTranslation();

 const tabs = [
    { key: "Sunday", label: t("Sunday"), dayIndex: 0 },
    { key: "Monday", label: t("Monday"), dayIndex: 1 },
    { key: "Tuesday", label: t("Tuesday"), dayIndex: 2 },
    { key: "Wednesday", label: t("Wednesday"), dayIndex: 3 },
    { key: "Thursday", label: t("Thursday"), dayIndex: 4 },
    { key: "Friday", label: t("Friday"), dayIndex: 5 },
    { key: "Saturday", label: t("Saturday"), dayIndex: 6 },
  ];

  const currentDay = searchParams.get("day");

  const activeTab = tabs.some((t) => t.key === currentDay)
    ? currentDay
    : "Sunday";
  const {
    shiftsByDay,
    isLoading,
    addShifts,
    updateShift,
    locations,
    templates,
    toggleActiveStatus,
  } = useShift();
  const [openModal, setOpenModal] = useState(false);

    if(isLoading) return <Loader />
  return (
    <div className="col-12">
      <div className="dc-haslayout dc-dbsectionspace accordion-table ">
        <div className="dc-dashboardbox dc-dashboardtabsholder setting">
          <div className="dc-dashboardtabs" style={{ width: "20%" }}>
            <ul className="dc-tabstitle nav navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <a
                    href={`#${tab.key}`}
                    className={`${activeTab === tab.key ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchParams({ day: tab.key });
                    }}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`dc-tabscontent`}
            style={{ width: "80%", justifyContent: "center" }}
          >
            <div className="table-header" style={{ marginBottom: "10px" }}>
              <div>
                <h3 className="table-title">{`Shift ${activeTab}`}</h3>
                {/* <h6 className="table-subtitle">subtitle</h6> */}
              </div>
              <button className="add-btn" onClick={() => setOpenModal(true)}>
                {t("Add Shift")}
              </button>
            </div>
                {tabs.map((tab) =>
                  activeTab === tab.key ? (
                    <ShiftForm
                      onToggleActive={toggleActiveStatus}
                      key={tab.key}
                      dayIndex={tab.dayIndex}
                      shifts={shiftsByDay[tab.dayIndex] || []}
                      templates={templates}
                      locations={locations}
                      onAdd={addShifts}
                      onUpdate={updateShift}
                      setOpenModal={setOpenModal}
                      t={t}
                    />
                  ) : null,
                )}
          </div>
        </div>
      </div>

      <AddModal show={openModal} onHide={() => setOpenModal(false)} setOpenModal={setOpenModal}></AddModal>
    </div>
  );
}
export const AddModal = ({ show, onHide  ,setOpenModal}) => {
  const { t } = useTranslation();
  
    useEffect(() => {
      if (show) {
        document.documentElement.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "auto";
      }
    
      return () => {
        document.documentElement.style.overflow = "auto";
      };
    }, [show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      centered
      className="diagnosis-modal pr-0"
    >
      <Modal.Header className="modal-header-custom">
        <Modal.Title className="modal-title-custom">{t("Add Shift")}</Modal.Title>
        <button type="button" className="btn-close-custom" onClick={onHide}>
          <MdClose size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div
          className="modal-content-custom table-insideUi"
          style={{ overflowY: "visible" }}
        >
          <ShiftStep setOpenModal={setOpenModal} insidUi={true} />
        </div>
      </Modal.Body>
      {/* <Modal.Footer className="modal-footer-custom">
        <button 
          onClick={onHide}
          className="dc-btn dc-cancel-btn"
        >
          {t('Close')}
        </button>
      </Modal.Footer> */}
    </Modal>
  );
};
