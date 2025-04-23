import AddUserForm from "../../components/AddUserForm/AddUserForm";
import css from "../AddUser/AddUser.module.css";

export default function AddUser() {
  return (
    <main>
      <div className={css.container}>
        {/* The form itself will have a margin-top applied */}
        <AddUserForm className={css.AddUserForm} />
      </div>
    </main>
  );
}
