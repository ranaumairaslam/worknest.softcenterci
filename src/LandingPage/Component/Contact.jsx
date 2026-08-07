import {
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const formRef = useRef(null);
  const sendEmail = (e) => {
  e.preventDefault();
  emailjs
  .sendForm(
    "service_ufs6491",
    "template_goqry7g",
    formRef.current,
    "r2LJxg8_4ssjc8GkQ"
  )
   .then(() => {
      alert("Message sent successfully!");
      formRef.current.reset();
    })
    .catch((error) => {
      alert("Failed to send message.");
    });
};
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 bg-gradient-to-b from-white to-[#f5fcfd]"
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#016472]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#016472]">
            Contact Us
          </p>

          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Let's Build Something
            <span className="text-[#016472]"> Great Together</span>
          </h2>

          <p className="mt-5 text-lg text-slate-600">
            Have questions or want to see Worknest in action?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">

          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >

            <div>
              <h3 className="text-3xl font-bold text-slate-900">
                Get In Touch
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Whether you have a question, feedback, or want a product
                demo, our team is ready to help you.
              </p>
            </div>

            {/* Contact Cards */}

            <div className="space-y-5">

              <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#016472]/10 text-[#016472]">
                  <Mail size={26} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Email
                  </p>
                  <p className="text-slate-600">
                    Softcenteric@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#016472]/10 text-[#016472]">
                  <Phone size={26} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Phone
                  </p>
                  <p className="text-slate-600">
                    +92 3010041264
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg transition">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#016472]/10 text-[#016472]">
                  <MapPin size={26} />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Office
                  </p>
                  <p className="text-slate-600">
                    Wukla Society Arifwala,Pakistan
                  </p>
                </div>
              </div>

            </div>

          </motion.div>

          {/* Right Side Form */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
          >

            <form 
            onSubmit={sendEmail}
            ref={formRef} className="space-y-6">

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#016472]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#016472]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Subject
                </label>

                <input
                  name="subject"
                  type="text"
                  placeholder="Subject"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#016472]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#016472]"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#016472] to-cyan-400 px-6 py-4 font-semibold text-white transition hover:bg-[#014954]"
              >
                <Send size={20} />
                Send Message
              </button>

            </form>

          </motion.div>

        </div>

      </div>
    </section>
  );
}