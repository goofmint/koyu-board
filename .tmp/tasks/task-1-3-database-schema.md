# Task 1.3: データベーススキーマ設計

## 概要

エンジニア向け掲示板サービスのためのデータベーススキーマを設計・実装します。この実装により、ユーザープロフィール、コミュニティ、フォーラム機能、チャット機能の基盤が構築されます。

## チェックボックス

- [ ] ENUM型定義の作成

## 実装計画

### 対象範囲

以下のENUM型を定義し、後続のテーブル作成で使用します：

1. **community_visibility_type**
   ```sql
   CREATE TYPE community_visibility_type AS ENUM ('public', 'private', 'invite_only');
   ```

2. **community_member_role**
   ```sql
   CREATE TYPE community_member_role AS ENUM ('owner', 'manager', 'member');
   ```

3. **user_status_type**
   ```sql
   CREATE TYPE user_status_type AS ENUM ('active', 'inactive', 'suspended');
   ```

4. **post_status_type**
   ```sql
   CREATE TYPE post_status_type AS ENUM ('published', 'draft', 'moderated', 'deleted');
   ```

5. **notification_type**
   ```sql
   CREATE TYPE notification_type AS ENUM ('mention', 'reply', 'like', 'community_invite', 'system');
   ```

6. **moderation_action_type**
   ```sql
   CREATE TYPE moderation_action_type AS ENUM ('approve', 'reject', 'flag', 'delete');
   ```

### 技術仕様

- **使用技術**: Supabase PostgreSQL
- **マイグレーションファイル**: SQLファイルとして作成
- **命名規則**: スネークケース（例: `community_visibility_type`）
- **ENUM値**: 小文字・アンダースコア区切り

### 実装アプローチ

1. **SQLマイグレーションファイル作成**
   - `supabase/migrations/` ディレクトリに配置
   - タイムスタンプ付きファイル名

2. **型定義の順序**
   - 依存関係を考慮した順序で作成
   - 各ENUM型は独立して定義可能

3. **バリデーション**
   - 定義されたENUM値が適切に制約として機能することを確認
   - 今後のテーブル作成時にFK制約として使用予定

### 期待される成果物

- ✅ ENUM型定義のSQLマイグレーションファイル
- ✅ Supabase上でのENUM型作成完了
- ✅ 今後のテーブル作成における型制約の基盤構築

### 完了条件

- 全てのENUM型がSupabaseデータベースに正常に作成されている
- マイグレーションファイルが適切にバージョン管理されている
- 後続タスクでのテーブル作成の準備が整っている

### 依存関係

- **前提条件**: Task 1.2 (Supabaseプロジェクトセットアップ) 完了
- **後続タスク**: Task 1.3の残りのサブタスク（基本テーブル、フォーラムテーブル等）

### 推定時間

- **作業時間**: 1時間
- **複雑度**: 低
- **リスク**: 低