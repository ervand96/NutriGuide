import Link from "next/link";

const links = [
  { href: "/category/diets", label: "Diets" },
  { href: "/category/reviews", label: "Reviews" },
  { href: "/category/supplements", label: "Supplements" },
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-black text-xl text-leaf-500 no-underline tracking-tight"
        >
          🍎 NutriGuide
        </Link>
        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-500 hover:text-leaf-500 text-sm font-medium transition-colors no-underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/category/reviews"
          className="bg-leaf-500 hover:bg-leaf-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors no-underline"
        >
          Best Picks →
        </Link>
      </div>
    </nav>
  );
}
