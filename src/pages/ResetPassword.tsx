import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Dumbbell, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import axios from "axios";
import gymHero from "@/assets/gym-hero.jpg";

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      toast.error(t("resetPassword.invalidResetLink"));
      navigate('/login');
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    setIsVerifying(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/auth/reset-password/verify`, { token });
      
      if (response.data.success) {
        setIsValidToken(true);
        setUserEmail(response.data.email);
      } else {
        setIsValidToken(false);
        toast.error(t("resetPassword.invalidOrExpiredLink"));
      }
    } catch (err: any) {
      console.error('Token verification error:', err);
      setIsValidToken(false);
      toast.error(err.response?.data?.message || t("resetPassword.invalidOrExpiredLink"));
    } finally {
      setIsVerifying(false);
    }
  };

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    
    if (pwd.length < 8) {
      errors.push(t("resetPassword.atLeast8Characters"));
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push(t("resetPassword.oneUppercaseLetter"));
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push(t("resetPassword.oneLowercaseLetter"));
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push(t("resetPassword.oneNumber"));
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      errors.push(t("resetPassword.oneSpecialCharacter"));
    }
    
    return errors;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError("");
    const errors = validatePassword(value);
    setValidationErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setError(t("resetPassword.passwordsDoNotMatchError"));
      toast.error(t("resetPassword.passwordsDoNotMatchError"));
      return;
    }

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setError(t("resetPassword.passwordDoesNotMeetRequirements"));
      toast.error(t("resetPassword.passwordDoesNotMeetRequirements"));
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        newPassword: password
      });

      if (response.data.success) {
        setSuccess(true);
        toast.success(t("resetPassword.passwordResetSuccess"));
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      const errorMessage = err.response?.data?.message || t("resetPassword.passwordResetFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="glass-card border-purple-500/20 w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <p className="text-muted-foreground">{t("resetPassword.verifyingResetLink")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <Card className="glass-card border-red-500/20 w-full max-w-md">
          <CardHeader className="space-y-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-red-600">{t("resetPassword.invalidResetLink")}</CardTitle>
            <CardDescription className="text-center">
{t("resetPassword.invalidResetLinkDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("resetPassword.resetLinkExpired")}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/forgot-password')} 
                variant="gradient"
                className="w-full"
              >
                {t("resetPassword.requestNewResetLink")}
              </Button>
              <Button 
                onClick={() => navigate('/login')} 
                variant="outline"
                className="w-full"
              >
                {t("resetPassword.backToLogin")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
{t("resetPassword.heroTitle")}
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
{t("resetPassword.heroDescription")}
            </p>
          </div>

          {/* Password Tips */}
          <div className="grid grid-cols-1 gap-4 mt-12 max-w-md w-full">
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("resetPassword.strongPassword")}</h3>
                  <p className="text-sm text-gray-400">{t("resetPassword.strongPasswordDescription")}</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("resetPassword.secureAndUnique")}</h3>
                  <p className="text-sm text-gray-400">{t("resetPassword.secureAndUniqueDescription")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
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
{t("resetPassword.backToLogin")}
          </Button>

          {!success ? (
            <Card className="glass-card border-purple-500/20">
              <CardHeader className="space-y-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 mx-auto">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-center">{t("resetPassword.resetPasswordTitle")}</CardTitle>
                <CardDescription className="text-center">
{t("resetPassword.enterNewPasswordDescription")} <strong>{userEmail}</strong>
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

                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("resetPassword.newPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("resetPassword.enterNewPassword")}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={isLoading}
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
                    
                    {/* Password Requirements */}
                    {password && (
                      <div className="text-xs space-y-1 mt-2">
                        <p className="font-medium text-muted-foreground">{t("resetPassword.passwordRequirements")}</p>
                        <ul className="space-y-1">
                          {[
                            { text: t("resetPassword.atLeast8Characters"), valid: password.length >= 8 },
                            { text: t("resetPassword.oneUppercaseLetter"), valid: /[A-Z]/.test(password) },
                            { text: t("resetPassword.oneLowercaseLetter"), valid: /[a-z]/.test(password) },
                            { text: t("resetPassword.oneNumber"), valid: /[0-9]/.test(password) },
                            { text: t("resetPassword.oneSpecialCharacter"), valid: /[^A-Za-z0-9]/.test(password) },
                          ].map((req, idx) => (
                            <li key={idx} className={`flex items-center gap-2 ${req.valid ? 'text-green-600' : 'text-muted-foreground'}`}>
                              {req.valid ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {req.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("resetPassword.confirmPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("resetPassword.confirmNewPassword")}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <p className={`text-xs flex items-center gap-2 ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {password === confirmPassword ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            {t("resetPassword.passwordsMatch")}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            {t("resetPassword.passwordsDoNotMatch")}
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading || validationErrors.length > 0 || password !== confirmPassword}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("resetPassword.resettingPassword")}
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        {t("resetPassword.resetPassword")}
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
                <CardTitle className="text-2xl text-center text-green-600">{t("resetPassword.passwordResetSuccessful")}</CardTitle>
                <CardDescription className="text-center">
{t("resetPassword.passwordResetDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    {t("resetPassword.canLoginWithNewPassword")}
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={() => navigate('/login')} 
                  variant="gradient"
                  className="w-full"
                >
                  {t("resetPassword.goToLogin")}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {t("resetPassword.redirectingToLogin")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

