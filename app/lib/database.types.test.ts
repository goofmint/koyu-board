import { describe, expect, test } from 'vitest';
import {
  CommunityVisibility,
  CommunityRole,
  UserStatus,
  PostStatus,
  NotificationTypes,
  ModerationAction,
  COMMUNITY_VISIBILITY_VALUES,
  COMMUNITY_MEMBER_ROLE_VALUES,
  USER_STATUS_VALUES,
  POST_STATUS_VALUES,
  NOTIFICATION_TYPE_VALUES,
  MODERATION_ACTION_VALUES,
  isCommunityVisibilityType,
  isCommunityMemberRole,
  isUserStatusType,
  isPostStatusType,
  isNotificationType,
  isModerationActionType,
  type CommunityVisibilityType,
  type CommunityMemberRole,
  type UserStatusType,
  type PostStatusType,
  type NotificationType,
  type ModerationActionType,
} from './database.types';

describe('Database Types', () => {
  describe('Constants', () => {
    test('CommunityVisibility constants', () => {
      expect(CommunityVisibility.PUBLIC).toBe('public');
      expect(CommunityVisibility.PRIVATE).toBe('private');
      expect(CommunityVisibility.INVITE_ONLY).toBe('invite_only');
    });

    test('CommunityRole constants', () => {
      expect(CommunityRole.OWNER).toBe('owner');
      expect(CommunityRole.MANAGER).toBe('manager');
      expect(CommunityRole.MEMBER).toBe('member');
    });

    test('UserStatus constants', () => {
      expect(UserStatus.ACTIVE).toBe('active');
      expect(UserStatus.INACTIVE).toBe('inactive');
      expect(UserStatus.SUSPENDED).toBe('suspended');
    });

    test('PostStatus constants', () => {
      expect(PostStatus.PUBLISHED).toBe('published');
      expect(PostStatus.DRAFT).toBe('draft');
      expect(PostStatus.MODERATED).toBe('moderated');
      expect(PostStatus.DELETED).toBe('deleted');
    });

    test('NotificationTypes constants', () => {
      expect(NotificationTypes.MENTION).toBe('mention');
      expect(NotificationTypes.REPLY).toBe('reply');
      expect(NotificationTypes.LIKE).toBe('like');
      expect(NotificationTypes.COMMUNITY_INVITE).toBe('community_invite');
      expect(NotificationTypes.SYSTEM).toBe('system');
    });

    test('ModerationAction constants', () => {
      expect(ModerationAction.APPROVE).toBe('approve');
      expect(ModerationAction.REJECT).toBe('reject');
      expect(ModerationAction.FLAG).toBe('flag');
      expect(ModerationAction.DELETE).toBe('delete');
    });
  });

  describe('Arrays', () => {
    test('COMMUNITY_VISIBILITY_VALUES contains all values', () => {
      expect(COMMUNITY_VISIBILITY_VALUES).toEqual(['public', 'private', 'invite_only']);
      expect(COMMUNITY_VISIBILITY_VALUES).toHaveLength(3);
    });

    test('COMMUNITY_MEMBER_ROLE_VALUES contains all values', () => {
      expect(COMMUNITY_MEMBER_ROLE_VALUES).toEqual(['owner', 'manager', 'member']);
      expect(COMMUNITY_MEMBER_ROLE_VALUES).toHaveLength(3);
    });

    test('USER_STATUS_VALUES contains all values', () => {
      expect(USER_STATUS_VALUES).toEqual(['active', 'inactive', 'suspended']);
      expect(USER_STATUS_VALUES).toHaveLength(3);
    });

    test('POST_STATUS_VALUES contains all values', () => {
      expect(POST_STATUS_VALUES).toEqual(['published', 'draft', 'moderated', 'deleted']);
      expect(POST_STATUS_VALUES).toHaveLength(4);
    });

    test('NOTIFICATION_TYPE_VALUES contains all values', () => {
      expect(NOTIFICATION_TYPE_VALUES).toEqual(['mention', 'reply', 'like', 'community_invite', 'system']);
      expect(NOTIFICATION_TYPE_VALUES).toHaveLength(5);
    });

    test('MODERATION_ACTION_VALUES contains all values', () => {
      expect(MODERATION_ACTION_VALUES).toEqual(['approve', 'reject', 'flag', 'delete']);
      expect(MODERATION_ACTION_VALUES).toHaveLength(4);
    });
  });

  describe('Type Guards', () => {
    describe('isCommunityVisibilityType', () => {
      test('returns true for valid values', () => {
        expect(isCommunityVisibilityType('public')).toBe(true);
        expect(isCommunityVisibilityType('private')).toBe(true);
        expect(isCommunityVisibilityType('invite_only')).toBe(true);
      });

      test('returns false for invalid values', () => {
        expect(isCommunityVisibilityType('invalid')).toBe(false);
        expect(isCommunityVisibilityType('')).toBe(false);
        expect(isCommunityVisibilityType('PUBLIC')).toBe(false);
      });
    });

    describe('isCommunityMemberRole', () => {
      test('returns true for valid values', () => {
        expect(isCommunityMemberRole('owner')).toBe(true);
        expect(isCommunityMemberRole('manager')).toBe(true);
        expect(isCommunityMemberRole('member')).toBe(true);
      });

      test('returns false for invalid values', () => {
        expect(isCommunityMemberRole('admin')).toBe(false);
        expect(isCommunityMemberRole('')).toBe(false);
        expect(isCommunityMemberRole('OWNER')).toBe(false);
      });
    });

    describe('isUserStatusType', () => {
      test('returns true for valid values', () => {
        expect(isUserStatusType('active')).toBe(true);
        expect(isUserStatusType('inactive')).toBe(true);
        expect(isUserStatusType('suspended')).toBe(true);
      });

      test('returns false for invalid values', () => {
        expect(isUserStatusType('disabled')).toBe(false);
        expect(isUserStatusType('')).toBe(false);
        expect(isUserStatusType('ACTIVE')).toBe(false);
      });
    });

    describe('isPostStatusType', () => {
      test('returns true for valid values', () => {
        expect(isPostStatusType('published')).toBe(true);
        expect(isPostStatusType('draft')).toBe(true);
        expect(isPostStatusType('moderated')).toBe(true);
        expect(isPostStatusType('deleted')).toBe(true);
      });

      test('returns false for invalid values', () => {
        expect(isPostStatusType('pending')).toBe(false);
        expect(isPostStatusType('')).toBe(false);
        expect(isPostStatusType('PUBLISHED')).toBe(false);
      });
    });

    describe('isNotificationType', () => {
      test('returns true for valid values', () => {
        expect(isNotificationType('mention')).toBe(true);
        expect(isNotificationType('reply')).toBe(true);
        expect(isNotificationType('like')).toBe(true);
        expect(isNotificationType('community_invite')).toBe(true);
        expect(isNotificationType('system')).toBe(true);
      });

      test('returns false for invalid values', () => {
        expect(isNotificationType('email')).toBe(false);
        expect(isNotificationType('')).toBe(false);
        expect(isNotificationType('MENTION')).toBe(false);
      });
    });

    describe('isModerationActionType', () => {
      test('returns true for valid values', () => {
        expect(isModerationActionType('approve')).toBe(true);
        expect(isModerationActionType('reject')).toBe(true);
        expect(isModerationActionType('flag')).toBe(true);
        expect(isModerationActionType('delete')).toBe(true);
      });

      test('returns false for invalid values', () => {
        expect(isModerationActionType('ban')).toBe(false);
        expect(isModerationActionType('')).toBe(false);
        expect(isModerationActionType('APPROVE')).toBe(false);
      });
    });
  });

  describe('Type Compatibility', () => {
    test('constants match type definitions', () => {
      const visibility: CommunityVisibilityType = CommunityVisibility.PUBLIC;
      const role: CommunityMemberRole = CommunityRole.OWNER;
      const status: UserStatusType = UserStatus.ACTIVE;
      const postStatus: PostStatusType = PostStatus.PUBLISHED;
      const notification: NotificationType = NotificationTypes.MENTION;
      const action: ModerationActionType = ModerationAction.APPROVE;

      expect(visibility).toBe('public');
      expect(role).toBe('owner');
      expect(status).toBe('active');
      expect(postStatus).toBe('published');
      expect(notification).toBe('mention');
      expect(action).toBe('approve');
    });

    test('arrays contain values matching type definitions', () => {
      COMMUNITY_VISIBILITY_VALUES.forEach(value => {
        expect(isCommunityVisibilityType(value)).toBe(true);
      });

      COMMUNITY_MEMBER_ROLE_VALUES.forEach(value => {
        expect(isCommunityMemberRole(value)).toBe(true);
      });

      USER_STATUS_VALUES.forEach(value => {
        expect(isUserStatusType(value)).toBe(true);
      });

      POST_STATUS_VALUES.forEach(value => {
        expect(isPostStatusType(value)).toBe(true);
      });

      NOTIFICATION_TYPE_VALUES.forEach(value => {
        expect(isNotificationType(value)).toBe(true);
      });

      MODERATION_ACTION_VALUES.forEach(value => {
        expect(isModerationActionType(value)).toBe(true);
      });
    });
  });
});