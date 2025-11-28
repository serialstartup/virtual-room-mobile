import { type ReactNode } from 'react'
import { MotiView } from 'moti'
import { ViewProps } from 'react-native'

interface AnimatedViewProps extends ViewProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scale' | 'crossfade' | 'rotate' | 'bounce' | 'rotateScale' | 'none'
  delay?: number
  duration?: number
  className?: string
  easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce'
  rotateFrom?: string
  rotateTo?: string
  stagger?: number
}

const AnimatedView = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 800,
  className = '',
  easing = 'easeInOut',
  rotateFrom = '0deg',
  rotateTo = '360deg',
  stagger = 0,
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
      case 'rotate':
        return {
          from: { opacity: 0.5, rotate: rotateFrom },
          animate: { opacity: 1, rotate: rotateTo }
        }
      case 'rotateScale':
        return {
          from: { opacity: 0, scale: 0.5, rotate: rotateFrom },
          animate: { opacity: 1, scale: 1, rotate: rotateTo }
        }
      case 'bounce':
        return {
          from: { opacity: 0, scale: 0.3 },
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
    const finalDelay = delay + stagger
    const baseTransition = {
      duration,
      delay: finalDelay
    }

    // Special cases for specific animations
    if (animation === 'bounce') {
      return {
        type: 'spring' as const,
        damping: 8,
        stiffness: 200,
        delay: finalDelay
      }
    }

    if (animation === 'rotateScale' || animation === 'rotate') {
      return {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
        delay: finalDelay
      }
    }

    switch (easing) {
      case 'spring':
        return {
          type: 'spring' as const,
          damping: 15,
          stiffness: 150,
          delay: finalDelay
        }
      case 'bounce':
        return {
          type: 'spring' as const,
          damping: 8,
          stiffness: 200,
          delay: finalDelay
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