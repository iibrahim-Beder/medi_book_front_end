const statusColors = {
  completed: "rgba(46, 204, 113, 0.29)", // أخضر
  cancelled: "rgba(231, 76, 60, 0.29)", // أحمر
  empty: "rgba(108, 117, 125, 0.29)", // رمادي
  pending: "rgba(36, 124, 255, 0.29)", // أزرق
  default: "rgba(36, 124, 255, 0.29)" // الافتراضي
};

const SingleSlot = ({ time = "9:00 am", spaces = 0, status = "default", onClick }) => {
  return (
    
    <div
      href="#!"
      className="dc-spaces"
      onClick={onClick}
      style={{

        marginRight:"60px",
        height:"fit-content",
        marginTop:"auto",
        border: `0.5px solid ${statusColors[status] || statusColors.default}`,
        backgroundColor: `${statusColors[status] || statusColors.default}20`,
      }}
    >
      <div>
        <span style={{ color: "#999" }}>{time}</span>
        <span>Spaces: {spaces.toString().padStart(2, "0")}</span>
      </div>
    </div >
  );
};

export default SingleSlot;