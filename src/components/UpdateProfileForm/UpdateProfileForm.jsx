import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import css from "./UpdateProfileForm.module.css";

const updateProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  avatar: Yup.string().url("Avatar must be a valid URL"),
});

export default function UpdateProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      console.log("Token being sent:", token);
      const response = await axios.patch(
        "/users/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={css.formContainer}>
      <div>
        <label>Name</label>
        <input type="text" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label>Avatar URL</label>
        <input type="text" {...register("avatar")} />
        {errors.avatar && <p>{errors.avatar.message}</p>}
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );
}