import { FirebaseTimestamp, BaseEntity, BaseStatus } from ".";

export type UserRole = "admin" | "moderator" | "user" | "viewer";

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: Extract<BaseStatus, "pending" | "active" | "suspended">;
  avatarUrl?: string;
  lastLogin?: FirebaseTimestamp;
  // Add more fields as needed (address, nationalId, joinedVia, etc.)
}