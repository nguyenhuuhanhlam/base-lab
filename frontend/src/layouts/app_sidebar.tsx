import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav_user";
import { useAuthStore } from "@/store/auth_store";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { AUTH_DISPLAY_FIELD } from "@/lib/constants";

const navItems = [
	{ to: "/", icon: LayoutDashboard, label: "Dashboard" },
	{ to: "/products", icon: Package, label: "Products" },
];

export function AppSidebar() {
	const user = useAuthStore((s) => s.user);
	const profile = useAuthStore((s) => s.profile);
	const logout = useAuthStore((s) => s.logout);

	const handleLogout = async () => {
		await signOut(auth);
		logout();
	};

	const getInitials = (name: string | null, email: string | null) => {
		if (name) {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		if (email) {
			return email.slice(0, 2).toUpperCase();
		}
		return "??";
	};

	const displayName = profile?.[AUTH_DISPLAY_FIELD] || user?.displayName || "User";

	const userData = user
		? {
			name: displayName,
			email: user.email || "",
			avatar: user.photoURL || undefined,
			initials: getInitials(displayName, user.email),
		}
		: {
			name: "Guest",
			email: "",
			initials: "GS",
		};

	return (
		<Sidebar collapsible="icon">
			{/* Logo */}
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<div className="flex items-center gap-2 cursor-default">
								<div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
									B
								</div>
								<span className="font-semibold text-sm tracking-tight">BaseLab</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* Nav */}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Overview</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map(({ to, icon: Icon, label }) => (
								<SidebarMenuItem key={to}>
									<NavLink to={to} end={to === "/"}>
										{({ isActive }) => (
											<SidebarMenuButton isActive={isActive} tooltip={label}>
												<Icon />
												<span>{label}</span>
											</SidebarMenuButton>
										)}
									</NavLink>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			{/* User */}
			<SidebarFooter>
				<NavUser user={userData} onLogout={handleLogout} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
