import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import UploadModelTab from "./tabs/UploadModelTab";
import ChooseModelTab from "./tabs/ChooseModelTab";

const PersonModal = () => {
  const [activeTab, setActiveTab] = useState<"uploadImage" | "model">(
    "uploadImage"
  );

  const tabs = [
    { key: "uploadImage", title: "Resmini Yükle" },
    { key: "model", title: "Model Seç" },
  ];

  return (
    <View style={{ minHeight: 250 }}>
      {/* Tab Buttons */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-end mb-6 gap-2">
          <Text className="text-2xl font-semibold text-virtual-primary">
            Step 1:
          </Text>
          <Text className="text-2xl font-semibold ">Choose Model</Text>
        </View>
        <View className="flex-row rounded-2xl bg-gray-300 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                className="flex-1 mx-1"
                onPress={() => setActiveTab(tab.key as "uploadImage" | "model")}
                activeOpacity={0.8}
              >
                {isActive ? (
                  <View className="rounded-2xl py-3 bg-white">
                    <Text className="text-virtual-primary text-center font-semibold text-sm">
                      {tab.title}
                    </Text>
                  </View>
                ) : (
                  <View className="rounded-xl py-3 bg-transparent">
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

      {/* Tab Content */}
      <AnimatePresence exitBeforeEnter>
        <MotiView
          key={activeTab}
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -20 }}
          transition={{ type: "timing", duration: 200 }}
        >
          {activeTab === "uploadImage" ? <UploadModelTab /> : <ChooseModelTab />}
        </MotiView>
      </AnimatePresence>
    </View>
  );
};

export default PersonModal;
