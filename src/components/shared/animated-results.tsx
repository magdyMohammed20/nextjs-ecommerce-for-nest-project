"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Smoothly crossfades its content whenever `signature` changes — use for
 * dashboard filter/search/sort/page switches so results don't snap.
 */
export function AnimatedResults({
  signature,
  children,
}: {
  signature: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={signature}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
