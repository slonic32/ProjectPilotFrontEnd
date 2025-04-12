import { useEffect, useState } from "react";
import axios from "axios";
import css from "./AdminPanel.module.css";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("/users/all", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <img 
                        src={user.avatarURL ? user.avatarURL : "/default-avatar.png"} 
                        alt={`${user.name}'s avatar`} 
                        className={css.avatar}
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "Not provided"}</td>
                    <td>{user.admin ? "Yes" : "No"}</td>
                    <td>{user.pm ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={css.noUsers}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}