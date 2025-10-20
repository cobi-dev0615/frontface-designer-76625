import { useState } from "react";
import { Check, Dumbbell, Rocket, MessageCircle, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DuxFit
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome to DuxFit! 🎉</CardTitle>
          <CardDescription>
            Let's set up your gym management system in just a few steps
          </CardDescription>
          <div className="pt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Gym Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Tell us about your gym</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-name">Gym Name *</Label>
                <Input id="gym-name" placeholder="DuxFit Piauí" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-location">Location *</Label>
                <Input id="gym-location" placeholder="Teresina, PI" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-phone">Phone Number *</Label>
                <Input id="gym-phone" placeholder="+55 (86) 99999-9999" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-email">Email Address *</Label>
                <Input id="gym-email" type="email" placeholder="contato@duxfit.com" />
              </div>
            </div>
          )}

          {/* Step 2: WhatsApp Integration */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Connect WhatsApp</h3>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="text-sm">
                  Connect your WhatsApp Business account to start managing leads automatically.
                </p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Auto-respond to new messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Qualify leads with AI
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Track conversations in one place
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
                <Input id="whatsapp-number" placeholder="+55 (86) 99123-4567" />
              </div>

              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Connect WhatsApp Business
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You can skip this step and configure it later in Settings
              </p>
            </div>
          )}

          {/* Step 3: Team Setup */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Invite your team</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                Add team members to collaborate on lead management
              </p>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="team@duxfit.com" type="email" />
                    <select className="px-3 py-2 text-sm border border-input rounded-md bg-background min-w-[120px]">
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Agent</option>
                    </select>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Add More Team Members
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You can add more team members later in Settings
              </p>
            </div>
          )}

          {/* Step 4: Ready to Launch */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-primary">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2">You're All Set! 🚀</h3>
                <p className="text-muted-foreground">
                  Your gym management system is ready to use
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left">
                <h4 className="font-semibold">What's next?</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Start receiving and managing leads automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Track conversations across WhatsApp and other channels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Monitor analytics and conversion metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Customize AI prompts for better lead qualification</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                variant="gradient"
                onClick={() => setStep(step + 1)}
                className="flex-1"
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="gradient"
                className="flex-1"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
