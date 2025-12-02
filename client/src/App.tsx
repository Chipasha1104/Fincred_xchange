import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExchangeProvider } from "@/lib/exchange-context";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin";
import ExchangeDetail from "@/pages/exchange-detail";
import GuidePage from "@/pages/guide";
import EmployeeLogin from "@/pages/employee-login";
import EmployeeDashboard from "@/pages/employee-dashboard";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function ProtectedAdminRoute({ component: Component }: { component: any }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        // Simple check - in real app, validate token expiry
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!isAuthenticated) {
    // Redirect to admin login - use wouter programmatically if needed
    // For now, return the login page directly
    return <AdminLogin />;
  }
  return <Component />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={() => <ProtectedAdminRoute component={AdminDashboard} />} />
        <Route path="/guide" component={GuidePage} />
        <Route path="/login" component={EmployeeLogin} />
        <Route path="/portal/:id" component={EmployeeDashboard} />
        <Route path="/exchange/:id" component={ExchangeDetail} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ExchangeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ExchangeProvider>
    </QueryClientProvider>
  );
}

export default App;
