import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import { GradientView } from "../index";
import AnimatedView from "../ui/AnimatedView";
import AnimatedText from "../ui/AnimatedText";
import ReusableButton from "../ui/ReusableButton";

const Hero = () => {
  return (
    <AnimatedView
      animation="crossfade"
      duration={800}
      easing="easeInOut"
      style={styles.container}
      className="rounded-b-2xl overflow-hidden"
    >
      <ImageBackground
        source={ require("@/assets/images/fashion1.png") }
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <GradientView
          preset="custom"
          colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}
        >
          <AnimatedView
            animation="scale"
            delay={200}
            duration={600}
            easing="easeOut"
            style={styles.content}
            className="px-6 items-center justify-center gap-4 mt-12"
          >
            <AnimatedText
              animation="scale"
              delay={400}
              duration={500}
              easing="easeOut"
              style={styles.title}
              className="text-5xl font-bold text-white text-center mb-2"
            >
              Kendinle en uyumlusunu bul!
            </AnimatedText>
            <AnimatedText
              animation="scale"
              delay={600}
              duration={500}
              easing="easeOut"
              style={styles.description}
              className="text-lg text-white text-center leading-6 mb-5"
            >
             Fotoğrafını yükle ya da hazır bir model seç. Hayalindeki kıyafetleri üstünde görmeye başla!
            </AnimatedText>
          </AnimatedView>

          <AnimatedView
            animation="slideUp"
            delay={800}
            duration={600}
            easing="easeOut"
            className="px-6 gap-4 w-full my-10"
          >
            <ReusableButton
              title="Try it now!"
              onPress={() => console.log("Shop Now!")}
              variant="filled"
              bgColor="bg-virtual-primary"
              textColor="text-white"
              style={{ width: "100%" }}
            />

            <ReusableButton
              title="View Wardrobe"
              onPress={() => console.log("View Collection!")}
              variant="outlined"
              borderColor="border-virtual-primary"
              style={{ width: "100%" }}
            />
          </AnimatedView>
        </GradientView>
      </ImageBackground>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height * 0.6,
  },
  imageBackground: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
  },
  title: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default Hero;






















// const heroSections = [
//   {
//     id: 1,
//     title: "Kendini Giydir 🎨",
//     description:
//       "Fotoğrafını yükle ya da hazır bir model seç. Hayalindeki kıyafetleri üstünde görmeye başla!",
//     image: Farber0,
//   },
//   {
//     id: 2,
//     title: "Tarzını Yarat ✨",
//     description:
//       "Sadece 'kırmızı uzun etek' de — yapay zeka senin için tasarlasın. Moda artık senin dilinden anlıyor!",
//     image: require("@/assets/images/Fashion1.svg"),
//   },
//   {
//     id: 3,
//     title: "Beğendiklerini Kaydet 💖",
//     description:
//       "Favori görünümlerini sakla, kıyafet fikirlerini arşivle ve ilham panonu oluştur.",
//     image: require("@/assets/images/Fashion2.svg"),
//   },
//   {
//     id: 4,
//     title: "Alışverişe Dönüştür 🛍️",
//     description:
//       "Beğendiğin kombinleri Google Lens ile bul, tarzını gerçeğe dönüştür.",
//     image: require("@/assets/images/Fashion3.svg"),
//   },
// ];



//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const heroImages = useMemo(
//     () => heroSections.map((section) => section.image),
//     []
//   );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [heroImages.length]);