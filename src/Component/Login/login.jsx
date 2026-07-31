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
} from "lucide-react";



export default function Login() {
  const initialvalue = {
    email: "",
    password: "",
  };

  const [formdata, setformdata] = useState(initialvalue);
  const [error, seterror] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setformdata((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      seterror((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // EMAIL VALIDATION
  // =========================
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let newErrors = {};

    if (!formdata.email.trim()) {
      newErrors.email = "*Email is required";
    } else if (!emailRegex.test(formdata.email.trim())) {
      newErrors.email = "*Please enter a valid email";
    }

    if (!formdata.password) {
      newErrors.password = "*Password is required";
    }

    return newErrors;
  };

  // =========================
  // NORMAL LOGIN
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    seterror(newErrors);

    if (Object.keys(newErrors).length === 0) {
      navigate("/dashboard");
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      /*
        Firebase Google Login yahan connect hoga.

        Example:

        const result = await signInWithPopup(
          auth,
          googleProvider
        );

        const user = result.user;

        console.log("Name:", user.displayName);
        console.log("Email:", user.email);

        navigate("/dashboard");
      */

      // Demo ke liye
      setTimeout(() => {
        setGoogleLoading(false);

        alert(
          "Google Login button is ready. Connect Firebase Authentication to make it fully functional."
        );
      }, 700);
    } catch (error) {
      console.error("Google Login Error:", error);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-black via-[#02191c] to-black">

      {/* =========================
          BACKGROUND GLOW EFFECTS
      ========================== */}

      {/* Top Left Glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 z-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]" />

      {/* Bottom Right Glow */}
      <div className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-[120px]" />

      {/* Center Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#016472]/10 blur-[120px]" />

      {/* =========================
          DOT GRID
      ========================== */}

      <div
        className="pointer-events-none absolute right-16 top-16 z-0 h-40 w-40 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* =========================
          FULL WIDTH BOTTOM WAVES
      ========================== */}

      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[200px] w-full opacity-70"
        viewBox="0 0 1600 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 Q 400 60 800 120 T 1600 120"
          stroke="#22d3ee"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />

        <path
          d="M0 150 Q 400 90 800 150 T 1600 150"
          stroke="#22d3ee"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />

        <path
          d="M0 180 Q 400 120 800 180 T 1600 180"
          stroke="#22d3ee"
          strokeOpacity="0.15"
          strokeWidth="1.5"
        />
      </svg>

      {/* =========================
          LEFT BRAND PANEL
      ========================== */}

      <div className="relative z-10 hidden w-1/2 flex-col justify-start overflow-hidden px-16 pt-14 pl-40 lg:flex">

        {/* Logo */}
        <div className="relative z-10 mb-4 flex items-center gap-3">

          <img
            src="/Softcenteric-logo.png"
            alt="Worknest Logo"
            className="h-[58px] w-[58px] object-contain"
          />

          <h1 className="text-[50px] font-bold tracking-tight text-white">
            Work<span className="text-[#a3feff]">nest</span>
          </h1>

        </div>

        {/* Tagline */}
        <div className="relative z-10 mb-6">

          <p className="text-[15px] text-gray-400">
            Work smarter. Grow together.
          </p>

          <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-[#a3feff] to-[#016472]" />

        </div>

        {/* Main Heading */}
        <h2 className="relative z-10 text-[60px] font-extrabold leading-[1.1] tracking-[-1px] text-white xl:text-[46px]">

          Welcome back to

          <br />

          <span className="bg-gradient-to-r from-[#a3feff] via-[#32dce5] to-[#016472] bg-clip-text text-transparent">
            your workspace.
          </span>

        </h2>

        {/* Description */}
        <p className="relative z-10 mt-4 max-w-[480px] text-[16px] leading-7 text-gray-300">
          Login to access your dashboard, manage your team, and keep your
          projects moving forward.
        </p>

        {/* Features */}
        <div className="relative z-10 mt-6 flex flex-col gap-4">

          {/* Feature 1 */}
          <div className="flex items-center gap-4">

            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#016472] bg-[#016472]/10">
              <Users className="h-5 w-5 text-[#a3feff]" />
            </div>

            <div>
              <p className="text-[16px] font-medium text-white">
                Collaborate with your team
              </p>

              <p className="text-[14px] text-gray-400">
                Work together seamlessly
              </p>
            </div>

          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4">

            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#016472] bg-[#016472]/10">
              <FolderKanban className="h-5 w-5 text-[#a3feff]" />
            </div>

            <div>
              <p className="text-[16px] font-medium text-white">
                Organize your projects
              </p>

              <p className="text-[14px] text-gray-400">
                Everything in one place
              </p>
            </div>

          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4">

            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#016472] bg-[#016472]/10">
              <BarChart3 className="h-5 w-5 text-[#a3feff]" />
            </div>

            <div>
              <p className="text-[16px] font-medium text-white">
                Track productivity
              </p>

              <p className="text-[14px] text-gray-400">
                Insights that help you grow
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          RIGHT LOGIN SECTION
      ========================== */}

      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6 lg:w-1/2">

        {/* Login Card */}
        <div className="my-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black backdrop-blur-xl">

          {/* Login Header */}
          <div className="flex flex-col items-center text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10">

              <img
                src="/Softcenteric-logo.png"
                alt="Worknest Logo"
                className="h-8 w-8 object-contain"
              />

            </div>

            <h1 className="text-[26px] font-bold text-white">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Login to your Worknest account
            </p>

          </div>

          {/* =========================
              LOGIN FORM
          ========================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-4"
          >

            {/* Email */}
            <label className="flex flex-col gap-1.5 text-left">

              <span className="text-sm font-medium text-gray-300">
                Email Address
              </span>

              <div className="relative">

                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                <input
                  className={`h-12 w-full rounded-lg border bg-white/5 pl-10 pr-3 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 ${
                    error.email
                      ? "border-red-500"
                      : "border-white/10 focus:border-cyan-400"
                  }`}
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />

              </div>

              {error.email && (
                <p className="text-sm text-red-400">
                  {error.email}
                </p>
              )}

            </label>

            {/* Password */}
            <label className="flex flex-col gap-1.5 text-left">

              <span className="text-sm font-medium text-gray-300">
                Password
              </span>

              <div className="relative">

                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                <input
                  className={`h-12 w-full rounded-lg border bg-white/5 pl-10 pr-10 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 ${
                    error.password
                      ? "border-red-500"
                      : "border-white/10 focus:border-cyan-400"
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
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-cyan-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              {error.password && (
                <p className="text-sm text-red-400">
                  {error.password}
                </p>
              )}

            </label>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-gray-400">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400"
                />

                Remember me

              </label>

              <span className="cursor-pointer text-cyan-400 hover:underline">
                Forgot password?
              </span>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#016472] to-cyan-400 text-base font-semibold text-black shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-400/50 active:scale-[0.98]"
            >

              Login

              <ArrowRight className="h-4 w-4" />

            </button>

          </form>

          {/* =========================
              DIVIDER
          ========================== */}

          <div className="my-5 flex items-center gap-3">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-gray-500">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10">
            <img
              src="/google-logo.png"
              alt="Google"
              className="h-5 w-5 object-contain"
            />

            Continue with Google
          </button>

         <div className="mt-[15px]">

          <p className="mt-5 text-center text-sm text-gray-400">

            Don't have an account?{" "}

            <Link
              to="/Signup"
              className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Sign up
            </Link>

          </p>
          </div>


          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">

            <ShieldCheck className="h-4 w-4 text-cyan-400" />

            Your data is secure with Worknest

          </div>

        </div>

      </div>

    </div>
  );
}