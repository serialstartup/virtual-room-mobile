import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import TitleSectionTab from "./TitleSectionTab";
import { FlashList } from "@shopify/flash-list";

const models = [
  {
    id: 1,
    name: "Sarah",
    image: require("@/assets/images/model1.jpg"),
  },
  {
    id: 2,
    name: "Emily",
    image: require("@/assets/images/model2.jpg"),
  },
  {
    id: 3,
    name: "Alexandra",
    image: require("@/assets/images/model3.jpg"),
  },
  {
    id: 4,
    name: "Becky",
    image: require("@/assets/images/model4.jpg"),
  },
  {
    id: 5,
    name: "Seth",
    image: require("@/assets/images/model5.jpg"),
  },
  {
    id: 6,
    name: "Johnny",
    image: require("@/assets/images/model6.jpg"),
  },
];

const ChooseModelTab = () => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity className="mr-4 items-center">
        <View className="w-44 h-56 rounded-xl overflow-hidden border-2 border-gray-200">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="mt-2 text-sm font-medium text-gray-700">
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <TitleSectionTab title="Model seç">
      <View >
        <FlashList
          horizontal
          data={models}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </TitleSectionTab>
  );
};

export default ChooseModelTab;
