import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dumbbell, Eye, EyeOff, Mail, Lock } from "lucide-react";
import gymHero from "@/assets/gym-hero.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DuxFit
            </span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <Button type="submit" variant="gradient" className="w-full" size="lg">
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Contact Admin */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Contact admin
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img
          src={gymHero}
          alt="DuxFit Gym"
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col items-center justify-center px-12 text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Dumbbell className="h-8 w-8" />
            </div>
            <span className="text-5xl font-bold">DuxFit</span>
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">The Biggest Gym in Piauí</h2>
          <p className="text-lg text-center text-white/90 max-w-md">
            Transform your fitness journey with state-of-the-art equipment and expert guidance
          </p>
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 h-32 w-32 rounded-full border-4 border-white" />
            <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full border-4 border-white" />
            <div className="absolute top-1/2 right-1/4 h-16 w-16 rotate-45 border-4 border-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
