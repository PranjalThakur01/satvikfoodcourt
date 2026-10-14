"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Leaf } from "lucide-react";

const links = [{ href: "/", label: "Overview" }, { href: "/menu", label: "Menu" }, { href: "/about", label: "Our story" }, { href: "/directions", label: "Find us" }];

export function SiteHeader() {
  const path = usePathname();
  return <header className="site-header"><Link href="/" className="brand" aria-label="Satvik Food Court home"><span className="brand-mark"><Leaf size={19} strokeWidth={1.7} /></span><span><strong>satvik</strong><small>FOOD COURT · HAMIRPUR</small></span></Link><nav className="main-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} className={path === link.href ? "nav-link active" : "nav-link"}>{link.label}</Link>)}</nav><Link href="/menu" className="header-cta">Explore menu <ArrowUpRight size={15} /></Link></header>;
}
