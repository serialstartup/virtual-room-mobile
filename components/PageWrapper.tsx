import { StyleSheet, StatusBar, ViewStyle, View } from "react-native";
import { type ReactNode, type FC } from "react";
import { Colors } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

interface PageWrapperProps {
  children: ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "default" | "light-content" | "dark-content";
  statusBarBackgroundColor?: string;
  padding?: number;
  style?: ViewStyle;
  withoutTopEdge?: boolean;
}

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  backgroundColor = Colors.background,
  statusBarStyle = "dark-content",
  statusBarBackgroundColor = Colors.background,
  padding = 0,
  style,
  withoutTopEdge = false,
}) => {
  if (withoutTopEdge) {
    return (
      <SafeAreaView
        edges={["left", "right"]}
        style={[styles.container, { backgroundColor, padding }, style]}
      >
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarBackgroundColor}
          translucent={false}
        />
        {children}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor, padding }, style]}
    >
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor}
        translucent={false}
      />
      {children}
    </SafeAreaView>
  );
};

export default PageWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
