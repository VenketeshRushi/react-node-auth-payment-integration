import { cn } from '@/lib/utils';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

interface NavbarWrapperProps {
  children: React.ReactNode;
}

const NavbarWrapper = ({ children }: NavbarWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    setVisible(latest > 100);
  });

  return (
    <motion.header
      ref={ref}
      className='fixed top-0 left-0 right-0 z-50 w-full flex justify-center'
    >
      <motion.div
        animate={{
          backdropFilter: visible ? 'blur(20px)' : 'blur(0px)',
          boxShadow: visible
            ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
            : 'none',
          width: visible ? '80%' : '100%',
          y: visible ? 20 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 30,
        }}
        className={cn(
          'relative z-[60] mx-auto w-full flex flex-row items-center justify-between px-6 py-4 border-b-1',
          visible &&
            'absolute px-6 py-4 border rounded-2xl backdrop-blur-md shadow-sm bg-background/80 border-border'
        )}
      >
        {children}
      </motion.div>
    </motion.header>
  );
};

export default NavbarWrapper;
