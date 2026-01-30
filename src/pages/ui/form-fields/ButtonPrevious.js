
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ButtonPrevious({ onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      sx={{
        textTransform: "none",
        borderRadius: "6px",
        paddingX: 2,
        paddingY: 0.7,
        fontSize: "15px",
        fontWeight: 500,
        borderColor: "rgba(0, 0, 0, 0.15)",
        color: "#444",
        "&:hover": {
          borderColor: "var(--blue)",
          backgroundColor: "rgba(21, 54, 198, 0.06)",
          color: "var(--blue)",
        },
      }}
    >
      Previous
    </Button>
  );
}
