import { Controller } from "react-hook-form";
import css from "./AvatarInput.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAvatar } from "../../redux/auth/selectors";

export default function AvatarInput({ control, register, setMyAvatar }) {
  const [inputImg, setInputImage] = useState(false);
  const userAvatar = useSelector(selectAvatar);

  const avatarUser = (
    <img
      className={css.photo}
      src={inputImg ? inputImg : userAvatar}
      width="100%"
      height="100%"
      alt="Avatar"
    />
  );

  const avatarDefault = (
    <img
      className={css.photo}
      src="./default-avatar.jpg"
      width="100%"
      height="100%"
      alt="Avatar"
    />
  );

  const onChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMyAvatar(file);
      setInputImage(URL.createObjectURL(file));
    } else {
      setInputImage(false);
    }
  };

  return (
    <div className={css.avatarInput}>
      <div className={css.avatarBox}>
        {userAvatar || inputImg ? avatarUser : avatarDefault}
      </div>

      <Controller
        name="file"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            {...register("avatar")}
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={onChange}
          />
        )}
      />
      <label htmlFor="file-input">
        <div className={css.upLoad}>
          <p>Upload a photo</p>
        </div>
      </label>
    </div>
  );
}
