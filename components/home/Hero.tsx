import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React from "react";
import { GradientButton, GradientView } from "../index";

const Hero = () => {
  return (
    <ImageBackground
      className="w-full h-3/4" 
      resizeMode="cover"
      source={{
        uri: "https://img.freepik.com/free-vector/colorful-background-with-pink-blue-color_125964-1618.jpg?semt=ais_hybrid&w=740&q=80",
      }}
    >
      <GradientView
        style={StyleSheet.absoluteFillObject}
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "transparent"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      ></GradientView>
    </ImageBackground>
  );
};

export default Hero;
