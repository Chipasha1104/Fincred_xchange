import { useState } from "react";
import { useLocation } from "wouter";
import { useExchange } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import iconImage from "@assets/generated_images/fincred_finance_logo_icon.png";

export default function EmployeeLogin() {
  const [, setLocation] = useLocation();
  const { setCurrentUser, setCurrentExchangeId } = useExchange();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setCurrentUser(data.participant);
      setCurrentExchangeId(data.exchangeId);
      setLocation(`/portal/${data.exchangeId}`);
    } catch (err) {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4" data-testid="page-employee-login">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-16 h-16 mx-auto relative">
             <img src={iconImage} alt="Logo" className="w-full h-full object-contain" data-testid="img-logo" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display font-bold text-primary" data-testid="text-title">Employee Portal</CardTitle>
            <CardDescription data-testid="text-description">Access your secure gift assignment</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Work Email</label>
              <Input 
                type="email" 
                placeholder="name@fincred.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
                data-testid="input-password"
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" data-testid="text-error">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold"
              disabled={loading}
              data-testid="button-login"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Access Portal <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
            
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
