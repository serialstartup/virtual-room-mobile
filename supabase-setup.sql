-- Virtual Room Mobile App - Supabase Database Setup
-- Bu scripti Supabase SQL Editor'da çalıştırarak veritabanınızı oluşturabilirsiniz

-- ==============================================
-- 1. TABLES CREATION
-- ==============================================

-- Users tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  premium_status BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Settings tablosu
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  push_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  new_features BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'tr',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Try On tablosu
CREATE TABLE try_on (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Image options (en az biri gerekli)
  self_image TEXT,
  model_image TEXT,
  
  -- Dress options (en az biri gerekli)
  dress_description TEXT,
  dress_image TEXT,
  product_url TEXT,
  
  -- Processing status
  processing_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  result_image TEXT, -- AI sonucu
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints: En az bir image kaynağı olmalı
  CONSTRAINT check_image_source CHECK (
    self_image IS NOT NULL OR model_image IS NOT NULL
  ),
  
  -- En az bir dress kaynağı olmalı
  CONSTRAINT check_dress_source CHECK (
    dress_description IS NOT NULL OR dress_image IS NOT NULL OR product_url IS NOT NULL
  ),
  
  -- Processing status kontrolü
  CONSTRAINT check_processing_status CHECK (
    processing_status IN ('pending', 'processing', 'completed', 'failed')
  )
);

-- Wardrobe tablosu
CREATE TABLE wardrobe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  try_on_id UUID NOT NULL REFERENCES try_on(id) ON DELETE CASCADE,
  liked BOOLEAN, -- true = beğenilen, false = beğenilmeyen, null = henüz karar verilmedi
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Aynı try_on bir kullanıcı için sadece bir kez eklenebilir
  UNIQUE(user_id, try_on_id)
);

-- ==============================================
-- 2. INDEXES FOR PERFORMANCE
-- ==============================================

-- Try_on tablosu için indeksler
CREATE INDEX idx_try_on_user_id ON try_on(user_id);
CREATE INDEX idx_try_on_created_at ON try_on(created_at DESC);
CREATE INDEX idx_try_on_processing_status ON try_on(processing_status);

-- Wardrobe tablosu için indeksler
CREATE INDEX idx_wardrobe_user_id ON wardrobe(user_id);
CREATE INDEX idx_wardrobe_try_on_id ON wardrobe(try_on_id);
CREATE INDEX idx_wardrobe_liked ON wardrobe(liked) WHERE liked IS NOT NULL;

-- User_settings tablosu için indeks
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ==============================================
-- 3. UPDATED_AT TRIGGER FUNCTION
-- ==============================================

-- Updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users tablosu için trigger
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==============================================

-- RLS'yi aktifleştir
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE try_on ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe ENABLE ROW LEVEL SECURITY;

-- Users politikaları
CREATE POLICY "Users can view own profile" 
    ON users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON users FOR UPDATE 
    USING (auth.uid() = id);

-- User_settings politikaları
CREATE POLICY "Users can manage own settings" 
    ON user_settings FOR ALL 
    USING (auth.uid() = user_id);

-- Try_on politikaları
CREATE POLICY "Users can manage own try-ons" 
    ON try_on FOR ALL 
    USING (auth.uid() = user_id);

-- Wardrobe politikaları
CREATE POLICY "Users can manage own wardrobe" 
    ON wardrobe FOR ALL 
    USING (auth.uid() = user_id);

-- ==============================================
-- 5. AUTO-CREATE USER SETTINGS FUNCTION
-- ==============================================

-- Yeni kullanıcı oluşturulduğunda otomatik settings oluştur
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users tablosu için trigger
CREATE TRIGGER create_user_settings_trigger
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_settings();

-- ==============================================
-- 6. USEFUL VIEWS (OPSIYONEL)
-- ==============================================

-- Kullanıcının beğendiği try-on'ları görmek için view
CREATE VIEW user_favorites AS
SELECT 
    w.user_id,
    t.*,
    w.created_at as added_to_wardrobe_at
FROM wardrobe w
JOIN try_on t ON w.try_on_id = t.id
WHERE w.liked = true;

-- Kullanıcının try-on istatistikleri için view
CREATE VIEW user_stats AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(t.id) as total_try_ons,
    COUNT(CASE WHEN w.liked = true THEN 1 END) as favorites_count,
    COUNT(CASE WHEN w.liked = false THEN 1 END) as disliked_count,
    COUNT(CASE WHEN w.liked IS NULL THEN 1 END) as undecided_count
FROM users u
LEFT JOIN try_on t ON u.id = t.user_id
LEFT JOIN wardrobe w ON t.id = w.try_on_id
GROUP BY u.id, u.name, u.email;

-- ==============================================
-- SETUP TAMAMLANDI!
-- ==============================================

-- Bu script başarıyla çalıştırıldıktan sonra:
-- 1. Tüm tablolarınız hazır olacak
-- 2. Güvenlik politikaları aktif olacak
-- 3. Performance indeksleri kurulacak
-- 4. Otomatik updated_at güncellemeleri çalışacak
-- 5. Yeni kullanıcılar için otomatik settings oluşacak

-- Test için örnek kullanım:
-- INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');
-- Bu otomatik olarak user_settings'e de bir kayıt ekleyecek!