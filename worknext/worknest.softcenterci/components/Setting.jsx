import { useRef, useState } from "react";
import { useProfile } from "./ProfileContext";
import { Camera, Eye, EyeOff, User, Bell, Mail, Smartphone, CheckCircle2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoleSettings } from "./RoleSettings";

const NOTIFICATIONS_STORAGE_KEY = "worknest_notification_prefs";
const defaultNotifications = { emailAlerts: true, pushNotifications: true, taskUpdates: true, weeklySummary: false };

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, setProfile } = useProfile();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [image, setImage] = useState(profile.image);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(profile.fullName);
  const location = useLocation();
  const role = location.state?.role || localStorage.getItem("userRole") || "superAdmin";
  const currentRole = getRoleSettings(role) || { role: "User", settings: [], notifications: [] };

  const [notifications, setNotifications] = useState(() => {
    const roleDefaults = {};
    (currentRole.notifications || []).forEach((n) => {
      roleDefaults[n.key] = n.defaultValue ?? true;
    });
    const merged = { ...defaultNotifications, ...roleDefaults };
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) return { ...merged, ...JSON.parse(stored) };
      return merged;
    } catch {
      return merged;
    }
  });
  const [savedNotifications, setSavedNotifications] = useState(notifications);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [selectValues, setSelectValues] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotMethod, setForgotMethod] = useState(null);
  const [forgotContact, setForgotContact] = useState("");
  const [forgotStep, setForgotStep] = useState("method");
  const [otpValue, setOtpValue] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [otpError, setOtpError] = useState("");

  const hasUnsavedChanges = JSON.stringify(notifications) !== JSON.stringify(savedNotifications);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setJustSaved(false);
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
        setSavedNotifications(notifications);
        setJustSaved(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSaving(false);
        setTimeout(() => setJustSaved(false), 2000);
      }
    }, 500);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
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

  const Toggle = ({ checked, onChange }) => (
    <button type="button" onClick={onChange} className={`relative w-11 h-6 rounded-full transition duration-300 ${checked ? "bg-[#016472]" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${checked ? "translate-x-5" : "translate-x-0"}`}></span>
    </button>
  );

  const NotificationRow = ({ icon: Icon, title, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#e6fbfc] text-[#016472] flex items-center justify-center">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{desc}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5fcfd] p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-[#000304]">{currentRole.role} Settings</h1>
        <p className="text-gray-500 mt-1">Manage your {currentRole.role} account.</p>

        <div className="flex justify-center">
          <div className="w-full max-w-[500px] bg-white rounded-2xl border border-gray-200 shadow-sm mt-6 overflow-hidden">
            <div className="flex gap-6 border-b border-gray-200 px-6">
                <button className={`relative h-12 px-2 text-[15px] font-semibold duration-200 ${activeTab === "profile" ? "text-[#016472] border-b-2 border-[#016472]" : "text-gray-500 hover:text-[#016472]"}`} onClick={() => setActiveTab("profile")}>Profile</button>
                <button className={`relative h-12 px-2 text-[15px] font-semibold duration-200 ${activeTab === "security" ? "text-[#016472] border-b-2 border-[#016472]" : "text-gray-500 hover:text-[#016472]"}`} onClick={() => setActiveTab("security")}>Security</button>
                <button className={`relative h-12 px-2 text-[15px] font-semibold duration-200 ${activeTab === "notifications" ? "text-[#016472] border-b-2 border-[#016472]" : "text-gray-500 hover:text-[#016472]"}`} onClick={() => setActiveTab("notifications")}>Notifications</button>
                </div>

            {activeTab === "profile" && (
              <div className="p-6">
                <div className="flex justify-center">
                  <div className="relative">
                    {image ? (
                      <img src={image} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4" />
                    ) : (
                      <div className="w-32 h-32 rounded-full border flex items-center justify-center">
                        <User size={60} className="text-gray-400" />
                      </div>
                    )}
                    <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#016472] text-white flex items-center justify-center" onClick={() => fileInputRef.current.click()}>
                      <Camera size={18} />
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImage} className="hidden" />
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Update Name" className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={profile.email || ""} readOnly className="w-full h-12 border border-gray-300 rounded-xl px-4 bg-gray-100 text-gray-600 cursor-not-allowed" />
                  </div>

                  {currentRole.settings.map((item, index) => {
                    const Icon = item.icon;
                    const isClickable = !!item.path || !!item.tab;
                    const handleClick = () => {
                      if (item.comingSoon) return;
                      if (item.path) navigate(item.path);
                      if (item.tab) setActiveTab(item.tab);
                    };
                    return (
                      <div key={index} onClick={isClickable ? handleClick : undefined} className={`border rounded-xl p-4 flex flex-col gap-3 transition-all duration-200 ${isClickable ? "cursor-pointer hover:border-[#016472] hover:bg-[#e6fbfc]" : ""} ${item.comingSoon ? "opacity-60 cursor-not-allowed" : ""}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Icon className="text-[#016472]" size={20} />
                            <span>{item.title}</span>
                          </div>
                          {item.comingSoon && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Coming Soon</span>}
                        </div>
                        {item.input && <input type="text" placeholder={item.placeholder} className="border rounded-lg p-2" />}
                        {item.select && (
                          <select className="border rounded-lg p-2 text-gray-700" value={selectValues[index] || ""} onChange={(e) => setSelectValues((prev) => ({ ...prev, [index]: e.target.value }))}>
                            <option value="" disabled>{item.placeholder}</option>
                            {item.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                          </select>
                        )}
                        {item.select && item.dependentInput && selectValues[index] && (
                          <input type="text" placeholder={item.dependentPlaceholders?.[selectValues[index]] || "Enter details"} className="border rounded-lg p-2" />
                        )}
                      </div>
                    );
                  })}

                  <button
                    className="w-full mt-5 h-12 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] duration-300"
                    onClick={() => {
                      setProfile({ ...profile, fullName, image });
                      if (role === "companyAdmin") navigate("/dashboard-company");
                      else if (role === "projectLeader") navigate("/dashboard-leader");
                      else if (role === "teamMember") navigate("/dashboard-team-member");
                      else if (role === "client") navigate("/client-dashboard");
                      else navigate("/dashboard-admin");
                    }}
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input type={showCurrent ? "text" : "password"} placeholder="Current Password" className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-[#016472]" />
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setShowCurrent(!showCurrent)}>
                        {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input type={showNew ? "text" : "password"} placeholder="New Password" className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-[#016472]" />
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setShowNew(!showNew)}>
                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} placeholder="Confirm Password" className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-[#016472]" />
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2" onClick={() => setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right -mt-2">
                    <button type="button" onClick={() => { setShowForgotPassword(true); resetForgotFlow(); }} className="text-sm text-[#016472] font-medium hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  <button className="w-full mt-5 h-12 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] duration-300">Change Password</button>

                  {showForgotPassword && (
                    <div className="mt-6 border border-gray-200 rounded-xl p-5 bg-[#f5fcfd]">

                      {forgotStep === "method" && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Reset Password</h4>
                          <p className="text-xs text-gray-500 mb-4">Choose how you'd like to receive your code.</p>
                          <div className="flex gap-3 mb-4">
                            <button type="button" onClick={() => { setForgotMethod("email"); setForgotContact(""); }} className={`flex-1 h-11 rounded-xl border font-medium text-sm duration-200 ${forgotMethod === "email" ? "border-[#016472] bg-[#e6fbfc] text-[#016472]" : "border-gray-300 text-gray-600 hover:border-[#016472]"}`}>Email</button>
                            <button type="button" onClick={() => { setForgotMethod("phone"); setForgotContact(""); }} className={`flex-1 h-11 rounded-xl border font-medium text-sm duration-200 ${forgotMethod === "phone" ? "border-[#016472] bg-[#e6fbfc] text-[#016472]" : "border-gray-300 text-gray-600 hover:border-[#016472]"}`}>Phone Number</button>
                          </div>
                          {forgotMethod && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">{forgotMethod === "email" ? "Email Address" : "Phone Number"}</label>
                              <input type={forgotMethod === "email" ? "email" : "tel"} value={forgotContact} onChange={(e) => setForgotContact(e.target.value)} placeholder={forgotMethod === "email" ? "Enter your email" : "Enter your phone number"} className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]" />
                            </div>
                          )}
                          <div className="flex gap-3">
                            <button type="button" onClick={() => setShowForgotPassword(false)} className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 duration-300">Cancel</button>
                            <button type="button" disabled={!forgotMethod || !forgotContact.trim()} onClick={() => setForgotStep("otp")} className="flex-1 h-11 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Send Code</button>
                          </div>
                        </>
                      )}

                      {forgotStep === "otp" && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Enter Verification Code</h4>
                          <p className="text-xs text-gray-500 mb-4">
                            We sent a 6-digit code to your {forgotMethod === "email" ? "email" : "phone"} at{" "}
                            <span className="font-medium text-gray-700">{forgotContact}</span>
                          </p>
                          <input
                            type="text"
                            maxLength={6}
                            value={otpValue}
                            onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                            placeholder="Enter 6-digit code"
                            className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472] text-center tracking-[0.5em] font-semibold"
                          />
                          {otpError && <p className="text-xs text-red-500 mt-2">{otpError}</p>}
                          <button type="button" onClick={() => { setForgotStep("method"); setOtpValue(""); setOtpError(""); }} className="text-xs text-[#016472] font-medium hover:underline mt-2">
                            Didn't get a code? Resend
                          </button>
                          <div className="flex gap-3 mt-4">
                            <button type="button" onClick={() => setForgotStep("method")} className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 duration-300">Back</button>
                            <button
                              type="button"
                              disabled={otpValue.length !== 6}
                              onClick={() => {
                                if (otpValue.length === 6) setForgotStep("newPassword");
                                else setOtpError("Please enter the 6-digit code.");
                              }}
                              className="flex-1 h-11 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Verify Code
                            </button>
                          </div>
                        </>
                      )}

                      {forgotStep === "newPassword" && (
                        <>
                          <h4 className="text-sm font-semibold text-gray-800 mb-1">Set New Password</h4>
                          <p className="text-xs text-gray-500 mb-4">Your identity has been verified. Enter a new password.</p>
                          <div className="space-y-3">
                            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New Password" className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]" />
                            <input type="password" value={confirmNewPass} onChange={(e) => setConfirmNewPass(e.target.value)} placeholder="Confirm New Password" className="w-full h-12 border border-gray-300 rounded-xl px-4 outline-none focus:ring-2 focus:ring-[#016472]" />
                            {confirmNewPass && newPass !== confirmNewPass && (
                              <p className="text-xs text-red-500">Passwords do not match.</p>
                            )}
                          </div>
                          <div className="flex gap-3 mt-4">
                            <button type="button" onClick={() => setForgotStep("otp")} className="flex-1 h-11 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 duration-300">Back</button>
                            <button
                              type="button"
                              disabled={!newPass || newPass !== confirmNewPass}
                              onClick={() => setForgotStep("done")}
                              className="flex-1 h-11 rounded-xl bg-[#016472] text-white font-semibold hover:bg-[#014954] duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reset Password
                            </button>
                          </div>
                        </>
                      )}

                      {forgotStep === "done" && (
                        <div className="text-center py-2">
                          <CheckCircle2 size={32} className="text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-800">Password reset successfully!</p>
                          <p className="text-xs text-gray-500 mt-1">You can now log in with your new password.</p>
                          <button type="button" onClick={() => setShowForgotPassword(false)} className="mt-4 text-sm text-[#016472] font-medium hover:underline">Close</button>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={18} className="text-[#016472]" />
                  <h3 className="text-sm font-semibold text-gray-800">Notification Preferences</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">Choose how you want to be notified about activity.</p>
                <div>
                  <NotificationRow icon={Mail} title="Email Alerts" desc="Get important updates sent to your email" checked={notifications.emailAlerts} onChange={() => toggleNotification("emailAlerts")} />
                  <NotificationRow icon={Smartphone} title="Push Notifications" desc="Receive alerts directly on your device" checked={notifications.pushNotifications} onChange={() => toggleNotification("pushNotifications")} />
                  <NotificationRow icon={Bell} title="Task Updates" desc="Notify me when a task status changes" checked={notifications.taskUpdates} onChange={() => toggleNotification("taskUpdates")} />
                  <NotificationRow icon={Mail} title="Weekly Summary" desc="Get a weekly digest of your activity" checked={notifications.weeklySummary} onChange={() => toggleNotification("weeklySummary")} />
                  {(currentRole.notifications || []).map((item) => (
                    <NotificationRow key={item.key} icon={item.icon} title={item.title} desc={item.desc} checked={notifications[item.key]} onChange={() => toggleNotification(item.key)} />
                  ))}
                </div>
                {hasUnsavedChanges && !justSaved && <p className="text-xs text-amber-600 mt-4">You have unsaved changes.</p>}
                <button onClick={handleSavePreferences} disabled={!hasUnsavedChanges || isSaving} className={`w-full mt-3 h-12 rounded-xl font-semibold duration-300 flex items-center justify-center gap-2 ${justSaved ? "bg-green-600 text-white" : "bg-[#016472] text-white hover:bg-[#014954]"} disabled:opacity-50`}>
                  {isSaving ? "Saving..." : justSaved ? (<><CheckCircle2 size={18} />Preferences Saved</>) : "Save Preferences"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}