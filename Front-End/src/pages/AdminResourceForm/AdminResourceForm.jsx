import React, { useState, useEffect } from "react";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import "./AdminResourceForm.css";

const AdminResourceForm = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [link, setLink] = useState("");
  const [resources, setResources] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCurrentUser();
    fetchResources();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/dashboard/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data && response.data.user) {
        setCurrentUserId(response.data.user.id);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/resources/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setResources(response.data);
    } catch (error) {
      setErrorMessage("Error fetching resources: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const resourceData = { name, categories, descriptions, link };

    try {
      await api.post("/api/add_resource/", resourceData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      fetchResources();
      setName("");
      setCategories("");
      setDescriptions("");
      setLink("");
      setSuccessMessage("✅ Resource added successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error adding resource: " + error.message);
      setSuccessMessage("");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const handleDelete = async (resourceId) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    try {
      await api.delete(`/api/resources/delete/${resourceId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchResources();
      setSuccessMessage("🗑️ Resource deleted successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("🚫 You can't delete this resource");
      setSuccessMessage("");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const filteredResources = resources.filter(
    (resource) => resource.author?.id === currentUserId
  );

  return (
    <div className="admin-resource-form-container">
      <h2>Manage Your Resources</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="admin-resource-form">
        <div className="form-group">
          <label htmlFor="resource-name">Resource Name</label>
          <input
            id="resource-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resource name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="resource-categories">Categories</label>
          <input
            id="resource-categories"
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Enter categories"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="resource-descriptions">Descriptions</label>
          <textarea
            id="resource-descriptions"
            value={descriptions}
            onChange={(e) => setDescriptions(e.target.value)}
            placeholder="Enter descriptions"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="resource-link">Resource Link</label>
          <input
            id="resource-link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter resource link"
            required
          />
        </div>

        <button type="submit">Add Resource</button>
      </form>

      <div className="resources-list">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <div key={resource.id} className="resource-item">
              <h3>{resource.name}</h3>
              <p>
                <strong>Category:</strong> {resource.categories}
              </p>
              <p className="description">{resource.descriptions}</p>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                Open Resource 🔗
              </a>
              <button onClick={() => handleDelete(resource.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No resources created yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminResourceForm;
