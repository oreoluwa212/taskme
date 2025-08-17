import React, { useState, useEffect } from "react";
import { useProjectStore } from "../../store/projectStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchBy, setSearchBy] = useState("name");
  const { projects, fetchProjects, loading } = useProjectStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!projects.length) {
      fetchProjects().catch((err) => {
        toast.error("Failed to fetch projects");
        console.error("Error fetching projects:", err);
      });
    }

    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
      setSearchBy(location.state.searchBy || "name");
    }
  }, [projects.length, fetchProjects, location.state]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects([]);
      return;
    }

    const filtered = projects.filter((project) => {
      const term = searchTerm.toLowerCase();

      switch (searchBy) {
        case "name":
          return project.name?.toLowerCase().includes(term);
        case "status":
          return project.status?.toLowerCase().includes(term);
        case "priority":
          return project.priority?.toLowerCase().includes(term);
        case "description":
          return project.description?.toLowerCase().includes(term);
        default:
          return project.name?.toLowerCase().includes(term);
      }
    });

    setFilteredProjects(filtered);
  }, [searchTerm, searchBy, projects]);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Projects
          </h1>
          <p className="text-gray-600">
            Find your projects quickly and efficiently
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:w-48">
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Search by Name</option>
                <option value="status">Search by Status</option>
                <option value="priority">Search by Priority</option>
                <option value="description">Search by Description</option>
              </select>
            </div>
          </div>

          {searchTerm && (
            <div className="text-sm text-gray-600">
              Found {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && searchTerm && (
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div
                  key={project._id || project.id}
                  onClick={() => handleProjectClick(project._id || project.id)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        {project.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Progress:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700 font-medium">
                          {project.progress || 0}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <p className="font-medium">
                        {formatDate(project.startDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>
                      <p className="font-medium">
                        {formatDate(project.dueDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeline:</span>
                      <p className="font-medium">{project.timeline} days</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search term or search criteria
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !searchTerm && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start searching
            </h3>
            <p className="text-gray-600">
              Enter a search term above to find your projects
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
