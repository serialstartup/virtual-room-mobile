import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DescriptionDressTab from "./tabs/DescriptionDressTab";
import UploadDressTab from "./tabs/UploadDressTab";
import ProductDressTab from "./tabs/ProductDressTab";

const DressModal = () => {
  const [activeTab, setActiveTab] = useState<
    "description" | "uploadDress" | "chooseDress"
  >("description");

  const tabs = [
    { key: "description", title: "Tarif et" },
    { key: "uploadDress", title: "Kıyafet Yükle" },
    { key: "chooseDress", title: "Kıyafet Seç" },
  ];

  return (
    <View style={{ minHeight: 280 }}>
      {/* Tab Buttons */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-end mb-6 gap-2">
          <Text className="text-2xl font-semibold text-virtual-primary">
            Step 2:
          </Text>
          <Text className="text-2xl font-semibold ">Choose Clothing</Text>
        </View>
        <View className="flex-row rounded-2xl bg-gray-300 p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                className="flex-1 mx-1"
                onPress={() =>
                  setActiveTab(
                    tab.key as "description" | "uploadDress" | "chooseDress"
                  )
                }
                activeOpacity={0.8}
              >
                {isActive ? (
                  <View className="rounded-2xl py-3 bg-white">
                    <Text className="text-black text-center font-semibold text-sm">
                      {tab.title}
                    </Text>
                  </View>
                ) : (
                  <View className="rounded-xl py-3 bg-transparent">
                    <Text className="text-white text-center font-semibold text-sm">
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
      <View>
        {activeTab === "description" ? (
          <DescriptionDressTab />
        ) : activeTab === "uploadDress" ? (
          <UploadDressTab />
        ) : (
          <ProductDressTab />
        )}
      </View>
    </View>
  );
};

export default DressModal;
