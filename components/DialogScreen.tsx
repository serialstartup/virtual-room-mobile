import { View, Text, TouchableOpacity, Modal } from 'react-native'
import { useState, type ReactNode } from 'react'
import { ChevronRight, X, Shield, Lock, Eye, FileText } from 'lucide-react-native'
import ReusableButton from './ui/ReusableButton'

interface DialogOption {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress?: () => void;
}

interface DialogScreenProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  options?: DialogOption[];
}

const DialogScreen: React.FC<DialogScreenProps> = ({
  title,
  subtitle,
  buttonText = "Aç",
  options = []
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const defaultOptions: DialogOption[] = [
    {
      id: 'privacy-policy',
      title: 'Gizlilik Politikası',
      subtitle: 'Verilerinizi nasıl kullandığımızı öğrenin',
      icon: <Eye color="#6b7280" size={20} />,
      onPress: () => {}
    },
    {
      id: 'terms-conditions',
      title: 'Kullanım Koşulları',
      subtitle: 'Hizmet kullanım koşullarımız',
      icon: <FileText color="#6b7280" size={20} />,
      onPress: () => {}
    },
    {
      id: 'data-security',
      title: 'Veri Güvenliği',
      subtitle: 'Bilgilerinizi nasıl koruduğumuzu görün',
      icon: <Lock color="#6b7280" size={20} />,
      onPress: () => {}
    },
    {
      id: 'account-security',
      title: 'Hesap Güvenliği',
      subtitle: 'Hesabınızı güvende tutun',
      icon: <Shield color="#6b7280" size={20} />,
      onPress: () => {}
    }
  ];

  const displayOptions = options.length > 0 ? options : defaultOptions;

  return (
    <View>
      {/* Trigger Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="flex-row items-center justify-between py-3"
        activeOpacity={0.7}
      >
        <View className="flex-1 mr-4">
          <Text className="text-gray-800 font-semibold text-base">{title}</Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          <Text className="text-gray-600 font-medium">{buttonText}</Text>
          <ChevronRight color="#6b7280" size={20} />
        </View>
      </TouchableOpacity>

      {/* Full Screen Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xl font-bold text-gray-800">{title}</Text>
                {subtitle && (
                  <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="bg-gray-200 rounded-full p-2"
                activeOpacity={0.7}
              >
                <X color="#6b7280" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <View className="flex-1 p-6">
            <View className="space-y-4">
              {displayOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={option.onPress}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="bg-white p-2 rounded-full">
                      {option.icon}
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold text-base">
                        {option.title}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-1">
                        {option.subtitle}
                      </Text>
                    </View>
                    <ChevronRight color="#6b7280" size={20} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View className="p-6 border-t border-gray-100">
            <ReusableButton
              title="Kapat"
              onPress={() => setIsModalVisible(false)}
              variant="outlined"
              borderColor="border-gray-300"
              textColor="text-gray-700"
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default DialogScreen