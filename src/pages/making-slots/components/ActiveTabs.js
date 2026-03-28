export default function ActiveTabs({
  activeCount = 0,
  inactiveCount = 0,
  activeTab,
  setActiveTab
}) {

  const tabs = [
    { key: "Active", label: "Active", count: activeCount },
    { key: "Inactive", label: "InActive", count: inactiveCount },
  ];

  // const visibleTabs = tabs.filter((tab) => tab.count > 0);

  // if (visibleTabs.length === 0) return null;

  return (
    <div className="active-tabs">
      <ul className="nav nav-pills inner-tab">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${
                activeTab === tab.key ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
              {/* <span className='num-item' style={{lineHeight:1.5}}>{tab.count}</span> */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}