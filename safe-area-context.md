# React Native Safe Area Context - Türkçe Kılavuz

React Native Safe Area Context kütüphanesi, uygulamanızın güvenli alanlarını (safe area) yönetmek için kullanılan güçlü bir araçtır. Bu kütüphane sayesinde durum çubuğu, çentik (notch), ana ekran göstergesi gibi sistem elementlerini dikkate alarak uygulamanızı doğru şekilde konumlandırabilirsiniz.

## 📋 Temel Kavramlar

### 1. Provider (Sağlayıcı)
- **SafeAreaProvider**: Tüm alt bileşenlere güvenli alan bilgilerini sağlayan ana bileşen
- Genellikle uygulamanın en üstüne yerleştirilir
- Sistem elementleriyle çakışan alanları hesaplar ve alt bileşenlere iletir

### 2. Consumer (Tüketici)  
- Provider'dan gelen güvenli alan verilerini kullanan bileşenler ve hook'lar
- Değerler her zaman en yakın parent provider'a görelidir

## 🏗️ Ana Bileşenler

### SafeAreaProvider
Uygulamanızın kök bileşenine eklenmelidir. Modaller ve route'lar için de ayrı provider'lar gerekebilir.

```javascript
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      {/* Uygulama içeriği */}
    </SafeAreaProvider>
  );
}
```

**⚠️ Önemli Notlar:**
- Animated View veya ScrollView içerisine yerleştirmeyin
- Çok sık güncelleme yapar ve performans sorunlarına neden olabilir

**Props:**
- `initialMetrics`: İlk render için frame ve inset değerleri (performans optimizasyonu)

```javascript
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {/* İçerik */}
    </SafeAreaProvider>
  );
}
```

### SafeAreaView (Önerilen Yöntem)
En performanslı çözüm. Native seviyede uygulandığı için titreşim (flicker) olmaz.

```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

function SomeComponent() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
    </SafeAreaView>
  );
}
```

**Ana Props:**

#### `edges` - Hangi Kenarların Korunacağını Belirler
```javascript
// Varsayılan: tüm kenarlar
<SafeAreaView edges={['top', 'right', 'bottom', 'left']} />

// Sadece yan ve alt kenarlar (üst hariç)
<SafeAreaView edges={['right', 'bottom', 'left']} />

// Gelişmiş mod kullanımı
<SafeAreaView 
  style={{paddingBottom: 24}} 
  edges={{bottom: 'maximum'}} 
/>
```

**Edge Modları:**
- `'additive'` (varsayılan): finalPadding = safeArea + padding
- `'maximum'`: finalPadding = max(safeArea, padding)
- `'off'`: O kenar için güvenli alan uygulanmaz

#### `mode` - Padding vs Margin
```javascript
// Padding kullan (varsayılan)
<SafeAreaView mode="padding" />

// Margin kullan (örn: ayırıcı bileşenler için)
<SafeAreaView mode="margin" style={{ height: 1, backgroundColor: '#eee' }} />
```

### SafeAreaListener
Güvenli alan değişikliklerini dinlemek için kullanılır. Re-render yapmaz, sadece onChange ile bildirim gönderir.

```javascript
import { SafeAreaListener } from 'react-native-safe-area-context';

function SomeComponent() {
  return (
    <SafeAreaListener
      onChange={({ insets, frame }) => {
        console.log('Güvenli alan değişti:', { insets, frame });
      }}
    >
      {/* İçerik */}
    </SafeAreaListener>
  );
}
```

## 🎣 Hook'lar

### useSafeAreaInsets
Güvenli alan değerlerini JavaScript'te manipüle etmek için kullanılır.

```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function HookComponent() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ 
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, 16),
      paddingLeft: insets.left,
      paddingRight: insets.right
    }}>
      {/* İçerik */}
    </View>
  );
}
```

**Dönen Değer:**
```javascript
{
  top: number,
  right: number, 
  bottom: number,
  left: number
}
```

