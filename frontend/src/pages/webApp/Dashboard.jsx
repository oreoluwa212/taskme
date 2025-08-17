// src/pages/webApp/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaClock } from "react-icons/fa";
import {
  HiOutlineFolder,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import useSubtaskStore from "../../store/subtaskStore";
import { formatDate } from "../../utils/dateUtils";
import HomeCard from "../../components/webApp/cards/HomeCard";
import PageHeader from "../../components/webApp/PageHeader";
import ProjectModal from "../../components/webApp/modals/ProjectModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Toast from "../../components/ui/Toast";
import CurrentProjectCard from "../../components/webApp/cards/CurrentProjectCard";
import { icon1, icon2, icon3, icon4 } from "../../../public";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Store hooks
  const {
    user,
    loading: userLoading,
    error: userError,
    getProfile,
  } = useAuthStore();

  const {
    projects,
    loading: projectLoading,
    error: projectError,
    stats,
    statsLoading,
    statsError,
    fetchProjects,
    fetchProjectStats,
    getProjectStats,
    resetStore,
    clearError,
    clearStatsError,
  } = useProjectStore();

  const {
    getRecentSubtasks,
    getOverdueSubtasks,
    getWeeklyProductivity,
    recentSubtasks,
    overdueSubtasks,
    loading: subtaskLoading,
    error: subtaskError,
  } = useSubtaskStore();

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState({
    currentProject: null,
    todaysTask: null,
    todaysTasks: [],
    upcomingDeadlines: [],
    recentProjects: [],
    overdueTasks: [],
    workloadAnalysis: null,
    subtaskStats: null,
  });

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Update dashboard data when projects or subtasks change
  useEffect(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      updateDashboardData();
    }
  }, [projects, recentSubtasks, overdueSubtasks]);

  const initializeData = async () => {
    try {
      resetStore();

      if (!user) {
        await getProfile();
      }

      // Fetch all data in parallel
      const dataPromises = [
        fetchProjects().catch((err) => console.error("Projects fetch error:", err)),
        fetchProjectStats().catch((err) => console.error("Project stats error:", err)),
        getRecentSubtasks({ limit: 20 }).catch((err) => console.error("Recent subtasks error:", err)),
        getOverdueSubtasks().catch((err) => console.error("Overdue subtasks error:", err)),
        getWeeklyProductivity().catch((err) => console.error("Weekly productivity error:", err)),
      ];

      await Promise.allSettled(dataPromises);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
      setToast({
        type: "error",
        message: "Failed to load dashboard data",
      });
    }
  };

  const updateDashboardData = () => {
    const projectsArray = Array.isArray(projects) ? projects : [];
    const recentSubtasksArray = Array.isArray(recentSubtasks) ? recentSubtasks : [];
    const overdueSubtasksArray = Array.isArray(overdueSubtasks) ? overdueSubtasks : [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get current project
    const currentProj =
      projectsArray.find((p) => p.status === "In Progress") ||
      projectsArray.find((p) => p.progress > 0 && p.progress < 100) ||
      projectsArray.find((p) => p.status === "Pending" && p.priority === "High") ||
      projectsArray[0];

    // Get today's tasks
    const todaysTasks = recentSubtasksArray
      .filter((subtask) => {
        if (!subtask.dueDate) return false;
        const dueDate = new Date(subtask.dueDate);
        const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        return taskDate.getTime() === today.getTime() && subtask.status !== "Completed";
      })
      .slice(0, 5);

    // Get primary today's task
    const todaysTask = todaysTasks.length > 0
      ? {
          id: todaysTasks[0]._id,
          name: todaysTasks[0].title,
          description: todaysTasks[0].description,
          project: todaysTasks[0].projectId?.name || "Unknown Project",
          priority: todaysTasks[0].priority || "Medium",
          status: todaysTasks[0].status,
          dueTime: todaysTasks[0].dueTime || "5:00 PM",
          projectId: todaysTasks[0].projectId?._id,
          estimatedHours: todaysTasks[0].estimatedHours || 0,
          category: todaysTasks[0].projectId?.category,
          tags: todaysTasks[0].tags || [],
        }
      : null;

    // Get upcoming deadlines
    const upcomingSubtasks = recentSubtasksArray
      .filter((subtask) => {
        if (!subtask.dueDate || subtask.status === "Completed") return false;
        const dueDate = new Date(subtask.dueDate);
        const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 7;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const upcomingDeadlines = upcomingSubtasks.map((subtask) => ({
      project: subtask.projectId?.name || "Unknown Project",
      taskName: subtask.title,
      taskDescription: subtask.description,
      dueDate: subtask.dueDate,
      dueTime: subtask.dueTime || "5:00 PM",
      priority: subtask.priority || "Medium",
      taskId: subtask._id,
      projectId: subtask.projectId?._id,
      category: subtask.projectId?.category,
      progress: calculateSubtaskProgress(subtask),
      estimatedHours: subtask.estimatedHours || 0,
    }));

    // Get overdue tasks
    const overdueTasksFromSubtasks = overdueSubtasksArray.map((subtask) => ({
      id: subtask._id,
      name: subtask.projectId?.name || "Unknown Project",
      taskName: subtask.title,
      taskDescription: subtask.description,
      dueDate: subtask.dueDate,
      dueTime: subtask.dueTime || "5:00 PM",
      priority: subtask.priority || "Medium",
      category: subtask.projectId?.category,
      progress: calculateSubtaskProgress(subtask),
      type: "subtask",
      projectId: subtask.projectId?._id,
    }));

    const overdueProjects = projectsArray
      .filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false;
        return new Date(p.dueDate) < now;
      })
      .map((project) => ({
        id: project._id,
        name: project.name,
        dueDate: project.dueDate,
        dueTime: project.dueTime || "5:00 PM",
        priority: project.priority || "Medium",
        category: project.category,
        progress: project.progress || 0,
        type: "project",
        projectId: project._id,
      }));

    const overdueTasks = [...overdueProjects, ...overdueTasksFromSubtasks].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );

    // Get recent projects
    const recentProjects = projectsArray
      .filter((p) => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        const daysDiff = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= 30;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Calculate workload analysis
    const workloadAnalysis = {
      totalEstimatedHours: recentSubtasksArray.reduce((sum, s) => sum + (s.estimatedHours || 0), 0),
      totalActualHours: recentSubtasksArray.reduce((sum, s) => sum + (s.actualHours || 0), 0),
      averageTimeline:
        projectsArray.length > 0
          ? Math.round(projectsArray.reduce((sum, p) => sum + (p.timeline || 0), 0) / projectsArray.length)
          : 0,
      totalSubtasks: recentSubtasksArray.length,
      completedSubtasks: recentSubtasksArray.filter((s) => s.status === "Completed").length,
      pendingSubtasks: recentSubtasksArray.filter((s) => s.status === "Pending").length,
      inProgressSubtasks: recentSubtasksArray.filter((s) => s.status === "In Progress").length,
      todaysTaskCount: todaysTasks.length,
      overdueTaskCount: overdueTasksFromSubtasks.length,
    };

    // Calculate subtask statistics
    const subtaskStats = {
      byPriority: {
        high: recentSubtasksArray.filter((s) => s.priority === "High").length,
        medium: recentSubtasksArray.filter((s) => s.priority === "Medium").length,
        low: recentSubtasksArray.filter((s) => s.priority === "Low").length,
      },
      byStatus: {
        completed: recentSubtasksArray.filter((s) => s.status === "Completed").length,
        inProgress: recentSubtasksArray.filter((s) => s.status === "In Progress").length,
        pending: recentSubtasksArray.filter((s) => s.status === "Pending").length,
      },
      averageEstimatedHours:
        recentSubtasksArray.length > 0
          ? (
              recentSubtasksArray.reduce((sum, s) => sum + (s.estimatedHours || 0), 0) /
              recentSubtasksArray.length
            ).toFixed(1)
          : 0,
    };

    setDashboardData({
      currentProject: currentProj
        ? {
            id: currentProj._id || currentProj.id,
            name: currentProj.name,
            description: currentProj.description,
            progress: currentProj.progress || 0,
            deadline: currentProj.dueDate,
            dueTime: currentProj.dueTime,
            status: currentProj.status,
            priority: currentProj.priority,
            category: currentProj.category,
            tags: currentProj.tags,
            timeline: currentProj.timeline,
            subtaskStats: currentProj.subtaskStats,
          }
        : null,
      todaysTask,
      todaysTasks,
      upcomingDeadlines,
      recentProjects,
      overdueTasks,
      workloadAnalysis,
      subtaskStats,
    });
  };

  const calculateSubtaskProgress = (subtask) => {
    if (subtask.status === "Completed") return 100;
    if (subtask.status === "In Progress") return 50;
    return 0;
  };

  const handleRetryProfile = async () => {
    try {
      await getProfile();
    } catch (error) {
      setToast({ type: "error", message: "Failed to load profile" });
    }
  };

  const handleRetryProjects = async () => {
    try {
      await Promise.all([fetchProjects(), fetchProjectStats()]);
    } catch (error) {
      setToast({ type: "error", message: "Failed to load projects" });
    }
  };

  const handleProjectCreated = async (newProject) => {
    setToast({
      type: "success",
      message: `Project "${newProject.name}" created successfully!`,
    });

    setIsModalOpen(false);
    await Promise.all([fetchProjects(), fetchProjectStats()]);
  };

  const handleProjectError = (error) => {
    setToast({
      type: "error",
      message: error.message || "Failed to create project",
    });
  };

  const handleCreateProject = () => setIsModalOpen(true);
  const handleClearErrors = () => {
    clearError();
    clearStatsError();
  };

  // Navigation handlers
  const handleProjectClick = (projectId) => {
    if (projectId) {
      navigate(`/project/${projectId}/details`);
    }
  };

  // Get safe stats
  const safeStats = React.useMemo(() => {
    if (statsError) {
      return getProjectStats();
    }
    return stats;
  }, [stats, statsError, getProjectStats]);

  if (userLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorMessages
        userError={userError}
        projectError={projectError}
        statsError={statsError}
        subtaskError={subtaskError}
        onRetryProfile={handleRetryProfile}
        onRetryProjects={handleRetryProjects}
        onClearErrors={handleClearErrors}
      />

      <div className="w-full">
        <PageHeader
          title={`Welcome back, ${user?.data?.firstname || user?.firstname || "User"}!`}
          subtitle="Here's what's on your plate today."
          onCreateProject={handleCreateProject}
        />

        <DashboardStatsCards
          stats={safeStats}
          workloadAnalysis={dashboardData.workloadAnalysis}
          subtaskStats={dashboardData.subtaskStats}
          isLoading={statsLoading || subtaskLoading}
        />

        <OverviewContent
          dashboardData={dashboardData}
          onCreateProject={handleCreateProject}
          onProjectClick={handleProjectClick}
          isLoading={projectLoading || subtaskLoading}
        />
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
        onError={handleProjectError}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// Dashboard Loader Component
const DashboardLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4 p-8">
      <LoadingSpinner size={40} />
      <p className="text-gray-600 text-center">Loading your dashboard...</p>
    </div>
  </div>
);

// Error Messages Component
const ErrorMessages = ({
  userError,
  projectError,
  statsError,
  subtaskError,
  onRetryProfile,
  onRetryProjects,
  onClearErrors,
}) => (
  <div className="space-y-4">
    {userError && (
      <ErrorMessage
        message={userError}
        onRetry={onRetryProfile}
        className="mx-4 sm:mx-0"
      />
    )}
    {projectError && (
      <ErrorMessage
        message={projectError}
        onRetry={onRetryProjects}
        className="mx-4 sm:mx-0"
      />
    )}
    {statsError && (
      <ErrorMessage
        message={`Stats error: ${statsError}`}
        onRetry={onRetryProjects}
        onClose={onClearErrors}
        className="mx-4 sm:mx-0"
      />
    )}
    {subtaskError && (
      <ErrorMessage
        message={`Subtask error: ${subtaskError}`}
        onRetry={onRetryProjects}
        onClose={onClearErrors}
        className="mx-4 sm:mx-0"
      />
    )}
  </div>
);

// Dashboard Stats Cards Component
const DashboardStatsCards = ({ stats, workloadAnalysis, subtaskStats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[120px] animate-pulse"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-8 h-6 sm:w-12 sm:h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-16 h-3 sm:w-20 sm:h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <HomeCard
          title="Total Projects"
          value={stats?.total || 0}
          className="text-gray-800"
          icon={icon1}
        />
        <HomeCard
          title="Pending"
          value={stats?.pending || 0}
          className="text-yellow-600"
          icon={icon2}
        />
        <HomeCard
          title="In Progress"
          value={stats?.inProgress || 0}
          className="text-blue-600"
          icon={icon3}
        />
        <HomeCard
          title="Completed"
          value={stats?.completed || 0}
          className="text-green-600"
          icon={icon4}
        />
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent = ({ dashboardData, onCreateProject, onProjectClick, isLoading }) => {
  const { currentProject, todaysTask, todaysTasks, upcomingDeadlines, recentProjects, overdueTasks } = dashboardData;

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentProject && !todaysTask && upcomingDeadlines.length === 0 && recentProjects.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="mb-4">
            <HiOutlineFolder className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active projects</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Get started by creating your first project to see your overview.
          </p>
          <button
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus size={14} />
            Create Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Current Project */}
        {currentProject && (
          <div className="w-full">
            <CurrentProjectCard project={currentProject} />
          </div>
        )}

        {/* Today's Tasks Overview */}
        {todaysTasks && todaysTasks.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-blue-500" />
              All Today's Tasks ({todaysTasks.length})
            </h3>
            <div className="space-y-3">
              {todaysTasks.slice(1, 6).map((task, index) => (
                <div
                  key={task.id || index}
                  onClick={() => onProjectClick(task.projectId)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer gap-3 sm:gap-0"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{task.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{task.project}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 mt-1">
                      <span>Due: {task.dueTime}</span>
                      <span>Est: {task.estimatedHours}h</span>
                      {task.category && <span>{task.category}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                        task.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
              {todaysTasks.length > 6 && (
                <div className="text-center text-sm text-gray-500 py-2">
                  +{todaysTasks.length - 6} more tasks for today
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <HiOutlineExclamationCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <h3 className="text-red-800 font-medium mb-2">
                  ⚠️ {overdueTasks.length} Overdue Item{overdueTasks.length > 1 ? "s" : ""}
                </h3>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id || index}
                      onClick={() => onProjectClick(item.projectId)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded border gap-3 sm:gap-0 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        {item.taskName && (
                          <p className="text-sm text-gray-700 font-medium truncate">
                            Task: {item.taskName}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Due: {formatDate(item.dueDate)} at {item.dueTime || "5:00 PM"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{item.category}</span>
                          <span>{item.priority} Priority</span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {item.type === "subtask" ? "Task" : "Project"}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-sm font-medium text-red-600">
                          {Math.ceil((new Date() - new Date(item.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                        </div>
                        <div className="text-xs text-gray-500">{item.progress || 0}% complete</div>
                      </div>
                    </div>
                  ))}
                  {overdueTasks.length > 3 && (
                    <div className="text-center">
                      <p className="text-sm text-red-600">
                        and {overdueTasks.length - 3} more overdue item{overdueTasks.length - 3 > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Projects Activity */}
        {recentProjects.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiOutlineCheckCircle className="text-blue-500" />
              Recent Activity ({recentProjects.length})
            </h3>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <div
                  key={project._id || index}
                  onClick={() => onProjectClick(project._id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer gap-3 sm:gap-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{project.category}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created: {formatDate(project.createdAt)}</span>
                      {project.timeline && <span>Timeline: {project.timeline} days</span>}
                      {project.subtaskStats && <span>Tasks: {project.subtaskStats.totalSubtasks}</span>}
                      {project.subtaskStats && <span>Est: {project.subtaskStats.totalEstimatedHours}h</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {project.tags &&
                      project.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {project.progress || 0}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
