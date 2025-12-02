import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ShieldCheck } from "lucide-react";

// Simple admin credentials (in a real app, this would be backend-authenticated)
const ADMIN_CREDENTIALS = {
  email: "admin@fincred.com",
  password: "fincred2025"
};

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({ email, timestamp: Date.now() }));
      setLocation('/admin');
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-8 bg-primary text-white rounded-t-lg">
          <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
             <ShieldCheck className="w-12 h-12" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display font-bold">Admin Access</CardTitle>
            <CardDescription className="text-blue-100">Secure administrator portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Admin Email</label>
              <Input 
                type="email" 
                placeholder="admin@fincred.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input 
                type="password" 
                placeholder="Enter admin password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
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
              Access Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <div className="text-center pt-4">
               <p className="text-xs text-muted-foreground">
                 Demo: <span className="font-mono text-primary cursor-pointer hover:underline" onClick={() => {setEmail('admin@fincred.com'); setPassword('fincred2025')}}>admin@fincred.com</span> / fincred2025
               </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
