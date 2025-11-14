import { useEffect, type ReactNode, type FC } from 'react';
import { MotiView, AnimatePresence } from 'moti';
import { ViewProps } from 'react-native';

interface FadeTransitionProps extends ViewProps {
  children: ReactNode;
  visible: boolean;
  duration?: number;
  delay?: number;
  exitDuration?: number;
  className?: string;
  onExitComplete?: () => void;
}

const FadeTransition: FC<FadeTransitionProps> = ({
  children,
  visible,
  duration = 300,
  delay = 0,
  exitDuration = 200,
  className,
  onExitComplete,
  ...props
}) => {
  useEffect(() => {
    if (!visible && onExitComplete) {
      // Call onExitComplete after exit animation completes
      const timer = setTimeout(onExitComplete, exitDuration + delay);
      return () => clearTimeout(timer);
    }
  }, [visible, onExitComplete, exitDuration, delay]);

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{
            opacity: 0,
            scale: 0.95,
            translateY: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            translateY: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            translateY: -10,
          }}
          transition={{
            type: 'timing',
            duration,
            delay,
          }}
          exitTransition={{
            type: 'timing',
            duration: exitDuration,
          }}
          className={className}
          {...props}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default FadeTransition;