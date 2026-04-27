import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth_store";
import { AUTH_COLLECTION } from "@/lib/constants";

export function useAuthSync() {
	const login = useAuthStore((s) => s.login);
	const logout = useAuthStore((s) => s.logout);
	const setProfile = useAuthStore((s) => s.setProfile);
	const setInitialized = useAuthStore((s) => s.setInitialized);

	useEffect(() => {
		let unsubscribeProfile: (() => void) | null = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				login(user);

				// Lắng nghe profile từ Firestore
				const docRef = doc(db, AUTH_COLLECTION, user.uid);
				unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
					if (docSnap.exists()) {
						setProfile(docSnap.data());
					} else {
						setProfile(null);
					}
				});
			} else {
				if (unsubscribeProfile) {
					unsubscribeProfile();
					unsubscribeProfile = null;
				}
				logout();
			}
			setInitialized();
		});

		return () => {
			unsubscribeAuth();
			if (unsubscribeProfile) unsubscribeProfile();
		};
	}, [login, logout, setProfile]);
}
