
"use client";

import { 
  motion, 
  AnimatePresence as FramerAnimatePresence,
  MotionProps,
  HTMLMotionProps
} from "framer-motion";

export type { MotionProps, HTMLMotionProps };

// Re-export motion as Motion to maintain the casing pattern used in the project
export const Motion = motion;

// Properly re-export AnimatePresence as a component
export const AnimatePresence: typeof FramerAnimatePresence = (props) => {
  return <FramerAnimatePresence {...props} />;
};
