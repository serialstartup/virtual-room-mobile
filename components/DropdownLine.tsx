import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react-native'

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownLineProps {
  title: string;
  subtitle?: string;
  options: DropdownOption[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const DropdownLine: React.FC<DropdownLineProps> = ({
  title,
  subtitle,
  options,
  defaultValue,
  onValueChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '');

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    if (disabled) return;
    setSelectedValue(value);
    setIsOpen(false);
    onValueChange?.(value);
  };

  return (
    <View>
      {/* Main Dropdown Button */}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(!isOpen)}
        className={`flex-row items-center justify-between py-3 ${disabled ? 'opacity-50' : ''}`}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <View className="flex-1 mr-4">
          <Text className="text-gray-800 font-semibold text-base">{title}</Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-gray-600 font-medium">
            {selectedOption?.label || 'Seçiniz'}
          </Text>
          {isOpen ? (
            <ChevronUp color="#6b7280" size={20} />
          ) : (
            <ChevronDown color="#6b7280" size={20} />
          )}
        </View>
      </TouchableOpacity>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <View className="bg-gray-50 rounded-xl mt-2 border border-gray-100">
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSelect(option.value)}
              className={`px-4 py-3 ${
                index === 0 ? 'rounded-t-xl' : ''
              } ${
                index === options.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-200'
              } ${
                selectedValue === option.value ? 'bg-virtual-primary/10' : ''
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-base ${
                selectedValue === option.value 
                  ? 'text-virtual-primary font-semibold' 
                  : 'text-gray-700'
              }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export default DropdownLine