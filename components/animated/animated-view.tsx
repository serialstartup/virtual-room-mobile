import React from 'react';
import { MotiView } from 'moti';
import { ViewStyle } from 'react-native';

interface AnimatedViewProps {
  children: React.ReactNode;
  from?: any;
  animate?: any;
  transition?: {
    type?: 'timing' | 'spring';
    duration?: number;
    delay?: number;
    repeatReverse?: boolean;
    loop?: boolean;
  };
  style?: ViewStyle;
}

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  from = { opacity: 0, scale: 0.9 },
  animate = { opacity: 1, scale: 1 },
  transition = { type: 'timing', duration: 300 },
  style,
}) => {
  return (
    <MotiView
      from={from}
      animate={animate}
      transition={transition}
      style={style}
    >
      {children}
    </MotiView>
  );
};