### useSafeAreaFrame
Ekran boyutları için Dimensions modülüne alternatif.

```javascript
import { useSafeAreaFrame } from 'react-native-safe-area-context';

function FrameComponent() {
  const frame = useSafeAreaFrame();
  
  return (
    <View style={{ 
      width: frame.width * 0.8,
      height: frame.height * 0.5
    }}>
      {/* İçerik */}
    </View>
  );
}
```

**Dönen Değer:**
```javascript
{
  x: number,
  y: number,
  width: number,
  height: number
}
```

## 🔧 İleri Seviye Kullanım

### Context Tabanlı Kullanım (Class Components)
```javascript
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

class ClassComponent extends React.Component {
  render() {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <View style={{ paddingTop: insets.top }}>
            {/* İçerik */}
          </View>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
```

### Higher Order Component
```javascript
import { withSafeAreaInsets } from 'react-native-safe-area-context';

class ClassComponent extends React.Component {
  render() {
    return (
      <View style={{ paddingTop: this.props.insets.top }}>
        {/* İçerik */}
      </View>
    );
  }
}

const ClassComponentWithInsets = withSafeAreaInsets(ClassComponent);
```

## ⚡ Performans Optimizasyonları

### 1. SafeAreaView Kullanın
Native implementasyon olduğu için cihaz döndürme sırasında gecikme olmaz.

### 2. initialWindowMetrics
İlk render'ı hızlandırmak için:

```javascript
import { 
  SafeAreaProvider, 
  initialWindowMetrics 
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {/* İçerik */}
    </SafeAreaProvider>
  );
}
```

**⚠️ Dikkat:** Provider yeniden mount oluyorsa veya react-native-navigation kullanıyorsanız bu özelliği kullanmayın.

## 🧪 Test Ayarları

### Jest Mock Kurulumu
```javascript
// jest setup dosyasına ekleyin
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
```

### Test Provider'ı
```javascript
export function TestSafeAreaProvider({ children }) {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 320, height: 640 },
        insets: { top: 20, left: 0, right: 0, bottom: 0 },
      }}
    >
      {children}
    </SafeAreaProvider>
  );
}
```

### Jest Konfigürasyonu
```javascript
// jest.config.js
transformIgnorePatterns: [
  'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-safe-area-context)/)',
];
```

## 📱 Pratik Örnekler

### Tam Ekran Modal
```javascript
function FullScreenModal() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ padding: 20 }}>
        <Text>Modal İçeriği</Text>
      </View>
    </SafeAreaView>
  );
}
```

### Alt Tab Bar
```javascript
function TabBar() {
  return (
    <SafeAreaView 
      edges={['bottom', 'left', 'right']} 
      style={{ backgroundColor: '#f8f8f8' }}
    >
      <View style={{ flexDirection: 'row', height: 60 }}>
        {/* Tab içeriği */}
      </View>
    </SafeAreaView>
  );
}
```

### Floating Action Button
```javascript
function FloatingButton() {
  return (
    <SafeAreaView 
      style={{ position: 'absolute', bottom: 24, right: 24 }}
      edges={{bottom: 'maximum'}}
    >
      <TouchableOpacity style={styles.fab}>
        <Text>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

## 🎯 En İyi Uygulamalar

1. **SafeAreaView Tercih Edin**: Performans için hook'lar yerine SafeAreaView kullanın
2. **Provider'ı Root'ta Tutun**: Uygulamanın en üstüne yerleştirin
3. **Edges'i Akıllıca Kullanın**: İhtiyacınız olmayan kenarları dahil etmeyin
4. **Test Etmeyi Unutmayın**: Farklı cihazlarda test edin
5. **Animasyon Dikkat**: Provider'ı animasyonlu view'lar içinde kullanmayın

Bu kılavuz ile React Native Safe Area Context'i etkili bir şekilde kullanabilir ve uygulamanızın tüm cihazlarda mükemmel görünmesini sağlayabilirsiniz.