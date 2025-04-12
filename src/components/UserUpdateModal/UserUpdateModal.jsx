import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import css from "./UserUpdateModal.module.css";

const updateUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phone: Yup.string(),
  admin: Yup.boolean(),
  pm: Yup.boolean(),
});

export default function UserUpdateModal({ user, onClose, onUpdate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      admin: user.admin || false,
      pm: user.pm || false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      
      // Create FormData object as the API expects multipart/form-data
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('admin', data.admin);
      formData.append('pm', data.pm);
      
      // Use the correct endpoint based on the API documentation
      const response = await axios.patch(
        "/users/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept": "application/json",
            // Don't set Content-Type - Axios will set it automatically with boundary for FormData
          },
        }
      );
      
      toast.success("User updated successfully!");
      onUpdate(response.data); // Pass updated user data to parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className={css.modalBackdrop}>
      <div className={css.modalContent}>
        <h2>Update User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={css.formGroup}>
            <label>Name</label>
            <input type="text" {...register("name")} />
            {errors.name && <p className={css.errorText}>{errors.name.message}</p>}
          </div>
          
          <div className={css.formGroup}>
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && <p className={css.errorText}>{errors.email.message}</p>}
          </div>
          
          <div className={css.formGroup}>
            <label>Phone</label>
            <input type="tel" {...register("phone")} />
            {errors.phone && <p className={css.errorText}>{errors.phone.message}</p>}
          </div>
          
          <div className={css.checkboxGroup}>
            <input type="checkbox" id="adminCheck" {...register("admin")} />
            <label htmlFor="adminCheck">Admin</label>
          </div>
          
          <div className={css.checkboxGroup}>
            <input type="checkbox" id="pmCheck" {...register("pm")} />
            <label htmlFor="pmCheck">Project Manager</label>
          </div>
          
          <div className={css.buttonGroup}>
            <button type="submit" className={css.saveButton}>Save Changes</button>
            <button type="button" onClick={onClose} className={css.cancelButton}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}