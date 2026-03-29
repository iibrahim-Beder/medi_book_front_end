import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { MdClose } from 'react-icons/md';
import useShift from "./hooks/useShift";
import SiftForm from "./components/ShiftForm";
import ShiftStep from "../../test/ShiftStep";
import Loader from "../shared/Loader";
export default function ShiftsManagement({ doctorId=103 }) {
  const [activeTab, setActiveTab] = useState("Sunday");
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

  const { shiftsByDay, isLoading, addShifts, updateShift,locations,templates,toggleActiveStatus } = useShift(doctorId=103);
 const [openModal, setOpenModal] = useState(false);



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
                      setActiveTab(tab.key);
                    }}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={`dc-tabscontent`} style={{ width: "80%", justifyContent: "center" }}>
            <div className="table-header" style={{ marginBottom: "10px" }}>
              <div>
                <h3 className="table-title">{`Shift ${activeTab}`}</h3>
                {/* <h6 className="table-subtitle">subtitle</h6> */}
              </div>
                  <button className="add-btn" 
                  onClick={() => setOpenModal(true)}
                  >
            {t('Add Shift')}
          </button>
            </div>

            {isLoading  ?  Loader("loading-in-side loadin-in-tab-content m-lg-auto") : (
              tabs.map((tab) =>
                activeTab === tab.key ? (
                  <SiftForm
                    onToggleActive={toggleActiveStatus}
                    key={tab.key}
                    dayIndex={tab.dayIndex}
                    shifts={shiftsByDay[tab.dayIndex] || []}
                    templates={templates}
                    locations={locations}
                    onAdd={addShifts}
                    onUpdate={updateShift}
                    t={t}
                  />
                ) : null
              )
            )}
          </div>
        </div>
      </div>
 
 <AddModal show={openModal} onHide={() => setOpenModal(false)}  >
 </AddModal>


    </div>
  );
}
export const AddModal = ({ 
  show, 
  onHide, 
}) => {
  const { t } = useTranslation();
 
  
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
          Add Shift
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
        <div className="modal-content-custom" style={{overflowY:"visible"}} >
        <ShiftStep insidUi={true}/>
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