import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "./FreeDev.css";

const FreeDev = () => {
  const [users, setUsers] = useState([]);
  const [userLocation, setUserLocation] = useState("Localisation inconnue");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/list_users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village;
          const country = data.address.country;
          setUserLocation(`${city}, ${country}`);
        } catch (error) {
          console.error("Reverse geocoding error :", error);
          setUserLocation("Location unavailable");
        }
      },
      (error) => {
        console.error("Geolocation error :", error);
        setUserLocation("Location access denied");
      }
    );
  }, []);

  return (
    <section className="freedev-section">
      <div className="freedev-grid">
        {users.map((user) => {
          const profile = user.profile;
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          const photoUrl = profile?.profile_photo
            ? `${backendUrl}/${profile.profile_photo}`
            : "/default.jpg";

          return (
            <div key={user.id} className="freedev-card">
              <img
                src={photoUrl}
                alt={`${user.username} profile`}
                className="freedev-avatar"
              />

              <h2 className="freedev-name location-line">
                <i className="fas fa-map-marker-alt"></i> {userLocation}
              </h2>

              <h2 className="freedev-name">
                {user.username} <span>({profile?.nickname || "no nickname"}) </span>
              </h2>

              <h3 className="freedev-title">
                {profile?.title || "Unknown position"}
              </h3>

              <p className="freedev-description">
                {profile?.descriptions?.length > 180
                  ? profile.descriptions.slice(0, 180) + "..."
                  : profile?.descriptions || "No description"}
              </p>

              <div className="freedev-links">
                {profile?.link_github && (
                  <a href={profile.link_github} target="_blank" rel="noreferrer">
                    <i className="fab fa-github"></i>
                  </a>
                )}
                {profile?.link_linkedin && (
                  <a href={profile.link_linkedin} target="_blank" rel="noreferrer">
                    <i className="fab fa-linkedin"></i>
                  </a>
                )}
                {profile?.link_upwork && (
                  <a href={profile.link_upwork} target="_blank" rel="noreferrer">
                    <i className="fab fa-upwork"></i>
                  </a>
                )}
              </div>

              <Link to={`/user/${user.id}`} className="freedev-button">
                View profile
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FreeDev;
