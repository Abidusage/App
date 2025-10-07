import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import "./EditResource.css";
import "../EditResource/EditResource.css";

const EditResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchResource();
  }, []);

  const fetchResource = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get(`/api/resources/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resource = response.data;
      setName(resource.name);
      setCategories(resource.categories);
      setDescriptions(resource.descriptions);
      setLink(resource.link);
    } catch (error) {
      console.error("Error fetching resource:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const resourceData = { name, categories, descriptions, link };

    try {
      await api.put(`/api/resources/update/${id}/`, resourceData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <div className="edit-resource-form-container">
      <h2>Edit Resource</h2>
      <form onSubmit={handleUpdate} className="edit-resource-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Resource Name"
          required
        />
        <input
          type="text"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="Categories"
          required
        />
        <textarea
          value={descriptions}
          onChange={(e) => setDescriptions(e.target.value)}
          placeholder="Descriptions"
          required
        ></textarea>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Resource Link"
          required
        />
        <button type="submit">Update Resource</button>
      </form>
    </div>
  );
};

export default EditResource;
