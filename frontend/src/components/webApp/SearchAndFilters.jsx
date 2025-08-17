// components/webApp/SearchAndFilters.jsx
import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { HiOutlineX, HiOutlineViewGrid, HiOutlineFolder } from "react-icons/hi";
import LoadingSpinner from "../ui/LoadingSpinner";

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  viewMode,
  setViewMode,
  clearSearch,
  isSearching,
  resultsCount,
  showViewToggle = false,
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v !== "createdAt" && v !== "desc"
  );

  return (
    <div className="w-full">
      {/* Search and Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Results Count and Loading */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {resultsCount} project{resultsCount !== 1 ? "s" : ""} found
          </span>
          {isSearching && <LoadingSpinner size={16} />}
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <FilterToggle
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {showViewToggle && (
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          )}

          {(searchQuery || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-4">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </div>
      )}
    </div>
  );
};

const SearchInput = ({ searchQuery, setSearchQuery }) => (
  <div className="relative min-w-0 flex-1 sm:flex-initial sm:w-64">
    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder="Search projects..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery("")}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <HiOutlineX className="h-4 w-4" />
      </button>
    )}
  </div>
);

const FilterToggle = ({ showFilters, setShowFilters, hasActiveFilters }) => (
  <button
    onClick={() => setShowFilters(!showFilters)}
    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors relative ${
      showFilters || hasActiveFilters
        ? "bg-blue-50 border-blue-300 text-blue-700"
        : "border-gray-300 text-gray-700 hover:bg-gray-50"
    }`}
  >
    <FaFilter className="h-4 w-4" />
    Filters
    {hasActiveFilters && (
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
    )}
  </button>
);

const ViewModeToggle = ({ viewMode, setViewMode }) => (
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
    <button
      onClick={() => setViewMode("grid")}
      className={`p-2 transition-colors ${
        viewMode === "grid"
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      title="Grid View"
    >
      <HiOutlineViewGrid className="h-4 w-4" />
    </button>
    <div className="w-px h-6 bg-gray-300"></div>
    <button
      onClick={() => setViewMode("list")}
      className={`p-2 transition-colors ${
        viewMode === "list"
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      title="List View"
    >
      <HiOutlineFolder className="h-4 w-4" />
    </button>
  </div>
);

const FilterPanel = ({ filters, setFilters }) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">Filter Options</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { value: "", label: "All Status" },
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" },
          ]}
        />

        <FilterInput
          label="Min Progress"
          type="number"
          min="0"
          max="100"
          value={filters.progressMin}
          onChange={(value) => updateFilter("progressMin", value)}
          placeholder="0%"
        />

        <FilterInput
          label="Max Progress"
          type="number"
          min="0"
          max="100"
          value={filters.progressMax}
          onChange={(value) => updateFilter("progressMax", value)}
          placeholder="100%"
        />

        <FilterInput
          label="Due From"
          type="date"
          value={filters.dueDateFrom}
          onChange={(value) => updateFilter("dueDateFrom", value)}
        />

        <FilterInput
          label="Due To"
          type="date"
          value={filters.dueDateTo}
          onChange={(value) => updateFilter("dueDateTo", value)}
        />

        <FilterSelect
          label="Sort By"
          value={filters.sortBy}
          onChange={(value) => updateFilter("sortBy", value)}
          options={[
            { value: "createdAt", label: "Created Date" },
            { value: "name", label: "Name" },
            { value: "dueDate", label: "Due Date" },
            { value: "progress", label: "Progress" },
          ]}
        />
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  ...props
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
      placeholder={placeholder}
      {...props}
    />
  </div>
);

export default SearchAndFilters;
