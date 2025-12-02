import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useExchange, Participant } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Gift, Calendar, DollarSign, FileText, CheckCircle2, LogOut, Plus, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function EmployeeDashboard() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { getExchange, currentUser, setCurrentUser, addToWishlist } = useExchange();
  
  const exchange = getExchange(id || "");
  
  // Redirect if not logged in or invalid exchange
  if (!exchange || !currentUser) {
    return (
        <div className="p-8 text-center space-y-4">
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p>Please log in to view your dashboard.</p>
            <Button onClick={() => setLocation('/login')}>Go to Login</Button>
        </div>
    );
  }

  const myMatch = currentUser.assignedToId 
    ? exchange.participants.find(p => p.id === currentUser.assignedToId)
    : null;

  const handleLogout = () => {
    setCurrentUser(null);
    setLocation('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Welcome, {currentUser.name}</h1>
            <p className="text-slate-500">{exchange.title}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Assignment (Main Focus) */}
        <div className="lg:col-span-2 space-y-8">
            {exchange.status === 'draft' ? (
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-primary">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-blue-900">Matching is pending</h2>
                        <p className="text-blue-700 max-w-md mx-auto">
                            The admin hasn't drawn names yet. Check back closer to the event date!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="bg-gradient-to-br from-primary to-blue-900 text-white border-none shadow-2xl overflow-hidden relative min-h-[400px]">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
                     
                     <CardContent className="p-8 md:p-12 relative z-10 flex flex-col h-full">
                        <div className="mb-8">
                            <h3 className="text-sm font-medium text-blue-200 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Gift className="w-4 h-4" /> Your Secret Assignment
                            </h3>
                            <p className="text-sm text-white/60">You are the Secret Santa for:</p>
                        </div>

                        <div className="mb-12">
                             <h2 className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow-md mb-2 animate-in slide-in-from-bottom-4 duration-700">
                                {myMatch?.name}
                             </h2>
                             <p className="text-xl text-blue-200 font-light">{myMatch?.email}</p>
                        </div>

                        {myMatch && (
                            <div className="mt-auto space-y-6">
                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-accent">
                                        <FileText className="w-4 h-4" /> Preferences & Hints
                                    </h4>
                                    <div className="text-base text-white/90 leading-relaxed">
                                        "{myMatch.suggestions || "No specific preferences listed."}"
                                    </div>
                                </div>

                                {myMatch.wishlist.length > 0 && (
                                    <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                        <h4 className="font-bold text-sm mb-3 text-blue-200">Their Wishlist</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {myMatch.wishlist.map((item, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3 text-accent" /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                     </CardContent>
                </Card>
            )}
        </div>

        {/* Right Column: My Details & Info */}
        <div className="space-y-6">
            {/* Event Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-primary" /> Event Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 text-sm">Date</span>
                        <span className="font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> {exchange.date}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 text-sm">Budget Cap</span>
                        <span className="font-medium flex items-center gap-2">
                            <span className="font-bold text-primary">K</span> {exchange.budget}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* My Wishlist */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Your Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Help your Secret Santa! Add specific items you'd love to receive.
                    </p>
                    
                    <div className="space-y-4">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const input = form.elements.namedItem('wish') as HTMLInputElement;
                            if (input.value) {
                                addToWishlist(exchange.id, currentUser.id, input.value);
                                input.value = '';
                            }
                        }} className="flex gap-2">
                            <Input name="wish" placeholder="e.g. Fun socks" className="bg-slate-50" />
                            <Button type="submit" size="icon" className="shrink-0 bg-primary text-white"><Plus className="w-4 h-4" /></Button>
                        </form>
                        
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {currentUser.wishlist.length === 0 ? (
                                <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed text-slate-400 text-sm">
                                    Your wishlist is empty.
                                </div>
                            ) : (
                                currentUser.wishlist.map((w, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
                                        <Gift className="w-4 h-4 text-primary" /> 
                                        <span className="text-sm font-medium text-slate-700">{w}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
