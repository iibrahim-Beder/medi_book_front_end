import { useState } from "react";
import DoctorDaySlots from "./cards/DoctorDaySlots";
import { useTranslation } from "react-i18next";

const CLINICS = [
  { id: 1, name: "Clinic A" },
  { id: 2, name: "Clinic B" },
  { id: 3, name: "Clinic C" }
];
const APPOINTMENT_TYPES = ["Consultation", "Follow-up", "Check-up", "Emergency"];
const CURRENCIES = ["EGP", "USD", "EUR", "GBP"];

export default function MakeSlotsMain({ header, formData, onSlotsChange, errors }) {
  const { t } = useTranslation();
const DAYS = [
    t("days.saturday"),
    t("days.sunday"),
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday")
  ];
  const [activeTab, setActiveTab] = useState(DAYS[0]);
  const [slots, setSlots] = useState({
    Saturday: [
      {
        id: 1,
        clinic: "1",
        SlotDurationInMinutes: 30,
        DaysInAdvance: 7,
        startTime: "09:00",
        endTime: "17:00",
        Price: 200,
        Currency: "EGP",
        AllowedAppointmentTypes: ["Consultation", "Follow-up"],
        isOpen: false
      }
    ],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: []
  });
 const handleUpdateSlots = (updated) => {
    setSlots(updated);
    if (onSlotsChange) {
      onSlotsChange(updated); 
    }
  };

  const handleAddSlot = (day) => {
    const updated = {
      ...slots,
      [day]: [
        {
          id: Date.now(),
          clinic: "",
          SlotDurationInMinutes: 30,
          DaysInAdvance: 7,
          startTime: "09:00",
          endTime: "17:00",
          Price: 0,
          Currency: "EGP",
          AllowedAppointmentTypes: [],
          isOpen: true
        },
        ...(slots[day] || [])
      ]
    };
    handleUpdateSlots(updated);
  };

  const handleSaveSlot = (updatedSlot) => {
    const updated = {
      ...slots,
      [activeTab]: slots[activeTab].map(slot =>
        slot.id === updatedSlot.id ? updatedSlot : slot
      )
    };
    handleUpdateSlots(updated);
  };

  const handleDeleteSlot = (slotId) => {
    const updated = {
      ...slots,
      [activeTab]: slots[activeTab].filter(slot => slot.id !== slotId)
    };
    handleUpdateSlots(updated);
  };

  const handleToggleSlot = (slotId) => {
    const updated = {
      ...slots,
      [activeTab]: slots[activeTab].map(slot =>
        slot.id === slotId ? { ...slot, isOpen: !slot.isOpen } : slot
      )
    };
    handleUpdateSlots(updated);
  };

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <div className="dc-haslayout dc-dbsectionspace">
        <div className={`dc-dashboardbox dc-dashboardtabsholder ${header ? "NewShado" : "noneshadow"}`}
        >
          {header && (
            <div className="dc-dashboardboxtitle">
              <h2>{t("Make Slots")}</h2>
            </div>
          )}
          <div className="divtoconvert">
            <div className="dc-dashboardtabs">
              <ul className="dc-tabstitle nav navbar-nav">
              {DAYS.map(day => (
                <li key={day} className="nav-item">
                  <a
                    href="#"
                    className={activeTab === day ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(day);
                    }}
                  >
                    {day}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="dc-tabscontent tab-content">
            <DoctorDaySlots
              day={activeTab}
              slots={slots[activeTab] || []}
              clinics={CLINICS}
              appointmentTypes={APPOINTMENT_TYPES}
              currencies={CURRENCIES}
              onAddSlot={handleAddSlot}
              onDeleteSlot={handleDeleteSlot}
              onToggleSlot={handleToggleSlot}
              onSaveSlot={handleSaveSlot}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}