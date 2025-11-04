import { StyleSheet, StatusBar, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { Colors } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'

interface PageWrapperProps {
  children: ReactNode
  backgroundColor?: string
  statusBarStyle?: 'default' | 'light-content' | 'dark-content'
  statusBarBackgroundColor?: string
  padding?: number
  style?: ViewStyle
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  backgroundColor = Colors.background,
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = Colors.background,
  padding = 0,
  style,
}) => {
  return (
    <SafeAreaView edges={['left','right']} style={[styles.container, { backgroundColor, padding }, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor}
        translucent={false}
      />
      {children}
    </SafeAreaView>
  )
}

export default PageWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})