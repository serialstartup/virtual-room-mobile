import { View, Text } from "react-native";
import GradientView from "../GradientView";
import ReusableButton from "../ui/ReusableButton";

const ReadyButton = () => {
  return (
    <View className="my-6">
      <GradientView
        preset="accent"
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View className="flex-col items-center justify-center py-8 px-10 gap-4">
          <Text className="text-center text-white font-semibold text-3xl">
            Ready to Transform your shopping experience?
          </Text>
          <Text className=" text-center text-white mb-6">
            Join thounsands of users who have discovered the future of fashion
            with Virtual Room.
          </Text>
          <ReusableButton
            textColor="text-virtual-primary-dark"
            padding="py-2 px-10"
            title="Get started now"
            buttonShadow={true}
            onPress={() => {}}
          />
        </View>
      </GradientView>
    </View>
  );
};

export default ReadyButton;
