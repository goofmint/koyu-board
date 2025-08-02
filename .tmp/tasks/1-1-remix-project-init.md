# Task 1.1: Remix プロジェクトの初期化

## 概要

エンジニア向け掲示板サービスのRemixプロジェクト初期化設定を行う。

## 目的

- Remixベースのプロジェクト構造を構築
- TypeScript、ESLint、Prettierの開発環境設定
- UI/CSSフレームワークの導入
- テスト環境の構築
- CI/CDパイプラインの基礎設定

## 手順

### 1. Remixプロジェクトの初期化

```bash
npx create-remix@latest koyu-board --template remix-run/remix/templates/remix
cd koyu-board
npm install
```

### 2. TypeScript設定の最適化

**tsconfig.json**

```json
{
  "include": ["remix.env.d.ts", "**/*.ts", "**/*.tsx"],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "target": "ES2022",
    "strict": true,
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    },
    "noEmit": true
  }
}
```

### 3. ESLintとPrettier設定

**.eslintrc.js**

```javascript
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
```

**.prettierrc**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 4. Tailwind CSS + shadcn/ui セットアップ

```bash
npm install -D tailwindcss postcss autoprefixer
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
npx tailwindcss init -p
```

**tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### 5. Vitest + Testing Library セットアップ

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/test/setup.ts'],
  },
  resolve: {
    alias: {
      '~': './app',
    },
  },
});
```

**app/test/setup.ts**

```typescript
import '@testing-library/jest-dom';
```

### 6. GitHub Actions CI/CD基本設定

**.github/workflows/ci.yml**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run typecheck

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build
```

### 7. package.json スクリプト更新

```json
{
  "scripts": {
    "build": "remix build",
    "dev": "remix dev --manual",
    "lint": "eslint --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .",
    "lint:fix": "npm run lint -- --fix",
    "start": "remix-serve ./build/index.js",
    "typecheck": "tsc",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "format": "prettier --write ."
  }
}
```

### 8. 環境変数設定

**.env.example**

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App
APP_BASE_URL=http://localhost:3000
NODE_ENV=development
```

**.gitignore** に追加

```
# Environment variables
.env
.env.local
.env.production

# Build output
/build
/public/build

# Dependencies
node_modules

# Cache
.cache
.eslintcache

# Test coverage
coverage

# VS Code
.vscode

# OS
.DS_Store
Thumbs.db
```

## プロジェクト構造

```
koyu-board/
├── app/
│   ├── components/          # 再利用可能なUIコンポーネント
│   │   ├── ui/             # shadcn/uiコンポーネント
│   │   └── layout/         # レイアウトコンポーネント
│   ├── lib/                # ユーティリティ関数
│   │   ├── supabase.ts     # Supabaseクライアント
│   │   ├── auth.ts         # 認証関連
│   │   └── utils.ts        # 汎用ユーティリティ
│   ├── routes/             # Remixルート
│   ├── styles/             # CSS/スタイル
│   ├── types/              # TypeScript型定義
│   ├── test/               # テスト設定
│   ├── entry.client.tsx    # クライアントエントリーポイント
│   ├── entry.server.tsx    # サーバーエントリーポイント
│   └── root.tsx            # アプリケーションルート
├── public/                 # 静的ファイル
├── .github/                # GitHub Actions
├── .env.example            # 環境変数テンプレート
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

## 完了条件

- [x] Remixプロジェクト初期化ドキュメント作成完了
- [ ] `npm run dev` でアプリケーションが起動する
- [ ] TypeScript、ESLint、Prettierが適切に設定される
- [ ] Tailwind CSSが動作する
- [ ] テストが実行できる
- [ ] CI/CDパイプラインが設定される

## 次のステップ

このタスク完了後、Task 1.2「Supabaseプロジェクトセットアップ」に進む。
