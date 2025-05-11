import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/operations";
import toast from "react-hot-toast";
import { default as plantImage } from "../../assets/images/plant.png";

import css from "./SignInForm.module.css";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

// Validation schema
const signInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export default function SignInForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInValidationSchema),
  });

  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        toast.success("Welcome back! ", {
          duration: 2000,
        });
      })
      .catch(() => {
        toast.error("Your email or password is incorrect🙈", {
          duration: 4000,
        });
      });
  };

  return (
    <motion.div
      className={css["signin-container"]}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.img
        src={plantImage}
        alt="plant"
        className={css["plant-image"]}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <div className={css["form-box"]}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className={css["input-group"]}>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email")}
              className={css["input-field"]}
            />
            <label htmlFor="email" className={css["floating-label"]}>
              Email
            </label>
            <Mail size={18} />
            {errors.email && (
              <p className={css["error-message"]}>{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className={css["input-group"]}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              {...register("password")}
              className={css["input-field"]}
            />
            <label htmlFor="password" className={css["floating-label"]}>
              Password
            </label>
            <Lock size={18} />
            {errors.password && (
              <p className={css["error-message"]}>{errors.password.message}</p>
            )}
          </div>

          {/* Button */}
          <motion.button
            type="submit"
            className={css["signin-button"]}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>

          <div className={css["link-row"]}>
            <span>Forgot password?</span>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
