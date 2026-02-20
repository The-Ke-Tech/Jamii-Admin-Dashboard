import { BaseEntity, FirebaseTimestamp, BaseStatus } from "./index";

export type IssueStatus = Extract<
  BaseStatus,
  "pending" | "approved" | "rejected" | "completed"
>;

export interface Issue extends BaseEntity {
  title: string;
  description: string;
  status: IssueStatus;
  emergency: boolean;
  reportedBy: string;           // user UID who reported
  location?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];            // array of storage URLs
  assignedTo?: string;          // admin/moderator UID
  resolutionNotes?: string;
  resolvedAt?: FirebaseTimestamp;
}