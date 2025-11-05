import { View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  style?: ViewStyle
  className?: string
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  style,
  className = "w-full bg-white rounded-lg"
}) => {
  return (
    <View
      className={className}
      style={style}
    >
      {children}
    </View>
  )
}

export default SectionWrapper
