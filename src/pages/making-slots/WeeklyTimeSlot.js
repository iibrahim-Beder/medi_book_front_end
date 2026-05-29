import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ShaftTabs from "./ShaftTabs";
import useShiftRules from "./hooks/useShiftRules";
import CustomAccordion from "../shared/CustomAccordion";
import { Modal } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import TimeRangePicker from "./TimeRange/TimeRangePicker";
import DaysAvailabilityCheckbox from "../ui/form-fields/DaysAvailabilityCheckbox";
import RenderCheckboxe from "./components/RenderCheckboxe";
import Field from "../ui/form-fields/Field";
import SegmentedProgress from "./TimeRange/SegmentedProgress";
import ActiveTabs from "./components/ActiveTabs";
import Loader from "../shared/Loader";
import { getTimeSlotTitle } from "./helper/helper";
import ErrorPage from "../notFound-pageError/ErrorPage";
import DataEmptyCom from "../shared/DataEmptyCom";
import PopupMessage from "../shared/PopupMessage";

export default function WeeklyTimeSlots() {
  const APPOINTMENT_TYPES = ["InPerson", "Follow-up", "Check-up", "Emergency"];
  const CURRENCIES = ["EGP", "USD", "EUR", "GBP"];
  const { t } = useTranslation();
  const shaftTabs = [
    { templateId: 7, name: "Morning", startTime: "08:00", endTime: "12:00" },
    { templateId: 8, name: "Afternoon", startTime: "12:00", endTime: "16:00" },
    { templateId: 9, name: "Evening", startTime: "16:00", endTime: "20:00" },
    { templateId: 11, name: "Night", startTime: "20:00", endTime: "23:59" },
  ];
  const formFields = [
    {
      name: "rangeTime",
      label: t("Select Time Range"),
      type: "timeRange",
    },
    {
      name: "SlotDurationInMinutes",
      label: t("slotDurationMinutes"),
      type: "number",
      min: 5,
      step: 5,
      half: true,
    },
    {
      name: "Price",
      label: t("price"),
      type: "number",
      min: 0,
      half: true,
    },
    {
      name: "Currency",
      label: t("currency"),
      disabled: true,
      // type: "select",
      // options: [{ value: "", label: t("selectCurrency") }, ...CURRENCIES.map(c => ({ value: c, label: c }))],
      half: true,
    },
    {
      name: "AllowedAppointmentTypes",
      label: t("allowedAppointmentTypes"),
      type: "checkboxes",
      options: APPOINTMENT_TYPES,
    },
  ];
  const [activeDay, setActiveDay] = useState("Sunday");
  const [activeShift, setActiveShift] = useState(7);
  const [activeTab, setActiveTab] = useState("Active");

  const {
    isLoading,
    isMainRulesFetching,
    rules,
    segments,
    // handleAddSlot,
    handleUpdateSlot,
    handleSaveSlot,
    handleToggleRuleActive,
    handleUpdateAddSlot,
    handleSaveNewSlots,
    availabilityData,
    selectedDays,
    toggleDay,
    isFetchingAvailability,
    addSlotData,
    activeRules,
    inactiveRules,
    handleUpdateActiveSlot,
    handleUpdateInactiveSlot,
    applyRule,
    openModal,
    setOpenModal,
    isError,
    error,
    refetch,
    activePopup,
    handleCloseActiveConfirm,
    handleConfirmActiveToggle,
  } = useShiftRules({
    activeShift,
    activeTab: activeDay,
  });
  //   if (isError && error?.status !== 500) {
  //   return <ErrorPage refetch={refetch} isFetching={isMainRulesFetching} />;
  // }
  const activeShiftName =
    shaftTabs.find((t) => t.templateId === activeShift)?.name || "Morning";
  const tabs = [
    { key: "Sunday", label: t("Sunday") },
    { key: "Monday", label: t("Monday") },
    { key: "Tuesday", label: t("Tuesday") },
    { key: "Wednesday", label: t("Wednesday") },
    { key: "Thursday", label: t("Thursday") },
    { key: "Friday", label: t("Friday") },
    { key: "Saturday", label: t("Saturday") },
  ];

  return (
    <div className="col-12">
      <div className="dc-haslayout dc-dbsectionspace accordion-table ">
        <div className="dc-dashboardbox dc-dashboardtabsholder setting">
          {/* Tabs Navigation */}
          <div className="dc-dashboardtabs" style={{ width: "20%" }}>
            {/* <div className="tab-titil" style={{ height: "94px",borderBottom: "1px solid #ddd" }} >
                Make Slots
              </div> */}
            <ul className="dc-tabstitle nav navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <a
                    href={`#${tab.key}`}
                    PatientNotes
                    className={`${activeDay === tab.key ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveDay(tab.key);
                    }}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tabs Content */}
          <div
            className={`p-0 dc-tabscontent tab-content table-container-style  tab-content-two-tabs `}
            style={{ width: "80%", justifyContent: "center" }}
          >
            <ShaftTabs
              activeShift={activeShift}
              setActiveShift={setActiveShift}
              tabs={shaftTabs}
            />
            <div className="table-header">
              <h3
                style={{ width: "fit-content", margin: "20px 0 0 20px" }}
                className="table-title"
              >
                {activeDay} {activeShiftName} Rules
              </h3>
              <button
                className="add-btn pr-5"
                onClick={() => setOpenModal(true)}
              >
                {t("Add New Rules")}
              </button>
            </div>
            <div className="card m-0 border-0" style={{ boxShadow: "none" }}>
              <div
                className="w-100 border-0  dc-tabscontent tab-content accordion-table accordion-table-card "
                style={{ minHeight: "550px" }}
              >
                {isMainRulesFetching ? (
                  Loader("loading-in-side loadin-in-tab-content m-lg-auto")
                ) : (
                  <div className="d-flex flex-column flex-direction-column w-100">
                    {isError && error?.statusCode !== 500? (
                      <div className="table-card">
                      <ErrorPage
                        error={error}
                        refetch={refetch}
                        isFetching={isMainRulesFetching}
                        imgStyle = {{ width: "40%", maxWidth: "350px" }}
                      />
                      </div>
                    ) : !segments?.length || error?.statusCode === 500 ? (
                      <div className="table-card">
                        <DataEmptyCom
                          LinkTo="/shifts-management"
                          linkText="Go to Create Shift"
                          text={t(
                            "No Rules Available ! Because There are no available shifts on this template today. If you want to add Rules on this shift you can go to create a new shift",
                          )}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="" style={{ marginBottom: "20px" }}>
                          <div
                            className="table-card"
                            style={{ padding: "20px 5px " }}
                          >
                            <SegmentedProgress
                              mode="segmented"
                              height={26}
                              gap={3}
                              segments={segments}
                              handleSelectRange={() => {}}
                            />
                          </div>
                        </div>

                        <ActiveTabs
                          activeCount={activeRules.length}
                          inactiveCount={inactiveRules.length}
                          activeTab={activeTab}
                          setActiveTab={setActiveTab}
                        />

                        {/* Active Rules */}
                        {activeTab === "Active" &&
                          (!activeRules.length ? (
                            <div className="table-card p-1">
                              <DataEmptyCom
                                imgStyle={{ maxWidth: "200px" }}
                                text={t("No Active Rules Available yet !")}
                                btnText="add new Rules"
                                onClick={() => setOpenModal(true)}
                              />
                            </div>
                          ) : (
                            <CustomAccordion
                              getItemTitle={getTimeSlotTitle}
                              accordioninnertitleSize="slots-accordion-title"
                              title={`${t("Active Rules")}`}
                              data={activeRules}
                              formFields={formFields}
                              appointmentTypes={APPOINTMENT_TYPES}
                              currencies={CURRENCIES}
                              onUpdate={handleUpdateActiveSlot}
                              onSave={handleSaveSlot}
                              timeline={segments}
                              isActive={true}
                              hedarClassName="title-card"
                              handleToggle={handleToggleRuleActive}
                              applyRule={applyRule}
                              noDataMessage={t("No Active Rules Available !")}
                            />
                          ))}

                        {/* Inactive Rules */}
                        {activeTab === "Inactive" && (
                          <CustomAccordion
                            getItemTitle={getTimeSlotTitle}
                            accordioninnertitleSize="slots-accordion-title"
                            title={`${t("Inactive Rules")}`}
                            data={inactiveRules}
                            formFields={formFields}
                            appointmentTypes={APPOINTMENT_TYPES}
                            currencies={CURRENCIES}
                            onUpdate={handleUpdateInactiveSlot}
                            onSave={handleSaveSlot}
                            timeline={segments}
                            isActive={false}
                            hedarClassName="title-card"
                            handleToggle={handleToggleRuleActive}
                            applyRule={applyRule}
                            noDataMessage={t("No Inactive Rules Available !")}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <AddModal show={openModal} onHide={() => setOpenModal(false)}>
                <form className="dc-formtheme dc-userform table-insideUi">
                  <fieldset>
                    <TimeRangePicker
                      timeline={segments}
                      onChange={(e) => handleUpdateAddSlot("rangeTime", e)}
                      value={addSlotData.rangeTime}
                    />
                    <div className="form-group-half form-group">
                      <DaysAvailabilityCheckbox
                        availability={availabilityData}
                        selectedDays={selectedDays}
                        onToggle={toggleDay}
                        disabled={
                          !availabilityData.length || isFetchingAvailability
                        }
                        loading={isFetchingAvailability}
                      />
                    </div>
                    <div className="form-group-half form-group p-0">
                      <div className="form-group-half form-group">
                        <Field
                          type="number"
                          name="Price"
                          placeholder={t("Price")}
                          label={t("Price")}
                          value={addSlotData.Price}
                          onChange={(e) =>
                            handleUpdateAddSlot("Price", e.target.value)
                          }
                          className="form-control"
                          forceShowError={true}
                        />
                      </div>
                      <div className="form-group-half form-group">
                        <Field
                          type="number"
                          name="SlotDurationInMinutes"
                          placeholder={t("Rules Duration")}
                          label={t("Duration (Minutes)")}
                          value={addSlotData.SlotDurationInMinutes}
                          onChange={(e) =>
                            handleUpdateAddSlot(
                              "SlotDurationInMinutes",
                              e.target.value,
                            )
                          }
                          className="form-control"
                          forceShowError={true}
                        />
                      </div>
                    </div>
                    <div className=" form-group">
                      <RenderCheckboxe
                        field={{
                          name: "AppointmentTypes",
                          label: t("Appointment Types"),
                          options: APPOINTMENT_TYPES,
                        }}
                        item={addSlotData}
                        onChange={handleUpdateAddSlot}
                        forceShowError={true}
                        readOnly={false}
                        index={null}
                      />
                    </div>
                    <div className="form-group dc-btnarea p-3">
                      <button
                        type="button"
                        className="second-btn"
                        style={{ float: "inline-end" }}
                        onClick={handleSaveNewSlots}
                        // disabled={isAdding || loadingAvailability}
                      >
                        {false ? t("saving") + "..." : t("save")}
                      </button>
                    </div>
                  </fieldset>
                </form>
              </AddModal>
            </div>
          </div>
        </div>
      </div>
     {activePopup.show && (
  <PopupMessage
    type={activePopup.newActive ? "success" : "danger"}
    title={
      activePopup.newActive
        ? t("activate shift")
        : t("deactivate shift")
    }
    message={t(
      activePopup.newActive
        ? "are you sure you want to activate this shift?"
        : "are you sure you want to deactivate this shift?",
      { name: activePopup.locationName }
    )}
    buttons={[
      {
        text: t("cancel"),
        onClick: handleCloseActiveConfirm,
        variant: "secondary",
      },
      {
        text: t("confirm"),
        onClick: handleConfirmActiveToggle,
        variant: "primary",
      },
    ]}
    onClose={handleCloseActiveConfirm}
  />
)}
    </div>
  );
}

export const AddModal = ({ show, onHide, children }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="diagnosis-modal pr-0 small-modal "
      // style={{maxWidth:"830px"}}
    >
      <div>
        <Modal.Header className="modal-header-custom">
          <Modal.Title className="modal-title-custom">Add Rules</Modal.Title>
          <button type="button" className="btn-close-custom" onClick={onHide}>
            <MdClose size={24} />
          </button>
        </Modal.Header>

        <Modal.Body className="p-0">
          <div
            className="modal-content-custom"
            style={{ overflowY: "visible" }}
          >
            {children}
          </div>
        </Modal.Body>
      </div>
      {/* 
      <Modal.Footer className="modal-footer-custom">
        <button onClick={onHide} className="dc-btn dc-cancel-btn">
          {t("Close")}
        </button>
      </Modal.Footer> */}
    </Modal>
  );
};
