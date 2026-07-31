
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Users,
  FolderKanban,
  BarChart3,
} from "lucide-react";

export default function Signup() {
  const initialvalue = {
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
  };

  const [formdata, setformdata] = useState(initialvalue);
  const [error, seterror] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

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

  const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const validate = () => {
    let newErrors = {};

    if (!formdata.fullname) {
      newErrors.fullname = "*Full name is required";
    } else if (!nameRegex.test(formdata.fullname)) {
      newErrors.fullname = "*Only alphabets allowed";
    }

    if (!formdata.email) {
      newErrors.email = "*Email is required";
    } else if (!emailRegex.test(formdata.email)) {
      newErrors.email = "*Please enter a valid email";
    }

    if (!formdata.password) {
      newErrors.password = "*Password is required";
    } else if (!passwordRegex.test(formdata.password)) {
      newErrors.password =
        "*Password must have 8+ characters, a letter, a digit, and a special character";
    }

    if (!formdata.confirmpassword) {
      newErrors.confirmpassword = "*Please confirm your password";
    } else if (formdata.confirmpassword !== formdata.password) {
      newErrors.confirmpassword = "*Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    seterror(newErrors);

    if (!agreed) {
      setAgreeError("*Please accept the Terms & Conditions");
    } else {
      setAgreeError("");
    }

    if (Object.keys(newErrors).length === 0 && agreed) {
      navigate("/login");
    }
  };

  // Google Signup
  const handleGoogleSignup = () => {
    alert("Google Signup will be connected soon!");
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-black via-[#02191c] to-black">


      <div className="pointer-events-none absolute -left-24 -top-24 z-0 h-80 w-80 rounded-full bg-cyan-400/25 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-16 z-0 h-96 w-96 rounded-full bg-cyan-400/25 blur-[120px]" />


      <div
        className="pointer-events-none absolute right-16 top-16 z-0 h-40 w-40 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />


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

      

      <div className="relative z-10 hidden w-1/2 flex-col justify-start overflow-hidden px-16 pt-14 pl-40 lg:flex">

        {/* Logo */}

        <div className="relative z-10 mb-8 flex items-center gap-3">

          <img
            src="/Softcenteric-logo.png"
            alt="Worknest Logo"
            className="h-[58px] w-[58px] object-contain"
          />

          <h1 className="text-[50px] font-bold tracking-tight text-white">
            Work<span className="text-[#a3feff]">nest</span>
          </h1>

        </div>

        {/* Main Heading */}

        <h2 className="relative z-10 text-[40px] font-extrabold leading-[1.1] tracking-[-1px] text-white xl:text-[46px]">

          Build your
          <br />

          <span className="bg-gradient-to-r from-[#a3feff] via-[#32dce5] to-[#016472] bg-clip-text text-transparent">
            smarter workspace.
          </span>

        </h2>

        {/* Description */}

        <p className="relative z-10 mt-4 max-w-[480px] text-[16px] leading-7 text-gray-300">
          Create your Worknest account and bring your team, projects and
          productivity together in one powerful workspace.
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
          RIGHT SIDE SIGNUP
      ========================== */}

      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6 lg:w-1/2">

        <div className="my-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black ">

          {/* Header */}

          <div className="flex flex-col items-center text-center">

            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10">
              <User className="h-6 w-6 text-cyan-300" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Create your account
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Get started with Worknest today.
            </p>

          </div>

          {/* Signup Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-5 flex flex-col gap-3"
          >

            {/* Full Name */}

            <label className="flex flex-col gap-1.5 text-left">

              <span className="text-sm font-medium text-gray-300">
                Full Name
              </span>

              <div className="relative">

                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                <input
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  type="text"
                  name="fullname"
                  value={formdata.fullname}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />

              </div>

              {error.fullname && (
                <p className="text-sm text-red-400">
                  {error.fullname}
                </p>
              )}

            </label>

            {/* Email */}

            <label className="flex flex-col gap-1.5 text-left">

              <span className="text-sm font-medium text-gray-300">
                Email Address
              </span>

              <div className="relative">

                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                <input
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
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
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-10 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formdata.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300"
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

            {/* Confirm Password */}

            <label className="flex flex-col gap-1.5 text-left">

              <span className="text-sm font-medium text-gray-300">
                Confirm Password
              </span>

              <div className="relative">

                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                <input
                  className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-10 text-[15px] text-white placeholder-gray-500 transition-all duration-200 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmpassword"
                  value={formdata.confirmpassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

              {error.confirmpassword && (
                <p className="text-sm text-red-400">
                  {error.confirmpassword}
                </p>
              )}

            </label>

            {/* Terms */}

            <div>

              <label className="flex items-start gap-2 text-sm text-gray-400">

                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) =>
                    setAgreed(e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-cyan-400"
                />

                <span>
                  I agree to the{" "}

                  <Link
                        to="/terms"
                        className="text-cyan-400 hover:underline"
                      >
                        Terms & Conditions
                      </Link>

                  {" "}and{" "}

                  <Link
                      to="/privacy-policy"
                      className="text-cyan-400 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    </span>

              </label>

              {agreeError && (
                <p className="mt-1 text-sm text-red-400">
                  {agreeError}
                </p>
              )}

            </div>

            {/* Create Account */}

            <button
              type="submit"
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 text-base font-semibold text-black shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-400/50 active:scale-[0.98]"
            >
              Create Account

              <ArrowRight className="h-4 w-4" />
            </button>

          </form>

          {/* OR */}

          <div className="my-4 flex items-center gap-3">

            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-gray-500">
              OR
            </span>

            <div className="h-px flex-1 bg-white/10" />

          </div>

          

         <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10">
            <img src="/google-logo.png" alt="Google" className="h-5 w-5 object-contain"/>

            Continue with Google
          </button>

          {/* Login */}
          <div className="mt-[15px]">

          <p className="mt-10 text-center text-sm text-gray-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Login
            </Link>

          </p>
          </div>

        </div>

      </div>

    </div>
  );
}