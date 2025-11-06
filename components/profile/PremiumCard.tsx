import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import { AnimatePresence, MotiView } from "moti";
import MonthlyPriceTab from "./tabs/MonthlyPriceTab";
import YearlyPriceTab from "./tabs/YearlyPriceTab";
import { Crown } from "lucide-react-native";
import GradientView from "../GradientView";
import { Colors } from "@/constants";
const PremiumCard = () => {
  const [activeTab, setActiveTab] = useState<"monthly" | "yearly">("monthly");

  const tabs = [
    { key: "monthly", title: "Monthly" },
    { key: "yearly", title: "Yearly" },
  ];

  return (
    <AnimatedView className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header Section */}
      <GradientView
        preset="custom"
        colors={[Colors.mutedPink[500],Colors.mutedPink[600],Colors.mutedPink[700],Colors.mutedPink[800]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className=" p-4">
          <View className="flex-row items-center gap-3">
            <Crown color="white" size={24} />
            <View className="text-wrap">
              <Text className="text-2xl font-bold text-white">
                Virtual Room Premium
              </Text>
              <Text className="text-white text-sm">
                Kendiniz üzerinde sınırsız deneme yapın!
              </Text>
            </View>
          </View>

          {/* Tab Buttons */}
          <View className="flex-row rounded-xl bg-gray-200 mt-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  className="flex-1"
                  onPress={() => setActiveTab(tab.key as "monthly" | "yearly")}
                  activeOpacity={0.8}
                >
                  {isActive ? (
                    <View className="rounded-lg py-2 bg-white">
                      <Text className="text-virtual-primary text-center font-semibold text-sm">
                        {tab.title}
                      </Text>
                    </View>
                  ) : (
                    <View className="rounded-lg py-2 bg-transparent">
                      <Text className="text-gray-500 text-center font-semibold text-sm">
                        {tab.title}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </GradientView>

      {/* Tab Content */}
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={activeTab}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -20 }}
          transition={{ type: "timing", duration: 200 }}
        >
          {activeTab === "monthly" ? <MonthlyPriceTab /> : <YearlyPriceTab />}
        </MotiView>
      </AnimatePresence>
    </AnimatedView>
  );
};

export default PremiumCard;
