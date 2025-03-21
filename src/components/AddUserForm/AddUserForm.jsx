import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import css from "./AddUserForm.module.css";

import { add as userAdd } from "../../redux/auth/operations";
import toast from "react-hot-toast";

const addUserValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters long"),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
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
    const name = data.email.split("@")[0];
    const email = data.email;
    const password = data.password;
    dispatch(userAdd({ name, email, password }))
      .unwrap()
      .then(() => {
        toast.success("User added successful!", {
          duration: 2000,
        });
        reset();
      })
      .catch((error) => {
        toast.error("Failed to add user", { duration: 4000 });
      });
  };

  return (
    <div>
      <div>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter user email"
              {...register("email")}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <label>Password</label>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter user password"
                {...register("password")}
              />
              <div onClick={() => setShowPassword(!showPassword)}></div>
            </div>
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <div>
            <label>Repeat Password</label>
            <div>
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat password"
                {...register("repeatPassword")}
              />
              <div
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              ></div>
            </div>
            {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
