# Virtual Room Mobile - State Management Architecture

## 📁 File Structure

```
/mobile/
├── types/
│   └── database.ts           # Supabase database types
├── services/
│   ├── supabase.ts          # Supabase client configuration
│   ├── auth.ts              # Authentication services
│   ├── tryOn.ts             # Try-on operations
│   ├── wardrobe.ts          # Wardrobe management
│   └── userSettings.ts      # User settings operations
├── hooks/
│   ├── useAuth.ts           # Authentication hooks
│   ├── useTryOn.ts          # Try-on hooks
│   ├── useWardrobe.ts       # Wardrobe hooks
│   └── useUserSettings.ts   # Settings hooks
└── store/
    ├── authStore.ts         # Authentication state
    ├── appStore.ts          # UI and app state
    ├── settingsStore.ts     # App settings
    └── index.ts             # Store exports
```

## ⚖️ State Management Strategy

### 🟢 Zustand (Local State)
**Use Zustand for:**
- **UI State**: Modals, loading states, navigation
- **Auth State**: User info, authentication status  
- **App Settings**: Theme, language, preferences
- **Temporary Data**: Form states, image selections

**Examples:**
```typescript
// UI State
const { isPersonModalOpen, openPersonModal } = useAppStore()

// Auth State  
const { user, isAuthenticated } = useAuthStore()

// Settings
const { theme, updateTheme } = useSettingsStore()
```

### 🔵 TanStack Query (Server State)
**Use TanStack Query for:**
- **Server Data**: Try-ons, wardrobe, user profile
- **API Operations**: CRUD operations, mutations
- **Caching**: Automatic data caching and synchronization
- **Background Updates**: Stale-while-revalidate pattern

**Examples:**
```typescript
// Fetching data
const { tryOns, isLoading } = useTryOn()

// Mutations with optimistic updates
const { createTryOn, isCreating } = useTryOn()
const { toggleLike } = useWardrobe()
```

## 🗂️ Store Details

### AuthStore (Zustand)
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}
```

### AppStore (Zustand)
```typescript
interface AppState {
  // Loading states
  isGlobalLoading: boolean
  isUploadingImage: boolean
  isProcessingTryOn: boolean
  
  // Navigation & Modals
  activeTab: string
  isPersonModalOpen: boolean
  isDressModalOpen: boolean
  
  // Try-on state
  selectedTryOnId: string | null
  selectedImages: string[]
  
  // Actions for all above
}
```

### SettingsStore (Zustand)
```typescript
interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  language: 'tr' | 'en'
  hapticFeedback: boolean
  cameraQuality: 'low' | 'medium' | 'high'
  // ... other app preferences
}
```

## 🔗 Data Flow

### 1. Authentication Flow
```
User Login → authService.login() → useAuth hook → authStore.login() → UI Update
```

### 2. Try-On Creation Flow
```
User Input → createTryOn() → tryOnService.createTryOn() → TanStack Cache Update → UI Refresh
```

### 3. Wardrobe Operations Flow
```
Like/Unlike → toggleLike() → wardrobeService.toggleLike() → Cache Invalidation → Optimistic Update
```

## 🔄 Cache Strategy

### Query Keys Structure
```typescript
['auth', 'currentUser']           // Current user data
['tryOns']                        // All user try-ons
['tryOn', tryOnId]               // Single try-on
['wardrobe']                     // All wardrobe items
['wardrobe', 'favorites']        // Favorite items only
['userSettings']                 // User settings
```

### Cache Invalidation
- **Auth changes**: Invalidate all user-related queries
- **Try-on updates**: Update specific try-on + try-ons list
- **Wardrobe changes**: Invalidate wardrobe queries + update try-ons list

## 🚀 Usage Examples

### Component with Server Data
```typescript
function TryOnList() {
  const { tryOns, isLoading, createTryOn } = useTryOn()
  const { toggleLike } = useWardrobe()
  
  if (isLoading) return <Loading />
  
  return (
    <FlatList
      data={tryOns}
      renderItem={({ item }) => (
        <TryOnCard 
          tryOn={item}
          onLike={() => toggleLike(item.id)}
        />
      )}
    />
  )
}
```

### Component with UI State
```typescript
function Header() {
  const { openPersonModal, isPersonModalOpen } = useAppStore()
  const { user } = useAuthStore()
  
  return (
    <View>
      <Text>Hello {user?.name}</Text>
      <TouchableOpacity onPress={openPersonModal}>
        <Text>Select Person</Text>
      </TouchableOpacity>
      
      <PersonModal visible={isPersonModalOpen} />
    </View>
  )
}
```

## 🎯 Benefits

### Performance
- **Selective re-renders**: Only components using changed state re-render
- **Background updates**: Data stays fresh automatically
- **Optimistic updates**: Instant UI feedback

### Developer Experience
- **Type safety**: Full TypeScript support
- **DevTools**: TanStack Query DevTools + Zustand DevTools
- **Predictable**: Clear separation of concerns

### User Experience
- **Offline support**: Cached data available offline
- **Real-time updates**: Live data synchronization
- **Smooth interactions**: Optimistic updates for immediate feedback

## 🔧 Environment Setup

1. **Copy environment file:**
```bash
cp .env.example .env
```

2. **Add your Supabase credentials:**
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. **Install dependencies:**
```bash
npm install @supabase/supabase-js
```

## 🎉 Ready to Use!

Your state management architecture is now complete and ready for integration with your existing components. The separation between UI state (Zustand) and server state (TanStack Query) provides a robust, scalable foundation for your Virtual Room app.