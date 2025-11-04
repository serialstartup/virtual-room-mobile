import {
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React from "react";

interface ReusableButtonProps {
  title: string;
  onPress: () => void;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  style?: ViewStyle;
  textColor?:string;
  borderColor?: string;
  bgColor?: string;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  title,
  onPress,
  variant = "filled",
  disabled = false,
  style,
  textColor,
  borderColor,
  bgColor
}) => {
  if (variant === "outlined") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`items-center justify-center border-2 bg-transparent py-3 px-6 min-h-[48px] rounded-xl ${disabled ? 'opacity-50' : 'opacity-100'} ${borderColor ? borderColor : 'border-white'}`}
        style={style}
      >
        <Text className={`font-semibold text-center text-base ${textColor ? textColor : 'text-white'}`}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center py-3 px-6 min-h-[48px] rounded-xl ${disabled ? 'opacity-50' : 'opacity-100'} ${bgColor ? bgColor : 'bg-white'}`}
      style={style}
    >
      <Text className={`font-semibold text-center text-base ${textColor ? textColor : 'text-black'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ReusableButton;
