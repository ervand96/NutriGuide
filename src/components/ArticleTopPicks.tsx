import Link from "next/link";
import { Product } from "@/types";
import ProductShelf from "./ProductShelf";

export default function ArticleTopPicks({
  products,
  slug,
}: {
  products: Product[];
  slug: string;
}) {
  return (
    <ProductShelf
      title="Shop Our Top Picks"
      subtitle="Swipe to compare — real prices, ratings & photos"
      products={products}
      slugPrefix={slug}
      className="mb-8 sm:mb-10 -mx-4 sm:mx-0 px-4 sm:px-0"
    />
  );
}
