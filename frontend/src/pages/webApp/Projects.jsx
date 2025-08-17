// src/pages/webApp/Projects.jsx - Updated with pagination
import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import PageHeader from "../../components/webApp/PageHeader";
import SearchAndFilters from "../../components/webApp/SearchAndFilters";
import ProjectGrid from "../../components/webApp/ProjectGrid";
import ProjectModal from "../../components/webApp/modals/ProjectModal";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Toast from "../../components/ui/Toast";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Pagination from "../../components/ui/Pagination";
import useProjectSearch from "../../hooks/useProjectSearch";
import { formatDate } from "../../utils/dateUtils";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const [initialLoading, setInitialLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Store hooks
  const { user } = useAuthStore();
  const {
    projects,
    loading: projectLoading,
    error: projectError,
    pagination,
    fetchProjects,
    goToPage,
    setPageSize,
    resetStore,
  } = useProjectStore();

  // Search hook - pass pagination info
  const {
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredProjects,
    isSearching,
    clearSearch,
    hasActiveFilters,
  } = useProjectSearch(projects);

  // Initialize data
  useEffect(() => {
    const initializeProjects = async () => {
      try {
        resetStore();
        await fetchProjects(1, true, false); // Start with page 1
      } catch (error) {
        console.error("Failed to initialize projects:", error);
      } finally {
        setInitialLoading(false);
        setHasInitialized(true);
      }
    };

    initializeProjects();
  }, [fetchProjects, resetStore]);

  // Event handlers
  const handleRetryProjects = async () => {
    setInitialLoading(true);
    setHasInitialized(false);
    try {
      await fetchProjects(1, true, false);
    } finally {
      setInitialLoading(false);
      setHasInitialized(true);
    }
  };

  const handleProjectCreated = async (newProject) => {
    setToast({
      type: "success",
      message: `Project "${newProject.name}" created successfully!`,
    });
    setIsModalOpen(false);
    // Refresh current page after creating project
    await fetchProjects(pagination.page, false, false);
  };

  const handleProjectError = (error) => {
    setToast({
      type: "error",
      message: error.message || "Failed to create project",
    });
  };

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  // Pagination handlers
  const handlePageChange = async (page) => {
    try {
      await goToPage(page);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to load page",
      });
    }
  };

  const handlePageSizeChange = async (newPageSize) => {
    try {
      await setPageSize(newPageSize);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to update page size",
      });
    }
  };

  // Clear search when changing pages
  const handlePageChangeWithClearSearch = async (page) => {
    if (searchQuery || hasActiveFilters) {
      clearSearch();
    }
    await handlePageChange(page);
  };

  // Ensure arrays are properly formatted
  const projectsArray = Array.isArray(projects) ? projects : [];
  
  // Use filtered projects if search is active, otherwise use all projects
  const displayProjects = (searchQuery || hasActiveFilters) 
    ? (Array.isArray(filteredProjects) ? filteredProjects : [])
    : projectsArray;

  // Determine loading state
  const isLoading =
    initialLoading ||
    !hasInitialized ||
    (projectLoading && projectsArray.length === 0);

  // Only show error if we're not loading and we have an error
  const shouldShowError = projectError && !isLoading;

  // Show pagination only when not searching/filtering and we have data
  const showPagination = !isSearching && !hasActiveFilters && !searchQuery && 
                        hasInitialized && !isLoading && pagination.pages > 1;

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6">
        <PageHeader
          title="My Projects"
          subtitle={`Manage and track all your projects in one place ${pagination.total ? `(${pagination.total} total)` : ''}`}
          onCreateProject={handleCreateProject}
          showMobileMenu={false}
        />
      </div>

      {/* Error Message */}
      {shouldShowError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ErrorMessage message={projectError} onRetry={handleRetryProjects} />
        </div>
      )}

      {/* Search and Filters */}
      {!isLoading && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            clearSearch={clearSearch}
            isSearching={isSearching}
            resultsCount={displayProjects.length}
            showViewToggle={true}
            totalResults={searchQuery || hasActiveFilters ? displayProjects.length : pagination.total}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            <ProjectGrid
              projects={displayProjects}
              viewMode={viewMode}
              formatDate={formatDate}
              isLoading={isLoading}
              isSearching={isSearching}
              searchQuery={searchQuery}
              hasActiveFilters={hasActiveFilters}
              onCreateProject={handleCreateProject}
              hasInitialized={hasInitialized}
            />
            
            {/* Pagination */}
            {showPagination && (
              <div className="border-t border-gray-200 pt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChangeWithClearSearch}
                  onPageSizeChange={handlePageSizeChange}
                  loading={projectLoading}
                  showPageSize={true}
                  showInfo={true}
                  className="px-4"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals and Notifications */}
      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProjectCreated}
          onError={handleProjectError}
        />
      )}

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

export default Projects;