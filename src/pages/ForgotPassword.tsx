import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import gymHero from "@/assets/gym-hero.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      setSuccess(true);
      toast.success("Password reset email sent!");
    } catch (err: any) {
      console.error('Forgot password error:', err);
      const errorMessage = err.response?.data?.message || "Failed to send reset email";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${gymHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/85 to-black/90 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Dumbbell className="h-12 w-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-transparent bg-clip-text">
              DuxFit CRM
            </h1>
          </div>

          {/* Hero Text */}
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Reset Your Password
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Don't worry! It happens to the best of us. Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-12 max-w-md w-full">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Process</h3>
                  <p className="text-sm text-gray-400">Your password reset link is secure and expires in 1 hour</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Verification</h3>
                  <p className="text-sm text-gray-400">Check your inbox for the password reset link</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-8 bg-background/80 backdrop-blur-xl relative">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>

          {!success ? (
            <Card className="glass-card border-purple-500/20">
              <CardHeader className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 mx-auto">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-center">Forgot Password?</CardTitle>
                <CardDescription className="text-center">
                  Enter your email address and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(""); // Clear error on input change
                        }}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            // Success State
            <Card className="glass-card border-green-500/20">
              <CardHeader className="space-y-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-center text-green-600">Check Your Email</CardTitle>
                <CardDescription className="text-center">
                  We've sent a password reset link to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    If an account exists with this email, you will receive a password reset link shortly.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong>Next steps:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the password reset link in the email</li>
                    <li>Create a new strong password</li>
                    <li>Log in with your new password</li>
                  </ul>
                  <p className="text-xs mt-4">
                    The reset link will expire in 1 hour for security reasons.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/login')} 
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                  <Button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                      setError("");
                    }}
                    variant="ghost"
                    className="flex-1"
                  >
                    Send Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{" "}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

