"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <AnimatePresence mode="wait" initial={false}><motion.div key={pathname} initial={{ opacity: 0, rotateX: 1.2, y: 10 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} exit={{ opacity: 0, rotateX: -1.2, y: -8 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: "50% 12%" }}>{children}</motion.div></AnimatePresence>;
}
