import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "firebase/auth";

interface AuthState {
	isLoggedIn: boolean;
	isInitializing: boolean;
	user: any | null;
	profile: any | null;
	login: (user: User, profile?: any) => void;
	setProfile: (profile: any) => void;
	logout: () => void;
	setInitialized: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			isInitializing: true,
			user: null,
			profile: null,
			login: (user, profile) =>
				set((state) => ({
					isLoggedIn: true,
					user: {
						uid: user.uid,
						email: user.email,
						displayName: user.displayName,
						photoURL: user.photoURL,
					},
					profile: profile !== undefined ? profile : state.profile,
					isInitializing: false,
				})),
			setProfile: (profile) => set({ profile }),
			logout: () => set({ isLoggedIn: false, user: null, profile: null, isInitializing: false }),
			setInitialized: () => set({ isInitializing: false }),
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				isLoggedIn: state.isLoggedIn,
				user: state.user,
				profile: state.profile,
			}),
		}
	)
);
