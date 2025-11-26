import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import DescriptionDressTab from "./tabs/DescriptionDressTab";
import UploadTab from "./tabs/UploadTab";
import ChooseClothes from "./ChooseClothes";
interface DressModalProps {
  onImageSelect: (imageUrl: string, description?: string) => void;
  selectedImage?: string;
  selectedDescription?: string;
}

const DressModal: React.FC<DressModalProps> = ({
  onImageSelect,
  selectedImage,
  selectedDescription,
}) => {
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
                className="flex-1"
                onPress={() =>
                  setActiveTab(
                    tab.key as "description" | "uploadDress" | "chooseDress"
                  )
                }
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
          {activeTab === "description" ? (
            <DescriptionDressTab
              onDescriptionChange={(description) =>
                onImageSelect("", description)
              }
              selectedDescription={selectedDescription}
            />
          ) : activeTab === "uploadDress" ? (
            <UploadTab
              onImageSelect={onImageSelect}
              selectedImage={selectedImage}
              title="Kıyafet yükle"
              skeletonTitle="Kıyafet resmini yükless"
            />
          ) : (
            // <UploadDressTab
            //   onImageSelect={onImageSelect}
            //   selectedImage={selectedImage}
            // />
            <ChooseClothes
              onImageSelect={onImageSelect}
              selectedImage={selectedImage}
            />
          )}
        </MotiView>
      </AnimatePresence>
    </View>
  );
};

export default DressModal;
