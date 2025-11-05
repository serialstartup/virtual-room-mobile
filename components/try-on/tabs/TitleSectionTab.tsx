import { View, Text } from "react-native";
import React from "react";

const TitleSectionTab = ({ title, children }) => {
  return (
    <View className="p-4">
      <Text className="font-semibold text-base mb-4">{title}</Text>
      {children}
    </View>
  );
};

export default TitleSectionTab;
