import css from "./UserInfo.module.css";
import { useSelector } from "react-redux";
import { selectAvatar, selectUser } from "../../redux/auth/selectors";
import { default as defaultAvatar } from "../../assets/images/default-avatar.jpg";

export default function UserInfo() {
  const user = useSelector(selectUser);
  const avatar = useSelector(selectAvatar);
  return (
    <>
      <div>
        <div>
          <div className={css.avatarBox}>
            <img
              className={css.photo}
              src={avatar ? avatar : defaultAvatar}
              width="100%"
              height="100%"
              alt="Avatar"
            />
          </div>
          <p>Hello, {user.name}!</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>

          <p>Administrator: {user.admin ? "yes" : "no"}</p>
          <p>Project Manager: {user.pm ? "yes" : "no"}</p>
        </div>
      </div>
    </>
  );
}
