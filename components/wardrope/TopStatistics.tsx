import { View, Text } from "react-native";
import React from "react";
import AnimatedView from "../ui/AnimatedView";
import { LayoutGrid, Heart } from "lucide-react-native";
import AnimatedText from "../ui/AnimatedText";

const statistics = [
  {
    id: 1,
    title: "Total Outfits",
    icon: LayoutGrid,
    value: 12,
    color: "#6366f1",
  },
  {
    id: 2,
    title: "Favorites",
    icon: Heart,
    value: 8,
    color: "#ec4899",
  },
];

const TopStatistics = () => {
  return (
    <View className="flex-row justify-between gap-3 px-4 mt-4">
      {statistics.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <AnimatedView
            key={stat.id}
            animation="scale"
            delay={index * 100}
            duration={400}
            className="flex-1 bg-white p-3 rounded-xl border border-gray-100"
          >
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <IconComponent size={16} color={stat.color} />
              </View>
              <View className="ml-3 flex-col">
                <AnimatedText
                  animation="scale"
                  delay={index * 100 + 200}
                  className="text-2xl font-bold text-gray-800"
                >
                  {stat.value}
                </AnimatedText>
                <AnimatedText
                  animation="scale"
                  delay={index * 100 + 300}
                  className="text-sm text-gray-500 text-center font-medium"
                >
                  {stat.title}
                </AnimatedText>
              </View>
            </View>
          </AnimatedView>
        );
      })}
    </View>
  );
};

export default TopStatistics;
