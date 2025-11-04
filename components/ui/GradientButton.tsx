import {
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";
import React from "react";

export type GradientPreset = 
  | 'primary' 
  | 'secondary' 
  | 'pink' 
  | 'dark' 
  | 'light' 
  | 'accent';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  preset?: GradientPreset;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "filled" | "outlined";
  style?: ViewStyle;
  textStyle?: TextStyle;
  borderRadius?: number;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  preset = "pink",
  disabled = false,
  size = "medium",
  variant = "filled",
  style,
  textStyle,
  borderRadius = 12,
}) => {
  const sizeClasses = {
    small: "py-2 px-4 min-h-[36px]",
    medium: "py-3 px-6 min-h-[48px]", 
    large: "py-4 px-8 min-h-[56px]",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // Preset color classes
  const presetClasses = {
    primary: {
      filled: "bg-black border-black",
      outlined: "border-black",
      text: {
        filled: "text-white",
        outlined: "text-black"
      }
    },
    secondary: {
      filled: "bg-gray-500 border-gray-500",
      outlined: "border-gray-600",
      text: {
        filled: "text-white",
        outlined: "text-gray-600"
      }
    },
    pink: {
      filled: "bg-pink-500 border-pink-500",
      outlined: "border-pink-500",
      text: {
        filled: "text-white",
        outlined: "text-pink-500"
      }
    },
    dark: {
      filled: "bg-gray-900 border-gray-900",
      outlined: "border-gray-900",
      text: {
        filled: "text-white",
        outlined: "text-gray-900"
      }
    },
    light: {
      filled: "bg-gray-100 border-gray-100",
      outlined: "border-gray-300",
      text: {
        filled: "text-gray-900",
        outlined: "text-black"
      }
    },
    accent: {
      filled: "bg-pink-600 border-pink-600",
      outlined: "border-pink-600",
      text: {
        filled: "text-white",
        outlined: "text-pink-600"
      }
    }
  };

  const currentPreset = presetClasses[preset];

  if (variant === "outlined") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`items-center justify-center border-2 bg-transparent ${currentPreset.outlined} ${sizeClasses[size]} ${disabled ? 'opacity-50' : 'opacity-100'}`}
        style={[{ borderRadius }, style]}
      >
        <Text className={`font-semibold text-center ${currentPreset.text.outlined} ${textSizeClasses[size]}`} style={textStyle}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center border-2 ${currentPreset.filled} ${sizeClasses[size]} ${disabled ? 'opacity-50' : 'opacity-100'}`}
      style={[{ borderRadius }, style]}
    >
      <Text className={`font-semibold text-center ${currentPreset.text.filled} ${textSizeClasses[size]}`} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default GradientButton;
