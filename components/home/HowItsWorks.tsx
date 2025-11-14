import {
  Footprints,
  Shirt,
  ScanFace,
  Link,
  Smile,
  ToolCase,
} from "lucide-react-native";
import { View, Text } from "react-native";
import AnimatedView from "../ui/AnimatedView";
import { FlashList } from "@shopify/flash-list";
import GradientView from "../GradientView";
import TitleSection from "../TitleSection";
const HowItsWorks = () => {
  const howItWorksData = [
    {
      id: 1,
      title: "Kendini Tanıt",
      description:
        "Fotoğrafını yükle veya hazır bir model seç. Stilini göstermek için sahne senin!",
      icon: <Footprints color="pink" size={36} />,
    },
    {
      id: 2,
      title: "Giysini Anlat",
      description:
        "Uzun kırmızı bir elbise mi? Oversize bir gömlek mi? Sadece tarif et — biz giydirelim!",
      icon: <Shirt color="pink" size={36} />,
    },
    {
      id: 3,
      title: "Görsel Yükle",
      description:
        "Beğendiğin bir kıyafetin ya da tasarımın varsa, fotoğrafını yükle. AI senin için üstüne uygulasın.",
      icon: <ScanFace color="pink" size={36} />,
    },
    {
      id: 4,
      title: "Linkini Paylaş",
      description:
        "Bir e-ticaret sitesinde kıyafet gördün mü? Linki yapıştır, biz onu senin üstünde gösterelim.",
      icon: <Link color="pink" size={36} />,
    },
    {
      id: 5,
      title: "Kendini Gör",
      description:
        "Yapay zeka kıyafeti senin üstüne yerleştirir. Tarzının nasıl göründüğünü anında keşfet!",
      icon: <Smile color="pink" size={36} />,
    },
    {
      id: 6,
      title: "Wardrobe'ına Ekle ",
      description:
        "Favori görünümlerini kaydet, kombinler oluştur ve kendi dijital gardırobunu yarat.",
      icon: <ToolCase color="pink" size={36} />,
    },
  ];

  const renderItem = ({ item }) => (
    <View className="mr-4">
      <GradientView
        preset="custom"
        borderRadius={16}
        colors={["#000000", "#3B3B3B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <AnimatedView className="py-4 px-6 gap-4 rounded-lg shadow w-72 h-64">
          <Text className="text-xl font-bold mb-2 text-white">
            {item.title}
          </Text>
          <Text className="text-virtual-surface">{item.description}</Text>
          <Text className="mt-auto self-end text-xl text-virtual-primary-dark bg-virtual-primary-light rounded-full py-2 px-4 font-semibold">{item.id}</Text>
          {/* <Text className="bg-virtual-primary text-white font-semibold px-4 py-2 mt-3 rounded-full text-3xl self-center">
            {item.id}
          </Text> */}
        </AnimatedView>
      </GradientView>
    </View>
  );

  return (
    <TitleSection className="my-10" bgColor="bg-gray-100" subtitle="Learn how to use the app and get the most out of it!" title="How it's Works">
      <AnimatedView className="h-72" animation="fadeIn" duration={600} easing="easeInOut">
        <FlashList
          horizontal
          data={howItWorksData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </AnimatedView>
    </TitleSection>
  );
};

export default HowItsWorks;
