import { BadgeCheck, ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

type NavUserProps = {
	user: {
		name: string;
		email: string;
		avatar?: string;
		initials: string;
	};
	onLogout?: () => void;
};

export function NavUser({ user, onLogout }: NavUserProps) {
	const { isMobile, state } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								{user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
								<AvatarFallback className="rounded-lg text-xs font-semibold">
									{user.initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-xs leading-tight">
								<span className="truncate font-semibold">{user.name}</span>
								<span className="truncate text-[11px] text-sidebar-foreground/60">
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{state === "collapsed" && (
							<>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5">
										<Avatar className="h-8 w-8 rounded-lg">
											{user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
											<AvatarFallback className="rounded-lg text-xs font-semibold">
												{user.initials}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-xs leading-tight">
											<span className="truncate font-semibold">{user.name}</span>
											<span className="truncate text-[11px] text-muted-foreground">
												{user.email}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
							</>
						)}

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck className="mr-2 size-4" />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="mr-2 size-4" />
								Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={onLogout}>
							<LogOut className="mr-2 size-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
