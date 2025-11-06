import { View, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import AnimatedView from "../ui/AnimatedView";
import SettingTitle from "./SettingTitle";
import SwitchLine from "../SwitchLine";
import DropdownLine from "../DropdownLine";
import PrivacyModal from "./PrivacyModal";
import { Shield, FileText, Database, ChevronRight } from "lucide-react-native";

const notifications = [
  {
    id: 1,
    title: "Push Bildirimleri",
    subtitle: "Yeni denemeler ve güncellemeler",
    status: true,
  },
  {
    id: 2,
    title: "E-posta Bildirimleri",
    subtitle: "Önemli duyurular ve kampanyalar",
    status: false,
  },
  {
    id: 3,
    title: "Yeni Özellikler",
    subtitle: "Ön izleme ve beta özellikleri",
    status: true,
  },
];

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

  const openModal = (
    type: "privacy-policy" | "terms-of-service" | "data-management"
  ) => {
    setSelectedModalType(type);
    setModalVisible(true);
  };

  return (
    <AnimatedView animation="slideUp">
      {/* Notifications Section */}
      <SettingTitle title="Bildirimler" iconName="Bell" iconColor="#ec4899">
        <View className="space-y-2">
          {notifications.map((notification) => (
            <SwitchLine
              key={notification.id}
              title={notification.title}
              subtitle={notification.subtitle}
              defaultValue={notification.status}
              onValueChange={(value) =>
                console.log(`${notification.title}: ${value}`)
              }
            />
          ))}
        </View>
      </SettingTitle>

      {/* Language Section */}
      <SettingTitle title="Dil Ayarları" iconName="Globe" iconColor="#ec4899">
        <DropdownLine
          title="Uygulama Dili"
          subtitle="Uygulamada kullanılacak dili seçin"
          options={languageOptions}
          defaultValue="tr"
          onValueChange={(value) => console.log(`Language selected: ${value}`)}
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
