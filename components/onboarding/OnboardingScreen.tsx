import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import PagerView from "react-native-pager-view";
import {
  Sparkles,
  User,
  Camera,
  Wand2,
  UserCircle,
  ArrowRight,
  X,
} from "lucide-react-native";
import AnimatedView from "@/components/ui/AnimatedView";
import AnimatedText from "@/components/ui/AnimatedText";
import { LinearGradient } from "expo-linear-gradient";
import { analytics } from "@/services/analytics";
import { onboardingStorage } from "@/services/onboardingStorage";
import "../../global.css";

const { height } = Dimensions.get("window");
const isSmallScreen = height < 700;

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface Slide {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactNode;
  readonly gradient: readonly [string, string];
}

type OnboardingState = "idle" | "completing" | "skipping";

const slides: readonly Slide[] = [
  {
    id: 0,
    title: "Welcome to Virtual Room",
    description:
      "Your AI-powered fashion companion. Try on clothes, create looks, and explore fashion in a whole new way.",
    icon: <Sparkles size={80} color="#fff" fill="#fff" />,
    gradient: ["#ec4899", "#8b5cf6"],
  },
  {
    id: 1,
    title: "Virtual Try-On",
    description:
      "See how clothes look on you instantly. Upload your photo and any garment to create realistic try-ons.",
    icon: <User size={80} color="#fff" />,
    gradient: ["#8b5cf6", "#6366f1"],
  },
  {
    id: 2,
    title: "Professional Showcases",
    description:
      "Transform product photos into professional model shots. Perfect for e-commerce and social media.",
    icon: <Camera size={80} color="#fff" />,
    gradient: ["#6366f1", "#3b82f6"],
  },
  {
    id: 3,
    title: "AI Fashion Designer",
    description:
      "Describe your dream outfit and watch AI bring it to life. Create unique fashion designs from text.",
    icon: <Wand2 size={80} color="#fff" />,
    gradient: ["#3b82f6", "#06b6d4"],
  },
  {
    id: 4,
    title: "Your Digital Twin",
    description:
      "Create a personalized avatar for private try-ons. Your face, your style, your privacy.",
    icon: <UserCircle size={80} color="#fff" />,
    gradient: ["#06b6d4", "#10b981"],
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasStartedTracking, setHasStartedTracking] = useState<boolean>(false);
  const [state, setState] = useState<OnboardingState>("idle");

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const page = e.nativeEvent.position;
      setCurrentPage(page);

      analytics.trackOnboardingSlideViewed(page, slides[page].title);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (state !== "idle") return;

    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      handleComplete();
    }
  }, [currentPage, state, handleComplete]);

  const handleSkip = useCallback(async () => {
    if (state !== "idle") return;

    setState("skipping");
    try {
      analytics.trackOnboardingSkipped(currentPage);
      await onboardingStorage.markOnboardingComplete();
    } catch (error) {
      console.error("[ONBOARDING] Error during skip:", error);
    } finally {
      onComplete();
    }
  }, [currentPage, onComplete, state]);

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

  // Track onboarding started only once
  React.useEffect(() => {
    if (!hasStartedTracking) {
      analytics.trackOnboardingStarted();
      analytics.trackOnboardingSlideViewed(0, slides[0].title);
      setHasStartedTracking(true);
    }
  }, [hasStartedTracking]);

  // Preload next slide for smoother experience
  React.useEffect(() => {
    if (currentPage < slides.length - 1) {
      // Preload next slide icon if it's an image
      const nextSlide = slides[currentPage + 1];
      // This is a simple preload hint for potential optimizations
    }
  }, [currentPage]);

  const currentSlide = useMemo(() => slides[currentPage], [currentPage]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Skip Button */}
      {currentPage < slides.length - 1 && (
        <AnimatedView
          animation="fadeIn"
          easing="spring"
          delay={1000}
          className={`absolute ${Platform.OS === "ios" ? "top-15" : "top-12"} right-5 z-10`}
        >
          <TouchableOpacity
            onPress={handleSkip}
            className="w-11 h-11 justify-center items-center rounded-full bg-black/30 backdrop-blur-sm border border-white/20 shadow-lg"
            activeOpacity={0.7}
            accessibilityLabel="Skip onboarding"
            accessibilityRole="button"
            disabled={state !== "idle"}
          >
            <X size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </AnimatedView>
      )}

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        className="flex-1"
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} className="flex-1">
            <LinearGradient
              colors={slide.gradient}
              className="flex-1 justify-center items-center px-10"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <AnimatedView
                animation="slideUp"
                easing="spring"
                stagger={index * 100}
                duration={600}
                className="items-center max-w-sm"
              >
                {/* Icon with Animation */}
                <AnimatedView
                  animation="rotateScale"
                  rotateFrom="0deg"
                  rotateTo="360deg"
                  stagger={400 + index * 100}
                  duration={800}
                  className={`${isSmallScreen ? "mb-7" : "mb-10"} w-30 h-30 justify-center items-center rounded-full bg-white/10 border-2 border-white/20 shadow-2xl`}
                >
                  {slide.icon}
                </AnimatedView>

                {/* Title with Stagger */}
                <AnimatedText
                  animation="slideUp"
                  easing="spring"
                  stagger={600 + index * 100}
                  duration={500}
                  className={`${isSmallScreen ? "text-3xl mb-4" : "text-4xl mb-5"} font-black text-white text-center tracking-tight`}
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.3)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}
                >
                  {slide.title}
                </AnimatedText>

                {/* Description with Stagger */}
                <AnimatedText
                  animation="slideUp"
                  easing="spring"
                  stagger={800 + index * 100}
                  duration={500}
                  className={`${isSmallScreen ? "text-base leading-6" : "text-lg leading-7"} text-white/95 text-center font-medium tracking-wide`}
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.2)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {slide.description}
                </AnimatedText>
              </AnimatedView>
            </LinearGradient>
          </View>
        ))}
      </PagerView>

      {/* Bottom Section */}
      <View
        className={`px-7 ${Platform.OS === "ios" ? "pb-12" : "pb-10"} pt-7 bg-white rounded-t-3xl shadow-2xl`}
      >
        {/* Progress Dots */}
        <View className="flex-row justify-center items-center mb-7">
          {slides.map((_, index) => (
            <AnimatedView
              key={`dot-${index}-${currentPage}`}
              animation={index === currentPage ? "bounce" : "scale"}
              easing="spring"
              stagger={index * 50}
              duration={300}
            >
              <View
                className={`w-2.5 h-2.5 rounded-full mx-1.5 border ${
                  index === currentPage
                    ? "w-7 bg-pink-500 border-pink-500 shadow-lg shadow-pink-500/30"
                    : "bg-gray-200 border-gray-300"
                }`}
              />
            </AnimatedView>
          ))}
        </View>

        {/* Next/Get Started Button */}
        <AnimatedView
          animation={currentPage === slides.length - 1 ? "bounce" : "scale"}
          easing="spring"
          delay={100}
          className="rounded-2xl overflow-hidden shadow-xl shadow-black/20"
        >
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            accessibilityLabel={
              currentPage === slides.length - 1
                ? "Get started with Virtual Room"
                : "Next slide"
            }
            accessibilityRole="button"
            disabled={state !== "idle"}
          >
            <LinearGradient
              colors={currentSlide.gradient}
              className="flex-row justify-center items-center py-5 px-9 gap-2.5 min-h-14"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <AnimatedText
                animation="typewriter"
                easing="spring"
                delay={200}
                className="text-white text-lg font-bold tracking-wide"
                style={{
                  textShadowColor: "rgba(0, 0, 0, 0.2)",
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {state === "completing" && currentPage === slides.length - 1
                  ? "Starting..."
                  : state === "skipping"
                    ? "Skipping..."
                    : currentPage === slides.length - 1
                      ? "Get Started"
                      : "Next"}
              </AnimatedText>
              <AnimatedView
                animation={
                  currentPage === slides.length - 1 ? "fadeIn" : "fadeIn"
                }
                easing="spring"
                delay={300}
              >
                <ArrowRight size={20} color="#fff" strokeWidth={2.5} />
              </AnimatedView>
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedView>
      </View>
    </View>
  );
};

export default OnboardingScreen;
