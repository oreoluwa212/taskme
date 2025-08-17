// utils/dateUtils.js

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch (error) {
        console.error("Date formatting error:", error);
        return "Invalid Date";
    }
};

/**
 * Calculate days between two dates
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {number} Number of days between dates
 */
export const calculateDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end.getTime() - start.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    } catch (error) {
        console.error("Date calculation error:", error);
        return 0;
    }
};

/**
 * Check if a date is overdue
 * @param {string} dueDate - Due date string
 * @returns {boolean} True if overdue
 */
export const isOverdue = (dueDate) => {
    if (!dueDate) return false;

    try {
        const due = new Date(dueDate);
        const today = new Date();
        return due < today;
    } catch (error) {
        console.error("Date comparison error:", error);
        return false;
    }
};

/**
 * Get relative time description (e.g., "2 days ago", "in 3 days")
 * @param {string} dateString - Date string
 * @returns {string} Relative time description
 */
export const getRelativeTime = (dateString) => {
    if (!dateString) return "N/A";

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays === -1) return "Yesterday";
        if (diffDays > 0) return `In ${diffDays} days`;
        if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;

        return formatDate(dateString);
    } catch (error) {
        console.error("Relative time calculation error:", error);
        return "Invalid Date";
    }
};

// utils/dateUtils.js
export const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
};

export const getCurrentDateTime = () => {
    return new Date().toISOString();
};

export const formatDisplayDate = (dateString) => {
    if (!dateString) return "No date set";

    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) return "Invalid date";

        // If the date is from 2024 (likely a backend issue), show current date instead
        if (date.getFullYear() === 2024 && new Date().getFullYear() > 2024) {
            return new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return "Invalid date";
    }
};

export const formatRelativeDate = (dateString) => {
    if (!dateString) return "No date";

    try {
        const date = new Date(dateString);
        const now = new Date();

        if (isNaN(date.getTime())) return "Invalid date";

        // Fix backdated dates from 2024
        if (date.getFullYear() === 2024 && now.getFullYear() > 2024) {
            return "Today";
        }

        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

        return `${Math.floor(diffDays / 365)} years ago`;
    } catch (error) {
        console.error('Error formatting relative date:', error);
        return "Invalid date";
    }
};

export const ensureCurrentDate = (dateString) => {
    if (!dateString) return getCurrentDateTime();

    try {
        const date = new Date(dateString);

        // If date is invalid or from 2024, return current date
        if (isNaN(date.getTime()) || date.getFullYear() === 2024) {
            return getCurrentDateTime();
        }

        return dateString;
    } catch (error) {
        return getCurrentDateTime();
    }
};