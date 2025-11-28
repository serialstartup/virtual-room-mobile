import { MotiText } from 'moti'
import { TextProps } from 'react-native'

interface AnimatedTextProps extends TextProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'typewriter' | 'stagger' | 'bounce' | 'none'
  delay?: number
  duration?: number
  className?: string
  easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring' | 'bounce'
  stagger?: number
  staggerFrom?: 'left' | 'right' | 'center'
}

const AnimatedText = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  className = '',
  easing = 'easeInOut',
  stagger = 0,
  staggerFrom = 'left',
  ...props
}: AnimatedTextProps) => {
  const getAnimationConfig = () => {
    const getSlideDistance = () => {
      switch (staggerFrom) {
        case 'left': return -30
        case 'right': return 30
        case 'center': return 0
        default: return 0
      }
    }

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
      case 'bounce':
        return {
          from: { opacity: 0, scale: 0.3, translateY: 20 },
          animate: { opacity: 1, scale: 1, translateY: 0 }
        }
      case 'typewriter':
        return {
          from: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 }
        }
      case 'stagger':
        return {
          from: { opacity: 0, translateX: getSlideDistance(), scale: 0.95 },
          animate: { opacity: 1, translateX: 0, scale: 1 }
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
    const finalDelay = delay + stagger
    const baseTransition = {
      duration,
      delay: finalDelay
    }

    // Special cases for specific animations
    if (animation === 'typewriter') {
      return {
        type: 'spring' as const,
        damping: 20,
        stiffness: 200,
        delay: finalDelay
      }
    }

    if (animation === 'bounce') {
      return {
        type: 'spring' as const,
        damping: 10,
        stiffness: 300,
        delay: finalDelay
      }
    }

    if (animation === 'stagger') {
      return {
        type: 'spring' as const,
        damping: 15,
        stiffness: 200,
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
          stiffness: 250,
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