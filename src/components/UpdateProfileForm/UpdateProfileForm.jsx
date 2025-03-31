import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import toast from "react-hot-toast";
import css from "./UpdateProfileForm.module.css";
import { editUser } from "../../redux/auth/operations";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";

//upload avatar
import AvatarInput from "../AvatarInput/AvatarInput";
import { useEffect, useState } from "react";

const updateProfileSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string(),
  password: Yup.string().test(
    "empty-or-8-characters-check",
    "Password must be at least 4 characters long",
    (password) => !password || (password.length >= 4 && password.length <= 22)
  ),
  repeatPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
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

    formData.append("name", name);

    formData.append("email", email);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    formData.append("phone", phone);
    formData.append("password", password);

    dispatch(editUser(formData))
      .unwrap()
      .then(() => {
        reset();
        toast.success("Profile updated successfully!", {
          duration: 2000,
        });
      })
      .catch((error) => {
        toast.error("Failed to update profile. Please try again.", {
          duration: 4000,
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.formContainer}>
      <AvatarInput
        control={control}
        register={register}
        setMyAvatar={setMyAvatar}
      />
      <div>
        <label>Name</label>

        <input
          type="text"
          placeholder={user.name}
          {...register("name", { value: user.name })}
        />

        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>

        <input
          type="email"
          placeholder={user.email}
          {...register("email", { value: user.email })}
        />

        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Phone</label>

        <input
          type="tel"
          placeholder={user.phone}
          {...register("phone", { value: user.phone })}
        />

        {errors.phone && <p>{errors.phone.message}</p>}
      </div>

      <div>
        <label>New Password</label>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            {...register("password")}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label>Repeat New Password</label>
        <div>
          <input
            type={showRepeatPassword ? "text" : "password"}
            placeholder="Repeat password"
            {...register("repeatPassword")}
          />
          <button
            type="button"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
          >
            {showRepeatPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
      </div>

      <button type="submit">Update Profile</button>
    </form>
  );
}
