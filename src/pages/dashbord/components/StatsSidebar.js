

export default function StatsSidebar({ stats }) {
  return (
    <aside className="dc-sidebar dc-dashboardsave">
      {stats.map((item, index) => (
        <div className="dc-proposalsr dc-box-shadow" key={index}>
          <div className={`dc-proposalsrcontent ${item.extraClass || ""}`}>
            <figure>
              <img src={item.img} alt={item.title} />
            </figure>
            <div className="dc-title">
              <h3>{item.count}</h3>
              <span>{item.title}</span>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}
