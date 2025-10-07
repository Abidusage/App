import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "./ProfileDetail.css";

const ProfileDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  const defaultPhoto = `${process.env.PUBLIC_URL}/default.jpg`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/user/${id}/`);
        if (response.data && response.data.profile) {
          setUser(response.data);
        } else {
          setError("User profile is incomplete or missing.");
        }
      } catch (err) {
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user || !user.profile)
    return <div className="error-message">Profile not found.</div>;

  const {
    username,
    profile: {
      profile_photo,
      title,
      descriptions,
      link_upwork,
      link_github,
      link_linkedin,
      phone,
      nickname,
    },
  } = user;

  const photoURL = profile_photo
    ? `${BASE_URL}/${profile_photo}`
    : defaultPhoto;

  const renderLink = (label, url) => (
    <p>
      <strong>{label}:</strong>{" "}
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ) : (
        "Not provided"
      )}
    </p>
  );

  return (
    <div className="profile-detail-container">
      <div className="profile-header">
        <img
          src={photoURL}
          alt={`Photo of ${username}`}
          className="profile-picture"
        />
        <div>
          <h2>{username}</h2>
          {nickname && <p className="nickname">@{nickname}</p>}
        </div>
      </div>

      <h3 className="job-title">{title || "Unspecified position"}</h3>

      <div className="profile-section profile-body">
        <p className="description">
          {descriptions || "This profile has no description yet."}
        </p>
      </div>

      <div className="profile-section profile-info">
        <p>
          <strong>State:</strong> {state || "Not provided"}
        </p>
        <p>
          <strong>Phone:</strong> {phone || "Not provided"}
        </p>
        {renderLink("Upwork", link_upwork)}
        {renderLink("GitHub", link_github)}
        {renderLink("LinkedIn", link_linkedin)}
      </div>
    </div>
  );
};

export default ProfileDetail;
