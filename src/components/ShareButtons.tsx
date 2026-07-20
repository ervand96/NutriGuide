"use client";

import { useState } from "react";

export default function ShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-y border-gray-100 my-8">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-1">
        Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center min-h-[44px] text-sm font-semibold text-bark bg-leaf-50 hover:bg-leaf-100 border border-leaf-100 px-4 py-2.5 rounded-full no-underline transition-colors"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center min-h-[44px] text-sm font-semibold text-bark bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-full transition-colors"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
