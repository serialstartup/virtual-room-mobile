import { View, Text, Switch } from 'react-native'
import { useState, useEffect, type FC } from 'react'

interface SwitchLineProps {
  title: string;
  subtitle: string;
  defaultValue?: boolean;
  value?: boolean; // Add controlled value prop
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
}

const SwitchLine: FC<SwitchLineProps> = ({
  title,
  subtitle,
  defaultValue = false,
  value, // Controlled value
  onValueChange,
  disabled = false
}) => {
  const [isEnabled, setIsEnabled] = useState(value !== undefined ? value : defaultValue);

  // Sync with controlled value
  useEffect(() => {
    if (value !== undefined) {
      setIsEnabled(value);
    }
  }, [value]);

  const handleToggle = (newValue: boolean) => {
    if (disabled) return;
    
    // If controlled, only call onValueChange
    if (value !== undefined) {
      onValueChange?.(newValue);
    } else {
      // If uncontrolled, update internal state
      setIsEnabled(newValue);
      onValueChange?.(newValue);
    }
  };

  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-1 mr-4">
        <Text className="text-gray-800 font-semibold text-base">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
        trackColor={{ false: '#e5e7eb', true: disabled ? '#d1d5db' : '#ec4899' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
        disabled={disabled}
      />
    </View>
  )
}

export default SwitchLine