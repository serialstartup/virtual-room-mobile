import { View, Text } from "react-native";

const TitleSectionTab = ({ title, children }) => {
  return (
    <View className="p-4">
      <Text className="font-outfit-semibold text-base mb-4">{title}</Text>
      {children}
    </View>
  );
};

export default TitleSectionTab;
