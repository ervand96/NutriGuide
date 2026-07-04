import Link from "next/link";

type Partner = "iherb" | "myprotein" | "amazon" | "noom" | "hellofresh";

export default function AffiliateButton({
  partner,
  source,
  query,
  children,
  variant = "solid",
  className = "",
}: {
  partner: Partner;
  source: string;
  query?: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
}) {
  const params = new URLSearchParams({ source });
  if (query) params.set("q", query);
  const href = `/go/${partner}?${params.toString()}`;

  const styles: Record<string, string> = {
    solid:
      "bg-leaf-500 hover:bg-leaf-600 text-white shadow-sm hover:shadow-md",
    outline:
      "border-2 border-leaf-500 text-leaf-600 hover:bg-leaf-50 bg-white",
    ghost: "bg-white/10 border border-white/40 text-white hover:bg-white/20",
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`no-underline inline-flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
