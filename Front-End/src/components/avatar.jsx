import React from "react";

const Avatar = ({ photoPath, alt = "Photo de profil", className = "" }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const photoUrl = photoPath
    ? `${backendUrl}/${photoPath}`
    : "/default.jpg"; 

  return <img src={photoUrl} alt={alt} className={className} />;
};

export default Avatar;
