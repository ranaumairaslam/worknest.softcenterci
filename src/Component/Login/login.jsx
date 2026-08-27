import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  FolderKanban,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { login, forgotPassword,changePassword } from "../../services/authService.js";


export default function Login() {
  const [formdata, setformdata] = useState({ email: "", password: "" });
  const [error, seterror] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotContact, setForgotContact] = useState("");
  const [forgotStep, setForgotStep] = useState("method");
  const [otpValue, setOtpValue] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingForgotRequest, setSendingForgotRequest] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
    if (error[name]) {
      seterror((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formdata.email.trim()) newErrors.email = "*Email is required";
    if (!formdata.password) newErrors.password = "*Password is required";
    seterror(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await login(formdata.email.trim(), formdata.password);
        navigate(response.dashboardRoute || "/dashboard-company");
      } catch (err) {
        seterror({ form: err.message || "Login failed" });
      } finally {
        setLoading(false);
      }
    }
  };

  // Forgot Password - No Validation, Direct API Call
  const handleSendForgotCode = async () => {
    if (!forgotContact.trim()) {
      alert("❌ Please enter your email address");
      return;
    }

    setSendingForgotRequest(true);
    try {
      const response = await forgotPassword(forgotContact.trim());

      if (response?.success) {
        alert(`✅ Account found!\n\n${response.message || "Check done!"}`);
        setForgotStep("otp");
      }
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setSendingForgotRequest(false);
    }
  };

  const resetForgotFlow = () => {
    setForgotContact("");
    setForgotStep("method");
    setOtpValue("");
    setNewPass("");
    setConfirmNewPass("");
    setOtpError("");
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#000304]">
      <div className="pointer-events-none absolute -left-24 -top-24 z-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#016472]/10 blur-[120px]" />

      <div
        className="pointer-events-none absolute right-16 top-16 z-0 h-40 w-40 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[200px] w-full opacity-70"
        viewBox="0 0 1600 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M0 120 Q 400 60 800 120 T 1600 120" stroke="#22d3ee" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M0 150 Q 400 90 800 150 T 1600 150" stroke="#22d3ee" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M0 180 Q 400 120 800 180 T 1600 180" stroke="#22d3ee" strokeOpacity="0.15" strokeWidth="1.5" />
      </svg>

      {/* LEFT SIDE */}
      <div className="relative z-10 hidden w-1/2 flex-col justify-start overflow-hidden px-16 pt-14 pl-40 lg:flex">
        <div className="relative z-10 mb-4 flex items-center gap-3">
          <img src="/Softcenteric-logo.png" alt="Worknest Logo" className="h-[58px] w-[58px] object-contain" />
          <h1 className="text-[50px] font-bold tracking-tight text-white">
            Work<span className="text-[#a3feff]">nest</span>
          </h1>
        </div>

        <div className="relative z-10 mb-6">
          <p className="text-[15px] text-gray-400">Work smarter. Grow together.</p>
          <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-[#a3feff] to-[#016472]" />
        </div>

        <h2 className="relative z-10 text-[60px] font-extrabold leading-[1.1] tracking-[-1px] text-white xl:text-[46px]">
          Welcome back to<br />
          <span className="bg-gradient-to-r from-[#a3feff] via-[#32dce5] to-[#016472] bg-clip-text text-transparent">
            your workspace.
          </span>
        </h2>

        <p className="relative z-10 mt-4 max-w-[480px] text-[16px] leading-7 text-gray-300">
          Login to access your dashboard, manage your team, and keep your projects moving forward.
        </p>

        <div className="relative z-10 mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#016472] bg-[#016472]/10">
              <Users className="h-5 w-5 text-[#a3feff]" />
            </div>
            <div>
              <p className="text-[16px] font-medium text-white">Collaborate with your team</p>
              <p className="text-[14px] text-gray-400">Work together seamlessly</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#016472] bg-[#016472]/10">
              <FolderKanban className="h-5 w-5 text-[#a3feff]" />
            </div>
            <div>
              <p className="text-[16px] font-medium text-white">Organize your projects</p>
              <p className="text-[14px] text-gray-400">Everything in one place</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#016472] bg-[#016472]/10">
              <BarChart3 className="h-5 w-5 text-[#a3feff]" />
            </div>
            <div>
              <p className="text-[16px] font-medium text-white">Track productivity</p>
              <p className="text-[14px] text-gray-400">Insights that help you grow</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6 lg:w-1/2">
        <div className="my-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10">
              <img src="/Softcenteric-logo.png" alt="Worknest Logo" className="h-8 w-8 object-contain" />
            </div>
            <h1 className="text-[26px] font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-400">Login to your Worknest account</p>
          </div>

          {/* FORGOT PASSWORD FLOW */}
          {showForgotPassword ? (
            <div className="mt-6">
              {forgotStep === "method" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white text-center">Reset Password</h3>
                  <p className="text-sm text-gray-400 text-center">Enter your email to receive a reset code</p>

                  <input
                    type="text"
                    value={forgotContact}
                    onChange={(e) => setForgotContact(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setShowForgotPassword(false); resetForgotFlow(); }}
                      className="flex-1 h-11 rounded-xl border border-white/10 text-gray-400 font-semibold hover:bg-white/5"
                    >
                      Back to Login
                    </button>
                    <button
                      type="button"
                      disabled={!forgotContact.trim() || sendingForgotRequest}
                      onClick={handleSendForgotCode}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 text-black font-semibold disabled:opacity-50"
                    >
                      {sendingForgotRequest ? "Checking..." : "Send Code"}
                    </button>
                  </div>
                </div>
              )}

              {forgotStep === "otp" && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-400">
                    ⚠️ Firebase OTP integration required. Backend is ready — Firebase SDK setup pending.
                  </div>

                  <p className="text-sm text-gray-400 text-center">Enter 6-digit code sent to {forgotContact}</p>

                  <input
                    type="text"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                    placeholder="Enter 6-digit code"
                    className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400 text-center tracking-[0.5em] font-semibold"
                  />
                  {otpError && <p className="text-xs text-red-400">{otpError}</p>}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotStep("method")}
                      className="flex-1 h-11 rounded-xl border border-white/10 text-gray-400 font-semibold hover:bg-white/5"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={otpValue.length !== 6}
                      onClick={() => alert("⚠️ Firebase SDK setup required for OTP verification.")}
                      className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 text-black font-semibold disabled:opacity-50"
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              )}

              {forgotStep === "newPassword" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white text-center">Set New Password</h3>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="New Password"
                    className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400"
                  />
                  <input
                    type="password"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Confirm New Password"
                    className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white placeholder-gray-500 outline-none focus:border-cyan-400"
                  />
                  {confirmNewPass && newPass !== confirmNewPass && (
                    <p className="text-xs text-red-400">Passwords do not match.</p>
                  )}
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setForgotStep("otp")} className="flex-1 h-11 rounded-xl border border-white/10 text-gray-400 font-semibold hover:bg-white/5">Back</button>
                    <button type="button" disabled={!newPass || newPass !== confirmNewPass} onClick={() => setForgotStep("done")} className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 text-black font-semibold disabled:opacity-50">Reset Password</button>
                  </div>
                </div>
              )}

              {forgotStep === "done" && (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 size={48} className="text-green-400 mx-auto" />
                  <p className="text-xl text-white font-semibold">Password Reset Successfully!</p>
                  <p className="text-sm text-gray-400">You can now login with your new password</p>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(false); resetForgotFlow(); }}
                    className="mt-2 h-11 px-8 rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 text-black font-semibold"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5 text-left">
                  <span className="text-sm font-medium text-gray-300">Email Address</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      className={`h-12 w-full rounded-lg border bg-white/5 pl-10 pr-3 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 ${
                        error.email ? "border-red-500" : "border-white/10 focus:border-cyan-400"
                      }`}
                      type="email"
                      name="email"
                      value={formdata.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                  {error.email && <p className="text-sm text-red-400">{error.email}</p>}
                </label>

                <label className="flex flex-col gap-1.5 text-left">
                  <span className="text-sm font-medium text-gray-300">Password</span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      className={`h-12 w-full rounded-lg border bg-white/5 pl-10 pr-10 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 ${
                        error.password ? "border-red-500" : "border-white/10 focus:border-cyan-400"
                      }`}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formdata.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-cyan-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {error.password && <p className="text-sm text-red-400">{error.password}</p>}
                </label>

                {error.form && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    {error.form}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400" />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); resetForgotFlow(); }}
                    className="cursor-pointer text-cyan-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#016472] to-cyan-400 text-base font-semibold text-black shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-400/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Login"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-gray-500">OR</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10"
              >
                <img src="/google-logo.png" alt="Google" className="h-5 w-5 object-contain" />
                Continue with Google
              </button>

              <div className="mt-[15px]">
                <p className="mt-5 text-center text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                Your data is secure with Worknest
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}