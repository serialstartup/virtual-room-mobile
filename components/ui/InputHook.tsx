import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { Controller, Control, FieldError } from 'react-hook-form';

interface InputProps {
  name: string;
  control: Control<any>;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: FieldError;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  name,
  control,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  label,
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: error ? '#EF4444' : '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              height: multiline ? 80 : 48
            }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
          />
        )}
      />
      {error && (
        <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
          {error.message}
        </Text>
      )}
    </View>
  );
};