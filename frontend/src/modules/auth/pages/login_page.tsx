import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import { auth } from "@/lib/firebase";
import {
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AUTH_COLLECTION, AUTH_DISPLAY_FIELD } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { GoogleIcon } from "@/components/icons/google_icon";

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
	const login = useAuthStore((s) => s.login);
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigate("/", { replace: true });
		}
	}, [isLoggedIn, navigate]);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);
	const [error, setError] = useState("");

	if (isLoggedIn) return null;

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			
			// Lưu/Cập nhật thông tin vào Firestore
			await setDoc(doc(db, AUTH_COLLECTION, result.user.uid), {
				email: result.user.email,
				uid: result.user.uid,
				provider: "password",
				updatedAt: serverTimestamp(),
			}, { merge: true });

			login(result.user);
			navigate("/");
		} catch {
			setError("Email hoặc mật khẩu không đúng.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setError("");
		setGoogleLoading(true);
		try {
			const result = await signInWithPopup(auth, googleProvider);
			
			// Lưu/Cập nhật thông tin vào Firestore
			await setDoc(doc(db, AUTH_COLLECTION, result.user.uid), {
				email: result.user.email,
				[AUTH_DISPLAY_FIELD]: result.user.displayName,
				photoURL: result.user.photoURL,
				uid: result.user.uid,
				provider: "google.com",
				updatedAt: serverTimestamp(),
			}, { merge: true });

			login(result.user);
			navigate("/");
		} catch {
			setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
		} finally {
			setGoogleLoading(false);
		}
	};

	const isDisabled = loading || googleLoading;

	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-stone-800">
			<Card className="w-full max-w-sm bg-stone-100 ring-stone-300 text-stone-800">
				<CardHeader className="items-center text-center gap-3 pb-2">
					{/* Logo */}
					<div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white bg-stone-700">
						B
					</div>
					<div>
						<CardTitle className="text-sm font-semibold uppercase tracking-widest text-stone-700">
							Chào mừng trở lại
						</CardTitle>
						<CardDescription className="text-xs text-stone-500 mt-1">
							Đăng nhập để tiếp tục
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="flex flex-col gap-4 pt-2">
					{/* Google */}
					<button
						type="button"
						onClick={handleGoogleLogin}
						disabled={isDisabled}
						className="w-full rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{googleLoading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<GoogleIcon size={16} />
						)}
						Đăng nhập với Google
					</button>

					{/* Divider */}
					<div className="flex items-center gap-3">
						<div className="flex-1 h-px bg-stone-300" />
						<span className="text-xs text-stone-400">hoặc</span>
						<div className="flex-1 h-px bg-stone-300" />
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="email" className="text-xs font-medium text-stone-600">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="email@example.com"
								required
								disabled={isDisabled}
								className="w-full rounded-lg px-3 py-2 text-sm bg-white border border-stone-300 text-stone-800 outline-none focus:border-stone-500 placeholder:text-stone-400 disabled:opacity-50"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="text-xs font-medium text-stone-600">
									Mật khẩu
								</label>
								<a href="#" className="text-xs font-medium text-stone-500 hover:text-stone-700 hover:underline">
									Quên mật khẩu?
								</a>
							</div>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
								required
								disabled={isDisabled}
								className="w-full rounded-lg px-3 py-2 text-sm bg-white border border-stone-300 text-stone-800 outline-none focus:border-stone-500 placeholder:text-stone-400 disabled:opacity-50"
							/>
						</div>

						{error && (
							<p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={isDisabled}
							className="w-full rounded-lg py-2 text-sm font-medium text-white bg-stone-700 flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
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
					</form>
				</CardContent>

				<CardFooter className="justify-center bg-stone-200/60">
					<p className="text-xs text-stone-500">
						Chưa có tài khoản?{" "}
						<a href="#" className="font-semibold text-stone-700 hover:underline">
							Đăng ký
						</a>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
