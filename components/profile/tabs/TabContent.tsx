import { View, Text } from "react-native";
import ReusableButton from "../../ui/ReusableButton";
import { Check, Crown, Zap, Shield, Sparkles, Star } from "lucide-react-native";

interface TabContentProps {
  type: "monthly" | "yearly";
}

const TabContent = ({ type }: TabContentProps) => {
  const features = [
    {
      icon: <Crown color="#ec4899" size={20} />,
      title: "Ad-free Experience",
      description: "Kesintisiz premium deneyim",
    },
    {
      icon: <Shield color="#ec4899" size={20} />,
      title: "Priority Support",
      description: "Öncelikli müşteri desteği",
    },
    {
      icon: <Zap color="#ec4899" size={20} />,
      title: "Advanced AI Models",
      description: "Gelişmiş yapay zeka modelleri",
    },
    {
      icon: <Sparkles color="#ec4899" size={20} />,
      title: "HD Quality Images",
      description: "Yüksek kaliteli görüntüler",
    },
    {
      icon: <Star color="#ec4899" size={20} />,
      title: "Exclusive Collections",
      description: "Özel koleksiyonlara erişim",
    },
    {
      icon: <Check color="#ec4899" size={20} />,
      title: "Early Access",
      description: "Yeni özelliklere erken erişim",
    },
  ];

  const monthlyPrice = "₺29.90";
  const yearlyPrice = "₺179.90";
  const yearlyMonthlyEquivalent = "₺14.99";

  return (
    <View className="p-4">
      {/* Price Section */}
      <View className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
        <View className="items-center">
          {type === "yearly" && (
            <View className="bg-virtual-primary px-3 py-1 rounded-full mb-3">
              <Text className="text-white font-outfit-semibold text-xs">
                %40 İndirim
              </Text>
            </View>
          )}
          <View className="flex-row items-center gap-1">
            <Text className="text-3xl font-outfit-semibold text-gray-800">
              {type === "monthly" ? monthlyPrice : yearlyPrice}
            </Text>
            <Text className="text-gray-500 font-outfit text-base">
              {type === "monthly" ? "/ay" : "/yıl"}
            </Text>
          </View>
          {type === "yearly" && (
            <Text className="text-gray-400 font-outfit text-xs mt-1">
              Aylık {yearlyMonthlyEquivalent} eşdeğer
            </Text>
          )}
        </View>
      </View>

      {/* Features List */}
      <View className="space-y-4 mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Premium Özellikler
        </Text>
        {features.map((feature, index) => (
          <View key={index} className={`${index !== 0 ? 'border-t border-gray-100' : ''}`}>
            <View  className="flex-row items-start m-2 gap-3">
              <View className="mt-1">{feature.icon}</View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-base">
                  {feature.title}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {feature.description}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Upgrade Button */}
      <ReusableButton
        title="Premium'a Yükselt"
        onPress={() => console.log("Upgrading to premium...")}
        variant="filled"
        bgColor="bg-virtual-primary"
        textColor="text-white"
        buttonShadow={true}
      />
    </View>
  );
};

export default TabContent;
