// hooks/useProjectSearch.js
import { useState, useEffect } from "react";
import api from "../services/api";

const useProjectSearch = (projects) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: "",
        progressMin: "",
        progressMax: "",
        dueDateFrom: "",
        dueDateTo: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Search and filter logic
    useEffect(() => {
        const performSearch = async () => {
            const hasActiveFilters = Object.values(filters).some(
                (v) => v && v !== "createdAt" && v !== "desc"
            );

            if (!searchQuery.trim() && !hasActiveFilters) {
                setFilteredProjects(projects);
                return;
            }

            setIsSearching(true);
            try {
                if (searchQuery.trim() || filters.status || filters.progressMin || filters.progressMax) {
                    const results = await searchProjectsAPI(searchQuery, filters);
                    setFilteredProjects(results);
                } else {
                    const sorted = sortProjectsLocally(projects, filters);
                    setFilteredProjects(sorted);
                }
            } catch (error) {
                console.error("Search error:", error);
                const fallbackResults = performLocalSearch(projects, searchQuery);
                setFilteredProjects(fallbackResults);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(performSearch, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery, filters, projects]);

    const searchProjectsAPI = async (query, filters) => {
        const params = new URLSearchParams();
        if (query.trim()) params.append("query", query.trim());

        Object.entries(filters).forEach(([key, value]) => {
            if (value && key !== "sortBy" && key !== "sortOrder") {
                params.append(key, value);
            }
        });

        const response = await api.get(`/projects/search?${params.toString()}`);
        return response.data?.data || response.data || [];
    };

    const sortProjectsLocally = (projects, filters) => {
        const filtered = [...projects];

        return filtered.sort((a, b) => {
            const aVal = getProjectValue(a, filters.sortBy);
            const bVal = getProjectValue(b, filters.sortBy);

            if (filters.sortOrder === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    };

    const getProjectValue = (project, field) => {
        switch (field) {
            case "name":
                return project.name?.toLowerCase() || "";
            case "progress":
                return project.progress || 0;
            case "dueDate":
                return new Date(project.dueDate || 0);
            case "createdAt":
                return new Date(project.createdAt || project.created_at || 0);
            default:
                return 0;
        }
    };

    const performLocalSearch = (projects, query) => {
        return projects.filter(
            (project) =>
                project.name?.toLowerCase().includes(query.toLowerCase()) ||
                project.description?.toLowerCase().includes(query.toLowerCase())
        );
    };

    const clearSearch = () => {
        setSearchQuery("");
        setFilters({
            status: "",
            progressMin: "",
            progressMax: "",
            dueDateFrom: "",
            dueDateTo: "",
            sortBy: "createdAt",
            sortOrder: "desc",
        });
        setShowFilters(false);
    };

    const hasActiveFilters = Object.values(filters).some(
        (v) => v && v !== "createdAt" && v !== "desc"
    );

    return {
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
    };
};

export default useProjectSearch;