import { BaseEntity, FirebaseTimestamp } from "./index";

export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  createdBy: string;              // admin UID
  targetAudience?: "all" | "users" | "moderators" | string[]; // future expansion
  isActive: boolean;
  expiresAt?: FirebaseTimestamp;
}