import { user } from "@/database/schema";

export type UserSelect = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export const USER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  TECH: "tech",
  SALES: "sales",
  DEV: "dev",
  QA: "qa",
  PO: "po",
  PM: "pm",
  FINANCE: "finance",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

const USER_ROLE_VALUES = new Set<string>(Object.values(USER_ROLE));

export function isUserRole(value: string): value is UserRole {
  return USER_ROLE_VALUES.has(value);
}

export const USER_PERMISSION = {
  USERS_READ: "users:read",
  USERS_DELETE: "users:delete",
  //blog permissions
  POSTS_CREATE: "posts:create",
  POSTS_READ: "posts:read",
  POSTS_UPDATE: "posts:update",
  POSTS_DELETE: "posts:delete",
} as const;

export type UserPermission = (typeof USER_PERMISSION)[keyof typeof USER_PERMISSION];

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  [USER_ROLE.OWNER]: [
    USER_PERMISSION.USERS_READ,
    USER_PERMISSION.USERS_DELETE,
    USER_PERMISSION.POSTS_CREATE,
    USER_PERMISSION.POSTS_READ,
    USER_PERMISSION.POSTS_UPDATE,
    USER_PERMISSION.POSTS_DELETE,
  ],
  [USER_ROLE.ADMIN]: [
    USER_PERMISSION.USERS_READ,
    USER_PERMISSION.USERS_DELETE,
    USER_PERMISSION.POSTS_CREATE,
    USER_PERMISSION.POSTS_READ,
    USER_PERMISSION.POSTS_UPDATE,
    USER_PERMISSION.POSTS_DELETE,
  ],
  [USER_ROLE.TECH]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ],
  [USER_ROLE.SALES]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ],
  [USER_ROLE.DEV]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ], // Dev can only read!
  [USER_ROLE.QA]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ],
  [USER_ROLE.PO]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ],
  [USER_ROLE.PM]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ],
  [USER_ROLE.FINANCE]: [USER_PERMISSION.USERS_READ, USER_PERMISSION.POSTS_READ],
};

export function hasPermission(role: UserRole, permission: UserPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export type UserResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type DeleteUserInput = {
  id: string;
};
