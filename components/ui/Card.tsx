import { StyleSheet, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { Colors } from '../../constants'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: number
  margin?: number
  borderRadius?: number
  style?: ViewStyle
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 16,
  margin = 0,
  borderRadius = 12,
  style,
}) => {
  const variantStyles = {
    default: {
      backgroundColor: Colors.surface,
      borderWidth: 0,
    },
    elevated: {
      backgroundColor: Colors.white[50],
      shadowColor: Colors.black[900],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    outlined: {
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: Colors.border,
    },
  }

  return (
    <View
      style={[
        styles.card,
        variantStyles[variant],
        {
          padding,
          margin,
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
})