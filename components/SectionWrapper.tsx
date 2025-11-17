import { View, ViewStyle } from 'react-native'
import { type ReactNode, type FC } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  style?: ViewStyle
  className?: string
}

const SectionWrapper: FC<SectionWrapperProps> = ({
  children,
  style,
  className = "w-full  rounded-lg"
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
