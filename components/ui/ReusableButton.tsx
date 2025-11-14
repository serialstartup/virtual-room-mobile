import { Text, TouchableOpacity, ViewStyle } from "react-native";
import { type FC } from "react";

interface ReusableButtonProps {
  title: string;
  onPress: () => void;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  style?: ViewStyle;
  textColor?: string;
  borderColor?: string;
  bgColor?: string;
  padding?: string;
  buttonShadow?: boolean;
  textShadow?: boolean;
}

const ReusableButton: FC<ReusableButtonProps> = ({
  title,
  onPress,
  variant = "filled",
  disabled = false,
  style,
  textColor,
  borderColor,
  bgColor,
  padding,
  textShadow = false,
  buttonShadow = false,
}) => {
  if (variant === "outlined") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`items-center justify-center border-[1px] bg-transparent min-h-[40px] rounded-xl ${padding ? padding : "py-2 px-4"} ${disabled ? "opacity-50" : "opacity-100"} ${borderColor ? borderColor : "border-white"} ${buttonShadow ? "shadow-lg shadow-black/50" : ""}`}
        style={style}
      >
        <Text
          className={`font-semibold text-center text-base ${textColor ? textColor : "text-white"} ${textShadow && "text-shadow-lg"}`}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center min-h-[40px] rounded-xl ${padding ? padding : "py-2 px-4"} ${disabled ? "opacity-50" : "opacity-100"} ${bgColor ? bgColor : "bg-white"} ${buttonShadow ? "shadow-md shadow-virtual-primary-light/90" : ""}`}
      style={style}
    >
      <Text
        className={`font-semibold text-center text-base ${textColor ? textColor : "text-black"} ${textShadow && "text-shadow-lg"}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ReusableButton;
