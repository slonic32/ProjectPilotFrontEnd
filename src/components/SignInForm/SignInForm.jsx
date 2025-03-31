import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/operations";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const signInValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters long")
    .required("Password is required"),
});

export default function SignInForm({ onLoginSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add navigation hook
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
        toast.success("Welcome back!");
        console.log("Login successful! Triggering onLoginSuccess...");
        onLoginSuccess(); // Notify parent of successful login
        navigate("/profile"); // Redirect to profile page
      })
      .catch(() => {
        toast.error("Your email or password is incorrect.");
      });
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
           
        <div>
          <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>
          {errors.password && <p>{errors.password.message}</p>}
     


        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}