import { useState } from "react";
import { useLocation } from "wouter";
import { useExchange } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, ArrowRight } from "lucide-react";
import iconImage from "@assets/generated_images/fincred_finance_logo_icon.png";

export default function EmployeeLogin() {
  const [, setLocation] = useLocation();
  const { exchanges, setCurrentUser } = useExchange();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Find participant across all exchanges (assuming email is unique-ish for mockup)
    let foundUser = null;
    let foundExchangeId = null;

    for (const ex of exchanges) {
      const participant = ex.participants.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (participant) {
        foundUser = participant;
        foundExchangeId = ex.id;
        break;
      }
    }

    if (foundUser && foundExchangeId) {
      setCurrentUser(foundUser);
      setLocation(`/portal/${foundExchangeId}`);
    } else {
      setError("Email not found in any active exchange. Please contact your administrator.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-16 h-16 mx-auto relative">
             <img src={iconImage} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display font-bold text-primary">Employee Portal</CardTitle>
            <CardDescription>Access your secure gift assignment</CardDescription>
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
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold">
              Access Portal <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="text-center pt-4">
               <p className="text-xs text-muted-foreground">
                 Demo Mode: Try <span className="font-mono text-primary cursor-pointer hover:underline" onClick={() => setEmail('sarah@fincred.com')}>sarah@fincred.com</span>
               </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
