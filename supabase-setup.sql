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
  
  -- Soft delete
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
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

-- Try_on tablosu için trigger
CREATE TRIGGER update_try_on_updated_at 
    BEFORE UPDATE ON try_on 
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

-- Try-On Feedback tablosu (kullanıcı memnuniyet ve favorite tracking)
CREATE TABLE try_on_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    try_on_id UUID NOT NULL, -- References farklı tablolara göre değişebilir (try_on, avatars, custom_models)
    try_on_type VARCHAR(50) NOT NULL CHECK (try_on_type IN ('classic', 'avatar', 'text-to-fashion', 'product-to-model')),
    feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('like', 'dislike', 'neutral')),
    feedback_source VARCHAR(20) NOT NULL CHECK (feedback_source IN ('heart', 'thumbs')), -- Heart = favorite, Thumbs = satisfaction
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, try_on_id, feedback_source) -- Bir kullanıcı bir sonuca hem heart hem thumbs verebilir ama her birinden sadece 1
);

-- Try-On Feedback için index'ler
CREATE INDEX idx_try_on_feedback_user_id ON try_on_feedback(user_id);
CREATE INDEX idx_try_on_feedback_type ON try_on_feedback(try_on_type);
CREATE INDEX idx_try_on_feedback_source ON try_on_feedback(feedback_source);
CREATE INDEX idx_try_on_feedback_created_at ON try_on_feedback(created_at);

-- User stats tablosu (trigger ile otomatik güncellenir)
CREATE TABLE user_stats (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_try_ons INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    disliked_count INTEGER DEFAULT 0,
    undecided_count INTEGER DEFAULT 0,
    satisfied_count INTEGER DEFAULT 0, -- thumbs up count
    dissatisfied_count INTEGER DEFAULT 0, -- thumbs down count
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id)
);

-- Try-On Feedback için RLS
ALTER TABLE try_on_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own feedback" 
    ON try_on_feedback FOR ALL 
    USING (auth.uid() = user_id);

-- User stats için RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own stats" 
    ON user_stats FOR ALL 
    USING (auth.uid() = user_id);

-- User stats güncelleme fonksiyonu (wardrobe ve feedback tabloları için)
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, total_try_ons, favorites_count, disliked_count, undecided_count, satisfied_count, dissatisfied_count)
  VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)), 0),
    COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND liked = true), 0),
    COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND liked = false), 0),
    COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND liked IS NULL), 0),
    COALESCE((SELECT COUNT(*) FROM try_on_feedback WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND feedback_source = 'thumbs' AND feedback_type = 'like'), 0),
    COALESCE((SELECT COUNT(*) FROM try_on_feedback WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND feedback_source = 'thumbs' AND feedback_type = 'dislike'), 0)
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_try_ons = COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)), 0),
    favorites_count = COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND liked = true), 0),
    disliked_count = COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND liked = false), 0),
    undecided_count = COALESCE((SELECT COUNT(*) FROM wardrobe WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND liked IS NULL), 0),
    satisfied_count = COALESCE((SELECT COUNT(*) FROM try_on_feedback WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND feedback_source = 'thumbs' AND feedback_type = 'like'), 0),
    dissatisfied_count = COALESCE((SELECT COUNT(*) FROM try_on_feedback WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) AND feedback_source = 'thumbs' AND feedback_type = 'dislike'), 0),
    updated_at = NOW();

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User stats trigger'ları
CREATE OR REPLACE TRIGGER update_user_stats_on_wardrobe_insert
  AFTER INSERT ON wardrobe
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE OR REPLACE TRIGGER update_user_stats_on_wardrobe_update
  AFTER UPDATE ON wardrobe
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE OR REPLACE TRIGGER update_user_stats_on_wardrobe_delete
  AFTER DELETE ON wardrobe
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Try-On Feedback trigger'ları (user_stats'ı otomatik günceller)
CREATE OR REPLACE TRIGGER update_user_stats_on_feedback_insert
  AFTER INSERT ON try_on_feedback
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE OR REPLACE TRIGGER update_user_stats_on_feedback_update
  AFTER UPDATE ON try_on_feedback
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

CREATE OR REPLACE TRIGGER update_user_stats_on_feedback_delete
  AFTER DELETE ON try_on_feedback
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- User stats indeksi
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

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