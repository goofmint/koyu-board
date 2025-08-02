# 詳細設計書 - エンジニア向け掲示板サービス

## 1. アーキテクチャ概要

### 1.1 システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Remix)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Forum     │  │    Chat     │  │    Auth     │        │
│  │  Component  │  │  Component  │  │  Component  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                      API Routes                             │
├─────────────────────────────────────────────────────────────┤
│                     Supabase Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │   Storage   │  │ Realtime    │        │
│  │  (Main DB)  │  │  (Images)   │  │   (Chat)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Gemini API │  │ Google OAuth│  │ GitHub OAuth│        │
│  │ (AI Features│  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技術スタック

- **言語**: TypeScript 5.x
- **フロントエンド**: Remix 2.x + React 18
- **バックエンド**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **UI**: Tailwind CSS + Radix UI / shadcn/ui
- **AI**: Gemini API (モデレーション・要約・翻訳)
- **デプロイ**: Cloudflare (Remix) + Supabase Cloud
- **テスト**: Vitest + Testing Library + Playwright

## 2. データベース設計

### 2.1 テーブル構成

```sql
-- ユーザー (Supabase Auth拡張)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  email VARCHAR(100) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- コミュニティ
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  visibility_type community_visibility_type NOT NULL DEFAULT 'open',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- メンバーシップとロール
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role community_role_type NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- カテゴリー (階層構造)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.categories(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- スレッド
CREATE TABLE public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  primary_language VARCHAR(5) DEFAULT 'en',
  ai_summary TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  moderation_status moderation_status_type DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ポスト (返信)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.posts(id),
  created_by UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  content_language VARCHAR(5) DEFAULT 'en',
  moderation_status moderation_status_type DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- チャット関連テーブル
CREATE TABLE public.chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  channel_type channel_type DEFAULT 'public',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  content_language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 通知
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  related_id UUID, -- 関連するthread_id, post_id等
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 翻訳
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL, -- community_id, thread_id or post_id
  content_type VARCHAR(20) NOT NULL, -- 'community', 'thread' or 'post'
  original_language VARCHAR(5) NOT NULL,
  translated_language VARCHAR(5) NOT NULL,
  translated_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, translated_language)
);
```

### 2.2 ENUM型定義

```sql
CREATE TYPE community_visibility_type AS ENUM ('open', 'limited', 'closed');
CREATE TYPE community_role_type AS ENUM ('owner', 'manager', 'member', 'banned');
CREATE TYPE moderation_status_type AS ENUM ('pending', 'approved', 'rejected', 'hidden');
CREATE TYPE channel_type AS ENUM ('public', 'private', 'dm');
CREATE TYPE message_type AS ENUM ('text', 'image', 'system');
CREATE TYPE notification_type AS ENUM ('mention', 'reply', 'chat_message', 'community_request');
```

## 3. コンポーネント設計

### 3.1 主要コンポーネント一覧

| コンポーネント名 | 責務 | 依存関係 |
|------------------|------|----------|
| CommunityLayout | コミュニティ全体のレイアウト | AuthProvider, CommunityProvider |
| ForumView | フォーラム表示・ナビゲーション | CategoryList, ThreadList |
| ThreadView | スレッド詳細とポスト表示 | PostList, PostEditor |
| ChatView | チャット機能 | ChannelList, MessageList, MessageInput |
| SearchProvider | 全文検索機能 | Supabaseクライアント |
| NotificationCenter | 通知管理 | RealtimeProvider |
| AIModeration | AI判定とモデレーション | OpenAI API |

### 3.2 主要コンポーネントの詳細

#### ForumView

**目的**: フォーラムのメイン画面を管理し、カテゴリー・スレッド一覧の表示を制御

**公開インターフェース**:
```typescript
interface ForumViewProps {
  communityId: string;
  categoryId?: string;
  sortBy?: 'latest' | 'popular' | 'created';
}

interface ForumState {
  categories: Category[];
  threads: Thread[];
  loading: boolean;
  error?: string;
}
```

**内部実装方針**: 
- React QueryでCaching戦略
- 無限スクロールでページネーション実装
- SSR対応でSEO最適化

#### ThreadView

**目的**: スレッド詳細ページでポストの階層表示とリアルタイム更新

**公開インターフェース**:
```typescript
interface ThreadViewProps {
  threadId: string;
  communityId: string;
}

interface ThreadState {
  thread: Thread;
  posts: Post[];
  aiSummary?: string;
  realtimeSubscription: RealtimeChannel;
}
```

**内部実装方針**:
- ネストしたポストの効率的な表示アルゴリズム
- Supabase Realtimeでリアルタイム更新
- AIサマリーの非同期取得と表示

#### ChatView

**目的**: リアルタイムチャット機能の提供

**公開インターフェース**:
```typescript
interface ChatViewProps {
  channelId: string;
  channelType: 'public' | 'private' | 'dm';
}

interface ChatState {
  messages: ChatMessage[];
  onlineUsers: User[];
  typingUsers: User[];
}
```

**内部実装方針**:
- Supabase Realtimeでメッセージング
- 既読管理とtyping indicator
- WebPush通知との連携

## 4. API設計

### 4.1 REST API エンドポイント

```typescript
// コミュニティ関連
GET    /api/communities
POST   /api/communities
GET    /api/communities/:id
PUT    /api/communities/:id
DELETE /api/communities/:id

// メンバー関係
GET    /api/communities/:id/members
POST   /api/communities/:id/members // メンバー追加
PUT    /api/communities/:id/members/:userId // ロール変更、バン
DELETE /api/communities/:id/members/:userId

// メンバー情報取得
GET    /api/members/:userId
PUT    /api/members/me // プロフィール更新
DELETE /api/members/me // 退会

// カテゴリ関連
GET    /api/communities/:id/categories
POST   /api/communities/:id/categories
GET    /api/communities/:id/categories/:categoryId
PUT    /api/communities/:id/categories/:categoryId
DELETE /api/communities/:id/categories/:categoryId

// スレッド関連
GET    /api/communities/:id/threads
POST   /api/communities/:id/threads
GET    /api/communities/:id/threads/:id
PUT    /api/communities/:id/threads/:id
DELETE /api/communities/:id/threads/:id

// ポスト関連
GET    /api/communities/:id/threads/:id/posts
POST   /api/communities/:id/threads/:id/posts
GET    /api/communities/:id/threads/:id/posts/:id
PUT    /api/communities/:id/threads/:id/posts/:id
DELETE /api/communities/:id/threads/:id/posts/:id

// チャット関連
GET    /api/communities/:id/channels
POST   /api/communities/:id/channels
GET    /api/communities/:id/channels/:id
PUT    /api/communities/:id/channels/:id
DELETE /api/communities/:id/channels/:id

// チャットメッセージ関連
GET    /api/communities/:id/channels/:id/messages
POST   /api/communities/:id/channels/:id/messages
GET    /api/communities/:id/channels/:id/messages/:messageId
PUT    /api/communities/:id/channels/:id/messages/:messageId
DELETE /api/communities/:id/channels/:id/messages/:messageId

// 検索関連
GET    /api/search?q=:query&scope=:scope&community_id=:id
```

### 4.2 Supabase RLS (Row Level Security) ポリシー

```sql
-- コミュニティの可視性制御
CREATE POLICY "Communities are visible based on type" ON communities
FOR SELECT USING (
  visibility_type = 'open' OR
  (visibility_type = 'limited' AND EXISTS (
    SELECT 1 FROM community_members 
    WHERE community_id = communities.id AND user_id = auth.uid()
  )) OR
  (visibility_type = 'closed' AND EXISTS (
    SELECT 1 FROM community_members 
    WHERE community_id = communities.id AND user_id = auth.uid()
  ))
);

-- スレッド・ポストの表示制御
CREATE POLICY "Posts are visible to community members" ON posts
FOR SELECT USING (
  moderation_status = 'approved' OR 
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM community_members cm
    JOIN threads t ON t.category_id IN (
      SELECT id FROM categories WHERE community_id = cm.community_id
    )
    WHERE cm.user_id = auth.uid() AND cm.role IN ('owner', 'manager')
    AND posts.thread_id = t.id
  )
);
```

## 5. AI機能設計

### 5.1 モデレーション機能

```typescript
interface ModerationRequest {
  content: string;
  contentType: 'thread' | 'post' | 'chat_message';
  language: string;
}

interface ModerationResponse {
  status: 'approved' | 'rejected' | 'flagged';
  reason?: string;
  confidence: number;
}

// OpenAI APIを使用したモデレーション
async function moderateContent(request: ModerationRequest): Promise<ModerationResponse> {
  const prompt = `
    以下のコンテンツをエンジニア向けフォーラムの投稿として評価してください。
    不適切な内容（攻撃的、スパム、オフトピックなど）がないかチェックし、
    JSON形式で結果を返してください。
    
    コンテンツ: ${request.content}
  `;
  
  // OpenAI API呼び出し実装
}
```

### 5.2 スレッド要約機能

```typescript
interface SummaryRequest {
  threadId: string;
  posts: Post[];
  maxLength: number;
}

async function generateThreadSummary(request: SummaryRequest): Promise<string> {
  const posts = request.posts.slice(0, 20); // 最新20件のポストを使用
  const prompt = `
    以下のエンジニア向けフォーラムのスレッドを要約してください。
    技術的な内容と議論の流れを簡潔にまとめ、200文字以内で要約してください。
    
    ポスト一覧:
    ${posts.map(p => `- ${p.content}`).join('\n')}
  `;
  
  // OpenAI API実装
}
```

### 5.3 翻訳機能

```typescript
interface TranslationRequest {
  text: string;
  fromLang: string;
  toLang: string;
}

async function translateContent(request: TranslationRequest): Promise<string> {
  const prompt = `
    以下のテキストを${request.fromLang}から${request.toLang}に翻訳してください。
    技術用語は適切に翻訳し、自然な表現にしてください。
    
    原文: ${request.text}
  `;
  
  // OpenAI API実装
}
```

## 6. リアルタイム機能

### 6.1 Supabase Realtime設定

```typescript
// チャットメッセージのリアルタイム購読
const setupChatRealtime = (channelId: string) => {
  return supabase
    .channel(`chat:${channelId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `channel_id=eq.${channelId}`
    }, payload => {
      // 新しいメッセージの処理
    })
    .subscribe();
};

