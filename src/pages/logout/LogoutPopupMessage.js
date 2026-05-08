import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PopupMessage from "../shared/PopupMessage";
import { logout } from "../../redux/Slices/login/authSlice";

export default function LogoutPopupMessage({ setShowPopupClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setShowPopupClose(false);
  };

  return (
    <PopupMessage
      type="warning"
      title="Logout"
      message={`Are you sure you want to logout?`}
      buttons={[
        {
          text: "Cancel",
          onClick: () => setShowPopupClose(false),
          variant: "secondary",
        },
        {
          text: "Logout",
          onClick: handleLogout,
          variant: "second-btn",
        },
      ]}
      onClose={() => setShowPopupClose(false)}
    />
  );
}
