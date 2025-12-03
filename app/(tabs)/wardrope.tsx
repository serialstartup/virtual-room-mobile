import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import { PageWrapper, SectionWrapper } from "@/components";
import TopStatistics from "@/components/wardrope/TopStatisticsNew";
import EachOutput from "@/components/wardrope/EachOutput";
import PageHeader from "@/components/PageHeader";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "react-i18next";

const Wardrope = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<"all" | "liked">("all");

  const handleFilterChange = (filter: "all" | "liked") => {
    try {
      setActiveFilter(filter);
    } catch (error) {
      console.error("[WARDROPE] Error changing filter:", error);
    }
  };

  const { wardrobeItems, favorites, isLoading, error } = useWardrobe();
  const { isAuthenticated, user } = useAuthStore();

  // Debug logs
  useEffect(() => {
    console.log("[WARDROBE_PAGE] 🔍 Debug Info:");
    console.log("- isAuthenticated:", isAuthenticated);
    console.log("- user:", user?.email);
    console.log("- isLoading:", isLoading);
    console.log("- error:", error);
    console.log("- wardrobeItems length:", wardrobeItems?.length || 0);
    console.log("- favorites length:", favorites?.length || 0);
    console.log("- wardrobeItems sample:", wardrobeItems?.slice(0, 2));
  }, [isAuthenticated, user, isLoading, error, wardrobeItems, favorites]);

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <SectionWrapper>
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-center">
              {t("wardrobePage.loginRequired")}
            </Text>
          </View>
        </SectionWrapper>
      </PageWrapper>
    );
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <SectionWrapper>
          <PageHeader
            title={t("wardrobePage.title")}
            subtitle={t("wardrobePage.subtitle")}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-center">
              {t("wardrobePage.loading")}
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
            title={t("wardrobePage.title")}
            subtitle={t("wardrobePage.subtitle")}
          />
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-center">
              {t("wardrobePage.error")}
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
          title={t("wardrobePage.title")}
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
