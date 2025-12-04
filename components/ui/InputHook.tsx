import { TextInput, View, Text } from "react-native";
import {
  Controller,
  Control,
  FieldError,
  RegisterOptions,
} from "react-hook-form";

interface InputProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: FieldError;
  label?: string;
  editable?: boolean;
  disabled?: boolean;
  rules?: RegisterOptions;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  name,
  control,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  label,
  editable = true,
  disabled = false,
  rules,
  leftIcon,
  rightIcon,
  maxLength,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text className="font-outfit-medium text-base text-gray-600 mb-2 ">
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: error ? "#EF4444" : "#D1D5DB",
              borderRadius: 8,
              paddingHorizontal: 12,
              backgroundColor: !editable || disabled ? "#F3F4F6" : "white",
            }}
          >
            {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 8,
                fontSize: 16,
                height: multiline ? 80 : 38,
                color: !editable || disabled ? "#9CA3AF" : "#000",
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              editable={editable && !disabled}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              secureTextEntry={secureTextEntry}
              multiline={multiline}
              numberOfLines={numberOfLines}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              maxLength={maxLength}
            />
            {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
          </View>
        )}
      />
      {error && (
        <Text className="font-outfit text-red-500 text-base mt-2">
          {error.message}
        </Text>
      )}
    </View>
  );
};
