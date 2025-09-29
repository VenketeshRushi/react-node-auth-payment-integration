import * as motion from 'motion/react-client';
import type { ReactNode } from 'react';

interface LayoutAnimationProps {
  children: ReactNode;
  className?: string;
}

export default function LayoutAnimation({
  children,
  className = '',
}: LayoutAnimationProps) {
  return (
    <motion.div
      initial={{
        y: 30,
        opacity: 0,
        scale: 0.98,
        filter: 'blur(4px)',
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.4 },
        scale: { duration: 0.5 },
        filter: { duration: 0.3 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
