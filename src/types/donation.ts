import { BaseEntity, FirebaseTimestamp } from "./index";

export type DonationStatus = "pending" | "completed" | "failed" | "refunded";

export interface Donation extends BaseEntity {
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  currency: string;               // usually "KES"
  paymentMethod: string;          // m-pesa, card, bank, etc.
  transactionId?: string;
  status: DonationStatus;
  issueId?: string;               // optional - linked to specific issue/project
  issueTitle?: string;
  receiptUrl?: string;            // optional proof of payment
}