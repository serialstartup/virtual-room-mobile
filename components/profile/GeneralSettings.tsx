import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import SettingTitle from "./SettingTitle";
import SwitchLine from "../SwitchLine";
import DropdownLine from "../DropdownLine";
import PrivacyModal from "./PrivacyModal";
import { Shield, FileText, Database, ChevronRight } from "lucide-react-native";
import { useUser } from "@/hooks/useUser";


const languageOptions = [
  { label: "Türkçe", value: "tr" },
  { label: "English", value: "en" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
];

const privacyOptions = [
  {
    id: "privacy-policy",
    title: "Gizlilik Politikası",
    subtitle: "Verilerinizi nasıl koruduğumuzu öğrenin",
    icon: <Shield color="#6b7280" size={20} />,
    type: "privacy-policy" as const,
  },
  {
    id: "terms-of-service",
    title: "Kullanım Koşulları",
    subtitle: "Hizmet kullanım şartlarımız",
    icon: <FileText color="#6b7280" size={20} />,
    type: "terms-of-service" as const,
  },
  {
    id: "data-management",
    title: "Veri Yönetimi",
    subtitle: "Verilerinizi nasıl yönettiğimizi görün",
    icon: <Database color="#6b7280" size={20} />,
    type: "data-management" as const,
  },
];

const GeneralSettings = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModalType, setSelectedModalType] = useState<
    "privacy-policy" | "terms-of-service" | "data-management"
  >("privacy-policy");

  const {
    userSettings,
    notificationSettings,
    updateSettings,
    isUpdateSettingsLoading,
    isSettingsLoading,
    updateSettingsError
  } = useUser();

  const openModal = (
    type: "privacy-policy" | "terms-of-service" | "data-management"
  ) => {
    setSelectedModalType(type);
    setModalVisible(true);
  };

  const handleNotificationChange = async (type: 'push_notifications' | 'email_notifications' | 'new_features', value: boolean) => {
    try {
      await updateSettings({ [type]: value });
    } catch (error) {
      console.error('Update settings error:', error);
      Alert.alert("Hata", "Ayar güncellenirken bir hata oluştu");
    }
  };

  const handleLanguageChange = async (value: string) => {
    try {
      await updateSettings({ language: value });
      Alert.alert("Başarılı", "Dil ayarınız güncellendi");
    } catch (error) {
      console.error('Language update error:', error);
      Alert.alert("Hata", "Dil ayarı güncellenirken bir hata oluştu");
    }
  };

  if (isSettingsLoading) {
    return (
      <AnimatedView animation="slideUp">
        <View className="bg-gray-50 p-6 rounded-2xl">
          <Text className="text-gray-500 text-center">Ayarlar yükleniyor...</Text>
        </View>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView animation="slideUp">
      {/* Notifications Section */}
      <SettingTitle title="Bildirimler" iconName="Bell" iconColor="#ec4899">
        <View className="space-y-2">
          <SwitchLine
            title="Push Bildirimleri"
            subtitle="Yeni denemeler ve güncellemeler"
            defaultValue={notificationSettings?.push_notifications ?? true}
            onValueChange={(value) => handleNotificationChange('push_notifications', value)}
            disabled={isUpdateSettingsLoading}
          />
          <SwitchLine
            title="E-posta Bildirimleri"
            subtitle="Önemli duyurular ve kampanyalar"
            defaultValue={notificationSettings?.email_notifications ?? true}
            onValueChange={(value) => handleNotificationChange('email_notifications', value)}
            disabled={isUpdateSettingsLoading}
          />
          <SwitchLine
            title="Yeni Özellikler"
            subtitle="Ön izleme ve beta özellikleri"
            defaultValue={notificationSettings?.new_features ?? true}
            onValueChange={(value) => handleNotificationChange('new_features', value)}
            disabled={isUpdateSettingsLoading}
          />
        </View>
      </SettingTitle>

      {/* Language Section */}
      <SettingTitle title="Dil Ayarları" iconName="Globe" iconColor="#ec4899">
        <DropdownLine
          title="Uygulama Dili"
          subtitle="Uygulamada kullanılacak dili seçin"
          options={languageOptions}
          defaultValue={userSettings?.language ?? "tr"}
          onValueChange={handleLanguageChange}
          disabled={isUpdateSettingsLoading}
        />
      </SettingTitle>

      {/* Privacy & Security Section */}
      <SettingTitle
        title="Gizlilik ve Güvenlik"
        iconName="Shield"
        iconColor="#ec4899"
      >
        <View className="space-y-3">
          {privacyOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => openModal(option.type)}
              className="flex-row items-center justify-between py-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="bg-gray-100 p-2 rounded-full">
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
              </View>
              <ChevronRight color="#6b7280" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </SettingTitle>

      {/* Privacy Modal */}
      <PrivacyModal
        type={selectedModalType}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </AnimatedView>
  );
};

export default GeneralSettings;
