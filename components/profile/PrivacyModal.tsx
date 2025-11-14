import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { X, Shield, FileText, Database } from 'lucide-react-native'
import ReusableButton from '../ui/ReusableButton'

interface PrivacyModalProps {
  type: 'privacy-policy' | 'terms-of-service' | 'data-management'
  visible: boolean
  onClose: () => void
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ type, visible, onClose }) => {
  const getModalContent = () => {
    switch (type) {
      case 'privacy-policy':
        return {
          title: 'Gizlilik Politikası',
          icon: <Shield color="#ec4899" size={24} />,
          content: `
Virtual Room olarak gizliliğinizi ciddiye alıyoruz ve kişisel verilerinizi korumak için en yüksek standartları uyguluyoruz.

VERİ TOPLAMA VE KULLANIM:
• Sadece uygulamanın çalışması için gerekli verileri topluyoruz
• Kişisel bilgileriniz şifrelenerek güvenli sunucularda saklanır
• Verilerinizi üçüncü taraflarla paylaşmayız

GÜVENLİK ÖNLEMLERİ:
• End-to-end şifreleme kullanıyoruz
• SSL sertifikası ile tüm veri transferleri korunur
• Düzenli güvenlik denetimleri yapılır

HAKLARINIZ:
• Verilerinizi istediğiniz zaman silebilirsiniz
• Hesabınızı kalıcı olarak kapatabilirsiniz
• Veri taşınabilirlik hakkınız vardır

Sorularınız için destek ekibimizle iletişime geçebilirsiniz.
          `
        }
      case 'terms-of-service':
        return {
          title: 'Kullanım Koşulları',
          icon: <FileText color="#ec4899" size={24} />,
          content: `
Virtual Room hizmetini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.

HİZMET KULLANIMI:
• Uygulamayı yasal amaçlar için kullanmalısınız
• Başkalarının haklarını ihlal etmemelisiniz
• Spam ve zararlı içerik paylaşmamalısınız

KULLANICI SORUMLULUKLARI:
• Hesap güvenliğinizden siz sorumlusunuz
• Gerçek ve güncel bilgiler vermelisiniz
• Şifrenizi güvenli tutmalısınız

FİKRİ MÜLKİYET:
• Uygulama içeriği telif hakkı ile korunmaktadır
• Kullanıcı içerikleri size aittir
• Ticari kullanım için izin gereklidir

HİZMET DEĞİŞİKLİKLERİ:
• Önceden bildirimde bulunarak değişiklik yapabiliriz
• Kritik güncellemeler anında uygulanabilir

Detaylı bilgi için yasal ekibimizle iletişime geçebilirsiniz.
          `
        }
      case 'data-management':
        return {
          title: 'Veri Yönetimi',
          icon: <Database color="#ec4899" size={24} />,
          content: `
Verilerinizi nasıl yönettiğimiz ve hangi haklara sahip olduğunuz hakkında bilgiler.

VERİ SAKLAMA:
• Fotoğraflarınız güvenli bulut sunucularda saklanır
• Hesap verileri şifrelenmiş veritabanında tutulur
• İnaktif hesaplar 2 yıl sonra otomatik silinir

VERİ İŞLEME:
• AI modelleri sadece gerekli durumlarda verilerinizi işler
• İşleme sonuçları anonim hale getirilir
• Analitik veriler toplu şekilde değerlendirilir

KULLANICI KONTROLLÜ:
• Verilerinizi dilediğiniz zaman silebilirsiniz
• Hangi verilerin toplandığını görebilirsiniz
• Veri kullanım tercihlerinizi ayarlayabilirsiniz

VERİ TRANSFERİ:
• Hesabınızı başka platformlara taşıyabilirsiniz
• JSON formatında veri dışa aktarımı yapabilirsiniz
• 24 saat içinde transfer tamamlanır

GDPR UYUMLU:
• Avrupa veri koruma standartlarına uygun çalışıyoruz
• Veri sorumlusu sıfatıyla şeffaf davranıyoruz

Veri haklarınızı kullanmak için ayarlar menüsünden işlem yapabilirsiniz.
          `
        }
      default:
        return { title: '', icon: null, content: '' }
    }
  }

  const { title, icon, content } = getModalContent()

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="bg-white p-2 rounded-full">
                {icon}
              </View>
              <Text className="text-xl font-bold text-gray-800">{title}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 rounded-full p-2"
              activeOpacity={0.7}
            >
              <X color="#6b7280" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-6">
          <Text className="text-gray-700 text-base leading-6 whitespace-pre-line">
            {content}
          </Text>
        </ScrollView>

        {/* Footer */}
        <View className="p-6 border-t border-gray-100">
          <ReusableButton
            title="Anladım"
            onPress={onClose}
            variant="filled"
            bgColor="bg-virtual-primary"
            textColor="text-white"
          />
        </View>
      </View>
    </Modal>
  )
}

export default PrivacyModal