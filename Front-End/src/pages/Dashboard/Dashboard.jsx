import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../../api";
import "../Dashboard/Dashboard.css";
import { ACCESS_TOKEN } from "../../constants";
import AdminResourceForm from "../AdminResourceForm/AdminResourceForm";
import Avatar from "../../components/avatar";

function Dashboard() {
  const [message, setMessage] = useState("Loading...");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

 
  function canManageResources(user) {
    if (!user || !user.profile) return false;

    const isStandardAdmin = user.isAdmin;
    const isFrontendAdmin =
      !user.profile.created_via_backend &&
      (user.profile.role === "admin" || user.profile.role === "allowed_role");

    return isStandardAdmin || isFrontendAdmin;
  }

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (!accessToken) {
        setMessage("No access token found");
        return;
      }

      const response = await api.get("/api/dashboard/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status !== 200) {
        setMessage("Failed to fetch dashboard data");
        return;
      }

      const data = response.data;
      setUser(data.user);

      if (data.user.isAdmin) {
        await fetchUsers(accessToken);
      }
    } catch (err) {
      setMessage("Error fetching dashboard data. Please try again later.");
      setError(err.message);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const response = await api.get("/api/list_users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        setMessage("Failed to fetch users");
        return;
      }

      setUsers(response.data);
    } catch (err) {
      setMessage("Error fetching users. Please try again later.");
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handlePermissionChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.put(
        `/api/user/${userId}/role/`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        setSuccessMessage("Role updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.log("Failed to update role");
      }
    } catch (error) {
      setError("Error updating role: " + error.message);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.put(
        `/api/users/roles/`,
        { users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      setError("Error saving changes: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ul>
          <li><NavLink to="/dashboard">Dashboard</NavLink></li>
          <li>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
        </ul>
      </div>

      <div className="content">
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        {user ? (
          <div>
            <div className="cv-card">
              <div className="cv-header">
                <Avatar
                  photoPath={user.profile.profile_photo}
                  alt="Profile"
                  className="cv-photo"
                />
                <div className="cv-basic-info">
                  <h2>{user.username}</h2>
                  <p><strong>Job Title:</strong> {user.profile.title}</p>
                  <p><strong>Phone:</strong> {user.profile.phone}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Nickname:</strong> {user.profile.nickname}</p>
                </div>
              </div>

              <div className="cv-section">
                <h3>📝Your Short Descriptions</h3>
                <p>{user.profile.descriptions}</p>
              </div>

              <div className="cv-section">
                <h3>🌐 Lienks</h3>
                <ul className="cv-links">
                  <li><strong>Upwork:</strong> <a href={`https://${user.profile.link_upwork}`} target="_blank" rel="noreferrer">{user.profile.link_upwork}</a></li>
                  <li><strong>GitHub:</strong> <a href={`https://${user.profile.link_github}`} target="_blank" rel="noreferrer">{user.profile.link_github}</a></li>
                  <li><strong>LinkedIn:</strong> <a href={`https://${user.profile.link_linkedin}`} target="_blank" rel="noreferrer">{user.profile.link_linkedin}</a></li>
                </ul>
              </div>

              <button className="edit-profile-button" onClick={() => navigate(`/edit-profile/${user.id}`)}>
                Edit Profile
              </button>
            </div>

          
            {canManageResources(user) && (
              <div className="admin-resource-section">
                <AdminResourceForm />
              </div>
            )}

          
            {user.isAdmin && (
              <div className="admin-section">
                <div className="user-list">
                  <h3>List of Users</h3>
                  <ul className="styled-user-list">
                    {users.length > 0 ? (
                      users.map((u) => (
                        <li key={u.id} className="user-item">
                          <div className="user-details">
                            <span className="user-username">{u.username}</span>
                            <span className="user-email">{u.email}</span>
                          </div>
                          {u.id !== user.id && (
                            <select
                              onChange={(e) => handlePermissionChange(u.id, e.target.value)}
                              value={u.role || "none"}
                              className="user-permission-select"
                            >
                              <option value="none">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </li>
                      ))
                    ) : (
                      <p>No users found.</p>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
