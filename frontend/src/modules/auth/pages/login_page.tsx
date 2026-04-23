import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth_store";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";

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
    <div>
      <h1>Sign in</h1>
      <p>Welcome back — enter your credentials to continue.</p>

      <Divider />

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <br />

        {/* Password */}
        <div>
          <label htmlFor="password">Password</label>
          <br />
          <Password
            inputId="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            feedback={false}
            toggleMask
            required
          />
        </div>

        <br />

        {/* Remember me */}
        <div>
          <Checkbox
            inputId="remember"
            checked={remember}
            onChange={(e) => setRemember(e.checked ?? false)}
          />
          <label htmlFor="remember"> Keep me signed in</label>
        </div>

        <br />

        {/* Submit */}
        <Button
          type="submit"
          label={loading ? "Signing in…" : "Sign In"}
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
          iconPos="right"
          loading={loading}
        />
      </form>
    </div>
  );
}
