/**
 * Centralized Framer Motion Animation System
 * Smooth, subtle, purposeful editorial micro-interactions
 * Respects user's reduced-motion preference
 */

export const transitionDefaults = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for luxurious, snappy feel
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitionDefaults,
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefaults,
  },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionDefaults,
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionDefaults,
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalContent = {
  hidden: { opacity: 0, scale: 0.96, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 350 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.2 },
  },
};

export const slideDrawerRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.28, ease: [0.32, 0, 0.67, 0] },
  },
};

export const slideDrawerLeft = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.28, ease: [0.32, 0, 0.67, 0] },
  },
};

export const slideDrawerBottom = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring', damping: 30, stiffness: 300 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.25 },
  },
};

export const accordionMotion = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
  },
};
