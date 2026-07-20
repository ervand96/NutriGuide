import Link from "next/link";
import AffiliateButton from "./AffiliateButton";
import { SITE_CONTAINER } from "@/lib/layout.js";

const paths = [
  {
    href: "/best-picks",
    title: "Best picks",
    desc: "Editor-ranked products & guides",
  },
  {
    href: "/quiz",
    title: "Diet quiz",
    desc: "2 minutes to a clear plan",
  },
  {
    href: "/category/supplements",
    title: "Supplements",
    desc: "What actually works",
  },
];

export default function StartHereStrip() {
  return (
    <section className="border-y border-leaf-100 bg-white py-8 sm:py-10">
      <div className={SITE_CONTAINER}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-leaf-600 text-xs font-bold uppercase tracking-[0.16em] mb-1">
              New here?
            </p>
            <h2 className="font-display font-black text-xl sm:text-2xl text-bark">
              Start with one clear path
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 lg:max-w-3xl">
            {paths.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="no-underline rounded-2xl border border-leaf-100 bg-leaf-50/60 hover:bg-leaf-50 px-4 py-3 transition-colors"
              >
                <div className="font-display font-bold text-bark text-sm sm:text-base">
                  {p.title} →
                </div>
                <div className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  {p.desc}
                </div>
              </Link>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <AffiliateButton
              partner="iherb"
              source="start-here"
              className="!py-2.5 !text-xs !px-3"
            >
              iHerb →
            </AffiliateButton>
          </div>
        </div>
      </div>
    </section>
  );
}
