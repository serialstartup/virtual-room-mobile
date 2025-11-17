import { View, Image } from "react-native";
import AnimatedView from "../ui/AnimatedView";
import AnimatedText from "../ui/AnimatedText";
import ReusableButton from "../ui/ReusableButton";
import { Plus, ArrowRight } from "lucide-react-native";
import { router } from "expo-router";

const Hero = () => {
  const handleTryNow = () => {
    router.push("/(tabs)/try-on");
  };

  return (
    <View className="bg-white px-6 pt-8 pb-12 min-h-[550px] md:min-h-[600px] rounded-b-3xl ">
      {/* Header Text */}
      <AnimatedView
        animation="slideUp"
        duration={600}
        easing="easeOut"
        className="mb-8"
      >
        <AnimatedText
          animation="slideUp"
          delay={200}
          duration={500}
          easing="easeOut"
          className="text-3xl font-bold text-gray-900 text-center mb-3"
        >
          Your Fit, Reimagined!
        </AnimatedText>
        <AnimatedText
          animation="slideUp"
          delay={400}
          duration={500}
          easing="easeOut"
          className="text-base text-gray-600 text-center px-10"
        >
          Kıyafetleri ve kombinleri saniyeler içinde üzerinde gör
        </AnimatedText>
      </AnimatedView>

      {/* Process Visualization */}
      <View className="flex-row justify-between items-center px-2 md:px-4 mb-5">
        {/* Step 1: Model */}
        <AnimatedView
          animation="slideUp"
          delay={600}
          duration={600}
          easing="easeOut"
          className="flex-1 items-center"
        >
          <View className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-50 shadow-lg">
            <Image
              source={require("@/assets/images/model.jpg")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <AnimatedText
            animation="slideUp"
            delay={800}
            duration={400}
            className="text-sm font-semibold text-gray-700 mt-3 text-center"
          >
            Fotoğraf
          </AnimatedText>
        </AnimatedView>

        {/* Plus Icon */}
        <AnimatedView
          animation="scale"
          delay={1000}
          duration={400}
          easing="easeOut"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 justify-center items-center mx-2 md:mx-4"
        >
          <Plus size={24} color="#ec4899" strokeWidth={3} />
        </AnimatedView>

        {/* Step 2: Garment */}
        <AnimatedView
          animation="slideUp"
          delay={1200}
          duration={600}
          easing="easeOut"
          className="flex-1 items-center"
        >
          <View className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-50 shadow-lg">
            <Image
              source={require("@/assets/images/black-jacket.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <AnimatedText
            animation="slideUp"
            delay={1400}
            duration={400}
            className="text-sm font-semibold text-gray-700 mt-3 text-center"
          >
            Kıyafet
          </AnimatedText>
        </AnimatedView>
      </View>

      {/* Arrow Down */}
      <AnimatedView
        animation="slideUp"
        delay={1600}
        duration={400}
        easing="easeOut"
        className="items-center my-4"
      >
        <View className="transform rotate-90">
          <ArrowRight size={24} color="#ec4899" strokeWidth={3} />
        </View>
      </AnimatedView>

      {/* Step 3: Result */}
      <AnimatedView
        animation="scale"
        delay={1800}
        duration={600}
        easing="easeOut"
        className="items-center mt-2"
      >
        <View className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-[1px]  border-virtual-primary shadow-xl">
          <Image
            source={require("@/assets/images/output.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <AnimatedText
          animation="slideUp"
          delay={2000}
          duration={400}
          className="text-lg font-bold text-virtual-primary mt-4 text-center"
        >
          Sonuç 🎉
        </AnimatedText>
        <AnimatedText
          animation="slideUp"
          delay={2200}
          duration={400}
          className="text-xs text-gray-600 mt-2 text-center"
        >
          Saniyeler içinde AI ile oluşturuldu
        </AnimatedText>
      </AnimatedView>

      {/* Action Buttons */}
      <AnimatedView
        animation="slideUp"
        delay={2400}
        duration={600}
        easing="easeOut"
        className="mt-10 gap-4"
      >
        <ReusableButton
          title="Şimdi Dene"
          onPress={handleTryNow}
          variant="filled"
          bgColor="bg-virtual-primary"
          textColor="text-white"
          style={{ width: "100%" }}
        />
      </AnimatedView>
    </View>
  );
};

export default Hero;