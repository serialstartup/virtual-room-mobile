import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { LayoutGrid, Heart } from "lucide-react-native";

interface TopStatisticsNewProps {
  totalOutfits: number;
  favoritesCount: number;
  activeFilter: "all" | "liked";
  onFilterChange: (filter: "all" | "liked") => void;
}

const TopStatisticsNew: React.FC<TopStatisticsNewProps> = ({
  totalOutfits = 0,
  favoritesCount = 0,
  activeFilter = "all",
  onFilterChange,
}) => {
  const { t } = useTranslation();

  const statistics = [
    {
      id: "all" as const,
      title: t("wardrobePage.statistics.totalOutfits"),
      value: totalOutfits,
      icon: (
        <LayoutGrid
          size={18}
          color={activeFilter === "all" ? "#ec4899" : "#6b7280"}
        />
      ),
    },
    {
      id: "liked" as const,
      title: t("wardrobePage.statistics.favorites"),
      value: favoritesCount,
      icon: (
        <Heart
          size={18}
          color={activeFilter === "liked" ? "#ec4899" : "#6b7280"}
        />
      ),
    },
  ];

  return (
    <View className="flex-row gap-3 px-4 mt-2 mb-2">
      {statistics.map((stat) => {
        const isActive = activeFilter === stat.id;

        return (
          <TouchableOpacity
            key={stat.id}
            className="flex-1"
            activeOpacity={0.7}
            onPress={() => onFilterChange(stat.id)}
          >
            <View
              className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${
                isActive
                  ? "bg-pink-50 border-pink-200"
                  : "bg-white border-gray-100"
              }`}
            >
              <View className="flex-row items-center gap-2">
                {stat.icon}
                <Text
                  className={`text-sm font-medium ${
                    isActive ? "text-pink-600" : "text-gray-600"
                  }`}
                >
                  {stat.title}
                </Text>
              </View>

              <Text
                className={`text-base font-bold ${
                  isActive ? "text-pink-600" : "text-gray-900"
                }`}
              >
                {stat.value}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TopStatisticsNew;
