"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [{ href: "/", label: "Overview" }, { href: "/menu", label: "Menu" }, { href: "/about", label: "Our story" }, { href: "/directions", label: "Find us" }];

export function SiteHeader() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return <header className="site-header"><Link href="/" className="brand" aria-label="Satvik Food Court home" onClick={() => setMenuOpen(false)}><span className="brand-mark"><Leaf size={19} strokeWidth={1.7} /></span><span><strong>satvik</strong><small>FOOD COURT · HAMIRPUR</small></span></Link><nav id="main-navigation" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={path === link.href ? "page" : undefined} className={path === link.href ? "nav-link active" : "nav-link"} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}<Link href="/menu" className="header-cta mobile-header-cta" onClick={() => setMenuOpen(false)}>Explore menu <ArrowUpRight size={15} /></Link></nav><Link href="/menu" className="header-cta desktop-header-cta">Explore menu <ArrowUpRight size={15} /></Link><button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(open => !open)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}<span>{menuOpen ? "Close" : "More"}</span></button></header>;
}
