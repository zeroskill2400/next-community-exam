-- products 테이블 생성
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

-- 업데이트 시간 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- products 테이블에 트리거 적용
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('MacBook Pro 16인치', 'M3 Pro 칩, 18GB 메모리, 512GB SSD', 2990000, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop', 'laptop', 10),
('iPhone 15 Pro', '티타늄 소재, 128GB, 프로 카메라 시스템', 1550000, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', 'phone', 25),
('iPad Pro 12.9인치', 'M2 칩, 256GB, WiFi 모델', 1790000, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop', 'tablet', 15),
('AirPods Pro', '액티브 노이즈 캔슬링, USB-C', 350000, 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&h=500&fit=crop', 'audio', 50),
('Apple Watch Series 9', 'GPS + Cellular, 45mm, 스포츠 밴드', 650000, 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop', 'watch', 30),
('Mac Studio', 'M2 Ultra 칩, 64GB 메모리, 1TB SSD', 5490000, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 'desktop', 5);

-- RLS (Row Level Security) 활성화 (선택사항)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 products를 읽을 수 있도록 정책 생성 (선택사항)
-- CREATE POLICY "Everyone can read products" ON products FOR SELECT USING (true); 