-- ===============================
-- Supabase Products 테이블 설정
-- ===============================

-- 기존 테이블이 있다면 삭제 (주의: 기존 데이터가 삭제됩니다)
-- DROP TABLE IF EXISTS products;

-- Products 테이블 생성
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 원 단위로 저장
  image_url TEXT,
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 업데이트 시간 자동 갱신을 위한 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Products 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기존 데이터 삭제 (선택사항)
-- DELETE FROM products;

-- 샘플 상품 데이터 삽입 (Picsum Photos 이미지 사용)
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
-- 노트북 카테고리
('MacBook Pro 16인치 M3 Pro', 'M3 Pro 칩, 18GB 통합 메모리, 512GB SSD 스토리지. 전문가를 위한 최고의 성능을 제공합니다.', 2990000, 'https://picsum.photos/id/238/500/500', 'laptop', 15),
('MacBook Air 15인치 M2', 'M2 칩, 8GB 통합 메모리, 256GB SSD 스토리지. 놀라운 성능과 긴 배터리 수명을 자랑합니다.', 1890000, 'https://picsum.photos/id/239/500/500', 'laptop', 25),

-- 스마트폰 카테고리  
('iPhone 15 Pro Max', '티타늄 소재, A17 Pro 칩, 256GB, 프로 카메라 시스템. 혁신적인 성능과 디자인을 경험하세요.', 1750000, 'https://picsum.photos/id/240/500/500', 'phone', 30),
('iPhone 15', 'A16 Bionic 칩, 128GB, 향상된 카메라 시스템. 일상을 더욱 특별하게 만들어줍니다.', 1250000, 'https://picsum.photos/id/241/500/500', 'phone', 40),

-- 태블릿 카테고리
('iPad Pro 12.9인치 M2', 'M2 칩, 256GB WiFi 모델, Liquid Retina XDR 디스플레이. 창작의 새로운 경험을 선사합니다.', 1790000, 'https://picsum.photos/id/242/500/500', 'tablet', 20),
('iPad Air 10.9인치', 'M1 칩, 64GB WiFi 모델, 10.9인치 Liquid Retina 디스플레이. 가볍고 강력한 성능을 제공합니다.', 899000, 'https://picsum.photos/id/243/500/500', 'tablet', 35),

-- 오디오 카테고리
('AirPods Pro 2세대', '액티브 노이즈 캔슬링, 공간 음향, USB-C 충전 케이스. 몰입감 넘치는 오디오 경험을 선사합니다.', 350000, 'https://picsum.photos/id/244/500/500', 'audio', 50),

-- 워치 카테고리
('Apple Watch Series 9', 'GPS + Cellular, 45mm, 스포츠 밴드. 건강과 피트니스를 위한 최고의 파트너입니다.', 650000, 'https://picsum.photos/id/245/500/500', 'watch', 25),

-- 데스크톱 카테고리
('Mac Studio M2 Ultra', 'M2 Ultra 칩, 64GB 통합 메모리, 1TB SSD. 전문가 워크플로우를 위한 궁극의 성능을 제공합니다.', 5490000, 'https://picsum.photos/id/246/500/500', 'desktop', 8),

-- 추가 상품들 (다양한 카테고리)
('Mac mini M2', 'M2 칩, 8GB 통합 메모리, 256GB SSD. 컴팩트한 크기에 강력한 성능을 담았습니다.', 799000, 'https://picsum.photos/id/247/500/500', 'desktop', 20),
('AirPods 3세대', '공간 음향, 적응형 EQ, MagSafe 충전 케이스. 프리미엄 사운드를 경험하세요.', 249000, 'https://picsum.photos/id/248/500/500', 'audio', 60),
('iPad 10세대', 'A14 Bionic 칩, 64GB WiFi 모델, 10.9인치 Liquid Retina 디스플레이. 일상의 모든 일을 쉽게 처리합니다.', 679000, 'https://picsum.photos/id/249/500/500', 'tablet', 45);

-- RLS (Row Level Security) 정책 설정 (선택사항)
-- 모든 사용자가 products 테이블을 읽을 수 있도록 허용
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 SELECT 권한 부여
CREATE POLICY "Everyone can view products" ON products
    FOR SELECT USING (true);

-- 인증된 사용자만 INSERT, UPDATE, DELETE 가능 (선택사항)
-- CREATE POLICY "Authenticated users can insert products" ON products
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can update products" ON products
--     FOR UPDATE USING (auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can delete products" ON products
--     FOR DELETE USING (auth.role() = 'authenticated');

-- 테이블 생성 및 데이터 삽입 완료 확인
SELECT 'Products 테이블 설정 완료!' as message;
SELECT COUNT(*) as total_products FROM products;
SELECT name, price, category, stock_quantity FROM products ORDER BY category, name; 