import { View, Text } from "react-native";
import React from "react";
import ReusableButton from "../ui/ReusableButton";

const CreateButton = () => {
  return (
    <View>
      <ReusableButton
        textColor="text-white"
        bgColor="bg-virtual-primary"
        variant="filled"
        buttonShadow={true}
        onPress={() => console.log("clickde")}
        title="Try it on!"
      />
    </View>
  );
};

export default CreateButton;
