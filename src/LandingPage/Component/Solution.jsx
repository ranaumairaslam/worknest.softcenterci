import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Tilt from "react-parallax-tilt";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const points = [
  "Manage multiple companies from one dashboard",
  "Monitor revenue with real-time analytics",
  "Collaborate with teams efficiently",
  "Secure role-based access control",
];

export default function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-white py-24"
    >
      {/* Glow */}
      <div className="absolute left-0 top-20 h-80 w-80 rounded-full bg-[#016472]/10 blur-3xl" />
      <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-[#016472]/10 blur-3xl" />

      
        <motion.div
  initial={{
    opacity: 0,
    x: 100,
    scale: 0.95,
  }}
  whileInView={{
    opacity: 1,
    x: 0,
    scale: 1,
  }}
  viewport={{
    once: true,
    amount: 0.3,
  }}
  transition={{
    duration: 0.8,
    ease: "easeOut",
  }}
  className="
relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2
  "
>

        {/* Left */}
        
        
        <div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#016472]">
            Solution
          </p>

          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Everything In One
            <span className="text-[#016472]">
              {" "}Powerful Workspace
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Worknest helps businesses simplify company management,
            project tracking, team collaboration and revenue monitoring
            through one modern platform.
          </p>

          <div className="mt-8 space-y-5">

            {points.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <div className="rounded-full bg-[#016472]/10 p-2">
                  <CheckCircle2
                    size={20}
                    className="text-[#016472]"
                  />
                </div>

                <span className="text-slate-700">
                  {item}
                </span>
              </div>
            ))}

          </div>
          <Link to="/signup" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 text-base px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#014f59]">

         
            Get Started
            <ArrowRight size={18} />
            </Link>

        </div>

        {/* Right */}
        <Tilt
  tiltMaxAngleX={10}
  tiltMaxAngleY={10}
  perspective={1200}
  transitionSpeed={1200}
  glareEnable={true}
  glareMaxOpacity={0.15}
  scale={1.02}
>
  <div
    className="
      overflow-hidden
      rounded-3xl
      border border-slate-200
      bg-white/70
      shadow-xl
      backdrop-blur-xl
    "
  >
    <img
      src="/Solution.jpeg"
      alt="Worknest Dashboard"
      className="w-full h-[550px] object-cover"
    />
  </div>
</Tilt>

      </motion.div>
    </section>
  );
}