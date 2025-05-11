import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import css from "./AdminPanel.module.css";

import ClockWithPlant from "../../components/Clock/ClockWithPlant";
import UserUpdateModal from "../../components/UserUpdateModal/UserUpdateModal";
import WelcomeSection from "../../components/WelcomeSection/WelcomeSection";
import UserInfo from "../../components/UserInfo/UserInfo";
import ProjectDashboard from "../../components/ProjectDashboard/ProjectDashboard";

import defaultAvatar from "../../assets/images/default-avatar.jpg";
import { BACKEND_HOST } from "../../config/backend";
import vine1 from "../../assets/images/vine1.png"
import vine2 from "../../assets/images/vine2.png"
export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/users/all");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await axios.delete(`/users/${user._id}`);
        toast.success(`User ${user.name} deleted successfully`);
        fetchUsers();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    fetchUsers();
  };

  return (
    <div className={css.container}>
      {/* Vines */}
      <img
        src={vine2}
        alt="Vine Right"
        className={css.vineRight}
      />
      <img
        src={vine1}
        alt="Vine Middle"
        className={css.vineMiddle}
      />

      {/* Clock */}
      <ClockWithPlant />

      {/* Title */}
      <h1>Admin Panel - User Management</h1>

      {/* Welcome + Info + Dashboard Section */}
      <div className={css.componentsContainer}>
        <div className={css.welcomeSection}>
          <WelcomeSection />
        </div>
        <div className={css.infoDashboardRow}>
          <div className={css.userInfo}>
            <UserInfo />
          </div>
          <div className={css.projectDashboard}>
            <ProjectDashboard />
          </div>
        </div>
      </div>


      {/* User Table */}
      {loading ? (
        <div className={css.loading}>Loading users...</div>
      ) : (
        <div className={css.tableContainer}>
          <table className={css.usersTable}>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Admin</th>
                <th>Project Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <img
                        src={
                          user.avatarURL
                            ? `${BACKEND_HOST}/${user.avatarURL}`
                            : defaultAvatar
                        }
                        alt={`${user.name}'s avatar`}
                        className={css.avatar}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "Not provided"}</td>
                    <td>{user.admin ? "Yes" : "No"}</td>
                    <td>{user.pm ? "Yes" : "No"}</td>
                    <td className={css.actions}>
                      <button
                        className={css.updateButton}
                        onClick={() => handleUpdateUser(user)}
                      >
                        Update
                      </button>
                      <button
                        className={css.deleteButton}
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={css.noUsers}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showUpdateModal && selectedUser && (
        <UserUpdateModal
          user={selectedUser}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUserUpdated}
        />
      )}
    </div>
  );
}
