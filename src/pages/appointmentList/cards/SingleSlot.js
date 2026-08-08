const statusColors = {
  Reserved: "#FFA726",  // Orange (Temporary Hold)
  Booked: "#4FC3F7",    // Light Blue
  Completed: "#66BB6A", // Green
  Expired: "#bdbbbb9b",   
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
        // border: `0.5px solid ${statusColors[status] || statusColors.default}`,
        // backgroundColor: `${statusColors[status] || statusColors.default}20`,
                  backgroundColor: `${statusColors[status] || ""}`,
                  color: ( status === "Available"|| status === "Reserved") ? "" : "white",
      }}
    >
      <div>
        <span style={{ color: status === "Available" ? "#999" : "white" }}>{time}</span>
        <span>Spaces: {spaces.toString().padStart(2, "0")}</span>
      </div>
    </div >
  );
};

export default SingleSlot;