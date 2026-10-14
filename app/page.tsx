import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Heart, MapPin, MoveUpRight, Star, UsersRound, Utensils } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const FoodHero3D = dynamic(() => import("@/components/FoodHero3D"), { ssr: false, loading: () => <div className="hero-canvas hero-loading"><div className="pizza-loader">✦</div></div> });

const specialties = [
  { emoji: "🥟", title: "Momo love", text: "Steamed, pan-fried, or golden crisp. Always worth sharing.", color: "mint", href: "/menu#momos" },
  { emoji: "🍕", title: "Pizza plans", text: "From Margherita comfort to a full-on Farm House.", color: "peach", href: "/menu#pizzas" },
  { emoji: "🧇", title: "Sweet endings", text: "Waffles, shakes and little reasons to linger.", color: "butter", href: "/menu#waffles" },
];

export default function Home() {
  return <>
    <section className="hero-section">
      <div className="hero-copy"><span className="eyebrow"><i /> A happy place for every craving</span><h1>Made with heart.<br /><em>Served with a smile.</em></h1><p className="hero-description">A little bit of everything, a lot of good food. Find your favourite comfort bite at Satvik Food Court.</p><div className="hero-actions"><Link className="button button-dark" href="/menu">Explore the menu <ArrowUpRight size={17} /></Link><Link className="text-link" href="/directions">Come say hello <ArrowRight size={16} /></Link></div><div className="hero-rating"><span className="rating-stars"><Star size={15} fill="currentColor" /><b>3.8</b></span><span>from 79 Google reviews</span><i /> <span>₹200–1,400 per person</span></div></div>
      <div className="hero-art"><div className="art-blob" /><div className="art-sun" /><FoodHero3D /><span className="orbit-note note-one">made fresh<br />with love <Heart size={13} fill="currentColor" /></span><span className="orbit-note note-two"><b>100%</b><br />vegetarian</span><span className="art-caption">A LITTLE TASTE OF THE GOOD LIFE <ArrowDown size={13} /></span></div>
      <div className="hero-bottom-note"><span aria-hidden="true" /><span>HAMIRPUR · HIMACHAL PRADESH</span></div>
    </section>
    <section className="welcome-band"><div className="welcome-photo" role="img" aria-label="Warm interior of Satvik Food Court" style={{ backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/WhatsApp%20Image%202026-10-15%20at%201.44.09%20AM.jpeg")` }} /><div className="welcome-content"><div className="welcome-title"><span className="eyebrow"><i /> Your table is waiting</span><h2>Come as you are.<br /><em>Leave a little happier.</em></h2></div><p>Quick lunch, long catch-up, solo snack or family dinner. We’ve saved you a seat.</p><Link href="/about" className="round-link" aria-label="Learn about Satvik Food Court"><ArrowUpRight /></Link></div></section>
    <section className="specialties-section"><div className="section-heading"><div><span className="eyebrow"><i /> The good stuff</span><h2>What sounds <em>good?</em></h2></div><Link href="/menu" className="underlined-link">See the full menu <ArrowRight size={15} /></Link></div><ScrollReveal className="specialty-grid">{specialties.map((item, index)=><Link key={item.title} href={item.href} className={`specialty-card ${item.color} reveal-child`}><div className="specialty-top"><span>0{index+1} / SATVIK FAVOURITES</span><ArrowUpRight size={18} /></div><span className="specialty-emoji">{item.emoji}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></Link>)}</ScrollReveal></section>
    <section className="visit-strip"><div className="visit-stamp"><span>GOOD<br />FOOD<br /><b>GOOD</b><br />MOOD</span><span className="stamp-star">✳</span></div><div className="visit-copy"><span className="eyebrow"><i /> Find your way here</span><h2>Himachali hospitality.<br /><em>Hamirpur heart.</em></h2><p>Right behind Kapil General Store at Vashisht Complex. Drop in from 9 in the morning.</p><Link href="/directions" className="button button-cream">Plan your visit <ArrowUpRight size={16} /></Link></div><div className="visit-details"><div><MapPin size={18} /><span>Kohta, Hamirpur<br />Himachal Pradesh 177001</span></div><div><Clock3 size={18} /><span>Opens at<br />9:00 AM</span></div><div><UsersRound size={18} /><span>Come solo, bring the kids,<br />or gather your whole group.</span></div></div></section>
    <section className="values-row"><ScrollReveal className="values-inner"><div className="reveal-child"><Utensils /><span>Vegetarian goodness</span></div><div className="reveal-child"><Heart /><span>Good for everyone</span></div><div className="reveal-child"><UsersRound /><span>Easy, casual dining</span></div><div className="reveal-child"><MoveUpRight /><span>Dine-in · Takeaway · Delivery</span></div></ScrollReveal></section>
  </>;
}
