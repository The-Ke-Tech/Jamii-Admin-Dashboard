// src/types/index.ts
import { Timestamp } from "firebase/firestore";

// Then in interfaces you can use:
// createdAt: Timestamp | string;

export type FirebaseTimestamp = Timestamp | Date | string | number;

// Status enums (you can import and reuse these)
export type BaseStatus = "pending" | "approved" | "rejected" | "completed" | "failed";

export interface BaseEntity {
  id: string;
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "pending" | "active" | "suspended";
  createdAt?: string | any;   // Firebase Timestamp or ISO string
  // add phone, avatarUrl, etc. if needed
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "completed";
  emergency: boolean;
  createdAt: string | any;     // Timestamp | Date | string
  reportedBy?: string;         // user ID
  location?: string;
  images?: string[];           // optional array of image URLs
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;            // usually "KES"
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  issueId?: string;
  issueTitle?: string;
  transactionId?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string | any;
  createdBy: string;           // admin UID
}

export * from "./common";
export * from "./user";
export * from "./issue";
export * from "./donation";
export * from "./announcement";

// Add more types as your project grows (e.g. Comment, Notification, etc.)