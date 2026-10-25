"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children?: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Scroll-reveal wrapper used across all sections. */
export function Reveal({
  children,
  delay = 0,
  y = 0,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.2, delay: Math.min(delay, 0.08), ease: "easeOut" }}
      custom={y}
      data-reveal
    >
      {children}
    </motion.div>
  );
}

export { variants as revealVariants };
