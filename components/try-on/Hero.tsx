import { View, Text } from "react-native";
import React from "react";
import GradientView from "../GradientView";
import StepIndicator from "./StepIndicator";
import { useTryOnSteps } from "@/components/try-on/useTryOnSteps";

const Hero = () => {
    const { step, next, prev, totalSteps } = useTryOnSteps();
  
  return (
    <View className=" rounded-b-3xl overflow-hidden">
      <GradientView
        preset="accent"
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-col items-center justify-center pt-20 pb-4 px-10 gap-4">
          <Text className="text-center text-white font-semibold text-4xl">
            Virtual Try-On
          </Text>
          <Text className=" text-center text-gray-200 mb-6">
            Upload your photo and see how clothes look on you before you buy!
          </Text>
        </View>
      <StepIndicator currentStep={step} totalSteps={totalSteps} />
      </GradientView>
    </View>
  );
};

export default Hero;
