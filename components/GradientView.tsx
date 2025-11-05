import { ViewStyle, DimensionValue } from 'react-native'
import React, { ReactNode } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export type GradientPreset = 
  | 'primary' 
  | 'secondary' 
  | 'pink' 
  | 'dark' 
  | 'light' 
  | 'accent'
  | 'custom'

interface GradientViewProps {
  children?: ReactNode
  preset?: GradientPreset
  colors?: readonly [string, string, ...string[]]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  style?: ViewStyle
  width?: DimensionValue
  height?: DimensionValue
  borderRadius?: number
  className?: string
}

const gradientPresets: Record<Exclude<GradientPreset, 'custom'>, readonly [string, string, ...string[]]> = {
  primary: ['#202124', '#000000'] as const,
  secondary: ['#a1a1aa', '#3f3f46'] as const,
  pink: ['#f472b6', '#be185d'] as const,
  dark: ['#1a1a1a', '#000000'] as const,
  light: ['#f1f3f4', '#e4e4e7'] as const,
  accent: ['#ec4899', '#9d174d','#F70F83'] as const,
}

const GradientView: React.FC<GradientViewProps> = ({
  children,
  preset = 'primary',
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  width,
  height,
  className,
  borderRadius = 0,
}) => {
  const gradientColors = colors || (preset === 'custom' ? ['#000000', '#71717a'] as const : gradientPresets[preset])

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius,
    ...style,
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={containerStyle}
      className={`overflow-hidden ${className || ''}`}
    >
      {children}
    </LinearGradient>
  )
}

export default GradientView