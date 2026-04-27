
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from "react-icons/fa";
import { Progress } from './Test';
import React from "react";
import "./dashboard.css";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  ShieldCheck,
  ChevronRight,
  Check,
  FileText,
  CalendarClock,
  User,
  Stethoscope,
  Calendar,
  MessageSquare,
  Video,
  BarChart3,
  FileSearch,
  CreditCard,
  Lock,
} from "lucide-react";

const links2 = [
  {
    icon: BookOpen,
    title: "Verification guide",
    description: "Accepted documents and requirements.",
    content: "You can upload your documents here and our team will verify them.",
  },
  {
    icon: LifeBuoy,
    title: "Contact support",
    description: "Our team replies within one hour.",
    content: "Reach us via live chat or email support@company.com. Available 24/7.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & compliance",
    description: "How we protect your patient data.",
    content: "We follow HIPAA and GDPR standards to ensure your data is encrypted and secure.",
  },
];

export function SupportStrip2() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <aside className="dc-card dc-aside">
      <div className="dc-card__header dc-card__header--simple">
        <h3 className="dc-card__title">Resources</h3>
        
        <p className="dc-card__sub">Help and documentation for new practitioners.</p>
      </div>

      <ul className="dc-links">
        {links2.map((item, index) => {
          const Icon = item.icon;
          const isOpen = activeIndex === index;

          return (
            <li key={item.title}>
              <button className="dc-link" onClick={() => toggle(index)}>
                <span className="dc-link__icon">
                  <Icon size={16} />
                </span>

                <span className="dc-link__body">
                  <span className="dc-link__title">{item.title}</span>
                  <span className="dc-link__desc">{item.description}</span>
                </span>

                <ChevronRight
                  size={16}
                  className={`dc-link__chev ${isOpen ? "open" : ""}`}
                />
              </button>

              <div className={`dc-link__expand ${isOpen ? "open" : ""}`}>
                <p>{item.content}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}













/* ---------- Verification Alert ---------- */
const VerificationAlert = () => (
  <div className="dc-alert">
    <div className="dc-alert__left">
      <div className="dc-alert__icon">
        <AlertCircle size={20} strokeWidth={2.25} />
      </div>
      <div>
        <div className="dc-alert__titlewrap">
          <h2 className="dc-alert__title">Account verification required</h2>
          <span className="dc-badge dc-badge--accent">Pending</span>
        </div>
        <p className="dc-alert__desc">
          Your profile is not yet visible to patients. Please complete the
          remaining steps below to finalize verification.
        </p>
      </div>
    </div>
    <button type="button" className="dc-btn dc-btn-bg">
      Complete registration
      <ArrowRight size={16} style={{ marginLeft: 6 }} />
    </button>
  </div>
);

/* ---------- Setup Progress ---------- */
const steps = [
  { icon: User, label: "Basic Information", meta: "Personal details and contact", done: true },
  { icon: Stethoscope, label: "Medical Specialty", meta: "Primary field and sub-specialties", done: true },
  { icon: FileText, label: "Upload Documents", meta: "Medical license, ID, insurance certificate", done: false, current: true },
  { icon: CalendarClock, label: "Set Availability", meta: "Weekly schedule and consultation types", done: false },
];

const SetupProgress = () => {
  const completed = steps.filter((s) => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);

  return (
    <section className="dc-card">
      <div className="dc-card__header">
        <div>
          <h3 className="dc-card__title">Profile completion</h3>
          <p className="dc-card__sub">
            {completed} of {steps.length} steps completed
          </p>
        </div>
        <div className="dc-percent">
          {percent}
          <span className="dc-percent__sign">%</span>
        </div>
      </div>

      <div className="dc-progress-wrap">
        <div className="dc-progress">
          <div className="dc-progress__bar" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <ul className="dc-steps">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.label}
              className={`dc-step ${step.current ? "dc-step--current" : ""}`}
            >
              <span
                className={`dc-step__icon ${
                  step.done
                    ? "dc-step__icon--done"
                    : step.current
                    ? "dc-step__icon--current"
                    : "dc-step__icon--idle"
                }`}
              >
                {step.done ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
              </span>

              <div className="dc-step__body">
                <div className="dc-step__titlerow">
                  <span
                    className={`dc-step__label ${
                      step.done ? "dc-step__label--muted" : ""
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.current && (
                    <span className="dc-pill dc-pill--primary">In progress</span>
                  )}
                  {step.done && <span className="dc-step__verified">Verified</span>}
                </div>
                <p className="dc-step__meta">{step.meta}</p>
              </div>

              {!step.done && <ChevronRight size={16} className="dc-step__chev" />}
            </li>
          );
        })}
      </ul>

      <div className="dc-card__footer">
        <p className="dc-card__footnote">
          Estimated time to finish: <strong>4 minutes</strong>
        </p>
        <button type="button" className="dc-btn dc-btn-bg">
          Continue setup
          <ChevronRight size={16} style={{ marginLeft: 4 }} />
        </button>
      </div>
    </section>
  );
};

/* ---------- Support Strip ---------- */
const links = [
  { icon: BookOpen, title: "Verification guide", description: "Accepted documents and requirements." },
  { icon: LifeBuoy, title: "Contact support", description: "Our team replies within one hour." },
  { icon: ShieldCheck, title: "Privacy & compliance", description: "How we protect your patient data." },
];

const SupportStrip = () => (
  <aside className="dc-card dc-aside">
    <div className="dc-card__header dc-card__header--simple">
      <h3 className="dc-card__title">Resources</h3>
      <p className="dc-card__sub">Help and documentation for new practitioners.</p>
    </div>
    <ul className="dc-links">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.title}>
            <a href="#" className="dc-link">
              <span className="dc-link__icon">
                <Icon size={16} />
              </span>
              <span className="dc-link__body">
                <span className="dc-link__title">{item.title}</span>
                <span className="dc-link__desc">{item.description}</span>
              </span>
              <ChevronRight size={16} className="dc-link__chev" />
            </a>
          </li>
        );
      })}
    </ul>
  </aside>
);

/* ---------- Feature List ---------- */
const features = [
  { icon: Calendar, title: "Appointment Scheduling", description: "Manage availability, bookings and reminders." },
  { icon: MessageSquare, title: "Secure Messaging", description: "HIPAA-compliant patient communication." },
  { icon: Video, title: "Video Consultations", description: "Conduct remote visits from any device." },
  { icon: FileSearch, title: "Patient Records", description: "Centralized medical history and notes." },
  { icon: CreditCard, title: "Billing & Payments", description: "Integrated invoicing and reimbursements." },
  { icon: BarChart3, title: "Practice Analytics", description: "Performance metrics and patient insights." },
];

const FeatureList = () => (
  <section className="dc-card">
    <div className="dc-card__header">
      <div>
        <h3 className="dc-card__title">Features available after activation</h3>
        <p className="dc-card__sub">
          These tools will unlock once your account is verified.
        </p>
      </div>
      <div className="dc-locked">
        <Lock size={12} />
        Locked
      </div>
    </div>

    <div className="dc-features">
      {features.map((feature, i) => {
        const Icon = feature.icon;
        return (
          <div key={feature.title} className="dc-feature" data-index={i}>
            <div className="dc-feature__icon">
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <h4 className="dc-feature__title">{feature.title}</h4>
              <p className="dc-feature__desc">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

/* ---------- Page ---------- */
const Dashboard = () => {
  return (
    <main className="p-3">
      <div className="dc-heading">
        <p className="dc-eyebrow">Dashboard</p>
        <h1 className="dc-h1">Welcome, Dr. john doe</h1>
        <p className="dc-lead">
          Complete the remaining verification steps to activate your professional
          account and start receiving patient bookings.
        </p>
      </div>

      <div className="dc-stack">
        <VerificationAlert />

        <div className="dc-grid">
          <div className="dc-grid__main">
            <SetupProgress />
          </div>
          <div className="dc-grid__side">
            {/* <SupportStrip /> */}
            <SupportStrip2/>
          </div>
        </div>

        <FeatureList />
      </div>
    </main>
  );
};


export function StatusToggle() {
  const [status, setStatus] = useState("active");

  return (
    
    <div className="toggle-wrapper">
      <Progress/>
      <button
        className={`toggle-btn ${status === "active" ? "active" : ""}`}
        onClick={() => setStatus("active")}
      >
        Active
      </button>

      <button
        className={`toggle-btn ${status === "inactive" ? "inactive" : ""}`}
        onClick={() => setStatus("inactive")}
      >
        Inactive
      </button>
    </div>
  );
}
export default function Doctor() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("active");
  return (
    <div className="">
      <Dashboard/>


      {/* <FeatureList/>
      
      <h1>Doctor generation rules</h1>

      <StatusToggle />

      <ActiveTabs activeCount={2} inactiveCount={3} activeTab={activeTab} setActiveTab={setActiveTab} />
      <AppointmentToggle activeCount={2} inactiveCount={3} />
      <StatusSelect />
  */}
    </div>
  );
}
export  function ActiveTabs({
  activeCount = 0,
  inactiveCount = 0,
  activeTab,
  setActiveTab
}) {

  const tabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "InActive", count: inactiveCount },
  ];

  const visibleTabs = tabs.filter((tab) => tab.count > 0);

  if (visibleTabs.length === 0) return null;

  return (
    <div className="active-tabs">
      <ul className="nav nav-pills inner-tab">
        {visibleTabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
              <span className='num-item' style={{lineHeight:1.5}}>{tab.count}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Content */}
      {/* <div className="tab-content mt-3">
        {activeTab === "active" && (
          <div>Active Content</div>
        )}
        {activeTab === "inactive" && (
          <div>Inactive Content</div>
        )}
      </div> */}
    </div>
  );
}
export  function AppointmentToggle({
  activeCount = 0,
  inactiveCount = 0,
  activeTab, setActiveTab
}) {
  // const [selected, setSelected] = useState("active");

  const tabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "InActive", count: inactiveCount },
  ];

  // if (options.length === 0) return null;

  return (
    <div className="toggle-container">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className="toggle-item"
              onClick={() => setActiveTab(tab.key)}
        >
          <span
            className={`dot ${
              activeTab === tab.key ? "active" : ""
            }`}
          ></span>

          <span className="label">
            {tab.label} <span className="count">{tab.count}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
export  function StatusSelect({selected, setSelected}) {
  const [isOpen, setIsOpen] = useState(false);
  // const [selected, setSelected] = useState("Active");

  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = ["Active", "Inactive"];

  return (
    <div className="select-container" ref={ref}>
      <button
        className="select-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
    <FaChevronDown />
      </button>

      {isOpen && (
        <div className="tooltip-arrow mt-2" style={{    position: "absolute",zIndex: 3,width:" 100%"}}>
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className={`option ${
                selected === opt ? "active" : ""
              }`}
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}