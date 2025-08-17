import React, { useState } from "react";

const UserAvatar = ({ user, size = "w-8 h-8", className = "" }) => {
    const [imageError, setImageError] = useState(false);

    // Get user avatar from multiple possible fields
    const getAvatarUrl = () => {
        if (!user) return null;

        return (
            user.avatar?.url ||
            user.profilePicture ||
            user.profileImage ||
            user.picture ||
            user.photo ||
            null
        );
    };

    // Get user initials for fallback
    const getUserInitials = () => {
        if (!user) return "U";

        const name =
            user.name ||
            user.username ||
            `${user.firstname || user.firstName || ""} ${user.lastname || user.lastName || ""}`.trim() ||
            user.email;

        if (!name) return "U";

        // If it's an email, use the part before @
        if (name.includes("@")) {
            const emailName = name.split("@")[0];
            return emailName.slice(0, 2).toUpperCase();
        }

        // Get initials from name
        const nameParts = name.split(" ");
        if (nameParts.length >= 2) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }

        return name.slice(0, 2).toUpperCase();
    };

    const avatarUrl = getAvatarUrl();
    const initials = getUserInitials();

    // If we have an avatar URL and no error, show the image
    if (avatarUrl && !imageError) {
        return (
            <img
                src={avatarUrl}
                alt="User Avatar"
                className={`${size} rounded-full object-cover ${className}`}
                onError={() => setImageError(true)}
                loading="lazy"
            />
        );
    }

    // Fallback to initials
    return (
        <div
            className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm ${className}`}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;