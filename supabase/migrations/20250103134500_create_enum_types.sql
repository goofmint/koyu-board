-- Create ENUM types for the application schema
-- This migration creates the foundational ENUM types that will be used across all tables

-- Community visibility type
CREATE TYPE community_visibility_type AS ENUM ('public', 'private', 'invite_only');

-- Community member role
CREATE TYPE community_member_role AS ENUM ('owner', 'manager', 'member');

-- User status type
CREATE TYPE user_status_type AS ENUM ('active', 'inactive', 'suspended');

-- Post status type
CREATE TYPE post_status_type AS ENUM ('published', 'draft', 'moderated', 'deleted');

-- Notification type
CREATE TYPE notification_type AS ENUM ('mention', 'reply', 'like', 'community_invite', 'system');

-- Moderation action type
CREATE TYPE moderation_action_type AS ENUM ('approve', 'reject', 'flag', 'delete');