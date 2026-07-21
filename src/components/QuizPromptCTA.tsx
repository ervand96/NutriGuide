import Link from "next/link";

export default function QuizPromptCTA({
  topic,
}: {
  topic?: string | null;
}) {
  const href = topic ? `/quiz?prefill=${encodeURIComponent(topic)}` : "/quiz";

  return (
    <section className="my-8 sm:my-10 rounded-2xl border border-gray-100 bg-white p-5 sm:p-7 text-center">
      <h2 className="font-display font-black text-xl sm:text-2xl text-bark mb-2">
        Not sure if this is right for you?
      </h2>
      <p className="text-gray-500 text-sm mb-5 max-w-md mx-auto">
        Answer a few quick questions and get a personalized starter stack with
        shop links.
      </p>
      <Link
        href={href}
        className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-bold px-6 no-underline text-sm sm:text-base"
      >
        Take our 30-second quiz →
      </Link>
    </section>
  );
}
