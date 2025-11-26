import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AnimatedView from "../ui/AnimatedView";
import SettingTitle from "./SettingTitle";
import SwitchLine from "../SwitchLine";
import DropdownLine from "../DropdownLine";
import PrivacyModal from "./PrivacyModal";
import { Shield, FileText, Database, ChevronRight } from "lucide-react-native";
import { useUser } from "@/hooks/useUser";
import { useSettingsStore } from "@/store/settingsStore";


const GeneralSettings = () => {
  const { t } = useTranslation();
  
  const languageOptions = [
    { label: t('languages.tr'), value: "tr" },
    { label: t('languages.en'), value: "en" },
    { label: t('languages.es'), value: "es" },
    { label: t('languages.fr'), value: "fr" },
  ];

  const privacyOptions = [
    {
      id: "privacy-policy",
      title: t('profile.sections.privacy.policy'),
      subtitle: t('profile.sections.privacy.policyDesc'),
      icon: <Shield color="#6b7280" size={20} />,
      type: "privacy-policy" as const,
    },
    {
      id: "terms-of-service",
      title: t('profile.sections.privacy.terms'),
      subtitle: t('profile.sections.privacy.termsDesc'),
      icon: <FileText color="#6b7280" size={20} />,
      type: "terms-of-service" as const,
    },
    {
      id: "data-management",
      title: t('profile.sections.privacy.data'),
      subtitle: t('profile.sections.privacy.dataDesc'),
      icon: <Database color="#6b7280" size={20} />,
      type: "data-management" as const,
    },
  ];
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

  const { language, updateLanguage } = useSettingsStore();

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
      Alert.alert(t('common.error'), t('profile.messages.settingUpdateError'));
    }
  };

  const handleLanguageChange = async (value: string) => {
    try {
      // Update local language (Zustand store + i18n)
      updateLanguage(value as 'tr' | 'en');
      
      // Update backend settings
      await updateSettings({ language: value });
      
      Alert.alert(t('common.success'), t('profile.messages.languageUpdated'));
    } catch (error) {
      console.error('Language update error:', error);
      Alert.alert(t('common.error'), t('profile.messages.settingUpdateError'));
    }
  };

  if (isSettingsLoading) {
    return (
      <AnimatedView animation="slideUp">
        <View className="bg-gray-50 p-6 rounded-2xl">
          <Text className="text-gray-500 text-center">{t('profile.messages.settingsLoading')}</Text>
        </View>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView animation="slideUp">
      {/* Notifications Section */}
      <SettingTitle title={t('profile.sections.notifications.title')} iconName="Bell" iconColor="#ec4899">
        <View className="space-y-2">
          <SwitchLine
            title={t('profile.sections.notifications.push')}
            subtitle={t('profile.sections.notifications.pushDesc')}
            defaultValue={notificationSettings?.push_notifications ?? true}
            onValueChange={(value) => handleNotificationChange('push_notifications', value)}
            disabled={isUpdateSettingsLoading}
          />
          <SwitchLine
            title={t('profile.sections.notifications.email')}
            subtitle={t('profile.sections.notifications.emailDesc')}
            defaultValue={notificationSettings?.email_notifications ?? true}
            onValueChange={(value) => handleNotificationChange('email_notifications', value)}
            disabled={isUpdateSettingsLoading}
          />
          <SwitchLine
            title={t('profile.sections.notifications.features')}
            subtitle={t('profile.sections.notifications.featuresDesc')}
            defaultValue={notificationSettings?.new_features ?? true}
            onValueChange={(value) => handleNotificationChange('new_features', value)}
            disabled={isUpdateSettingsLoading}
          />
        </View>
      </SettingTitle>

      {/* Language Section */}
      <SettingTitle title={t('profile.sections.language.title')} iconName="Globe" iconColor="#ec4899">
        <DropdownLine
          title={t('profile.sections.language.app')}
          subtitle={t('profile.sections.language.appDesc')}
          options={languageOptions}
          defaultValue={language}
          onValueChange={handleLanguageChange}
          disabled={isUpdateSettingsLoading}
        />
      </SettingTitle>

      {/* Privacy & Security Section */}
      <SettingTitle
        title={t('profile.sections.privacy.title')}
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
