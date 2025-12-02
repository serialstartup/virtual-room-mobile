import React, { useRef, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import Animated, {
  useHandler,
  useEvent,
  useSharedValue,
} from "react-native-reanimated";
import { ArrowRight } from "lucide-react-native";
import AnimatedView from "@/components/ui/AnimatedView";
import AnimatedText from "@/components/ui/AnimatedText";
import { LinearGradient } from "expo-linear-gradient";
import { analytics } from "@/services/analytics";
import { onboardingStorage } from "@/services/onboardingStorage";
import "../../global.css";

const { height } = Dimensions.get("window");

// 1. Define the handler (from PagerView docs for Reanimated integration)
function usePageScrollHandler(
  handlers: { onPageScroll: (e: any, context: any) => void },
  dependencies?: any[]
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
  const subscribeForEvents = ["onPageScroll"];

  return useEvent(
    (event) => {
      "worklet";
      const { onPageScroll } = handlers;
      if (onPageScroll && event.eventName.endsWith("onPageScroll")) {
        onPageScroll(event, context);
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  );
}

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface Slide {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly color: string;
}

const slides: readonly Slide[] = [
  {
    id: 0,
    title: "Welcome to Virtual Room",
    description:
      "Your AI-powered fashion companion. Try on clothes, create looks, and explore fashion in a whole new way.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    id: 1,
    title: "Virtual Try-On",
    description:
      "See how clothes look on you instantly. Upload your photo and any garment to create realistic try-ons.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    id: 2,
    title: "Professional Showcases",
    description:
      "Transform product photos into professional model shots. Perfect for e-commerce and social media.",
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    id: 3,
    title: "AI Fashion Designer",
    description:
      "Describe your dream outfit and watch AI bring it to life. Create unique fashion designs from text.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
  {
    id: 4,
    title: "Your Digital Twin",
    description:
      "Create a personalized avatar for private try-ons. Your face, your style, your privacy.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    color: "#ec4899",
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasStartedTracking, setHasStartedTracking] = useState<boolean>(false);
  const [state, setState] = useState<"idle" | "completing" | "skipping">(
    "idle"
  );

  const { width, height } = Dimensions.get("screen");
  const offset = useSharedValue(0);

  const pageScrollHandler = usePageScrollHandler(
    {
      onPageScroll: (e: any) => {
        "worklet";
        offset.value = e.offset;
      },
    },
    []
  );

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const page = e.nativeEvent.position;
      setCurrentPage(page);
      analytics.trackOnboardingSlideViewed(page, slides[page].title);
    },
    []
  );

  const handleComplete = useCallback(async () => {
    if (state !== "idle") return;

    setState("completing");
    try {
      analytics.trackOnboardingCompleted();
      await onboardingStorage.markOnboardingComplete();
    } catch (error) {
      console.error("[ONBOARDING] Error during completion:", error);
    } finally {
      onComplete();
    }
  }, [onComplete, state]);

  const handleNext = useCallback(() => {
    if (state !== "idle") return;

    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      handleComplete();
    }
  }, [currentPage, state, handleComplete]);

  // Track onboarding started only once
  React.useEffect(() => {
    if (!hasStartedTracking) {
      analytics.trackOnboardingStarted();
      analytics.trackOnboardingSlideViewed(0, slides[0].title);
      setHasStartedTracking(true);
    }
  }, [hasStartedTracking]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Top Header */}
      {/* <View className="items-center pt-4 pb-2">
        <AnimatedText
          animation="fadeIn"
          delay={300}
          className="text-xl font-outfit-bold text-virtual-primary tracking-wider uppercase"
        >
          Virtual Room
        </AnimatedText>
      </View> */}

      {/* Main Content */}
      <View className="flex-1">
        <AnimatedPagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={handlePageSelected}
          onPageScroll={pageScrollHandler}
        >
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              collapsable={false}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 24,
              }}
            >
              {/* Visual Area - Top Half */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <AnimatedView
                  animation="scale"
                  duration={800}
                  delay={index === 0 ? 200 : 0}
                  style={{
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "80%",
                  }}
                >
                  <Image
                    source={{ uri: slide.image }}
                    style={{
                      width: width * 0.9,
                      height: height * 0.6,
                      borderRadius: 20,
                      marginVertical: 10,
                    }}
                    contentFit="cover"
                    transition={1000}
                  />
                </AnimatedView>
              </View>

              {/* Text Area - Bottom Half */}
              <View
                className="mt-4"
                style={{
                  width: "100%",
                  alignItems: "center",
                  paddingBottom: 40,
                }}
              >
                <AnimatedText
                  animation="slideUp"
                  delay={300}
                  className="text-3xl font-outfit-bold text-slate-900 text-center mb-4 leading-tight"
                >
                  {slide.title}
                </AnimatedText>

                <AnimatedText
                  animation="fadeIn"
                  delay={500}
                  className="text-base font-outfit text-slate-500 text-center leading-6 px-4"
                >
                  {slide.description}
                </AnimatedText>
              </View>
            </View>
          ))}
        </AnimatedPagerView>
      </View>

      {/* Bottom Controls */}
      <View className="px-8 pb-4 pt-4 flex-row justify-between items-center ">
        {/* Back Button */}
        <View className="w-20 items-start">
          <TouchableOpacity
            onPress={() => pagerRef.current?.setPage(currentPage - 1)}
            className="p-2"
            disabled={currentPage === 0 || state !== "idle"}
            style={{ opacity: currentPage > 0 ? 1 : 0 }}
          >
            <AnimatedText className="text-slate-400 font-outfit-medium text-base">
              Back
            </AnimatedText>
          </TouchableOpacity>
        </View>

        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center gap-2">
          {slides.map((_, index) => (
            <AnimatedView
              key={`dot-${index}`}
              animation={index === currentPage ? "scale" : "fadeIn"}
              duration={300}
            >
              <View
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "w-6 bg-virtual-primary"
                    : "w-2 bg-slate-200"
                }`}
              />
            </AnimatedView>
          ))}
        </View>

        {/* Next / Get Started Button */}
        <View className="w-24 items-end">
          <AnimatedView animation="slideUp" delay={600}>
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.9}
              disabled={state !== "idle"}
              style={{
                shadowColor: "#ec4899",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <LinearGradient
                colors={["#ec4899", "#db2777"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: currentPage === slides.length - 1 ? 24 : 0,
                  width: currentPage === slides.length - 1 ? undefined : 48,
                }}
              >
                {currentPage === slides.length - 1 ? (
                  <AnimatedText className="text-white font-outfit-bold text-sm whitespace-nowrap">
                    {state === "completing" ? "..." : "Start"}
                  </AnimatedText>
                ) : (
                  <ArrowRight size={20} color="white" strokeWidth={2.5} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default OnboardingScreen;
