import * as motion from 'motion/react-client';
import type { ReactNode } from 'react';

interface TemplateProps {
  children: ReactNode;
  className?: string;
}

export default function LayoutAnimation({
  children,
  className = '',
}: TemplateProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
