import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
	const login = useAuthStore((s) => s.login);
	const navigate = useNavigate();

	const [email, setEmail] = useState("demo@baselab.io");
	const [password, setPassword] = useState("password");
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			login();
			navigate("/");
		}, 800);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-sm bg-background border border-border rounded-xl overflow-hidden">
				<div className="flex justify-center pt-8 pb-4">
					<div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
						</svg>
					</div>
				</div>
				
				<div className="px-6 pb-6">
					<div className="text-center mb-6">
						<h1 className="text-xl font-semibold tracking-tight">Sign In</h1>
						<p className="text-sm text-muted-foreground mt-1">Welcome back — enter your credentials</p>
					</div>
					
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<a href="#" className="text-xs text-primary hover:underline font-medium">Forgot?</a>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
							/>
						</div>

						<div className="flex items-center space-x-2 pt-1">
							<Checkbox
								id="remember"
								checked={remember}
								onCheckedChange={(checked) => setRemember(checked === true)}
							/>
							<Label htmlFor="remember" className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Keep me signed in
							</Label>
						</div>
					</div>
				</div>

				<div className="px-6 pb-8">
					<Button
						type="submit"
						className="w-full shadow-none"
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in…
							</>
						) : (
							"Sign In"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
