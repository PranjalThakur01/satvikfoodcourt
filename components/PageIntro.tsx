import { ReactNode } from "react";
export function PageIntro({ eyebrow, title, copy, children }: { eyebrow: string; title: ReactNode; copy?: string; children?: ReactNode }) {
  return <section className="page-intro"><div className="page-intro-inner"><span className="eyebrow"><i />{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}{children}</div></section>;
}
