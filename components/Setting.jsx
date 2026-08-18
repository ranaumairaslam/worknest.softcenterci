import { useRef, useState, useEffect } from "react";
import { useProfile } from "./ProfileContext";
import {
  Camera,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "./profileService.js";
import { changePassword, forgotPassword } from "./authService.js";

const ROLE_LABELS = {
  superAdmin: "Super Admin",
  companyAdmin: "Company Admin",
  projectLeader: "Project Leader",
  teamMember: "Team Member",
  client: "Client",
};

export default function Settings({ role: propRole }) {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, setProfile } = useProfile();

  // Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Image & upload
  const [image, setImage] = useState(profile.image);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Profile form
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [email, setEmail] = useState(profile.email || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Role
  const role =
    propRole ||
    location.state?.role ||
    localStorage.getItem("userRole") ||
    "superAdmin";

  const roleLabel = ROLE_LABELS[role] || "User";

  // Load profile from backend on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const data = await getProfile();
        if (data) {
          setFullName(data.fullName || data.name || "");
          setEmail(data.email || "");
          setImage(data.avatarUrl || null);
          setProfile({
            ...profile,
            fullName: data.fullName || data.name || "",
            email: data.email || "",
            image: data.avatarUrl || null,
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line
  }, []);

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotMethod, setForgotMethod] = useState(null);
  const [forgotContact, setForgotContact] = useState("");
  const [forgotStep, setForgotStep] = useState("method");
  const [otpValue, setOtpValue] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingForgotRequest, setSendingForgotRequest] = useState(false);

  // Image Upload
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image must be 5MB or smaller");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("❌ Only image files are allowed");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);

    setUploadingImage(true);
    try {
      const updated = await uploadAvatar(file);
      if (updated?.avatarUrl) {
        setImage(updated.avatarUrl);
        setProfile({ ...profile, image: updated.avatarUrl });
      }
      alert("✅ Profile picture uploaded successfully!");
    } catch (err) {
      alert(`❌ Upload failed: ${err.message}`);
      setImage(profile.image);
    } finally {
      setUploadingImage(false);
    }
  };

  // Delete Avatar
  const handleDeleteImage = async () => {
    if (!image) return;
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

    setUploadingImage(true);
    try {
      await deleteAvatar();
      setImage(null);
      setProfile({ ...profile, image: null });
      alert("✅ Profile picture removed successfully!");
    } catch (err) {
      alert(`❌ Failed to remove: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      alert("❌ Full name is required");
      return;
    }

    if (fullName.trim().length < 2) {
      alert("❌ Full name must be at least 2 characters");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateProfile({ fullName: fullName.trim() });
      setProfile({
        ...profile,
        fullName: updated?.fullName || fullName.trim(),
        image,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);

      setTimeout(() => {
        if (role === "companyAdmin") navigate("/dashboard-company");
        else if (role === "projectLeader") navigate("/dashboard-leader");
        else if (role === "teamMember") navigate("/dashboard-team-member");
        else if (role === "client") navigate("/client-dashboard");
        else navigate("/dashboard-admin");
      }, 1000);
    } catch (err) {
      alert(`❌ Update failed: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      alert("❌ Current password is required");
      return;
    }

    if (!newPassword.trim()) {
      alert("❌ New password is required");
      return;
    }

    if (newPassword.length < 6) {
      alert("❌ New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("❌ New password and confirm password do not match");
      return;
    }

    if (currentPassword === newPassword) {
      alert("❌ New password must be different from current password");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      alert("✅ Password changed successfully! Please login again.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setChangingPassword(false);
    }
  };

  // Forgot Password - Send Code
  const handleSendForgotCode = async () => {
    if (!forgotMethod || !forgotContact.trim()) {
      alert("❌ Please select method and enter your contact");
      return;
    }

    setSendingForgotRequest(true);
    try {
      const response = await forgotPassword(forgotContact.trim());
      
      if (response?.success) {
        alert(
          `✅ Account found!\n\n${response.message || 'Verification code will be sent via Firebase.'}\n\nNote: Firebase OTP setup is required to complete this flow.`
        );
        setForgotStep("otp");
      }
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setSendingForgotRequest(false);
    }
  };

  const resetForgotFlow = () => {
    setForgotMethod(null);
    setForgotContact("");
    setForgotStep("method");
    setOtpValue("");
    setNewPass("");
    setConfirmNewPass("");
    setOtpError("");
  };

  return (
    <div className="min-h-screen bg-[#f5fcfd] p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#000304]">{roleLabel} Settings</h1>
        <p className="text-gray-500 mt-1">Manage your {roleLabel} account.</p>

        <div className="flex justify-center">
          <div className="w-full max-w-[500px] bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden">
            {/* Tabs - Only Profile & Security */}
            <div className="flex gap-6 border-b border-gray-200 px-6">
              <button
                className={`relative h-12 px-2 text-[15px] font-semibold duration-200 ${
                  activeTab === "profile"
                    ? "text-[#016472] border-b-2 border-[#016472]"
                    : "text-gray-500 hover:text-[#016472]"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`relative h-12 px-2 text-[15px] font-semibold duration-200 ${
                  activeTab === "security"
                    ? "text-[#016472] border-b-2 border-[#016472]"
                    : "text-gray-500 hover:text-[#016472]"
                }`}
                onClick={() => setActiveTab("security")}
              >
                Security
              </button>
            </div>

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="p-6">
                {loadingProfile ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading profile...
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <div className="relative">
                        {image ? (
                          <img
                            src={image}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#016472]/20"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-gray-50">
                            <User size={60} className="text-gray-400" />
                          </div>
                        )}

                        <button
                          type="button"
                          disabled={uploadingImage}
                          className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#016472] text-white flex items-center justify-center hover:bg-[#014954] disabled:opacity-50"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploadingImage ? (
                            <span className="text-xs">⏳</span>
                          ) : (
                            <Camera size={18} />
                          )}
                        </button>

                        {image && !uploadingImage && (
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="absolute top-1 right-1 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                            title="Remove image"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImage}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {uploadingImage && (
                      <p className="text-center text-xs text-[#016472] mt-2 animate-pulse">
                        Uploading image to Cloudinary...
                      </p>
                    )}

                    <div className="mt-8 space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full h-12 border border-gray-300 rounded-xl px-4 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                      </div>

                      {/* Update Profile Button */}
                      <button
                        type="button"
                        disabled={savingProfile}
                        className={`w-full mt-5 h-12 rounded-xl font-semibold duration-300 flex items-center justify-center gap-2 ${
                          profileSaved
                            ? "bg-green-600 text-white"
                            : "bg-[#016472] text-white hover:bg-[#014954]"
                        } disabled:opacity-50`}
                        onClick={handleUpdateProfile}
                      >
                        {savingProfile ? (
                          "Saving..."
                        ) : profileSaved ? (
                          <>
                            <CheckCircle2 size={18} />
                            Profile Updated!
                          </>
                        ) : (
                          "Update Profile"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="p-6">
                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-[#016472]"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrent(!showCurrent)}
                      >
                        {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-[#016472]"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNew(!showNew)}
                      >
                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-[#016472]"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠️ Passwords do not match
                      </p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right -mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        resetForgotFlow();
                      }}
                      className="text-sm text-[#016472] font-medium hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Change Password Button */}
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="w-full mt-5 h-12 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {changingPassword ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Changing Password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>

                  {/* Forgot Password Flow */}
                  {showForgotPassword && (
                    <div className="mt-6 border border-gray-200 rounded-xl p-5 bg-[#f5fcfd]">
                      {forgotStep === "method" && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Reset Password
                          </h4>
                          <p className="text-xs text-gray-500 mb-4">
                            Choose how you'd like to receive your code.
                          </p>
                          <div className="flex gap-3 mb-4">
                            <button
                              type="button"
                              onClick={() => {
                                setForgotMethod("email");
                                setForgotContact("");
                              }}
                              className={`flex-1 h-11 rounded-xl border font-medium text-sm duration-200 ${
                                forgotMethod === "email"
                                  ? "border-[#016472] bg-[#e6fbfc] text-[#016472]"
                                  : "border-gray-300 text-gray-600 hover:border-[#016472]"
                              }`}
                            >
                              Email
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setForgotMethod("phone");
                                setForgotContact("");
                              }}
                              className={`flex-1 h-11 rounded-xl border font-medium text-sm duration-200 ${
                                forgotMethod === "phone"
                                  ? "border-[#016472] bg-[#e6fbfc] text-[#016472]"
                                  : "border-gray-300 text-gray-600 hover:border-[#016472]"
                              }`}
                            >
                              Phone Number
                            </button>
                          </div>

                          {forgotMethod && (
                            <input
                              type={forgotMethod === "email" ? "email" : "tel"}
                              value={forgotContact}
                              onChange={(e) => setForgotContact(e.target.value)}
                              placeholder={
                                forgotMethod === "email"
                                  ? "Enter your email"
                                  : "Enter your phone number"
                              }
                              className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472] mb-4"
                            />
                          )}

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowForgotPassword(false)}
                              className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={
                                !forgotMethod ||
                                !forgotContact.trim() ||
                                sendingForgotRequest
                              }
                              onClick={handleSendForgotCode}
                              className="flex-1 h-11 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] disabled:opacity-50"
                            >
                              {sendingForgotRequest ? "Checking..." : "Send Code"}
                            </button>
                          </div>
                        </>
                      )}

                      {forgotStep === "otp" && (
                        <>
                          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                            ⚠️ Firebase OTP integration required to complete this flow.
                            Backend is ready — Firebase SDK setup pending.
                          </div>

                          <p className="text-xs text-gray-500 mb-4">
                            Enter 6-digit code sent to {forgotContact}
                          </p>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpValue}
                            onChange={(e) => {
                              setOtpValue(e.target.value.replace(/\D/g, ""));
                              setOtpError("");
                            }}
                            placeholder="Enter 6-digit code"
                            className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472] text-center tracking-[0.5em] font-semibold"
                          />
                          {otpError && (
                            <p className="text-xs text-red-500 mt-2">{otpError}</p>
                          )}
                          <div className="flex gap-3 mt-4">
                            <button
                              type="button"
                              onClick={() => setForgotStep("method")}
                              className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              disabled={otpValue.length !== 6}
                              onClick={() => {
                                alert(
                                  "⚠️ Firebase SDK setup required for OTP verification. Please contact developer."
                                );
                              }}
                              className="flex-1 h-11 rounded-xl bg-[#016472] text-white font-semibold disabled:opacity-50"
                            >
                              Verify Code
                            </button>
                          </div>
                        </>
                      )}

                      {forgotStep === "newPassword" && (
                        <>
                          <div className="space-y-3">
                            <input
                              type="password"
                              value={newPass}
                              onChange={(e) => setNewPass(e.target.value)}
                              placeholder="New Password"
                              className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]"
                            />
                            <input
                              type="password"
                              value={confirmNewPass}
                              onChange={(e) => setConfirmNewPass(e.target.value)}
                              placeholder="Confirm New Password"
                              className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]"
                            />
                            {confirmNewPass && newPass !== confirmNewPass && (
                              <p className="text-xs text-red-500">Passwords do not match.</p>
                            )}
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button
                              type="button"
                              onClick={() => setForgotStep("otp")}
                              className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              disabled={!newPass || newPass !== confirmNewPass}
                              onClick={() => setForgotStep("done")}
                              className="flex-1 h-11 rounded-xl bg-[#016472] text-white font-semibold disabled:opacity-50"
                            >
                              Reset Password
                            </button>
                          </div>
                        </>
                      )}

                      {forgotStep === "done" && (
                        <div className="text-center py-2">
                          <CheckCircle2 size={32} className="text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-800">
                            Password reset successfully!
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(false)}
                            className="mt-4 text-sm text-[#016472] font-medium hover:underline"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}