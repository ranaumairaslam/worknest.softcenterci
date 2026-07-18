
import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";

const DESKTOP_BREAKPOINT = 1024;

function useIsDesktop(breakpoint = DESKTOP_BREAKPOINT) {
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= breakpoint
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const handleChange = (event) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isDesktop;
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen && !isDesktop ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, isDesktop]);

  const handleToggle = useCallback(() => {
    if (isDesktop) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, [isDesktop]);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const mainOffsetClass = isDesktop
    ? collapsed
      ? "lg:ml-20"
      : "lg:ml-72"
    : "ml-0";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={handleCloseMobile}
      />

      <div
        className={`min-h-screen min-w-0 transition-all duration-300 ease-in-out ${mainOffsetClass}`}
      >
        <Navbar onToggle={handleToggle} />

        <main className="p-4 sm:p-6">
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500 sm:p-10">
            Your Dashboard Content
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
