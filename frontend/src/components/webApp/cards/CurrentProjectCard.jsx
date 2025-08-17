import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";
import { useProjectStore } from "../../../store/projectStore";
import useSubtaskStore from "../../../store/subtaskStore";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const CurrentProjectCard = ({ loading = false }) => {
  // Get current project using the store method
  const getCurrentProject = useProjectStore((state) => state.getCurrentProject);
  const projects = useProjectStore((state) => state.projects);
  const storeLoading = useProjectStore((state) => state.loading);

  // Get subtask store data and methods
  const getSubtasksByProjectId = useSubtaskStore(
    (state) => state.getSubtasksByProjectId
  );
  const getProjectSubtasks = useSubtaskStore(
    (state) => state.getProjectSubtasks
  );
  const subtaskLoading = useSubtaskStore((state) => state.loading);

  // Get the current project based on your business logic
  const project = getCurrentProject();
  const isLoading = loading || storeLoading || subtaskLoading;

  // Get subtasks for the current project
  const projectSubtasks = useMemo(() => {
    if (!project) return [];
    return getSubtasksByProjectId(project._id || project.id);
  }, [project, getSubtasksByProjectId]);

  // Calculate task statistics from subtasks
  const taskStats = useMemo(() => {
    if (!projectSubtasks.length) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
      };
    }

    const completed = projectSubtasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pending = projectSubtasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const inProgress = projectSubtasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    return {
      totalTasks: projectSubtasks.length,
      completedTasks: completed,
      pendingTasks: pending,
      inProgressTasks: inProgress,
    };
  }, [projectSubtasks]);

  // Calculate progress percentage based on completed tasks
  const calculatedProgress = useMemo(() => {
    if (taskStats.totalTasks === 0) return 0;
    return Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100);
  }, [taskStats]);

  // Load subtasks when project changes
  useEffect(() => {
    if (project && (!projectSubtasks.length || projectSubtasks.length === 0)) {
      getProjectSubtasks(project._id || project.id).catch(console.error);
    }
  }, [project, getProjectSubtasks, projectSubtasks.length]);

  const isReady = !isLoading && project;

  // If no projects exist, show a different state
  if (!isLoading && (!projects || projects.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Project
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Link
            to="/projects/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Create First Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Current Project</h3>
        {isReady ? (
          <Link
            to={`/projects`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View all →
          </Link>
        ) : (
          <SkeletonBox className="w-20 h-4" />
        )}
      </div>

      {/* Project Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        {/* Project Name */}
        <div className="mb-4">
          {isReady ? (
            <>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">
                {project.name}
              </h4>
              <p className="text-sm text-gray-600">
                Due {formatDate(project.dueDate || project.deadline)}
              </p>
            </>
          ) : (
            <>
              <SkeletonBox className="w-1/2 h-6 mb-2" />
              <SkeletonBox className="w-1/3 h-4" />
            </>
          )}
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            {isReady ? (
              <span className="text-sm font-semibold text-blue-600">
                {calculatedProgress}%
              </span>
            ) : (
              <SkeletonBox className="w-10 h-4" />
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isReady
                  ? "bg-gradient-to-r from-blue-500 to-purple-500"
                  : "bg-gray-300 animate-pulse"
              }`}
              style={{ width: isReady ? `${calculatedProgress}%` : "100%" }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          {isReady ? (
            <Link
              to={`/project/${project._id || project.id}/details`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              View Project
            </Link>
          ) : (
            <SkeletonBox className="w-28 h-10" />
          )}
        </div>
      </div>

      {/* Quick Stats - Now using calculated stats from subtasks */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          {
            label: "Total Tasks",
            value: taskStats.totalTasks,
            color: "text-gray-900",
          },
          {
            label: "Completed",
            value: taskStats.completedTasks,
            color: "text-green-600",
          },
          {
            label: "Pending",
            value: taskStats.pendingTasks,
            color: "text-yellow-600",
          },
        ].map((stat, idx) => (
          <div key={idx} className="text-center">
            {isReady ? (
              <>
                <div className={`text-lg font-semibold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </>
            ) : (
              <>
                <SkeletonBox className="w-10 h-5 mx-auto mb-1" />
                <SkeletonBox className="w-16 h-3 mx-auto" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Tags */}
      {isReady && project.tags && project.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentProjectCard;
