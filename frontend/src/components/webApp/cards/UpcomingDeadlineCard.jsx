import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";
import useSubtaskStore from "../../../store/subtaskStore";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const UpcomingDeadlineCard = ({ loading = false }) => {
  // Get subtask store data and methods
  const subtasks = useSubtaskStore((state) => state.subtasks);
  const loadDashboardSubtasks = useSubtaskStore(
    (state) => state.loadDashboardSubtasks
  );
  const subtaskLoading = useSubtaskStore((state) => state.loading);

  const isLoading = loading || subtaskLoading;

  // Find the most urgent upcoming deadline
  const upcomingDeadline = useMemo(() => {
    if (!subtasks.length) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter for incomplete tasks with due dates
    const incompleteTasks = subtasks.filter(
      (task) => task.status !== "Completed" && task.dueDate
    );

    if (!incompleteTasks.length) return null;

    // Sort by due date (earliest first)
    const sortedTasks = incompleteTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });

    // Get the most urgent one
    const urgentTask = sortedTasks[0];

    return {
      taskId: urgentTask._id,
      taskName: urgentTask.title,
      project:
        urgentTask.projectId?.name ||
        urgentTask.projectId?.description ||
        "Unknown Project",
      dueDate: urgentTask.dueDate,
      dueTime: urgentTask.dueTime || "End of day",
      priority: urgentTask.priority,
      description: urgentTask.description,
      estimatedHours: urgentTask.estimatedHours,
      projectId: urgentTask.projectId?._id || urgentTask.projectId,
    };
  }, [subtasks]);

  // Load subtasks on mount if needed
  useEffect(() => {
    if (subtasks.length === 0) {
      loadDashboardSubtasks().catch(console.error);
    }
  }, [subtasks.length, loadDashboardSubtasks]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Calculate days until deadline
  const daysUntilDeadline = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(dueDate);
    deadlineDate.setHours(0, 0, 0, 0);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysLeft = upcomingDeadline
    ? daysUntilDeadline(upcomingDeadline.dueDate)
    : 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Deadline
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <SkeletonBox className="w-20 h-4 mb-2" />
              <SkeletonBox className="w-32 h-5" />
            </div>
          ))}
          <SkeletonBox className="w-full h-10 rounded-lg" />
        </div>
      </div>
    );
  }

  // Show no upcoming deadlines state
  if (!upcomingDeadline) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Deadline
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">No upcoming deadlines</p>
          <p className="text-sm text-gray-400">
            All tasks are completed or have no due dates
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Deadline
      </h3>

      <div className="space-y-4">
        {/* Project */}
        <div>
          <span className="text-sm text-gray-500">Project</span>
          <p className="text-lg font-medium text-gray-900">
            {upcomingDeadline.project}
          </p>
        </div>

        {/* Task Name */}
        <div>
          <span className="text-sm text-gray-500">Task</span>
          <p className="text-lg font-medium text-gray-900">
            {upcomingDeadline.taskName}
          </p>
          {upcomingDeadline.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {upcomingDeadline.description}
            </p>
          )}
        </div>

        {/* Due Date */}
        <div>
          <span className="text-sm text-gray-500">Due Date</span>
          <p className="text-lg font-medium text-gray-900">
            {formatDate(upcomingDeadline.dueDate)}
          </p>
        </div>

        {/* Estimated Hours (if available) */}
        {upcomingDeadline.estimatedHours > 0 && (
          <div>
            <span className="text-sm text-gray-500">Estimated Time</span>
            <p className="text-lg font-medium text-gray-900">
              {upcomingDeadline.estimatedHours}{" "}
              {upcomingDeadline.estimatedHours === 1 ? "hour" : "hours"}
            </p>
          </div>
        )}

        {/* Priority */}
        <div>
          <span className="text-sm text-gray-500">Priority</span>
          <div className="mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                upcomingDeadline.priority
              )}`}
            >
              {upcomingDeadline.priority}
            </span>
          </div>
        </div>

        {/* Days Left Indicator */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time remaining</span>
            <span
              className={`text-sm font-medium ${
                daysLeft <= 0
                  ? "text-red-600"
                  : daysLeft <= 1
                  ? "text-red-500"
                  : daysLeft <= 3
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {daysLeft === 0
                ? "Due today"
                : daysLeft === 1
                ? "1 day left"
                : daysLeft < 0
                ? `${Math.abs(daysLeft)} days overdue`
                : `${daysLeft} days left`}
            </span>
          </div>

          {/* Progress bar for urgency */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                daysLeft <= 0
                  ? "bg-red-500"
                  : daysLeft <= 1
                  ? "bg-red-400"
                  : daysLeft <= 3
                  ? "bg-yellow-400"
                  : "bg-green-400"
              }`}
              style={{
                width:
                  daysLeft <= 0
                    ? "100%"
                    : daysLeft <= 7
                    ? `${100 - daysLeft * 10}%`
                    : "30%",
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <Link
            to={`/project/${upcomingDeadline.projectId}/details`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
          >
            View Project →
          </Link>

          {/* Quick action for high priority or overdue tasks */}
          {(daysLeft <= 1 || upcomingDeadline.priority === "High") && (
            <Link
              to={`/subtask/${upcomingDeadline.taskId}`}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors w-full justify-center"
            >
              🚨 Urgent: Work on this task
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlineCard;
