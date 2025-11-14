// components/try-on/StepIndicator.tsx
import { View } from "react-native";

type Props = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({ currentStep, totalSteps }: Props) => {
  return (
    <View className="flex-row justify-center items-center mt-4 mb-6">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isActive = i + 1 <= currentStep;
        return (
          <View
            key={i}
            className={`h-2 w-8 mx-1 rounded-full ${
              isActive ? "bg-virtual-primary" : "bg-virtual-primary-light"
            }`}
          />
        );
      })}
    </View>
  );
};

export default StepIndicator;
