import { Text as RNText, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  className?: string;
}

export function Text({ className, style, ...props }: CustomTextProps) {
  return (
    <RNText
      className={`font-outfit text-base text-virtual-text-muted-dark ${className || ""}`}
      style={style}
      {...props}
    />
  );
}
