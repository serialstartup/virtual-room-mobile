import { View, Text } from "react-native";
import React from "react";
import { GradientView, PageWrapper, SectionWrapper } from "@/components";
import TopStatistics from "@/components/wardrope/TopStatistics";
import EachOutput from "@/components/wardrope/EachOutput";

const Wardrope = () => {
  return (
    <PageWrapper withoutTopEdge>
      <SectionWrapper >
        <View className=" rounded-b-3xl overflow-hidden">
          <GradientView
            preset="accent"
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-col items-center justify-center pt-20 pb-4 px-10 gap-4">
              <Text className="text-center text-white font-semibold text-4xl">
                My Wardrobe
              </Text>
              <Text className=" text-center text-gray-200 mb-6">
                Your saved outfits and try-ons
              </Text>
            </View>
          </GradientView>
        </View>
      </SectionWrapper>

      <SectionWrapper className="p-4 bg-gray-50">
        <TopStatistics />
      </SectionWrapper>

      <SectionWrapper className="flex-1 bg-gray-50 p-0">
        <EachOutput />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default Wardrope;
