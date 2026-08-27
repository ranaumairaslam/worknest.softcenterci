import {
  Building2,
  Users,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Building2,
    title: "Company Management",
    description:
      "Manage multiple companies, workspaces, and business operations from one powerful dashboard.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Connect teams, assign tasks, and improve productivity with seamless collaboration tools.",
  },
  {
    icon: ShieldCheck,
    title: "Role Based Access",
    description:
      "Control permissions with Super Admin, Admin, and team-level access management.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Get real-time insights with powerful analytics and performance tracking.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Management",
    description:
      "Track subscriptions, plans, and revenue growth from a centralized system.",
  },
  {
    icon: Zap,
    title: "Smart Automation",
    description:
      "Automate repetitive workflows and save valuable time for your teams.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden  py-24"
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#016472]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div className="mx-auto mb-16 max-w-3xl text-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}  viewport={{ once: true }} transition={{ duration: 0.7 }}>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#016472]">
            Features
          </p>

          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Everything You Need To
            <span className="text-[#016472]">
              {" "}Manage Workspace
            </span>
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Worknest provides powerful tools to manage companies,
            teams, revenue and productivity from one place.
          </p>

    </motion.div>


        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (
              <motion.div
  key={index}
  initial={{
    opacity: 0,
    y: 60,
    scale: 0.95,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
    scale: 1,
  }}
  viewport={{
    once: true,
    amount: 0.2,
  }}
  transition={{
    duration: 0.6,
    delay: index * 0.15,
    ease: "easeOut",
  }}
  className="
  group rounded-3xl border border-slate-200
  bg-white/70 p-8
  shadow-sm backdrop-blur-xl
  transition-all duration-300
  hover:-translate-y-2
  hover:border-[#016472]/40
  hover:shadow-xl
  "
>

                {/* Icon */}
                <div
                  className="
                  mb-6 flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-[#016472]/10
                  text-[#016472]
                  transition-all duration-300
                  group-hover:bg-[#016472]
                  group-hover:text-white
                  "
                >
                  <Icon size={28}/>
                </div>


                {/* Content */}
                <h3 className="
                  mb-3 text-xl font-semibold text-slate-900
                ">
                  {feature.title}
                </h3>


                <p className="
                  leading-relaxed text-slate-600
                ">
                  {feature.description}
                </p>


              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}