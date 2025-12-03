import { TouchableOpacity, ViewStyle, View } from "react-native";
import { MotiView } from "moti";
import { Heart } from "lucide-react-native";
import { HapticFeedback } from "./haptic-feedback";

interface AnimatedHeartProps {
  isLiked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: number;
  className?: string;
  style?: ViewStyle;
  containerClassName?: string;
  containerStyle?: ViewStyle;
  likedColor?: string;
  unlikedColor?: string;
  hapticType?: "light" | "medium" | "heavy" | "selection";
}

const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  isLiked,
  onToggle,
  disabled = false,
  size = 16,
  className = "absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-sm",
  style,
  containerClassName,
  containerStyle,
  likedColor = "#ec4899",
  unlikedColor = "#6b7280",
  hapticType = "light",
}) => {
  const handlePress = () => {
    if (disabled) return;

    // Trigger haptic feedback
    HapticFeedback.trigger(hapticType);

    // Call the toggle function
    onToggle();
  };

  return (
    <View style={containerStyle} className={containerClassName}>
      <TouchableOpacity
        className={className}
        style={style}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{
            scale: isLiked ? [1, 1.2, 1] : 1,
          }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
          }}
        >
          <Heart
            size={size}
            color={isLiked ? likedColor : unlikedColor}
            fill={isLiked ? likedColor : "transparent"}
          />
        </MotiView>
      </TouchableOpacity>
    </View>
  );
};

export default AnimatedHeart;
