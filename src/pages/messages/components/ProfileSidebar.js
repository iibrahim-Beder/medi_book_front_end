export default function ProfileSidebar() {
  return (
    <div className="dc-dashboardbox dc-messagebox">
      <div className="dc-dashboardboxcontent">
        <div className="dc-userprofile">
          <figure>
            <img src="/images/avt/patient-avt.png" alt="profile" />
          </figure>
          <div className="dc-title">
            <h3>
              <i className="fa fa-check-circle"></i> Valentine Mehring
            </h3>
            <span>
              Member since May 30, 2013 <br />
              <a href="javascript:void(0);">@valentine20658</a>
            </span>
          </div>
        </div>
        <div className="dc-applyfilters">
          <a href="javascript:void(0);" className="dc-btn">
            View Profile
          </a>
        </div>
      </div>
    </div>
  );
}
