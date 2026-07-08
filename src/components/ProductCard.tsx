import Link from "next/link";
import { Product } from "@/types";

interface Props {
  product: Product;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-base">
      {"★".repeat(Math.floor(rating))}
      {"☆".repeat(5 - Math.floor(rating))}
      <span className="text-gray-400 font-body text-xs ml-2">{rating}/5</span>
    </span>
  );
}

export default function ProductCard({ product }: Props) {
  const isHighlighted = product.highlight ?? false;
  const href = product.affiliateUrl || "/go/iherb?source=product-card";

  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-7 mb-6 sm:mb-7 relative border-2 transition-all duration-300 hover:shadow-md ${
        isHighlighted ? "border-leaf-500 shadow-md shadow-leaf-100" : "border-gray-100"
      }`}
    >
      <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6 bg-leaf-500 text-white font-body font-bold text-xs px-3 sm:px-4 py-1.5 rounded-full">
        #{product.rank} {product.badge}
      </div>

      <div className="mt-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
          <h3 className="font-display text-lg sm:text-xl font-bold text-bark leading-snug">
            {product.name}
          </h3>
          <span className="font-body font-bold text-lg sm:text-xl text-leaf-600 shrink-0">
            {product.price}
          </span>
        </div>
        <Stars rating={product.rating} />
        <p className="font-body text-sm text-gray-600 leading-relaxed mt-4 mb-5">
          {product.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
          <div>
            <div className="font-body font-bold text-xs text-leaf-600 uppercase tracking-widest mb-2">
              ✅ Pros
            </div>
            {product.pros.map((p) => (
              <div key={p} className="font-body text-sm text-gray-600 mb-1">
                • {p}
              </div>
            ))}
          </div>
          <div>
            <div className="font-body font-bold text-xs text-red-500 uppercase tracking-widest mb-2">
              ❌ Cons
            </div>
            {product.cons.map((c) => (
              <div key={c} className="font-body text-sm text-gray-600 mb-1">
                • {c}
              </div>
            ))}
          </div>
        </div>
        <Link
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="no-underline block w-full text-center bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-6 py-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          {product.buttonText || "Check Price →"}
        </Link>
      </div>
    </div>
  );
}
