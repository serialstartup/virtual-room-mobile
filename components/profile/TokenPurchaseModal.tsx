import { View, Text, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, Zap, Check, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';

interface TokenPackage {
  id: string;
  tokens: number;
  price: string;
  priceValue: number;
  popular?: boolean;
  discount?: string;
  badge?: string;
}

interface TokenPurchaseModalProps {
  visible: boolean;
  onClose: () => void;
  onPurchase: (packageId: string, tokens: number) => Promise<void>;
}

// Dimensions available if needed in the future
// const { width: screenWidth } = Dimensions.get('window');

const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  visible,
  onClose,
  onPurchase,
}) => {
  const { t } = useTranslation();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const tokenPackages: TokenPackage[] = [
    {
      id: 'token_50',
      tokens: 50,
      price: '$4.99',
      priceValue: 4.99,
    },
    {
      id: 'token_100',
      tokens: 100,
      price: '$8.99',
      priceValue: 8.99,
      popular: true,
      discount: `10% ${t('tokens.packages.save')}`,
      badge: t('tokens.packages.mostPopular'),
    },
    {
      id: 'token_250',
      tokens: 250,
      price: '$19.99',
      priceValue: 19.99,
      discount: `20% ${t('tokens.packages.save')}`,
      badge: t('tokens.packages.bestValue'),
    },
  ];

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    const pkg = tokenPackages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    setIsPurchasing(true);
    try {
      await onPurchase(pkg.id, pkg.tokens);
      onClose();
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const getPricePerToken = (pkg: TokenPackage) => {
    return (pkg.priceValue / pkg.tokens).toFixed(2);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="bg-virtual-primary/10 p-2.5 rounded-xl">
                <Zap size={24} color="#ec4899" fill="#ec4899" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-gray-900">{t('tokens.title')}</Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  {t('tokens.subtitle')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
            >
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Benefits Section */}
          <View className="px-6 py-6 bg-gradient-to-b from-virtual-primary/5 to-transparent">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {t('tokens.benefits.title')}
            </Text>
            <View className="space-y-3">
              {[
                t('tokens.benefits.aiTryOn'),
                t('tokens.benefits.productShowcase'),
                t('tokens.benefits.textToFashion'),
                t('tokens.benefits.avatarCreation'),
              ].map((benefit, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <View className="bg-green-100 p-1.5 rounded-full">
                    <Check size={14} color="#22c55e" strokeWidth={3} />
                  </View>
                  <Text className="text-gray-700 flex-1">{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Token Packages */}
          <View className="px-6 py-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {t('tokens.packages.title')}
            </Text>
            <View className="space-y-4">
              {tokenPackages.map((pkg, index) => (
                <MotiView
                  key={pkg.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: index * 100 }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedPackage(pkg.id)}
                    className={`relative p-5 rounded-2xl border-2 my-4 ${
                      selectedPackage === pkg.id
                        ? 'border-virtual-primary bg-virtual-primary/5'
                        : 'border-gray-200 bg-white'
                    }`}
                    style={{
                      shadowColor: selectedPackage === pkg.id ? '#ec4899' : '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: selectedPackage === pkg.id ? 0.15 : 0.05,
                      shadowRadius: 4,
                      elevation: selectedPackage === pkg.id ? 3 : 1,
                    }}
                    activeOpacity={0.7}
                  >
                    {/* Badge */}
                    {pkg.badge && (
                      <View className="absolute -top-3 left-4 bg-virtual-primary px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">
                          {pkg.badge}
                        </Text>
                      </View>
                    )}

                    <View className="flex-row items-center justify-between">
                      {/* Left Side - Token Info */}
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-2">
                          <Sparkles
                            size={20}
                            color={selectedPackage === pkg.id ? '#ec4899' : '#6b7280'}
                          />
                          <Text
                            className={`text-2xl font-bold ${
                              selectedPackage === pkg.id
                                ? 'text-virtual-primary'
                                : 'text-gray-900'
                            }`}
                          >
                            {pkg.tokens} {t('tokens.packages.tokens')}
                          </Text>
                        </View>
                        
                        {pkg.discount && (
                          <View className="bg-green-100 px-2 py-1 rounded-md self-start mb-2">
                            <Text className="text-green-700 text-xs font-semibold">
                              {pkg.discount}
                            </Text>
                          </View>
                        )}

                        <Text className="text-gray-500 text-sm">
                          {t('tokens.packages.perToken')} ${getPricePerToken(pkg)}
                        </Text>
                      </View>

                      {/* Right Side - Price */}
                      <View className="items-end">
                        <Text
                          className={`text-3xl font-bold ${
                            selectedPackage === pkg.id
                              ? 'text-virtual-primary'
                              : 'text-gray-900'
                          }`}
                        >
                          {pkg.price}
                        </Text>
                        <Text className="text-gray-500 text-sm mt-1">{t('tokens.packages.oneTime')}</Text>
                      </View>
                    </View>

                    {/* Selection Indicator */}
                    {selectedPackage === pkg.id && (
                      <View className="absolute top-5 right-5 bg-virtual-primary rounded-full p-1">
                        <Check size={16} color="white" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </View>

          {/* Info Section */}
          <View className="px-6 pb-6">
            <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <Text className="text-blue-900 font-semibold mb-2">
                {t('tokens.info.title')}
              </Text>
              <Text className="text-blue-800 text-sm leading-relaxed">
                {t('tokens.info.description')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View className="px-6 py-4 border-t border-gray-100 bg-white mb-6">
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={!selectedPackage || isPurchasing}
            className={`py-4 rounded-2xl ${
              selectedPackage && !isPurchasing
                ? 'bg-virtual-primary'
                : 'bg-gray-300'
            }`}
            style={{
              shadowColor: selectedPackage && !isPurchasing ? '#ec4899' : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: selectedPackage && !isPurchasing ? 5 : 0,
            }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isPurchasing
                ? t('tokens.purchase.processing')
                : selectedPackage
                ? `${t('tokens.purchase.pay')} ${tokenPackages.find((p) => p.id === selectedPackage)?.price}`
                : t('tokens.purchase.selectPackage')}
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-500 text-xs mt-3">
            {t('tokens.purchase.securePayment')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default TokenPurchaseModal;
