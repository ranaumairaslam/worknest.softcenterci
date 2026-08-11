import {
  BadgeCheck,
  Users,
  Building2,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: Building2,
    number: "250+",
    title: "Companies",
  },
  {
    icon: Users,
    number: "12K+",
    title: "Active Users",
  },
  {
    icon: Globe2,
    number: "20+",
    title: "Countries",
  },
  {
    icon: BadgeCheck,
    number: "99.9%",
    title: "System Uptime",
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-24"
    >
      {/* Glow */}
      <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-[#016472]/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#016472]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >

            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#016472]">
              About Worknest
            </p>

            <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Built To Help
              <span className="text-[#016472]">
                {" "}Modern Teams Grow
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Worknest is an all-in-one workspace designed to simplify
              company management, project collaboration, revenue tracking,
              and team productivity.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Whether you're a startup or a growing enterprise,
              Worknest provides the tools you need to organize work,
              manage people, and make smarter business decisions.
            </p>

          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-6"
          >

            {stats.map((item, index) => {

              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                  rounded-3xl
                  border border-slate-200
                  bg-white/70
                  p-8
                  shadow-sm
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-[#016472]/40
                  hover:shadow-xl
                  "
                >

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#016472]/10 text-[#016472]">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-4xl font-bold text-slate-900">
                    {item.number}
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {item.title}
                  </p>

                </div>
              );
            })}

          </motion.div>

        </div>

      </div>
    </section>
  );
}