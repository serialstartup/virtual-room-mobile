import { View, Text, TouchableOpacity } from "react-native";

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
  const statistics = [
    {
      id: "all" as const,
      title: "Total Outfits",
      value: totalOutfits,
      color: "#6366f1",
    },
    {
      id: "liked" as const,
      title: "Favorites",
      value: favoritesCount,
      color: "#ec4899",
    },
  ];

  return (
    <View className="flex-row justify-between gap-3 px-4 mt-4">
      {statistics.map((stat) => {
        const isActive = activeFilter === stat.id;

        return (
          <TouchableOpacity
            key={stat.id}
            className="flex-1"
            onPress={() => {
              onFilterChange(stat.id);
            }}
          >
            <View
              className={`p-3 rounded-xl border ${
                isActive
                  ? "bg-white border-virtual-primary"
                  : "bg-white border-gray-100"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Text>{stat.id === "all" ? "📊" : "❤️"}</Text>
                </View>
                <View className="ml-3 flex-col">
                  <Text
                    className={`text-2xl font-bold ${
                      isActive ? "text-virtual-primary" : "text-gray-800"
                    }`}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-virtual-primary" : "text-gray-500"
                    }`}
                  >
                    {stat.title}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TopStatisticsNew;
