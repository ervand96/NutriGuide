import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the NutriGuide team.",
};

const CONTACT_EMAIL = "ervandharutyunyan06096@gmail.com";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-leaf-500 font-semibold mb-3">
            Get in Touch
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-bark mb-4">
            Contact Us
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Questions about a review, a partnership inquiry, or just want to
            say hi? Reach out — we read every message.
          </p>
        </div>

        <div className="bg-leaf-50 border border-leaf-100 rounded-2xl p-8 max-w-lg">
          <div className="text-xs font-bold text-leaf-600 uppercase tracking-widest mb-3">
            Email us directly
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-2xl font-display font-bold text-bark hover:text-leaf-600 transition-colors no-underline break-all"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="text-gray-500 text-sm mt-4">
            We typically reply within 1–2 business days.
          </p>
        </div>

        <div className="mt-10 text-gray-500 text-sm max-w-xl">
          <p>
            For brand and affiliate partnership inquiries, please include
            details about your product and audience fit so we can respond
            faster.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
