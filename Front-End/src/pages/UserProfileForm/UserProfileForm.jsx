import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import "./UserProfileForm.css";

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    descriptions: "",
    nickname: "",
    phone: "",
    link_upwork: "",
    link_github: "",
    link_linkedin: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get("/api/detailprofile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFormData({
        title: response.data.title || "",
        descriptions: response.data.descriptions || "",
        nickname: response.data.nickname || "",
        phone: response.data.phone || "",
        link_upwork: response.data.link_upwork || "",
        link_github: response.data.link_github || "",
        link_linkedin: response.data.link_linkedin || "",
      });
    } catch (error) {
      setErrorMessage("❌ Failed to load profile.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (profilePhoto) {
      data.append("profile_photo", profilePhoto);
    }

    try {
      await api.put("/api/detailprofile/", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSuccessMessage("✅ Profile updated successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (error) {
      setErrorMessage("❌ Submission error: invalid data.");
    }

    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
    }, 5000);
  };

  return (
    <div className="user-profile-form-container">
      <h2>Edit Profile</h2>

      <div className="toast-wrapper">
        {successMessage && <div className="success-toast">{successMessage}</div>}
        {errorMessage && <div className="error-toast">{errorMessage}</div>}
      </div>

      <form onSubmit={handleSubmit} className="user-profile-form">
        {/* Form fields unchanged */}
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descriptions">Description</label>
          <textarea
            id="descriptions"
            name="descriptions"
            value={formData.descriptions}
            onChange={handleChange}
            placeholder="Enter profile description"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nickname">Nickname</label>
          <input
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="Enter nickname"
            required
          />
        </div>

        

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_upwork">Upwork Link</label>
          <input
            id="link_upwork"
            name="link_upwork"
            value={formData.link_upwork}
            onChange={handleChange}
            placeholder="https://www.upwork.com/..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_github">GitHub Link</label>
          <input
            id="link_github"
            name="link_github"
            value={formData.link_github}
            onChange={handleChange}
            placeholder="https://github.com/..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link_linkedin">LinkedIn Link</label>
          <input
            id="link_linkedin"
            name="link_linkedin"
            value={formData.link_linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile_photo">Profile Photo</label>
          <input
            id="profile_photo"
            type="file"
            onChange={handleProfilePhotoChange}
          />
        </div>

        <button type="submit">Save</button>
        <a href="/dashboard" className="canceler">Cancel</a>
      </form>
    </div>
  );
};

export default UserProfileForm;
