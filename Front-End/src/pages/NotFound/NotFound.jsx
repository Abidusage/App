import React from "react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>We're sorry, but the page you were looking for doesn't exist.</p>
        <a href="/" className="home-link">
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFound;
