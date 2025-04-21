import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { editUser } from "../../redux/auth/operations";
import { selectUser } from "../../redux/auth/selectors";

import AvatarInput from "../AvatarInput/AvatarInput";
import css from "./UpdateProfileForm.module.css";

import { useState } from "react";

const updateProfileSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string(),
  password: Yup.string().test(
    "empty-or-length",
    "Password must be at least 4 characters",
    (val) => !val || (val.length >= 4 && val.length <= 22)
  ),
  repeatPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function UpdateProfileForm() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [avatar, setMyAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
  });

  const onSubmit = (data) => {
    const { name, email, phone, password } = data;

    const formData = new FormData();
    formData.append("name", name || user.name);
    formData.append("email", email || user.email);
    formData.append("phone", phone || user.phone);
    if (password) formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    dispatch(editUser(formData))
      .unwrap()
      .then(() => {
        reset();
        toast.success("Profile updated successfully!");
      })
      .catch(() => {
        toast.error("Update failed. Please try again.");
      });
  };

  return (
    <div className={css.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={css.formContainer}>
        <h2>Update Your Profile</h2>

        <div className={css.avatarBox}>
          <AvatarInput
            control={control}
            register={register}
            setMyAvatar={setMyAvatar}
          />
        </div>

        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder={user.name}
            {...register("name", { value: user.name })}
          />
          {errors.name && <p className={css.error}>{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            {...register("email", { value: user.email })}
          />
          {errors.email && <p className={css.error}>{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            placeholder={user.phone}
            {...register("phone", { value: user.phone })}
          />
          {errors.phone && <p className={css.error}>{errors.phone.message}</p>}
        </div>

        <div>
          <label>New Password</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("password")}
            />
            <button
              type="button"
              className={css.toggleBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && <p className={css.error}>{errors.password.message}</p>}
        </div>

        <div>
          <label>Repeat New Password</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showRepeatPassword ? "text" : "password"}
              placeholder="Repeat password"
              {...register("repeatPassword")}
            />
            <button
              type="button"
              className={css.toggleBtn}
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
            >
              {showRepeatPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.repeatPassword && (
            <p className={css.error}>{errors.repeatPassword.message}</p>
          )}
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}
