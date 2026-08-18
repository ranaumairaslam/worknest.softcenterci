import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#02191c] to-black px-4 py-10 text-gray-300">

      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <Link
            to="/Signup"
            className="mb-6 inline-flex items-center gap-2"
          >
            <img
              src="/Softcenteric-logo.png"
              alt="Worknest Logo"
              className="h-12 w-12 object-contain"
            />

            <span className="text-3xl font-bold text-white">
              Work<span className="text-[#a3feff]">nest</span>
            </span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Last Updated: July 30, 2026
          </p>

        </div>

        {/* Content */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-10">

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              1. Introduction
            </h2>

            <p className="leading-7">
              Welcome to Worknest. We respect your privacy and are committed
              to protecting your personal information. This Privacy Policy
              explains what information we collect, how we use it, and how
              we protect it when you use Worknest.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              2. Information We Collect
            </h2>

            <p className="mb-3 leading-7">
              When you create or use a Worknest account, we may collect:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-7">
              <li>Full name</li>
              <li>Email address</li>
              <li>Account information</li>
              <li>Company and team information</li>
              <li>Projects, tasks, and workspace information</li>
              <li>Information you provide when contacting us</li>
            </ul>

            <p className="mt-4 leading-7">
              If you choose to sign in using Google, we may receive basic
              account information provided by Google, such as your name and
              email address.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              3. How We Use Your Information
            </h2>

            <p className="mb-3 leading-7">
              We may use your information to:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-7">
              <li>Create and manage your Worknest account</li>
              <li>Provide and improve our services</li>
              <li>Manage teams, projects, and tasks</li>
              <li>Send important account and service notifications</li>
              <li>Maintain security and prevent unauthorized access</li>
              <li>Respond to your questions and support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              4. Information Sharing
            </h2>

            <p className="leading-7">
              We do not sell your personal information. We may share
              information only when necessary to provide our services,
              maintain security, comply with legal requirements, or when
              you explicitly give us permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              5. Data Security
            </h2>

            <p className="leading-7">
              We use reasonable technical and organizational measures to
              protect your information from unauthorized access, alteration,
              disclosure, or destruction. However, no online service can
              guarantee complete security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              6. Cookies
            </h2>

            <p className="leading-7">
              Worknest may use cookies or similar technologies to maintain
              sessions, remember preferences, improve functionality, and
              understand how users interact with our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              7. Third-Party Services
            </h2>

            <p className="leading-7">
              Worknest may use third-party services such as authentication,
              hosting, analytics, or payment providers. These services may
              process information according to their own privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              8. Data Retention
            </h2>

            <p className="leading-7">
              We retain your information only for as long as necessary to
              provide our services, maintain your account, comply with legal
              obligations, and resolve disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              9. Your Privacy Rights
            </h2>

            <p className="mb-3 leading-7">
              Depending on applicable law, you may have the right to:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-7">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Update your account information</li>
              <li>Ask questions about how your information is used</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              10. Children's Privacy
            </h2>

            <p className="leading-7">
              Worknest is not intended for children who are not legally
              permitted to use online services. We do not knowingly collect
              personal information from children without appropriate consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">
              11. Changes to This Privacy Policy
            </h2>

            <p className="leading-7">
              We may update this Privacy Policy from time to time. When
              changes are made, we will update the "Last Updated" date on
              this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-white">
              12. Contact Us
            </h2>

            <p className="leading-7">
              If you have questions about this Privacy Policy or how your
              information is handled, please contact the Worknest support
              team.
            </p>
          </section>

          {/* Back */}
          <div className="mt-10 border-t border-white/10 pt-6 text-center">

            <Link
              to="/Signup"
              className="inline-flex rounded-lg bg-gradient-to-r from-[#016472] to-cyan-400 px-6 py-3 font-semibold text-black transition hover:shadow-lg hover:shadow-cyan-400/20"
            >
              Back to Signup
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}