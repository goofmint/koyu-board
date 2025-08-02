# Task 1.2: Supabase プロジェクトセットアップ

## 概要

Koyu Board における認証とデータベース基盤として Supabase を設定する。OAuth プロバイダー（Google, GitHub）の設定を含む完全なセットアップを行う。

## 実装内容

### 1. Supabase プロジェクト作成

#### 1.1 プロジェクト初期化
```bash
# Supabase CLI のインストール
npm install -g supabase

# プロジェクト初期化
supabase init

# Supabase プロジェクトと連携
supabase link --project-ref <project-ref>
```

#### 1.2 ローカル開発環境設定
```bash
# ローカル Supabase 起動
supabase start

# データベース URL とキーの確認
supabase status
```

### 2. 環境変数設定

#### 2.1 環境変数ファイル作成
```env
# .env.local (開発環境)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

```env
# .env.server (サーバー専用環境変数)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 2.2 本番環境変数
- Cloudflare Pages の Environment Variables に設定
- セキュアな秘匿情報の管理

### 3. Supabase クライアント初期化

#### 3.1 クライアント設定ファイル
```typescript
// app/lib/supabase.client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY)
```

#### 3.2 サーバーサイドクライアント
```typescript
// app/lib/supabase.server.ts
import { createServerClient } from '@supabase/ssr'

export const createServerClient = (request: Request) =>
  createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { headers: { cookie: request.headers.get('cookie') ?? '' } }
  )
```

### 4. OAuth プロバイダー設定

#### 4.1 Google OAuth 設定
- Google Cloud Console での OAuth アプリ作成
- 認証情報の設定
- リダイレクト URL の設定

#### 4.2 GitHub OAuth 設定
- GitHub Developer Settings での OAuth App 作成
- クライアント ID とシークレットの設定
- Authorization callback URL の設定

#### 4.3 Supabase での OAuth 設定
- Authentication > Providers で Google と GitHub を有効化
- クライアント ID とシークレットを設定
- Site URL とリダイレクト URL を設定

### 5. 認証フロー実装

#### 5.1 ログイン機能
```typescript
// app/lib/auth.ts
import { createClient } from './supabase.client'

export const signInWithProvider = async (provider: 'google' | 'github') => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.ENV.APP_URL}/auth/callback`
    }
  })
  
  if (error) throw error
}
```

#### 5.2 ログアウト機能
```typescript
export const signOut = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

#### 5.3 認証コールバック処理
```typescript
// app/routes/auth.callback.tsx
import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { createServerClient } from '~/lib/supabase.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  
  if (code) {
    const supabase = createServerClient(request)
    await supabase.auth.exchangeCodeForSession({ authCode: code })
  }
  
  return redirect('/')
}
```

## 必要な依存関係

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.0.10",
    "@supabase/supabase-js": "^2.38.0"
  }
}
```

## 設定ファイル

### supabase/config.toml
```toml
[auth]
enabled = true
site_url = "http://localhost:3000"
additional_redirect_urls = ["https://your-domain.com"]

[auth.external.google]
enabled = true
client_id = "env(GOOGLE_CLIENT_ID)"
secret = "env(GOOGLE_CLIENT_SECRET)"

[auth.external.github]
enabled = true
client_id = "env(GITHUB_CLIENT_ID)"
secret = "env(GITHUB_CLIENT_SECRET)"
```

## テスト項目

1. ローカル Supabase が正常に起動する
2. 環境変数が正しく設定されている
3. Supabase クライアントが初期化される
4. Google OAuth でログインできる
5. GitHub OAuth でログインできる
6. ログアウトが正常に動作する
7. 認証状態が適切に管理される

## セキュリティ考慮事項

- Row Level Security (RLS) の有効化
- API キーの適切な管理
- リダイレクト URL の制限
- CORS 設定の確認
- 認証トークンの適切な処理

## 完了条件

- [ ] Supabase プロジェクトが作成されている
- [ ] 環境変数が開発・本番環境で適切に設定されている
- [ ] Supabase クライアントが正常に初期化される
- [ ] Google OAuth でログイン・ログアウトができる
- [ ] GitHub OAuth でログイン・ログアウトができる
- [ ] 認証コールバックが正常に処理される
- [ ] 認証状態が適切に管理される

## 次のタスクへの引き継ぎ

Task 1.3 で使用するデータベース接続が確立され、認証機能の基盤が整った状態で引き継ぐ。