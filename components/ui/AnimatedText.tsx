import React from 'react'
import { MotiText } from 'moti'
import { TextProps } from 'react-native'

interface AnimatedTextProps extends TextProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'typewriter' | 'none'
  delay?: number
  duration?: number
  className?: string
  easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring'
}

const AnimatedText = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  className = '',
  easing = 'easeInOut',
  ...props
}: AnimatedTextProps) => {
  const getAnimationConfig = () => {
    switch (animation) {
      case 'slideUp':
        return {
          from: { opacity: 0, translateY: 30 },
          animate: { opacity: 1, translateY: 0 }
        }
      case 'slideDown':
        return {
          from: { opacity: 0, translateY: -30 },
          animate: { opacity: 1, translateY: 0 }
        }
      case 'slideLeft':
        return {
          from: { opacity: 0, translateX: -30 },
          animate: { opacity: 1, translateX: 0 }
        }
      case 'slideRight':
        return {
          from: { opacity: 0, translateX: 30 },
          animate: { opacity: 1, translateX: 0 }
        }
      case 'scale':
        return {
          from: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 }
        }
      case 'typewriter':
        return {
          from: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 }
        }
      case 'fadeIn':
        return {
          from: { opacity: 0 },
          animate: { opacity: 1 }
        }
      default:
        return {
          from: { opacity: 1 },
          animate: { opacity: 1 }
        }
    }
  }

  const config = getAnimationConfig()

  const getTransition = () => {
    const baseTransition = {
      duration,
      delay
    }

    if (animation === 'typewriter') {
      return {
        type: 'spring' as const,
        delay
      }
    }

    switch (easing) {
      case 'spring':
        return {
          type: 'spring' as const,
          damping: 15,
          stiffness: 150,
          delay
        }
      case 'ease':
      case 'easeIn':
      case 'easeOut':
      case 'easeInOut':
      default:
        return {
          type: 'timing' as const,
          ...baseTransition
        }
    }
  }

  return (
    <MotiText
      {...config}
      transition={getTransition()}
      className={className}
      {...props}
    >
      {children}
    </MotiText>
  )
}

export default AnimatedText