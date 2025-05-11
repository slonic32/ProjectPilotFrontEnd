import AddUserForm from "../../components/AddUserForm/AddUserForm";
import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import css from "./AddUser.module.css";

export default function AddUser() {
  return (
    <div className={css.page}>
      {/* Animated Vines */}
      <img
        src="src/assets/images/imgbin-leaf-green-leaves-PrY01nVcvG7rKmaHQu1phZLCY.png"
        alt="Left Vine"
        className={`${css.vine} ${css.vineLeft}`}
      />
      <img
        src="src/assets/images/pngtree-cartoon-green-plant-vine-png-image_4569455.png"
        alt="Top Vine"
        className={`${css.vine} ${css.vineTop}`}
      />

      {/* Clock */}
      <div className={css.clockWrapper}>
        <ClockWithPlant />
      </div>

      {/* Form Container */}
      <div className={css.container}>
        <AddUserForm />
      </div>
    </div>
  );
}
