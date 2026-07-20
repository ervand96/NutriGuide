import GuideShelfCard, { GuideCardPost } from "./GuideShelfCard";

/** Beautiful shelf-style article card — used sitewide */
export default function ArticleCard({
  article,
  rank = 1,
}: {
  article: GuideCardPost;
  rank?: number;
}) {
  return <GuideShelfCard post={article} rank={rank} />;
}
