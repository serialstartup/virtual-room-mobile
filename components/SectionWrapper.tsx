import { StyleSheet, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { Colors } from '../constants'

interface SectionWrapperProps {
  children: ReactNode
  backgroundColor?: string
  padding?: number
  margin?: number
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  style?: ViewStyle
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  backgroundColor = Colors.background,
  padding = 16,
  margin = 0,
  borderRadius = 8,
  borderWidth = 0,
  borderColor = Colors.border,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          padding,
          margin,
          borderRadius,
          borderWidth,
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}

export default SectionWrapper

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})
