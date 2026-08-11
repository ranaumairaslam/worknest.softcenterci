import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import Earth from "./Earth";
export default function HeroSection(){
    const navigate = useNavigate();
return(
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#000304] pt-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-16 px-6 lg:flex-row lg:px-10">

<div className="max-w-2xl ">
<p className="mb-4 inline-flex rounded-full border border-[#016472] bg-[#016472]/10 px-4 py-2 text-[15px] font-medium text-[#a3feff]">🚀 Smart Workspace For Modern Teams</p>
<div className="mt-[30px]">
<h1 className=" mt-5 text-xl font-extrabold leading-tight text-white md:text-2xl lg:text-6xl">Your Team.<span className="block text-[#ffffff]">Your Workflow.</span><span className="block text-[#06f6fa]">Your Success.</span></h1>

<p className="mt-8 max-w-xl text-[18px] leading-8 text-slate-300">Customize Worknest to fit your Workflow<span className="block">and scale as you grow.</span></p>

<div className="mt-10 flex flex-wrap gap-5">
    
<Link to="/signup" className="rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-90 hover:shadow-cyan-500/30">
  Get Started
</Link>
</div>


</div>
</div>


<div className="relative mx-auto flex h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] lg:h-[620px] lg:w-[620px] items-center justify-center">

  <svg
    className="absolute inset-0 z-10 w-full h-full pointer-events-none"
    viewBox="0 0 600 600"
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M300 300 C200 230 100 160 80 100"
      stroke="#22d3ee"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M300 300 C160 300 40 300 -180 300"
      stroke="#22d3ee"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M300 300 C220 340 150 390 80 450"
      stroke="#22d3ee"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M300 300 C400 230 500 160 520 100"
      stroke="#22d3ee"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M300 300 C410 295 500 295 620 300"
      stroke="#22d3ee"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M300 300 C380 340 450 390 520 450"
      stroke="#22d3ee"
      strokeWidth="2"
      strokeDasharray="6 6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>

  <div className="relative z-20">
    <Earth />
  </div>

  <img
    src="/Softcenteric-logo.png"
    alt="Logo"
    className="absolute z-30 w-25 sm:w-30 md:w-35 lg:w-50 mb-[40px] text-white-1000"
  />

  <div className="absolute top-6 left-4 sm:top-8 sm:left-6 md:top-10 md:left-8 lg:top-15 lg:left-10 z-40 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#02181d] shadow-lg shadow-cyan-500/40">
    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-cyan-300" />
  </div>

  <div className="absolute top-1/2 left-[-15px] sm:left-[-20px] md:left-[-30px] lg:left-[-50px] -translate-y-1/2 z-40 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#02181d] shadow-lg shadow-cyan-500/40">
    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-cyan-300" />
  </div>

  <div className="absolute bottom-12 left-4 sm:bottom-16 sm:left-6 md:bottom-24 md:left-8 lg:bottom-32 lg:left-10 z-40 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#02181d] shadow-lg shadow-cyan-500/40">
    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-cyan-300" />
  </div>

  <div className="absolute top-6 right-4 sm:top-8 sm:right-6 md:top-10 md:right-8 lg:top-15 lg:right-13 z-40 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#02181d] shadow-lg shadow-cyan-500/40">
    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-cyan-300" />
  </div>

  <div className="absolute top-1/2 right-[-15px] sm:right-[-20px] md:right-[-30px] lg:right-[-50px] -translate-y-1/2 z-40 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#02181d] shadow-lg shadow-cyan-500/40">
    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-cyan-300" />
  </div>

  <div className="absolute bottom-10 right-6 sm:bottom-16 sm:right-6 md:bottom-24 md:right-6 lg:bottom-32 lg:right-8 z-40 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full border-2 border-cyan-400 bg-[#02181d] shadow-lg shadow-cyan-500/40">
    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-cyan-300" />
  </div>

</div>
 
  

</div>

</section>
);
}