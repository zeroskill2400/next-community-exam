-- Posts 테이블 생성 (간단 버전)
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 샘플 데이터 삽입
INSERT INTO posts (title, content, author, author_id) VALUES
  ('첫 번째 게시글', '안녕하세요! 커뮤니티 첫 게시글입니다.', 'test@example.com', gen_random_uuid()),
  ('두 번째 게시글', 'Next.js와 Supabase로 만든 커뮤니티입니다.', 'admin@example.com', gen_random_uuid()),
  ('환영합니다!', '새로운 멤버들을 환영합니다. 자유롭게 소통해요!', 'user@example.com', gen_random_uuid()); 