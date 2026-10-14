import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone, Sparkles } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

export const metadata = { title: "Visit us | Satvik Food Court", description: "Find Satvik Food Court at Vashisht Complex, Kohta, Hamirpur, Himachal Pradesh. Open daily from 9 AM." };

const address = "Vashisht Complex, behind Kapil General Store, Kohta, Hamirpur, Himachal Pradesh 177001";
const mapUrl = "https://maps.google.com/?q=MGQC%2B78+Hamirpur+Himachal+Pradesh";

export default function DirectionsPage() {
  return <><PageIntro eyebrow="We’ll put the kettle on" title={<>Your next good<br /><em>meal is right here.</em></>} copy="Find us in Kohta, right behind Kapil General Store. We’re easy to get to and even easier to stay at." />
    <section className="directions-section"><div className="map-card"><iframe title="Map showing Satvik Food Court in Hamirpur" src="https://maps.google.com/maps?q=MGQC%2B78%20Hamirpur%20Himachal%20Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="map-open" href={mapUrl} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={15}/></a><span className="map-code"><MapPin size={14}/> MGQC+78</span></div><div className="visit-info"><span className="eyebrow"><i /> Come find us</span><h2>Satvik Food Court<br /><em>सात्विक फूड कोर्ट</em></h2><div className="info-row"><MapPin /><div><strong>Our address</strong><p>{address}</p><a href={mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={13}/></a></div></div><div className="info-row"><Clock3 /><div><strong>When to visit</strong><p>Opens daily at 9:00 AM</p><small>Hours may vary on holidays.</small></div></div><div className="info-row"><Phone /><div><strong>Questions? Call us.</strong><p><a href="tel:08091952445">080919 52445</a></p></div></div><a href="tel:08091952445" className="button button-dark visit-call">Give us a call <ArrowUpRight size={15}/></a></div></section>
    <section className="visit-amenities"><div><span className="eyebrow"><i /> A good place to gather</span><h2>Come for the food.<br /><em>Stay for the feeling.</em></h2></div><div className="amenities-list"><span><Sparkles /> Casual atmosphere</span><span><Sparkles /> Good for kids</span><span><Sparkles /> Solo dining</span><span><Sparkles /> LGBTQ+ friendly</span><span><Sparkles /> Groups welcome</span><span><Sparkles /> Restroom available</span></div></section>
    <section className="directions-bottom"><p>Coming with an appetite?</p><Link href="/menu" className="underlined-link">Browse the menu <ArrowUpRight size={15}/></Link></section>
  </>;
}
