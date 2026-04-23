import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Card } from "primereact/card";
import "./login_page.css";

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
		<div className="login-header-top">
			<div className="login-logo">
				<i className="pi pi-bolt"></i>
			</div>
		</div>
	);

	const footer = (
		<div className="login-footer">
			<Button
				type="submit"
				label={loading ? "Signing in…" : "Sign In"}
				loading={loading}
				icon={loading ? undefined : "pi pi-arrow-right"}
				iconPos="right"
				className="submit-button"
				size="small"
			/>
		</div>
	);

	return (
		<form onSubmit={handleSubmit}>
			<Card 
				className="login-card"
				header={header}
				title="Sign In"
				subTitle="Welcome back — enter your credentials"
				footer={footer}
			>
				<div className="login-form">
					{/* Email */}
					<div className="form-group">
						<label htmlFor="email" className="form-label">Email</label>
						<InputText
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							className="form-input"
						/>
					</div>

					{/* Password */}
					<div className="form-group">
						<label htmlFor="password" className="form-label">Password</label>
						<Password
							inputId="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							toggleMask
							required
							inputClassName="form-input"
						/>
					</div>

					{/* Remember me */}
					<div className="login-options">
						<div className="remember-me">
							<Checkbox
								inputId="remember"
								checked={remember}
								onChange={(e) => setRemember(e.checked ?? false)}
							/>
							<label htmlFor="remember" className="remember-label">Keep me signed in</label>
						</div>
						<a href="#" className="forgot-password">Forgot?</a>
					</div>
				</div>
			</Card>
		</form>
	);
}
