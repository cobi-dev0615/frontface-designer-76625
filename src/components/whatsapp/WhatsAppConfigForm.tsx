import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, RefreshCcw, Save, Trash2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import * as whatsappConfigService from '@/services/whatsappConfigService';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WhatsAppConfigProps {
  gymId: string;
}

export function WhatsAppConfig({ gymId }: WhatsAppConfigProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');

  // Configuration state
  const [config, setConfig] = useState({
    phoneNumber: '',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    webhookVerifyToken: ''
  });

  // Load existing configuration
  useEffect(() => {
    loadConfig();
  }, [gymId]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const existingConfig = await whatsappConfigService.getWhatsAppConfig(gymId);
      if (existingConfig) {
        setConfig({
          phoneNumber: existingConfig.phoneNumber,
          phoneNumberId: existingConfig.phoneNumberId,
          businessAccountId: existingConfig.businessAccountId,
          accessToken: '', // Don't show existing token for security
          webhookVerifyToken: ''
        });
        setConnectionStatus(existingConfig.status === 'ACTIVE' ? 'connected' : 'disconnected');
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.phoneNumber || !config.phoneNumberId || !config.businessAccountId || !config.accessToken) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      await whatsappConfigService.saveWhatsAppConfig({
        ...config,
        gymId
      });
      toast.success('WhatsApp configuration saved successfully');
      await loadConfig(); // Reload to get updated status
    } catch (error: any) {
      console.error('Error saving WhatsApp config:', error);
      toast.error(error.response?.data?.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const result = await whatsappConfigService.testWhatsAppConnection(gymId);
      if (result.configured) {
        setConnectionStatus('connected');
        toast.success('WhatsApp connection test successful');
      } else {
        setConnectionStatus('disconnected');
        toast.error(`Connection test failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error testing WhatsApp connection:', error);
      setConnectionStatus('disconnected');
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the WhatsApp configuration? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await whatsappConfigService.deleteWhatsAppConfig(gymId);
      toast.success('WhatsApp configuration deleted successfully');
      setConfig({
        phoneNumber: '',
        phoneNumberId: '',
        businessAccountId: '',
        accessToken: '',
        webhookVerifyToken: ''
      });
      setConnectionStatus('unknown');
    } catch (error: any) {
      console.error('Error deleting WhatsApp config:', error);
      toast.error('Failed to delete configuration');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading WhatsApp configuration...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">WhatsApp Configuration</h2>
          <p className="text-muted-foreground">Configure WhatsApp Business API for this gym</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={isTesting || !config.phoneNumberId}
          >
            {isTesting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !config.phoneNumberId}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Config
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Connection Status
            {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {connectionStatus === 'disconnected' && <XCircle className="h-5 w-5 text-red-500" />}
            {connectionStatus === 'unknown' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
          </CardTitle>
          <CardDescription>
            {connectionStatus === 'connected' && 'WhatsApp Business API is connected and ready'}
            {connectionStatus === 'disconnected' && 'WhatsApp Business API connection failed'}
            {connectionStatus === 'unknown' && 'WhatsApp Business API connection status unknown'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business API Settings</CardTitle>
          <CardDescription>
            Enter your WhatsApp Business API credentials from Meta Business Manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={config.phoneNumber}
                onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                placeholder="+55 86 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">Phone Number ID</Label>
              <Input
                id="phoneNumberId"
                value={config.phoneNumberId}
                onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                placeholder="12345678901234567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAccountId">Business Account ID</Label>
            <Input
              id="businessAccountId"
              value={config.businessAccountId}
              onChange={(e) => setConfig({ ...config, businessAccountId: e.target.value })}
              placeholder="12345678901234567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token</Label>
            <Textarea
              id="accessToken"
              value={config.accessToken}
              onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
              placeholder="EAAxxxxxxxxxxxxxxxxxxxxx"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookVerifyToken">Webhook Verify Token (Optional)</Label>
            <Input
              id="webhookVerifyToken"
              value={config.webhookVerifyToken}
              onChange={(e) => setConfig({ ...config, webhookVerifyToken: e.target.value })}
              placeholder="your-webhook-verify-token"
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              These credentials are sensitive. Keep them secure and never share them publicly.
              The access token will be encrypted and stored securely.
            </AlertDescription>
          </Alert>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Get WhatsApp Business API Access</h4>
            <p className="text-sm text-muted-foreground">
              Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Meta Business Manager</a> and apply for WhatsApp Business API access.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">2. Get Your Credentials</h4>
            <p className="text-sm text-muted-foreground">
              In Meta Business Manager, go to WhatsApp → API Setup to get your Phone Number ID, Business Account ID, and Access Token.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">3. Configure Webhook</h4>
            <p className="text-sm text-muted-foreground">
              Set up your webhook URL: <code className="bg-muted px-1 rounded">https://yourdomain.com/api/whatsapp/webhook</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
