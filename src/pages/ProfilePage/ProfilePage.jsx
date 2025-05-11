import UpdateProfileForm from "../../components/UpdateProfileForm/UpdateProfileForm";
import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Vines */}
      <img src="src\assets\images\imgbin-leaf-green-leaves-PrY01nVcvG7rKmaHQu1phZLCY.png" alt="Right Vine" className={styles.vineRight} />
      <img src="src\assets\images\pngtree-cartoon-green-plant-vine-png-image_4569455.png" alt="Bottom Vine" className={styles.vineMiddle} />

      <div className={styles.contentWrapper}>
        <ClockWithPlant />
        <UpdateProfileForm />
      </div>
    </div>
  );
}
