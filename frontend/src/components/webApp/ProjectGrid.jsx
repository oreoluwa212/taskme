// components/webApp/ProjectGrid.jsx
import React from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineFolder } from "react-icons/hi";
import ProjectDetailCard from "./cards/ProjectDetailCard";
import ProjectDetailCardSkeleton from "./cards/ProjectDetailCardSkeleton";

const ProjectGrid = ({
  projects,
  viewMode,
  formatDate,
  isLoading,
  isSearching,
  searchQuery,
  hasActiveFilters,
  onCreateProject,
  hasInitialized, // New prop from the updated Projects.jsx
}) => {
  // Debug logging to help identify the issue
  console.log("ProjectGrid render:", {
    isLoading,
    hasInitialized,
    projectsLength: projects?.length || 0,
    isSearching,
    searchQuery,
    hasActiveFilters,
  });

  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : [];

  // Show skeleton cards when loading - this should be the first check
  // Enhanced condition to handle edge cases
  if (isLoading || hasInitialized === false) {
    console.log("Showing skeleton loader");
    return <SkeletonGrid viewMode={viewMode} />;
  }

  // Only check for empty state when NOT loading AND we have initialized
  if (!isLoading && hasInitialized && projectsArray.length === 0) {
    console.log("Showing empty state");
    return (
      <EmptyState
        searchQuery={searchQuery}
        hasActiveFilters={hasActiveFilters}
        onCreateProject={onCreateProject}
        isSearching={isSearching}
      />
    );
  }

  // Show projects
  console.log("Showing projects grid");
  return (
    <div className="w-full">
      {viewMode === "grid" ? (
        <GridView projects={projectsArray} formatDate={formatDate} />
      ) : (
        <ListView projects={projectsArray} formatDate={formatDate} />
      )}
    </div>
  );
};

const SkeletonGrid = ({ viewMode }) => {
  // Create an array of 6 skeleton items
  const skeletonItems = Array(6).fill(null);

  if (viewMode === "grid") {
    return (
      <div className="w-full">
        {/* Desktop Skeleton Grid */}
        <div className="hidden md:block w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
            {skeletonItems.map((_, index) => (
              <ProjectDetailCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Skeleton Grid */}
        <div className="md:hidden w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {skeletonItems.map((_, index) => (
              <ProjectDetailCardSkeleton key={`skeleton-mobile-${index}`} />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    // List view skeletons
    return (
      <div className="space-y-3 w-full">
        {skeletonItems.map((_, index) => (
          <SkeletonListItem key={`skeleton-list-${index}`} />
        ))}
      </div>
    );
  }
};

const SkeletonListItem = () => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg w-full animate-pulse">
    <div className="flex-1 min-w-0">
      <div className="h-5 bg-gray-300 rounded w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <div className="text-right">
        <div className="h-4 bg-gray-300 rounded w-8 mb-1 ml-auto"></div>
        <div className="w-20 bg-gray-200 rounded-full h-2"></div>
      </div>
    </div>
  </div>
);

const GridView = ({ projects, formatDate }) => (
  <>
    {/* Desktop Grid View */}
    <div className="hidden md:block w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
        {projects.map((project) => (
          <ProjectCard
            key={project._id || project.id}
            project={project}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>

    {/* Mobile/Tablet Grid */}
    <div className="md:hidden w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {projects.map((project) => (
          <ProjectCard
            key={project._id || project.id}
            project={project}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  </>
);

const ListView = ({ projects, formatDate }) => (
  <div className="space-y-3 w-full">
    {projects.map((project) => (
      <ProjectListItem
        key={project._id || project.id}
        project={project}
        formatDate={formatDate}
      />
    ))}
  </div>
);

const ProjectCard = ({ project, formatDate }) => (
  <div className="w-full">
    <ProjectDetailCard
      projectId={project._id || project.id}
      projectName={project.name}
      dueDate={formatDate(project.dueDate)}
      dueDays={project.timeline}
      startDate={formatDate(project.startDate)}
      progress={project.progress || 0}
    />
  </div>
);

const ProjectListItem = ({ project, formatDate }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow w-full">
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
      <p className="text-sm text-gray-500">
        Due: {formatDate(project.dueDate)}
      </p>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <ProjectProgress progress={project.progress || 0} />
    </div>
  </div>
);

const ProjectProgress = ({ progress }) => (
  <div className="text-right">
    <div className="text-sm font-medium text-gray-900">{progress}%</div>
    <div className="w-20 bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const EmptyState = ({
  searchQuery,
  hasActiveFilters,
  onCreateProject,
  isSearching,
}) => {
  const isFiltered = searchQuery || hasActiveFilters;

  // Don't show "Create Project" button while searching
  const showCreateButton = !isFiltered && !isSearching;

  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <HiOutlineFolder className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isFiltered ? "No projects match your search" : "No projects yet"}
      </h3>
      <p className="text-gray-500 mb-6">
        {isFiltered
          ? "Try adjusting your search criteria or filters."
          : "Get started by creating your first project."}
      </p>
      {showCreateButton && (
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={14} />
          Create Project
        </button>
      )}
    </div>
  );
};

export default ProjectGrid;
