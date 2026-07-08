import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for NutriGuide, including data collection, cookies, and affiliate disclosures.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-leaf-500 font-semibold mb-3">
            Legal
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-bark mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">Last updated: June 19, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-bark">
              1. Information We Collect
            </h2>
            <p>
              When you visit NutriGuide, we may collect information that helps
              us understand how the site is used. This may include browser type,
              device information, referral sources, and anonymous analytics
              data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bark">
              2. Cookies and Tracking
            </h2>
            <p>
              We use cookies and similar technologies to improve site
              performance, remember preferences, and help measure traffic. Some
              cookies may be set by third-party partners for affiliate tracking
              and analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bark">3. Affiliate Links</h2>
            <p>
              NutriGuide may contain affiliate links. If you click on these
              links, we may earn a commission at no additional cost to you. This
              does not affect the opinions or recommendations presented in our
              content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bark">
              4. How We Use Information
            </h2>
            <p>
              We use collected information to improve user experience, analyze
              site traffic, troubleshoot issues, and support our content and
              affiliate programs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bark">
              5. Third-Party Services
            </h2>
            <p>
              We may use third-party services such as analytics providers or web
              hosting platforms. These providers may collect data according to
              their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bark">6. Your Choices</h2>
            <p>
              You can usually disable cookies in your browser settings. Please
              note that some site features may not work correctly if cookies are
              disabled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-bark">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              through our contact page at /contact or by emailing us directly.
              the website.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
