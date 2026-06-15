import { Button } from "@mui/material";
import { Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function DataEmptyComponent({
  title = "Data Empty",
  text = "No Data Found",
  imgStyle = { width: "40%", maxWidth: "300px" },
  children = null,
  LinkTo = null,
  linkText = "Add New",
  btnText = "Add New",
  onClick = null,
  containerStyle = {},
}) {
  return (
    <div className="empty-data-container" style={containerStyle}>
      <img style={imgStyle} src="/images/dashboard/dataEmpty.png" alt="Error" />
      <div className="text-center text-danger mt-4">
        <h3 style={{ fontWeight: "500", color: "#008ce9" }}>{title}</h3>
        <h5 style={{ fontWeight: "500" }}>{text}</h5>
        {children}
        {LinkTo && (
          <Link to={LinkTo}>
            <a
              href="!#"
              style={{
                textWrapMode: "nowrap",
                textDecoration: "underline",
                margin: "0 20px",
                fontWeight: "500",
                fontSize: "16px",
              }}
            >
              {linkText}
            </a>
          </Link>
        )}
        {onClick && (
          <Button
            onClick={onClick}
            variant="contained"
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              backgroundColor: "#60a5fa",
              boxShadow: "none",
            }}
          >
            {btnText}
          </Button>
        )}
      </div>
    </div>
  );
}
