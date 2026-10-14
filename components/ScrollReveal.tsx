"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".reveal-child", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .12, delay, ease: "power2.out", scrollTrigger: { trigger: root.current, start: "top 88%", once: true } });
    }, root);
    return () => ctx.revert();
  }, [delay]);
  return <div ref={root} className={className}>{children}</div>;
}
