import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import toast from "react-hot-toast";
import css from "./UpdateProfileForm.module.css";
import { editUser } from "../../redux/auth/operations";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";

const updateProfileSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string().email("Invalid email address"),

  avatar: Yup.string().url("Avatar must be a valid URL"),
});

export default function UpdateProfileForm() {

  const dispatch = useDispatch();
  const user = useSelector(selectUser);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
  });


  const onSubmit = (data) => {
    dispatch(editUser(data))
      .unwrap()
      .then(() => {
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
      <div>
        <label>Name</label>

        <input type="text" placeholder={user.name} {...register("name")} />

        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>

        <input type="email" placeholder={user.email} {...register("email")} />

        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Avatar URL</label>

        <input
          type="text"
          placeholder={user.avatarURL}
          {...register("avatarURL")}
        />

        {errors.avatar && <p>{errors.avatar.message}</p>}
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );

}

