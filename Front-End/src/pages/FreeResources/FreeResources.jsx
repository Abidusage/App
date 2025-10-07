import React, { useEffect, useState } from "react";
import api from "../../api";
import "../FreeResources/FreeResources.css";

const FreeResources = () => {
  const [resources, setResources] = useState([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get("/api/resources/");
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    // <div className="resources-container">
      <div className="editorial-wrapper">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <div key={resource.id} className="editorial-block">
              <h2 className="editorial-title">{resource.name}</h2>
              <hr className="editorial-divider" />
              <p className="editorial-description">{resource.descriptions}</p>
              <p className="editorial-author">
                🖋️ <strong>{resource.author?.username}</strong>
              </p>
              <a
                href={
                  resource.link.startsWith("http")
                    ? resource.link
                    : `https://${resource.link}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link"
              >
                Read Resource ↗
              </a>
            </div>
          ))
        ) : (
          <p>No resources available at the moment. Please check back later.</p>
        )}
      </div>
    // </div>
  );
};

export default FreeResources;
