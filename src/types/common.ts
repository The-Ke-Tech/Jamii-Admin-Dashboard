import { FirebaseTimestamp } from ".";

// src/types/common.ts (additions)
export type WithId<T> = T & { id: string };

export interface WithTimestamps<T> {
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}