// 通知のリアルタイム配信
const setupNotificationRealtime = (userId: string) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, payload => {
      // 通知の表示
    })
    .subscribe();
};
```

### 6.2 WebPush通知

```typescript
interface NotificationService {
  requestPermission(): Promise<boolean>;
  subscribe(userId: string): Promise<void>;
  sendNotification(notification: Notification): Promise<void>;
}

// Service Worker での通知処理
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const options = {
    body: data.content,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.type,
    data: data.relatedId
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
```

## 7. 検索機能設計

### 7.1 PostgreSQL全文検索

```sql
-- 全文検索用のインデックス作成
CREATE INDEX idx_threads_search ON threads USING GIN(
  to_tsvector('japanese', title || ' ' || content)
);

CREATE INDEX idx_posts_search ON posts USING GIN(
  to_tsvector('japanese', content)
);

-- 検索クエリ例
SELECT t.*, ts_rank(to_tsvector('japanese', t.title || ' ' || t.content), query) AS rank
FROM threads t, plainto_tsquery('japanese', $1) query
WHERE to_tsvector('japanese', t.title || ' ' || t.content) @@ query
ORDER BY rank DESC, t.created_at DESC;
```

### 7.2 検索API実装

```typescript
interface SearchRequest {
  query: string;
  scope: 'global' | 'community' | 'thread';
  communityId?: string;
  threadId?: string;
  limit?: number;
  offset?: number;
}

interface SearchResult {
  threads: ThreadSearchResult[];
  posts: PostSearchResult[];
  totalCount: number;
}

async function searchContent(request: SearchRequest): Promise<SearchResult> {
  // PostgreSQLの全文検索を使用した実装
}
```

## 8. セキュリティ設計

### 8.1 認証・認可

- **Supabase Auth**を使用したOAuth認証
- **Row Level Security (RLS)**によるデータアクセス制御
- **JWT**による状態管理

### 8.2 入力検証

```typescript
// Zodを使用したスキーマ検証
const ThreadCreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  categoryId: z.string().uuid(),
});

