import { useEffect, useState } from "react";
import axios from "axios";
import css from "./AdminPanel.module.css";
import toast from "react-hot-toast";
import UserUpdateModal from "../../components/UserUpdateModal/UserUpdateModal";
import { default as defaultAvatar } from "../../assets/images/default-avatar.jpg";
import { BACKEND_HOST } from "../../config/backend";

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
      // console.log("First user from API:", response.data.users[0]); // Log first user to see structure
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        // Use _id instead of id
        await axios.delete(`/users/${user._id}`);
        toast.success(`User ${user.name} deleted successfully`);
        // Refresh user list after deletion
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
      }
    }
  };
  users.map((user, index) => (
    <tr key={user._id || index}>{/* ... rest of the code ... */}</tr>
  ));
  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  // And in the handleUserUpdated function
  const handleUserUpdated = (updatedUser) => {
    // Update the user in the users array
    const updatedUsers = users.map((user) =>
      user._id === updatedUser._id ? updatedUser : user
    );
    setUsers(updatedUsers);
    fetchUsers(); // Refresh the user list to ensure data is current
  };

  return (
    <div className={css.container}>
      <h1>Admin Panel - User Management</h1>

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
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id || index}>
                    <td>
                      <img
                        src={
                          user.avatarURL
                            ? BACKEND_HOST + "/" + user.avatarURL
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
                        onClick={() => handleDeleteUser(user)} // Pass the entire user object
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
