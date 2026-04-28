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

        // Sort client-side: documents with createdAt first (desc), rest at end
        data.sort((a, b) => {
          const aTs = a.createdAt?.seconds ?? 0;
          const bTs = b.createdAt?.seconds ?? 0;
          return bTs - aTs;
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
