import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Using relative paths to avoid alias resolution errors
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Warehouse, ArrowLeft, Loader2 } from 'lucide-react';
import authIllustration from '../assets/auth-illustration.jpg';
import { useToast } from '../components/ui/use-toast';
import api from '../lib/api';

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/send-otp', { email: formData.email });
      toast({ title: "OTP Sent", description: "Please check your email for the code." });
      setStep(2);
    } catch (error: any) {
      console.error("OTP Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.response?.data?.message || "Failed to send OTP. Ensure backend is running." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Create Admin
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/signup', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });
      toast({ title: "Success", description: "Admin account created successfully!" });
      navigate('/login');
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Signup Failed", 
        description: error.response?.data?.message || "Invalid OTP or details" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-lg">
          <img 
            src={authIllustration} 
            alt="Warehouse Management" 
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
          <h2 className="text-3xl font-bold text-white mt-8 mb-4">
            Join Thousands of Businesses
          </h2>
          <p className="text-white/90 text-lg">
            Start managing your inventory efficiently across multiple locations.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md shadow-neumorphic">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Warehouse className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">
              {step === 1 ? "Create Admin Account" : "Verify Email"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Get started with StockMaster today" 
                : `Enter the OTP sent to ${formData.email}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 gradient-primary text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Continue"}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => navigate('/login')}
                    type="button"
                  >
                    Sign in
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    required
                    className="h-11 text-center tracking-widest text-lg"
                    maxLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 gradient-primary text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Signup"}
                </Button>
                <Button 
                  variant="ghost" 
                  type="button" 
                  className="w-full" 
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}