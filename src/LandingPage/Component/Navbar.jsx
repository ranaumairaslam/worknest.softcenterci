import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { title: "Home", path: "#home" },
    { title: "Features", path: "#features" },
    { title: "Solution", path: "#solution" },
    { title: "About", path: "#about" },
    { title: "Contact", path: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#010005] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link to="/login" className="flex items-center gap-3">
          <img src="/Softcenteric-logo.png" alt="Worknest" className="mt-0 h-16 w-16 object-contain"/>
          <h1 className="pt-[14px] text-4xl font-bold text-white">
            Work<span className="text-[#a3feff]">nest</span>
          </h1>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-10 lg:flex">
          {navLinks.map((item) => (
            <li key={item.title}>
              <a href={item.path} className="text-[15px] font-medium text-white transition-all duration-300 hover:text-[#14bfc2]">
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-4 lg:flex">
          <Link to="/login" className="rounded-xl border border-[#016472] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#a3feff] hover:text-[#a3feff]">
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 px-8 py-2.5 text-sm font-semibold !text-white !no-underline shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white lg:hidden">
          <Menu size={30} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#000304] lg:hidden">
          <div className="flex flex-col px-6 py-5">
            {navLinks.map((item) => (
              <a key={item.title} href={item.path} className="py-3 text-slate-300 transition-all duration-300 hover:text-[#a3feff]">
                {item.title}
              </a>
            ))}
            <div className="mt-5 flex flex-col gap-3">
              <Link to="/login" className="rounded-xl border border-[#016472] py-3 text-center font-semibold text-white">
                Login
              </Link>

              {/* FIXED MOBILE SIGN UP BUTTON */}
              <Link
                to="/signup"
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 py-3.5 text-center text-base font-semibold !text-white !no-underline"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}