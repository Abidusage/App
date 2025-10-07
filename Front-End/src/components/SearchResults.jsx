import React from "react";
import { Link } from "react-router-dom";

const SearchResults = ({ results }) => {
  if (!results) return null;

  const { groupedUsers, groupedResources } = results;

  return (
    <div className="search-results-container">
      <h3>🔍 Résultats de recherche</h3>

      {/* Utilisateurs groupés */}
      {groupedUsers && typeof groupedUsers === "object" && (
        Object.entries(groupedUsers).map(([groupName, groupUsers]) => (
          <div key={groupName} className="results-users">
            <h4>👥 {groupName} <span className="badge">{groupUsers.length}</span></h4>
            <ul>
              {groupUsers.map((user) => (
                <li key={user.id}>
                  <Link to={`/profile/${user.id}`}>{user.username}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {/* Ressources groupées */}
      {groupedResources && typeof groupedResources === "object" && (
        Object.entries(groupedResources).map(([category, resources]) => (
          <div key={category} className="results-resources">
            <h4>
              📚 {category} <span className="badge">{resources.length}</span>
            </h4>
            <ul>
              {resources.map((resource) => (
                <li key={resource.id}>
                  <Link to={`/freeresources#${resource.id}`}>
                    {resource.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {/* Aucun résultat */}
      {!groupedUsers && !groupedResources && (
        <p>🚫 Aucun résultat trouvé.</p>
      )}
    </div>
  );
};

export default SearchResults;
