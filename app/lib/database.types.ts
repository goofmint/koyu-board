// Database type definitions for the application
// These types correspond to the ENUM types created in the database migrations

export type CommunityVisibilityType = 'public' | 'private' | 'invite_only';

export type CommunityMemberRole = 'owner' | 'manager' | 'member';

export type UserStatusType = 'active' | 'inactive' | 'suspended';

export type PostStatusType = 'published' | 'draft' | 'moderated' | 'deleted';

export type NotificationType = 'mention' | 'reply' | 'like' | 'community_invite' | 'system';

export type ModerationActionType = 'approve' | 'reject' | 'flag' | 'delete';

// Helper objects for validation and UI
export const CommunityVisibility = {
  PUBLIC: 'public' as const,
  PRIVATE: 'private' as const,
  INVITE_ONLY: 'invite_only' as const,
} as const;

export const CommunityRole = {
  OWNER: 'owner' as const,
  MANAGER: 'manager' as const,
  MEMBER: 'member' as const,
} as const;

export const UserStatus = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  SUSPENDED: 'suspended' as const,
} as const;

export const PostStatus = {
  PUBLISHED: 'published' as const,
  DRAFT: 'draft' as const,
  MODERATED: 'moderated' as const,
  DELETED: 'deleted' as const,
} as const;

export const NotificationTypes = {
  MENTION: 'mention' as const,
  REPLY: 'reply' as const,
  LIKE: 'like' as const,
  COMMUNITY_INVITE: 'community_invite' as const,
  SYSTEM: 'system' as const,
} as const;

export const ModerationAction = {
  APPROVE: 'approve' as const,
  REJECT: 'reject' as const,
  FLAG: 'flag' as const,
  DELETE: 'delete' as const,
} as const;

// Arrays for iteration and validation
export const COMMUNITY_VISIBILITY_VALUES: CommunityVisibilityType[] = ['public', 'private', 'invite_only'];
export const COMMUNITY_MEMBER_ROLE_VALUES: CommunityMemberRole[] = ['owner', 'manager', 'member'];
export const USER_STATUS_VALUES: UserStatusType[] = ['active', 'inactive', 'suspended'];
export const POST_STATUS_VALUES: PostStatusType[] = ['published', 'draft', 'moderated', 'deleted'];
export const NOTIFICATION_TYPE_VALUES: NotificationType[] = ['mention', 'reply', 'like', 'community_invite', 'system'];
export const MODERATION_ACTION_VALUES: ModerationActionType[] = ['approve', 'reject', 'flag', 'delete'];

// Type guards for runtime validation
export function isCommunityVisibilityType(value: string): value is CommunityVisibilityType {
  return COMMUNITY_VISIBILITY_VALUES.includes(value as CommunityVisibilityType);
}

export function isCommunityMemberRole(value: string): value is CommunityMemberRole {
  return COMMUNITY_MEMBER_ROLE_VALUES.includes(value as CommunityMemberRole);
}

export function isUserStatusType(value: string): value is UserStatusType {
  return USER_STATUS_VALUES.includes(value as UserStatusType);
}

export function isPostStatusType(value: string): value is PostStatusType {
  return POST_STATUS_VALUES.includes(value as PostStatusType);
}

export function isNotificationType(value: string): value is NotificationType {
  return NOTIFICATION_TYPE_VALUES.includes(value as NotificationType);
}

export function isModerationActionType(value: string): value is ModerationActionType {
  return MODERATION_ACTION_VALUES.includes(value as ModerationActionType);
}