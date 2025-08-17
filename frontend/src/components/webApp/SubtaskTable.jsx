import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaClock,
  FaPlay,
  FaPlus,
  FaRobot,
  FaSync,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useSubtaskStore from "../../store/subtaskStore";

const SubtaskTable = ({ projectId, projectName, onSubtaskChange }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubtask, setNewSubtask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  const {
    subtasks,
    subtaskStats,
    loading,
    error,
    generatingSubtasks,
    getProjectSubtasks,
    updateSubtask,
    deleteSubtask,
    createSubtask,
    generateAISubtasks,
    getSubtasksByProjectId,
    setError,
  } = useSubtaskStore();

  // Get subtasks for this specific project
  const projectSubtasks = getSubtasksByProjectId(projectId);

  useEffect(() => {
    if (projectId) {
      console.log("Fetching subtasks for project:", projectId);
      getProjectSubtasks(projectId).catch((err) => {
        console.error("Failed to fetch project subtasks:", err);
      });
    }
  }, [projectId, getProjectSubtasks]);

  // Debug logging
  useEffect(() => {
    console.log("Project ID:", projectId);
    console.log("All subtasks in store:", subtasks);
    console.log("Filtered project subtasks:", projectSubtasks);
    console.log("Subtask stats:", subtaskStats);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [projectId, subtasks, projectSubtasks, subtaskStats, loading, error]);

  // Helper function to trigger parent refresh
  const triggerParentRefresh = async () => {
    if (onSubtaskChange && typeof onSubtaskChange === "function") {
      try {
        await onSubtaskChange();
      } catch (error) {
        console.error("Error in parent refresh callback:", error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateSubtask(id, { status: newStatus });
      toast.success("Subtask status updated successfully");

      // Refresh the subtasks list
      await getProjectSubtasks(projectId);

      // Trigger parent component refresh
      await triggerParentRefresh();
    } catch (error) {
      toast.error("Failed to update subtask status");
      console.error("Status update error:", error);
    }
  };

  const handleEdit = (subtask) => {
    setIsEditing(subtask.id || subtask._id);
    setEditFormData({
      title: subtask.title,
      description: subtask.description,
      dueDate: subtask.dueDate?.split("T")[0] || "",
      priority: subtask.priority,
      status: subtask.status,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateSubtask(isEditing, editFormData);
      toast.success("Subtask updated successfully");
      setIsEditing(null);
      setEditFormData({});

      // Refresh the subtasks list
      await getProjectSubtasks(projectId);

      // Trigger parent component refresh
      await triggerParentRefresh();
    } catch (error) {
      console.error("Failed to update subtask:", error);
      toast.error("Failed to update subtask");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditFormData({});
  };

  const handleDelete = async (subtaskId) => {
    if (window.confirm("Are you sure you want to delete this subtask?")) {
      try {
        await deleteSubtask(subtaskId);
        toast.success("Subtask deleted successfully");

        // Refresh the subtasks list
        await getProjectSubtasks(projectId);

        // Trigger parent component refresh
        await triggerParentRefresh();
      } catch (error) {
        console.error("Failed to delete subtask:", error);
        toast.error("Failed to delete subtask");
      }
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.title.trim()) {
      toast.error("Please enter a title for the subtask");
      return;
    }

    try {
      await createSubtask(projectId, newSubtask);
      toast.success("Subtask created successfully");
      setNewSubtask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      });
      setShowAddForm(false);

      // Refresh the subtasks list
      await getProjectSubtasks(projectId);

      // Trigger parent component refresh
      await triggerParentRefresh();
    } catch (error) {
      console.error("Failed to create subtask:", error);
      toast.error("Failed to create subtask");
    }
  };

  const handleGenerateAI = async () => {
    try {
      await generateAISubtasks(projectId, false);
      toast.success("AI subtasks generated successfully");

      // Refresh the subtasks list
      await getProjectSubtasks(projectId);

      // Trigger parent component refresh
      await triggerParentRefresh();
    } catch (error) {
      console.error("Failed to generate AI subtasks:", error);
      toast.error("Failed to generate AI subtasks");
    }
  };

  const handleRegenerateAI = async () => {
    if (
      window.confirm(
        "This will replace all existing AI-generated subtasks. Continue?"
      )
    ) {
      try {
        await generateAISubtasks(projectId, true);
        toast.success("AI subtasks regenerated successfully");

        // Refresh the subtasks list
        await getProjectSubtasks(projectId);

        // Trigger parent component refresh
        await triggerParentRefresh();
      } catch (error) {
        console.error("Failed to regenerate AI subtasks:", error);
        toast.error("Failed to regenerate AI subtasks");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheck className="text-green-600" />;
      case "In Progress":
        return <FaPlay className="text-blue-600" />;
      default:
        return <FaClock className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedTasks = projectSubtasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const totalTasks = projectSubtasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Error display
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Error loading subtasks:</h3>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              getProjectSubtasks(projectId);
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {projectName} - Subtasks
          </h2>
          <p className="text-gray-600 mt-1">
            {completedTasks ?? 0} of {totalTasks ?? 0} tasks completed (
            {progressPercentage ?? 0}%)
          </p>
          {subtaskStats && typeof subtaskStats.progress === "number" && (
            <p className="text-sm text-gray-500">
              API Progress: {subtaskStats.progress}% • Total:{" "}
              {subtaskStats.count}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {projectSubtasks.some((task) => task.aiGenerated) && (
            <button
              onClick={handleRegenerateAI}
              disabled={generatingSubtasks}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {generatingSubtasks ? (
                <FaSync className="animate-spin" />
              ) : (
                <FaRobot />
              )}
              {generatingSubtasks ? "Regenerating..." : "Regenerate AI"}
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Add Subtask
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Add Subtask Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Subtask</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Subtask title *"
              value={newSubtask.title}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, title: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              value={newSubtask.dueDate}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, dueDate: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newSubtask.priority}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, priority: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <select
              value={newSubtask.status}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, status: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <textarea
            placeholder="Description (optional)"
            value={newSubtask.description}
            onChange={(e) =>
              setNewSubtask({ ...newSubtask, description: e.target.value })
            }
            className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddSubtask}
              disabled={!newSubtask.title.trim() || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Subtask"}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(loading || generatingSubtasks) && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            {generatingSubtasks
              ? "AI is generating subtasks..."
              : "Loading subtasks..."}
          </span>
        </div>
      )}

      {/* Subtasks Table */}
      {projectSubtasks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border-b font-semibold text-gray-700">
                  Task
                </th>
                <th className="text-left p-3 border-b font-semibold text-gray-700">
                  Status
                </th>
                {/* <th className="text-left p-3 border-b font-semibold text-gray-700">
                  Due Date
                </th> */}
                <th className="text-left p-3 border-b font-semibold text-gray-700">
                  Hours
                </th>
                <th className="text-left p-3 border-b font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projectSubtasks.map((subtask) => (
                <tr
                  key={subtask.id || subtask._id}
                  className="hover:bg-gray-50"
                >
                  <td className="p-3 border-b">
                    {isEditing === (subtask.id || subtask._id) ? (
                      <div>
                        <input
                          type="text"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={editFormData.description}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              description: e.target.value,
                            })
                          }
                          className="w-full mt-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {subtask.title}
                          {subtask.aiGenerated && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              AI
                            </span>
                          )}
                          {subtask.isOverdue && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Overdue
                            </span>
                          )}
                          {subtask.priority && (
                            <span
                              className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                                subtask.priority
                              )}`}
                            >
                              {subtask.priority}
                            </span>
                          )}
                        </div>
                        {subtask.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {subtask.description}
                          </div>
                        )}
                        {subtask.tags && subtask.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {subtask.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-b">
                    {isEditing === (subtask.id || subtask._id) ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          })
                        }
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(subtask.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            subtask.status
                          )}`}
                        >
                          {subtask.status}
                        </span>
                      </div>
                    )}
                  </td>
                  {/* <td className="p-3 border-b">
                    {isEditing === (subtask.id || subtask._id) ? (
                      <input
                        type="date"
                        value={editFormData.dueDate}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            dueDate: e.target.value,
                          })
                        }
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">
                        {subtask.dueDate
                          ? new Date(subtask.dueDate).toLocaleDateString()
                          : "No date set"}
                      </span>
                    )}
                  </td> */}
                  <td className="p-3 border-b">
                    <div className="text-sm text-gray-600">
                      <div>Est: {subtask.estimatedHours || 0}h</div>
                      <div>Act: {subtask.actualHours || 0}h</div>
                    </div>
                  </td>
                  <td className="p-3 border-b">
                    {isEditing === (subtask.id || subtask._id) ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Save changes"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-600 hover:text-gray-800"
                          title="Cancel editing"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(subtask)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Edit subtask"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(subtask.id || subtask._id)
                          }
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete subtask"
                        >
                          <FaTrash />
                        </button>
                        {subtask.status !== "Completed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(
                                subtask.id || subtask._id,
                                "Completed"
                              )
                            }
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Mark as completed"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {projectSubtasks.length === 0 && !loading && !generatingSubtasks && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            No subtasks found for this project
          </div>
          <button
            onClick={handleGenerateAI}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaRobot className="inline mr-2" />
            Generate AI Subtasks
          </button>
        </div>
      )}
    </div>
  );
};

export default SubtaskTable;
