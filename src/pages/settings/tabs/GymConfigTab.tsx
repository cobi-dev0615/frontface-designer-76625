import { Building2, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GymConfigTab = () => {
  const plans = [
    { name: "Annual Plan", price: "99.99", cycle: "monthly", description: "Best value - 12 month commitment" },
    { name: "Semi-Annual Plan", price: "119.99", cycle: "monthly", description: "6 month commitment" },
    { name: "Monthly Plan", price: "139.99", cycle: "monthly", description: "No commitment" },
    { name: "Daily Pass", price: "40.00", cycle: "daily", description: "Single day access" },
  ];

  const features = [
    "24/7 Access", "Cardio Equipment", "Weight Training", "Group Classes",
    "Personal Training", "Locker Rooms", "Showers", "Parking",
    "WiFi", "Kids Room (DUX KIDS)", "Lounge Area", "Juice Bar",
  ];

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Core details about your gym location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gym-name">Gym Name <span className="text-destructive">*</span></Label>
              <Input id="gym-name" defaultValue="DuxFit - Piauí 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location/Branch</Label>
              <Input id="location" defaultValue="Piauí - Centro" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+55 (86) 99123-4567" />
              <div className="flex items-center gap-2 mt-2">
                <Checkbox id="whatsapp" defaultChecked />
                <Label htmlFor="whatsapp" className="text-sm font-normal">This is a WhatsApp number</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="duxfitacademia@gmail.com" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" defaultValue="https://duxfit.com.br" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input id="instagram" className="pl-7" defaultValue="duxfit" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo & Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Logo & Branding</CardTitle>
          <CardDescription>Upload your gym logo and set brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max 2MB)</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input id="primary-color" type="color" defaultValue="#8b5cf6" className="w-20 h-10" />
                <Input defaultValue="#8b5cf6" className="flex-1" readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input id="secondary-color" type="color" defaultValue="#6366f1" className="w-20 h-10" />
                <Input defaultValue="#6366f1" className="flex-1" readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address & Location */}
      <Card>
        <CardHeader>
          <CardTitle>Address & Location</CardTitle>
          <CardDescription>Physical location of your gym</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" defaultValue="Avenida Frei Serafim, 2850" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input id="neighborhood" defaultValue="Centro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue="Teresina" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select defaultValue="PI">
                <SelectTrigger id="state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PI">Piauí (PI)</SelectItem>
                  <SelectItem value="MA">Maranhão (MA)</SelectItem>
                  <SelectItem value="CE">Ceará (CE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <div className="flex gap-2">
              <Input id="zip" defaultValue="64000-000" className="max-w-[200px]" />
              <Button variant="outline">Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Set your gym's opening hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="brt">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brt">BRT (Brasília Time - GMT-3)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-32">
                  <Checkbox id={day.toLowerCase()} defaultChecked />
                  <Label htmlFor={day.toLowerCase()} className="font-normal">{day}</Label>
                </div>
                <Input type="time" defaultValue="00:00" className="w-32" />
                <span className="text-muted-foreground">-</span>
                <Input type="time" defaultValue="23:59" className="w-32" />
                <div className="flex items-center gap-2">
                  <Checkbox id={`${day}-24h`} defaultChecked={day !== "Saturday" && day !== "Sunday"} />
                  <Label htmlFor={`${day}-24h`} className="font-normal text-sm">24 hours</Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plans & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Plans</CardTitle>
          <CardDescription>Configure your pricing tiers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.map((plan, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Plan Name</Label>
                  <Input defaultValue={plan.name} />
                </div>
                <div className="space-y-2">
                  <Label>Price (R$)</Label>
                  <Input defaultValue={plan.price} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input defaultValue={plan.description} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id={`plan-active-${index}`} defaultChecked />
                  <Label htmlFor={`plan-active-${index}`} className="font-normal text-sm">Active</Label>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full gap-2">
            <Building2 className="h-4 w-4" />
            Add Plan
          </Button>
        </CardContent>
      </Card>

      {/* Gym Features */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Features</CardTitle>
          <CardDescription>What does your gym offer?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Checkbox id={feature.toLowerCase().replace(/\s+/g, "-")} defaultChecked />
                <Label htmlFor={feature.toLowerCase().replace(/\s+/g, "-")} className="font-normal">{feature}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Extra details about your gym</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="gym-size">Gym Size (m²)</Label>
              <Input id="gym-size" defaultValue="3,000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment-brand">Equipment Brand</Label>
              <Input id="equipment-brand" defaultValue="Speedo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Total Capacity</Label>
              <Input id="capacity" defaultValue="500 members" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={6}
              defaultValue="DuxFit is the biggest gym in Piauí, offering state-of-the-art equipment and facilities..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <p className="text-sm text-muted-foreground">Last saved: 2 minutes ago</p>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="gradient" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GymConfigTab;
