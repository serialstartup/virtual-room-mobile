import { View, Text } from "react-native";
import { useState } from "react";
import { PageWrapper, SectionWrapper } from "@/components";
import TopStatistics from "@/components/wardrope/TopStatisticsNew";
import EachOutput from "@/components/wardrope/EachOutput";
import PageHeader from "@/components/PageHeader";
import { useWardrobe } from "@/hooks/useWardrobe";

const Wardrope = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "liked">("all");

  const handleFilterChange = (filter: "all" | "liked") => {
    try {
      setActiveFilter(filter);
    } catch (error) {
      console.error("[WARDROPE] Error changing filter:", error);
    }
  };

  const { wardrobeItems, favorites, isLoading, error } = useWardrobe();

  if (isLoading) {
    return (
      <PageWrapper>
        <SectionWrapper>
          <PageHeader
            title="My Wardrobe"
            subtitle="Your saved outfits and try-ons"
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-center">
              Loading your wardrobe...
            </Text>
          </View>
        </SectionWrapper>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <SectionWrapper>
          <PageHeader
            title="My Wardrobe"
            subtitle="Your saved outfits and try-ons"
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-center">
              Unable to load wardrobe
            </Text>
          </View>
        </SectionWrapper>
      </PageWrapper>
    );
  }
  return (
    <PageWrapper>
      <SectionWrapper>
        <PageHeader
          title="My Wardrobe"
          subtitle="Your saved outfits and try-ons"
        />
      </SectionWrapper>

      <SectionWrapper className="p-4">
        <TopStatistics
          totalOutfits={wardrobeItems?.length || 0}
          favoritesCount={favorites?.length || 0}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </SectionWrapper>

      <SectionWrapper className="flex-1 p-0">
        <EachOutput
          filter={activeFilter}
          wardrobeItems={wardrobeItems || []}
          favorites={favorites || []}
        />
      </SectionWrapper>
    </PageWrapper>
  );
};

export default Wardrope;
