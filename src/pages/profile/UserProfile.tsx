import { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Lock, Activity, TrendingUp, Calendar, Loader2, Check, X, Upload, Trash2, Image, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as userService from "@/services/userService";
import type { UserProfile as UserProfileType, UserStats, Activity as ActivityType } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const UserProfile = () => {
  const { setUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Error states
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const [profileData, statsData, activityData] = await Promise.all([
        userService.getMyProfile(),
        userService.getMyStats(),
        userService.getMyActivity({ limit: 10 })
      ]);
      
      setProfile(profileData);
      setStats(statsData);
      setActivities(activityData.activities);
      
      // Initialize form fields
      setName(profileData.name);
      setPhone(profileData.phone || "");
    } catch (err: any) {
      console.error('Error loading profile:', err);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setError("");
      setIsSaving(true);

      const updatedProfile = await userService.updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    // Reset form fields to original values
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone || "");
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError("");

      // Validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setPasswordError("All password fields are required");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }

      if (newPassword.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        return;
      }

      setIsChangingPassword(true);

      await userService.changePassword({
        currentPassword,
        newPassword
      });

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Password changed successfully!");
    } catch (err: any) {
      console.error('Error changing password:', err);
      const errorMessage = err.response?.data?.message || "Failed to change password";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP)");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview URL immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setIsSaving(true);
      const updatedProfile = await userService.uploadAvatarFile(file);
      setProfile(updatedProfile);
      
      // Update auth store so avatar appears in Header and Sidebar
      setUser({
        id: updatedProfile.id,
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role as 'ADMIN' | 'MANAGER' | 'AGENT',
        status: updatedProfile.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        avatar: updatedProfile.avatar,
        phone: updatedProfile.phone,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
        lastLogin: updatedProfile.lastLogin
      });
      
      toast.success("Avatar uploaded successfully!");
    } catch (err: any) {
      console.error('Error uploading avatar file:', err);
      toast.error(err.response?.data?.message || "Failed to upload avatar");
      setPreviewUrl(""); // Clear preview on error
    } finally {
      setIsSaving(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await userService.deleteAvatar();
      setProfile(updatedProfile);
      setPreviewUrl(""); // Clear preview
      
      // Update auth store so avatar is removed from Header and Sidebar
      setUser({
        id: updatedProfile.id,
        email: updatedProfile.email,
        name: updatedProfile.name,
        role: updatedProfile.role as 'ADMIN' | 'MANAGER' | 'AGENT',
        status: updatedProfile.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        avatar: updatedProfile.avatar,
        phone: updatedProfile.phone,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
        lastLogin: updatedProfile.lastLogin
      });
      
      toast.success("Avatar deleted successfully!");
    } catch (err: any) {
      console.error('Error deleting avatar:', err);
      toast.error(err.response?.data?.message || "Failed to delete avatar");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'USER_LOGIN':
        return <User className="h-4 w-4" />;
      case 'LEAD_CREATED':
      case 'LEAD_UPDATED':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>Failed to load profile data</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 glass-card">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              {/* Avatar with Hover Upload */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <Avatar className="h-32 w-32 cursor-pointer">
                  {/* Show preview if available, otherwise show profile avatar */}
                  <AvatarImage src={previewUrl || profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-gradient-primary text-white text-3xl font-bold">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Hover Overlay - Bottom Third Only */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 left-0 right-0 h-[33.333%] flex items-end justify-center pb-2 bg-black/40 backdrop-blur-sm rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <div className="bg-primary/80 rounded-full p-1.5 hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4 text-white/90" />
                  </div>
                </div>

                {/* Delete Button - Bottom Left Corner */}
                {profile.avatar && !isSaving && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAvatar();
                    }}
                    className="absolute bottom-0 left-0 bg-red-500/90 hover:bg-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  </button>
                )}

                {/* Loading Overlay */}
                {isSaving && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-full">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="font-bold text-lg">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <Badge variant="outline" className="mt-2">
                  {profile.role}
                </Badge>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Hover over avatar to upload or delete • Max 5MB
              </p>

              {/* Stats */}
              {stats && (
                <div className="w-full pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{stats.leads.total}</p>
                      <p className="text-xs text-muted-foreground">Total Leads</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-500">{stats.leads.conversionRate}</p>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-500">{stats.followUps.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-500">{stats.conversations.active}</p>
                      <p className="text-xs text-muted-foreground">Active Chats</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card className="lg:col-span-2 glass-card">
          <Tabs defaultValue="personal">
            <CardHeader>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* Personal Tab */}
              <TabsContent value="personal" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact administrator if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (86) 99999-9999"
                    disabled={!isEditing || isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={profile.role}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Account Created</Label>
                  <p className="text-sm text-muted-foreground">{formatDate(profile.createdAt)}</p>
                </div>

                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <p className="text-sm text-muted-foreground">
                    {profile.lastLogin ? formatDate(profile.lastLogin) : 'Never'}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-4">
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordError("");
                    }}
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError("");
                    }}
                    disabled={isChangingPassword}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                    disabled={isChangingPassword}
                  />
                </div>

                <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <CardDescription>
                  View your recent activity and actions
                </CardDescription>

                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No activity recorded yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                      >
                        <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.description}</p>
                          {activity.lead && (
                            <p className="text-xs text-muted-foreground">
                              Lead: {activity.lead.name}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Gym Assignments */}
      {profile.gyms && profile.gyms.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Gym Assignments</CardTitle>
            <CardDescription>Gyms you have access to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {profile.gyms.map((gym) => (
                <div
                  key={gym.id}
                  className="flex items-center gap-3 p-4 rounded-lg border bg-card/50"
                >
                  <Avatar>
                    {gym.logo && <AvatarImage src={gym.logo} alt={gym.name} />}
                    <AvatarFallback>{getInitials(gym.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{gym.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Role: {gym.role}
                    </p>
                  </div>
                  <Badge variant={gym.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {gym.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
