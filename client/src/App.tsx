import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ExchangeProvider } from "@/lib/exchange-context";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import AdminDashboard from "@/pages/admin";
import ExchangeDetail from "@/pages/exchange-detail";
import GuidePage from "@/pages/guide";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/guide" component={GuidePage} />
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
