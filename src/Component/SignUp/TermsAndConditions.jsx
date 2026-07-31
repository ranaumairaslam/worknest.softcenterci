import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#02191c] to-black text-gray-300">

      {/* Background Glow */}
      <div className="pointer-events-none fixed -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="pointer-events-none fixed -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#016472]/20 blur-[130px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">

          {/* Logo */}
          <Link to="/Signup" className="flex items-center gap-3">

            <img
              src="/Softcenteric-logo.png"
              alt="Worknest Logo"
              className="h-11 w-11 object-contain"
            />

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Work<span className="text-[#a3feff]">nest</span>
            </h1>

          </Link>

          {/* Back */}
          <Link
            to="/Signup"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-cyan-400/40 hover:bg-white/5 hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back to Signup
          </Link>

        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">

        {/* Page Heading */}
        <div className="mb-10 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10">
            <FileText className="h-7 w-7 text-cyan-300" />
          </div>
          <div className="flex flex-col items-center">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Terms & Conditions
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
            Please read these Terms & Conditions carefully before creating
            your Worknest account or using our services.
          </p>


        </div>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black backdrop-blur-xl sm:p-10">

          {/* Introduction */}
          <section>
            <h3 className="text-xl font-semibold text-white">
              1. Acceptance of Terms
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Welcome to Worknest. By creating an account, accessing, or
              using Worknest, you agree to be bound by these Terms &
              Conditions. If you do not agree with any part of these terms,
              please do not create an account or use our services.
            </p>
          </section>

          {/* Account Registration */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              2. Account Registration
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              To use certain features of Worknest, you may need to create
              an account. You agree to provide accurate, complete, and
              up-to-date information during registration.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-gray-400">
              <li>You must provide accurate account information.</li>
              <li>You are responsible for keeping your password secure.</li>
              <li>You are responsible for activity performed through your account.</li>
              <li>You should notify Worknest if you believe your account has been compromised.</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              3. Acceptable Use
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Worknest is designed to help teams manage their workspace,
              projects, tasks, employees, and business activities. You agree
              to use the platform only for lawful and authorized purposes.
            </p>

            <p className="mt-3 leading-7 text-gray-400">
              You must not use Worknest to conduct fraudulent activities,
              gain unauthorized access to systems, distribute malicious
              software, or interfere with the operation of the platform.
            </p>
          </section>

          {/* Company and Team Data */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              4. Company and Team Data
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              You may store company, employee, project, customer, and other
              business information within Worknest. You are responsible for
              ensuring that you have the appropriate rights and permissions
              to upload and manage such information.
            </p>
          </section>

          {/* Subscription */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              5. Plans, Subscriptions & Payments
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Worknest may provide free and paid subscription plans. Paid
              plans may provide access to additional features, storage,
              tools, or other functionality.
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-gray-400">
              <li>Subscription prices will be displayed before purchase.</li>
              <li>Payments must be made using an available payment method.</li>
              <li>Your selected plan may become active after successful payment.</li>
              <li>Subscription periods and renewal terms will depend on your selected plan.</li>
              <li>Applicable taxes or payment processing charges may apply.</li>
            </ul>
          </section>

          {/* Refund */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              6. Refund & Cancellation
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Cancellation and refund eligibility may depend on the
              subscription plan and applicable refund policy. Before
              purchasing a paid plan, please review the applicable billing
              and refund information provided by Worknest.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              7. Intellectual Property
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Worknest and its associated software, interface, branding,
              logos, designs, graphics, and platform features are protected
              by applicable intellectual property laws.
            </p>

            <p className="mt-3 leading-7 text-gray-400">
              You may not copy, reproduce, modify, distribute, sell, or
              commercially exploit Worknest materials without appropriate
              authorization.
            </p>
          </section>

          {/* User Content */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              8. User Content
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              You retain ownership of the business or other content that you
              submit to Worknest, subject to the rights necessary for
              Worknest to provide its services.
            </p>

            <p className="mt-3 leading-7 text-gray-400">
              You are responsible for ensuring that your content does not
              violate applicable laws or the rights of other individuals or
              organizations.
            </p>
          </section>

          {/* Privacy */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              9. Privacy
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Worknest may collect and process information necessary to
              provide and improve its services. Our Privacy Policy explains
              how personal information is collected, used, stored, and
              protected.
            </p>
          </section>

          {/* Security */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              10. Security
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              We take reasonable measures to help protect the Worknest
              platform and user information. However, no online service can
              guarantee complete security, and users should take appropriate
              steps to protect their account credentials.
            </p>
          </section>

          {/* Suspension */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              11. Account Suspension or Termination
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Worknest may suspend or terminate an account if there is a
              violation of these Terms & Conditions, misuse of the platform,
              fraudulent activity, security concerns, or other circumstances
              that require action to protect Worknest or its users.
            </p>
          </section>

          {/* Availability */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              12. Service Availability
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              We aim to keep Worknest available and reliable, but temporary
              interruptions may occur because of maintenance, technical
              issues, updates, network problems, or circumstances beyond
              our reasonable control.
            </p>
          </section>

          {/* Limitation */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              13. Limitation of Liability
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              To the extent permitted by applicable law, Worknest will not
              be responsible for indirect, incidental, special, or
              consequential losses resulting from the use or inability to
              use the platform.
            </p>
          </section>

          {/* Changes */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              14. Changes to These Terms
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              Worknest may update these Terms & Conditions from time to
              time. Updated terms may be published on this page. Continued
              use of the platform after an update may indicate acceptance of
              the revised terms, where permitted by law.
            </p>
          </section>

          {/* Contact */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold text-white">
              15. Contact Us
            </h3>

            <p className="mt-3 leading-7 text-gray-400">
              If you have any questions regarding these Terms & Conditions,
              please contact the Worknest support team.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" />

              <p className="text-sm text-gray-400">
                By creating a Worknest account, you confirm that you have
                read and agree to these Terms & Conditions.
              </p>
            </div>
          </section>

          {/* Bottom Buttons */}
            <div className="mt-10 border-t border-white/10 pt-6 text-center">

            <Link
              to="/Signup"
              className="inline-flex rounded-lg bg-gradient-to-r from-[#016472] to-cyan-400 px-6 py-3 font-semibold text-black transition hover:shadow-lg hover:shadow-cyan-400/20"
            >
              Back to Signup
            </Link>

          </div>

        </div>

        {/* Footer */}
        <p className="pt-[30px] text-center text-xs text-gray-500">
          © 2026 Worknest. All rights reserved.
        </p>

      </main>

    </div>
  );
}