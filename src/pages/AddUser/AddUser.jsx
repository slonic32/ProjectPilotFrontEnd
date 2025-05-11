import AddUserForm from "../../components/AddUserForm/AddUserForm";
import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import css from "./AddUser.module.css";
import vine1 from "../../assets/images/vine1.png"
import vine2 from "../../assets/images/vine2.png"
export default function AddUser() {
  return (
    <div className={css.page}>
      {/* Animated Vines */}
      <img
        src={vine2}
        alt="Left Vine"
        className={`${css.vine} ${css.vineLeft}`}
      />
      <img
        src={vine1}
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
