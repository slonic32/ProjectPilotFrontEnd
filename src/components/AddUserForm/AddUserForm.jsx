import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import css from "./AddUserForm.module.css";
import { add as userAdd } from "../../redux/auth/operations";
import toast from "react-hot-toast";

const addUserValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  phone: Yup.string(),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  admin: Yup.boolean(),
  pm: Yup.boolean(),
});

export default function AddUserForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(addUserValidationSchema),
  });

  const onSubmit = (data) => {
    const { name, email, phone, password, admin, pm } = data;
    dispatch(userAdd({ name, email, phone, password, admin, pm }))
      .unwrap()
      .then(() => {
        toast.success("User added successfully!", { duration: 2000 });
        reset();
      })
      .catch(() => {
        toast.error("Failed to add user", { duration: 4000 });
      });
  };

  return (
    <div className={css.wrapper}>
      <div className={css.formBox}>
        <h1>Add New User</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Name</label>
            <input type="text" placeholder="Enter user name" {...register("name")} />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div>
            <label>Email</label>
            <input type="text" placeholder="Enter user email" {...register("email")} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <label>Phone</label>
            <input type="tel" placeholder="Enter user phone" {...register("phone")} />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>

          <div className={css.checkboxWrapper}>
            <input type="checkbox" id="admin" {...register("admin")} />
            <label htmlFor="admin">Admin</label>
          </div>

          <div className={css.checkboxWrapper}>
            <input type="checkbox" id="pm" {...register("pm")} />
            <label htmlFor="pm">Project Manager (PM)</label>
          </div>

          <div>
            <label>Password</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <div>
            <label>Repeat Password</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat password"
                {...register("repeatPassword")}
              />
              <button type="button" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                {showRepeatPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
