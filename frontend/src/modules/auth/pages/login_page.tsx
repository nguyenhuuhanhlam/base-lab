import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
	const login = useAuthStore((s) => s.login);
	const navigate = useNavigate();

	const [email, setEmail] = useState("demo@baselab.io");
	const [password, setPassword] = useState("password");
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
		<div
			className="min-h-screen flex items-center justify-center p-4"
			style={{ backgroundColor: "#2e2e2e" }}
		>
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm rounded-2xl p-10 flex flex-col gap-6"
				style={{ backgroundColor: "#c9c5bc" }}
			>
				{/* Logo placeholder */}
				<div className="flex justify-center">
					<div
						className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white"
						style={{ backgroundColor: "#3d3a35" }}
					>
						B
					</div>
				</div>

				{/* Heading */}
				<h1
					className="text-center text-sm font-semibold uppercase tracking-widest"
					style={{ color: "#3d3a35" }}
				>
					Chào mừng trở lại
				</h1>

				{/* Fields */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="email"
							className="text-xs font-medium"
							style={{ color: "#3d3a35" }}
						>
							Email của bạn
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email@example.com"
							required
							className="w-full rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-stone-400 placeholder:text-stone-400"
							style={{ backgroundColor: "#ffffff", color: "#3d3a35" }}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="password"
							className="text-xs font-medium"
							style={{ color: "#3d3a35" }}
						>
							Mật khẩu
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
							className="w-full rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-stone-400 placeholder:text-stone-400"
							style={{ backgroundColor: "#ffffff", color: "#3d3a35" }}
						/>
					</div>
				</div>

				{/* Forgot password */}
				<div className="text-center -mt-2">
					<a
						href="#"
						className="text-xs font-semibold hover:underline"
						style={{ color: "#3d3a35" }}
					>
						Quên mật khẩu?
					</a>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg py-2 text-sm font-medium text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
					style={{ backgroundColor: "#3d3a35" }}
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Đang đăng nhập…
						</>
					) : (
						"Đăng nhập"
					)}
				</button>

				{/* Register link */}
				<p className="text-center text-xs" style={{ color: "#3d3a35" }}>
					Chưa có tài khoản?{" "}
					<a href="#" className="font-semibold hover:underline">
						Đăng ký
					</a>
				</p>
			</form>
		</div>
	);
}
