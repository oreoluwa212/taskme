import React, { useState, useEffect, useRef } from "react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCamera,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
} from "react-icons/hi";
import { useUserStore } from "../../store/userStore";
import useAuthStore from "../../store/authStore"; // Import auth store

const Profile = () => {
  // Zustand stores
  const {
    user,
    loading,
    updating,
    uploading,
    changingPassword,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    deleteAvatar,
    clearError,
  } = useUserStore();

  // Add auth store to sync user data - with safe destructuring
  const authStore = useAuthStore();
  const authUser = authStore?.user;
  const setAuthUser = authStore?.setUser;

  // Local state for editing
  const [editableProfile, setEditableProfile] = useState({});

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [toast, setToast] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const fileInputRef = useRef(null);

  // Initialize profile data when user data loads
  useEffect(() => {
    if (user) {
      setEditableProfile({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "", // Keep email for display, but won't be editable
        phoneNumber: user.phoneNumber || "",
        location: user.location || "",
        timezone: user.timezone || "America/Los_Angeles",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Sync user data between stores when profile updates - with safety check
  useEffect(() => {
    if (user && authUser && typeof setAuthUser === "function") {
      // Update auth store with latest user data from user store
      setAuthUser({
        ...authUser,
        ...user,
        // Preserve any auth-specific data structure
        data: {
          ...authUser.data,
          ...user,
        },
      });
    }
  }, [user, authUser, setAuthUser]);

  // Load user profile on mount
  useEffect(() => {
    if (!user) {
      fetchProfile().catch(() => {
        showToast("error", "Failed to load profile");
      });
    }
  }, [user, fetchProfile]);

  // Clear store errors and show toast
  useEffect(() => {
    if (error) {
      showToast("error", error);
      clearError();
    }
  }, [error, clearError]);

  // Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordData.newPassword));
  }, [passwordData.newPassword]);

  // Handle profile update - exclude email from updates
  const handleProfileUpdate = async () => {
    try {
      // Create a copy of editableProfile without the email field
      const { email, ...profileWithoutEmail } = editableProfile;
      await updateProfile(profileWithoutEmail);
      setIsEditing(false);
      showToast("success", "Profile updated successfully!");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset to original user data
    setEditableProfile({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      location: user.location || "",
      timezone: user.timezone || "America/Los_Angeles",
      bio: user.bio || "",
    });
    setIsEditing(false);
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "New passwords don't match!");
      return;
    }
    if (passwordStrength < 3) {
      showToast("error", "Password is too weak!");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("success", "Password changed successfully!");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Handle avatar upload with auth store sync
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select an image file");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "File size must be less than 5MB");
      return;
    }

    try {
      const result = await uploadAvatar(file);

      // Immediately update auth store with new avatar - with safety check
      if (authUser && result && typeof setAuthUser === "function") {
        const updatedUser = {
          ...authUser,
          avatar: result.avatar || user.avatar,
          data: {
            ...authUser.data,
            avatar: result.avatar || user.avatar,
          },
        };
        setAuthUser(updatedUser);
      }

      showToast("success", "Avatar uploaded successfully!");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Handle avatar deletion with auth store sync
  const handleAvatarDelete = async () => {
    try {
      await deleteAvatar();

      // Immediately update auth store to remove avatar - with safety check
      if (authUser && typeof setAuthUser === "function") {
        const updatedUser = {
          ...authUser,
          avatar: null,
          data: {
            ...authUser.data,
            avatar: null,
          },
        };
        setAuthUser(updatedUser);
      }

      showToast("success", "Avatar removed successfully!");
    } catch (error) {
      showToast("error", error.message);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstname || "";
    const lastName = user.lastname || "";
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";
  };

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Very Weak";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  // Show loading if user data is still being fetched
  if (loading && !user) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <HiOutlineCheck size={20} />
            ) : (
              <HiOutlineX size={20} />
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile & Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account information and security
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getUserInitials()}
                  </div>
                )}

                {/* Avatar action buttons */}
                <div className="absolute -bottom-1 -right-1 flex gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                    title="Upload new avatar"
                  >
                    {uploading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <HiOutlineCamera size={14} />
                    )}
                  </button>

                  {user?.avatar?.url && (
                    <button
                      onClick={handleAvatarDelete}
                      disabled={uploading}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 ml-1"
                      title="Remove avatar"
                    >
                      <HiOutlineTrash size={14} />
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <HiOutlineUser size={18} />
                Profile Information
              </div>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "security"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck size={18} />
                Security
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <div className="flex gap-2">
                  {isEditing && (
                    <button
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() =>
                      isEditing ? handleProfileUpdate() : setIsEditing(true)
                    }
                    disabled={updating}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isEditing
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {updating
                      ? "Saving..."
                      : isEditing
                      ? "Save Changes"
                      : "Edit Profile"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <HiOutlineUser
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={editableProfile.firstname || ""}
                      onChange={(e) =>
                        setEditableProfile((prev) => ({
                          ...prev,
                          firstname: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <HiOutlineUser
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={editableProfile.lastname || ""}
                      onChange={(e) =>
                        setEditableProfile((prev) => ({
                          ...prev,
                          lastname: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                    <span className="text-xs text-gray-500 ml-2">
                      (Read-only)
                    </span>
                  </label>
                  <div className="relative">
                    <HiOutlineMail
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      value={editableProfile.email || ""}
                      disabled={true} // Always disabled - email cannot be edited
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support if you need to
                    update your email address.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <HiOutlinePhone
                      className="absolute left-3 top-3 text-gray-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      value={editableProfile.phoneNumber || ""}
                      onChange={(e) =>
                        setEditableProfile((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editableProfile.location || ""}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={editableProfile.timezone || "America/Los_Angeles"}
                    onChange={(e) =>
                      setEditableProfile((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editableProfile.bio || ""}
                  onChange={(e) =>
                    setEditableProfile((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showPassword.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.current ? (
                          <HiOutlineEyeOff size={20} />
                        ) : (
                          <HiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showPassword.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.new ? (
                          <HiOutlineEyeOff size={20} />
                        ) : (
                          <HiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <HiOutlineLockClosed
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? (
                          <HiOutlineEyeOff size={20} />
                        ) : (
                          <HiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !==
                        passwordData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <HiOutlineExclamationCircle size={16} />
                          Passwords don't match
                        </p>
                      )}
                  </div>

                  <button
                    onClick={handlePasswordChange}
                    disabled={
                      changingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword !==
                        passwordData.confirmPassword ||
                      passwordStrength < 3
                    }
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {changingPassword
                      ? "Changing Password..."
                      : "Change Password"}
                  </button>
                </div>
              </div>

              {/* Account Information Display */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Account ID:</span>
                    <p className="font-mono text-gray-700 mt-1">{user?.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Email Status:</span>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user?.emailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user?.emailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Member Since:</span>
                    <p className="text-gray-700 mt-1">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <p className="text-gray-700 mt-1">
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
