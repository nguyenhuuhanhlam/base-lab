import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";

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

	const header = (
		<div className="flex justify-center pt-6">
			<div className="w-10 h-10 bg-indigo-500 rounded-md flex items-center justify-center shadow-md mx-auto mb-3">
				<i className="pi pi-bolt text-white text-sm" />
			</div>
		</div>
	);

	const footer = (
		<div className="flex justify-center mt-3">
			<Button
				type="submit"
				label={loading ? "Signing in…" : "Sign In"}
				loading={loading}
				icon={loading ? undefined : "pi pi-arrow-right"}
				iconPos="right"
				className="w-[70%]! text-sm!"
				size="small"
			/>
		</div>
	);

	return (
		<form onSubmit={handleSubmit}>
			<Card
				className="w-full max-w-sm"
				header={header}
				title={<p className="text-center text-sm font-bold text-slate-800 uppercase tracking-wide m-0">Sign In</p>}
				subTitle={<p className="text-center text-xs text-slate-500 mt-1">Welcome back — enter your credentials</p>}
				footer={footer}
			>
				<div className="flex flex-col gap-4">
					{/* Email */}
					<div className="flex flex-col gap-1.5">
						<label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email</label>
						<InputText
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							className="w-full text-sm p-2"
						/>
					</div>

					{/* Password */}
					<div className="flex flex-col gap-1.5">
						<label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
						<Password
							inputId="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							inputClassName="w-full text-sm p-2"
						/>
					</div>

					{/* Remember me */}
					<div className="flex items-center justify-between mt-1">
						<div className="flex items-center gap-2">
							<Checkbox
								inputId="remember"
								checked={remember}
								onChange={(e) => setRemember(e.checked ?? false)}
							/>
							<label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Keep me signed in</label>
						</div>
						<a href="#" className="text-xs text-indigo-600 font-medium no-underline hover:text-indigo-400">Forgot?</a>
					</div>
				</div>
			</Card>
		</form>
	);
}