const PostCreateSchema = z.object({
  content: z.string().min(1).max(5000),
  threadId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});
```

### 8.3 CSRF・XSS対策

- RemixのCSRF保護機能を活用
- コンテンツのサニタイゼーション
- CSP (Content Security Policy) の設定

## 9. パフォーマンス最適化

### 9.1 キャッシング戦略

```typescript
// React Queryによるクライアントキャッシング
const useThreads = (communityId: string) => {
  return useQuery({
    queryKey: ['threads', communityId],
    queryFn: () => fetchThreads(communityId),
    staleTime: 5 * 60 * 1000, // 5分
    cacheTime: 10 * 60 * 1000, // 10分
  });
};

// Redisキャッシング (将来的な拡張)
const cacheThreadSummary = async (threadId: string, summary: string) => {
  await redis.setex(`summary:${threadId}`, 3600, summary);
};
```

### 9.2 画像最適化

```typescript
// Supabase Storageでの画像処理
const uploadOptimizedImage = async (file: File): Promise<string> => {
  // リサイズ・圧縮処理
  const optimizedFile = await compressImage(file, {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.8
  });
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(`threads/${Date.now()}.webp`, optimizedFile);
    
  return data?.path || '';
};
```

## 10. テスト戦略

### 10.1 単体テスト

- **カバレッジ目標**: 80%以上
- **テストフレームワーク**: Vitest + Testing Library

```typescript
// コンポーネントテスト例
describe('ThreadView', () => {
  it('should display thread title and content', async () => {
    const mockThread = createMockThread();
    render(<ThreadView threadId={mockThread.id} />);
    
    expect(await screen.findByText(mockThread.title)).toBeInTheDocument();
    expect(screen.getByText(mockThread.content)).toBeInTheDocument();
  });
});
```

### 10.2 E2Eテスト

```typescript
// Playwrightを使用したE2Eテスト
test('user can create and reply to thread', async ({ page }) => {
  await page.goto('/community/test-community');
  
  // スレッド作成
  await page.click('[data-testid="create-thread"]');
  await page.fill('[data-testid="thread-title"]', 'Test Thread');
  await page.fill('[data-testid="thread-content"]', 'This is a test thread');
  await page.click('[data-testid="submit-thread"]');
  
  // 返信作成
  await page.fill('[data-testid="reply-content"]', 'Test reply');
  await page.click('[data-testid="submit-reply"]');
  
  await expect(page.locator('[data-testid="post"]')).toContainText('Test reply');
});
```

## 11. デプロイメント設計

### 11.1 CI/CD パイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloudflare
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_PROJECT_ID: ${{ secrets.CLOUDFLARE_PROJECT_ID }}
        run: |
          npm run build
          npx wrangler deploy --env production
```

