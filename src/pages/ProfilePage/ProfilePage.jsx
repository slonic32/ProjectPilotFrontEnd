import UpdateProfileForm from "../../components/UpdateProfileForm/UpdateProfileForm";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>Profile</h1>
      <UpdateProfileForm />
    </div>
  );
}
