import UpdateProfileForm from "../../components/UpdateProfileForm/UpdateProfileForm";
import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import styles from "./ProfilePage.module.css";
import vine1 from "../../assets/images/vine1.png"
import vine2 from "../../assets/images/vine2.png"
export default function ProfilePage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Vines */}
      <img src={vine2} alt="Right Vine" className={styles.vineRight} />
      <img src={vine1} alt="Bottom Vine" className={styles.vineMiddle} />

      <div className={styles.contentWrapper}>
        <ClockWithPlant />
        <UpdateProfileForm />
      </div>
    </div>
  );
}
