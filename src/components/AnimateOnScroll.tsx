"use client";

import { useEffect, useRef, useState } from "react";

type Animation = "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";

interface Props {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
}

export default function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Above-the-fold content can miss the first paint if we wait for IO;
    // reveal immediately when already in (or near) the viewport.
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
    if (inView) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 0px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`animate-on-scroll animate-${animation} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