### 11.2 環境設定

```typescript
// 環境変数管理
const config = {
  supabase: {
    url: process.env.SUPABASE_URL!,
    anonKey: process.env.SUPABASE_ANON_KEY!,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
  },
  app: {
    baseUrl: process.env.APP_BASE_URL!,
    environment: process.env.NODE_ENV!,
  }
};
```

## 12. モニタリング・ログ戦略

### 12.1 エラー監視

- **Sentry**によるエラートラッキング
- **Supabase Dashboard**でのDB監視
- **Cloudflare Analytics**でのフロントエンドパフォーマンス監視

### 12.2 ログ設計

```typescript
interface LogEvent {
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  communityId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const logger = {
  info: (message: string, metadata?: Record<string, any>) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      metadata,
      timestamp: new Date(),
    }));
  },
  // warn, error メソッドも同様
};
```

## 13. 実装上の注意事項

### 13.1 セキュリティ
- Supabase RLSポリシーの適切な設定
- AI API呼び出し時のレート制限対応
- ユーザー入力の適切なサニタイゼーション

### 13.2 パフォーマンス
- 大量データに対する適切なページネーション
- リアルタイム機能の接続数制限
- AI機能の非同期処理とキューイング

### 13.3 運用
- DB Migration戦略の確立
- AI機能のコスト監視
- ユーザーフィードバック収集機能

### 13.4 スケーラビリティ
- コミュニティ数増加に対応するDB設計
- ファイルストレージの容量管理
- AIサービスの使用量最適化