import { type ReactNode } from 'react'
import { MotiView } from 'moti'
import { ViewProps } from 'react-native'

interface AnimatedViewProps extends ViewProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scale' | 'crossfade' | 'none'
  delay?: number
  duration?: number
  className?: string
  easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring'
}

const AnimatedView = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 800,
  className = '',
  easing = 'easeInOut',
  ...props
}: AnimatedViewProps) => {
  const getAnimationConfig = () => {
    switch (animation) {
      case 'slideUp':
        return {
          from: { opacity: 0, translateY: 50 },
          animate: { opacity: 1, translateY: 0 }
        }
      case 'slideDown':
        return {
          from: { opacity: 0, translateY: -50 },
          animate: { opacity: 1, translateY: 0 }
        }
      case 'scale':
        return {
          from: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 }
        }
      case 'fadeIn':
        return {
          from: { opacity: 0 },
          animate: { opacity: 1 }
        }
      case 'crossfade':
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

    switch (easing) {
      case 'spring':
        return {
          type: 'spring' as const,
          damping: 15,
          stiffness: 150,
          delay
        }
      case 'ease':
        return {
          type: 'timing' as const,
          ...baseTransition
        }
      case 'easeIn':
        return {
          type: 'timing' as const,
          ...baseTransition
        }
      case 'easeOut':
        return {
          type: 'timing' as const,
          ...baseTransition
        }
      case 'easeInOut':
      default:
        return {
          type: 'timing' as const,
          ...baseTransition
        }
    }
  }

  return (
    <MotiView
      {...config}
      transition={getTransition()}
      className={className}
      {...props}
    >
      {children}
    </MotiView>
  )
}

export default AnimatedView