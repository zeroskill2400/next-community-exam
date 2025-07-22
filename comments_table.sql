-- 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 외래키 제약조건
    CONSTRAINT fk_comments_post_id 
        FOREIGN KEY (post_id) 
        REFERENCES public.posts(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_comments_author_id 
        FOREIGN KEY (author_id) 
        REFERENCES public.users(id) 
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC); 