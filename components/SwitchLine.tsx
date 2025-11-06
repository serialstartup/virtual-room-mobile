import { View, Text, Switch } from 'react-native'
import React, { useState } from 'react'

interface SwitchLineProps {
  title: string;
  subtitle: string;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
}

const SwitchLine: React.FC<SwitchLineProps> = ({
  title,
  subtitle,
  defaultValue = false,
  onValueChange
}) => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);

  const handleToggle = (value: boolean) => {
    setIsEnabled(value);
    onValueChange?.(value);
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
        trackColor={{ false: '#e5e7eb', true: '#ec4899' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
      />
    </View>
  )
}

export default SwitchLine