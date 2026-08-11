import { Mail, Phone, MapPin } from "lucide-react";

import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#071A2B] text-white">

      {/* Top Footer */}
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div>

            <h2 className="text-3xl font-bold">
              Work<span className="text-[#016472]">nest</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-300">
              Worknest helps businesses manage teams, projects,
              revenue and productivity through one modern platform.
            </p>

            <div className="mt-8 flex gap-4">

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#016472]"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#016472]"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#016472]"
              >
                <FaLinkedinIn size={18} />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#016472]"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition hover:bg-[#016472]"
              >
                <FaXTwitter size={18} />
              </a>

            </div>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Quick Links
            </h3>

            <ul className="space-y-4 text-slate-300">

              <li><a href="#home" className="hover:text-[#20D4E3] transition">Home</a></li>

              <li><a href="#features" className="hover:text-[#20D4E3] transition">Features</a></li>

              <li><a href="#solution" className="hover:text-[#20D4E3] transition">Solutions</a></li>

              

              <li><a href="#about" className="hover:text-[#20D4E3] transition">About</a></li>

              <li><a href="#contact" className="hover:text-[#20D4E3] transition">Contact</a></li>

            </ul>

          </div>

          {/* Resources */}
          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Resources
            </h3>

            <ul className="space-y-4 text-slate-300">

              

              <li><a href="/privacy-policy" className="hover:text-[#20D4E3] transition">Privacy Policy</a></li>

              <li><a href="/terms" className="hover:text-[#20D4E3] transition">Terms & Conditions</a></li>

              

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-semibold">
              Contact
            </h3>

            <div className="space-y-5 text-slate-300">

              <div className="flex items-center gap-3">
                <Mail size={20} className="text-[#20D4E3]" />
                <span>Softcenteric@gmail.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={20} className="text-[#20D4E3]" />
                <span>+92 3010041264</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-[#20D4E3]" />
                <span>Wukla Society Arifwala, Pakistan</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="w-[full] flex flex-row items-center justify-center gap-2 px-6 py-4 text-sm text-slate-400 sm:justify-center sm:px-10">

          <p>
            © 2026 Worknest. All Rights Reserved.
          </p>

          

        </div>

      </div>

    </footer>
  );
}