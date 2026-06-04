import { UserRole } from "@/types/enums";

export const PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    "create",
    "read",
    "update",
    "delete",
    "manage_users",
    "pin_property",
    "feature_property",
  ],
  [UserRole.ADMIN]: ["create", "read", "update", "pin_property", "feature_property"],
  [UserRole.VIEWER]: ["read"],
};

export function can(role: UserRole, action: string): boolean {
  return PERMISSIONS[role]?.includes(action) ?? false;
}
