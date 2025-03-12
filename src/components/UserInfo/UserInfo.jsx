import css from "./UserInfo.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";

export default function UserInfo() {
  const user = useSelector(selectUser);
  return (
    <>
      <div>
        <div>
          <p>Hello, {user.name}!</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Avatar: {user.avatarURL}</p>
          <p>Administrator: {user.admin ? "yes" : "no"}</p>
          <p>Project Manager: {user.pm ? "yes" : "no"}</p>
        </div>
      </div>
    </>
  );
}
