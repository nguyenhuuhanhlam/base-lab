import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AUTH_COLLECTION } from "@/lib/constants";

export interface UserRecord {
  id: string;
  organizationName?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  uid?: string;
  role?: string;
  provider?: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  [key: string]: unknown;
}

interface UseUsersResult {
  users: UserRecord[];
  isLoading: boolean;
  error: string | null;
  updateUser: (id: string, data: Partial<UserRecord>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, AUTH_COLLECTION),
      (snapshot) => {
        const data: UserRecord[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Client-side sorting: Google accounts first, then alphabetical by name/email
        data.sort((a, b) => {
          // 1. Prioritize Google accounts
          const isGoogleA = a.provider === 'google.com';
          const isGoogleB = b.provider === 'google.com';
          
          if (isGoogleA && !isGoogleB) return -1;
          if (!isGoogleA && isGoogleB) return 1;
          
          // 2. Sort alphabetically by displayName or email
          const nameA = (a.displayName || a.email || "").toLowerCase();
          const nameB = (b.displayName || b.email || "").toLowerCase();
          
          return nameA.localeCompare(nameB);
        });

        setUsers(data);
        setIsLoading(false);
      },
      (err) => {
        console.error("useUsers error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateUser = async (id: string, data: Partial<UserRecord>) => {
    try {
      const userRef = doc(db, AUTH_COLLECTION, id);
      await updateDoc(userRef, data as any);
    } catch (err: any) {
      console.error("updateUser error:", err);
      throw err;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const userRef = doc(db, AUTH_COLLECTION, id);
      await deleteDoc(userRef);
    } catch (err: any) {
      console.error("deleteUser error:", err);
      throw err;
    }
  };

  return { users, isLoading, error, updateUser, deleteUser };
}
