import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/operations";
import { showNotification } from "../../utils/notification";
import css from "./LogOut.module.css";
import plantImage from "../../assets/images/plant.png";

const title = "Log out";

export default function LogOut() {
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logout()).unwrap();
      showNotification("You have been logged out successfully!", "success");
    } catch (error) {
      showNotification("Failed to log out. Please try again.", "error");
      console.error("Logout operation failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={css.wrapper}>
      <div className={css.card}>
        <img src={plantImage} alt="plant" className={css.plant} />
        <h2>{title}</h2>
        <p>Do you really want to leave?</p>
        <button onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );
}
