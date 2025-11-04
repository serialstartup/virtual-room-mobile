import React from 'react';
import { MotiText } from 'moti';
import { TextStyle } from 'react-native';

interface AnimatedTextProps {
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
  style?: TextStyle;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  from = { opacity: 0, translateY: 10 },
  animate = { opacity: 1, translateY: 0 },
  transition = { type: 'timing', duration: 400 },
  style,
}) => {
  return (
    <MotiText
      from={from}
      animate={animate}
      transition={transition}
      style={style}
    >
      {children}
    </MotiText>
  );
};