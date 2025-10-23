import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dumbbell, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building2,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthStore } from "@/store/authStore";
import gymHero from "@/assets/gym-hero.jpg";

interface InvitationData {
  gymName: string;
  role: string;
  inviterName: string;
  expiresAt: string;
}

interface RegistrationForm {
  invitationCode: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingInvitation, setIsValidatingInvitation] = useState(false);
  const [error, setError] = useState("");
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [registrationType, setRegistrationType] = useState<'invitation' | 'gym-owner'>('invitation');
  
  const [formData, setFormData] = useState<RegistrationForm>({
    invitationCode: searchParams.get('invitation') || '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Validate invitation code when it changes
  useEffect(() => {
    if (formData.invitationCode && formData.invitationCode.length >= 8) {
      validateInvitation(formData.invitationCode);
    } else {
      setInvitationData(null);
    }
  }, [formData.invitationCode]);

  const validateInvitation = async (code: string) => {
    setIsValidatingInvitation(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/invitation/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setInvitationData(data.data);
        setFormData(prev => ({
          ...prev,
          email: data.data.email || prev.email
        }));
        toast.success(t("register.invitationValidated"));
      } else {
        setInvitationData(null);
        if (response.status !== 404) {
          setError(data.message || t("register.invalidInvitationCode"));
        }
      }
    } catch (error) {
      console.error('Invitation validation error:', error);
      setInvitationData(null);
    } finally {
      setIsValidatingInvitation(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'invitationCode') {
      setError("");
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError(t("register.nameRequired"));
      return false;
    }
    if (!formData.email.trim()) {
      setError(t("register.emailRequired"));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t("register.validEmail"));
      return false;
    }
    if (!formData.password) {
      setError(t("register.passwordRequired"));
      return false;
    }
    if (formData.password.length < 8) {
      setError(t("register.passwordMinLength"));
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(formData.password)) {
      setError(t("register.passwordComplexity"));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t("register.passwordsDoNotMatch"));
      return false;
    }
    if (registrationType === 'invitation' && !invitationData) {
      setError(t("register.validInvitationCode"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = registrationType === 'invitation' 
        ? '/auth/register/invitation/accept'
        : '/auth/register/gym-owner';

      const payload = registrationType === 'invitation' 
        ? {
            invitationCode: formData.invitationCode,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
            password: formData.password
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
            password: formData.password,
            gymName: formData.name + "'s Gym" // Simple gym name for now
          };

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t("register.registrationSuccess"));
        navigate('/login');
      } else {
        setError(data.message || t("register.registrationFailed"));
        toast.error(data.message || t("register.registrationFailed"));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(t("register.networkError"));
      toast.error(t("register.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding Section (60%) */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img
          src={gymHero}
          alt="DuxFit Gym"
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col items-center justify-center px-12 text-white w-full">
          <div className="text-center max-w-lg">
            <div className="flex items-center justify-center mb-6">
              <Dumbbell className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">DuxFit CRM</h1>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">
              {t("register.heroTitle")}
            </h2>
            
            <p className="text-lg mb-8 text-white/90">
              {t("register.heroDescription")}
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t("register.features.aiWhatsApp")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t("register.features.analytics")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t("register.features.leadManagement")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t("register.features.multiGym")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>{t("register.features.mobileResponsive")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form (40%) */}
      <div className="flex w-full lg:w-[40%] items-center justify-center bg-background p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <Dumbbell className="h-8 w-8 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">DuxFit CRM</h1>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{t("register.createAccount")}</h2>
            <p className="text-muted-foreground mt-2">
              {t("register.joinGymTeam")}
            </p>
          </div>

          {/* Registration Type Toggle */}
          <div className="flex space-x-2 p-1 bg-muted rounded-lg">
            <Button
              variant={registrationType === 'invitation' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setRegistrationType('invitation')}
            >
{t("register.invitationCode")}
            </Button>
            <Button
              variant={registrationType === 'gym-owner' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setRegistrationType('gym-owner')}
            >
{t("register.gymOwner")}
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Invitation Code (for invitation flow) */}
            {registrationType === 'invitation' && (
              <div className="space-y-2">
                <Label htmlFor="invitationCode">{t("register.invitationCode")}</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="invitationCode"
                    type="text"
                    placeholder={t("register.enterInvitationCode")}
                    value={formData.invitationCode}
                    onChange={(e) => handleInputChange('invitationCode', e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                  {isValidatingInvitation && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
                  )}
                </div>
                
                {/* Invitation Info */}
                {invitationData && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{t("register.invitationValid")}</span>
                      </div>
                      <div className="space-y-1 text-sm text-green-700">
                        <p><strong>{t("register.gym")}:</strong> {invitationData.gymName}</p>
                        <p><strong>{t("register.role")}:</strong> <Badge variant="secondary">{invitationData.role}</Badge></p>
                        <p><strong>{t("register.invitedBy")}:</strong> {invitationData.inviterName}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <User className="h-5 w-5 mr-2" />
{t("register.personalInformation")}
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("register.fullName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("register.enterFullName")}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("register.emailAddress")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      disabled={isLoading || (invitationData && invitationData.email)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("register.phoneNumber")}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t("register.phonePlaceholder")}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Security */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Lock className="h-5 w-5 mr-2" />
{t("register.security")}
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t("register.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("register.createStrongPassword")}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("register.passwordRequirements")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("register.confirmYourPassword")}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gym Assignment (for invitation flow) */}
            {registrationType === 'invitation' && invitationData && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
{t("register.gymAssignment")}
                  </h3>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{t("register.gym")}:</span>
                          <span className="text-sm">{invitationData.gymName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{t("register.role")}:</span>
                          <Badge variant="secondary">{invitationData.role}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{t("register.invitedBy")}:</span>
                          <span className="text-sm">{invitationData.inviterName}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="gradient" 
              className="w-full" 
              size="lg"
              disabled={isLoading || (registrationType === 'invitation' && !invitationData)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("register.creatingAccount")}
                </>
              ) : (
                t("register.createAccount")
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("register.alreadyHaveAccount")}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium"
                  onClick={() => navigate('/login')}
                  disabled={isLoading}
                >
                  {t("register.signIn")}
                </Button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
