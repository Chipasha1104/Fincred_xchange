import { Link } from "wouter";
import { useExchange } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, DollarSign, ArrowRight, Plus, Gift, Users, BarChart3, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { exchanges, createExchange, resetDraw } = useExchange();
  
  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createExchange(title, date || 'TBD', budget || '$20');
    setTitle("");
    setDate("");
    setBudget("");
  };

  // Stats
  const totalParticipants = exchanges.reduce((acc, curr) => acc + curr.participants.length, 0);
  const activeExchanges = exchanges.filter(e => e.status === 'active').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Manage Fincred gift exchanges and participants</p>
        </div>
        <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Download Reports
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-primary rounded-full">
                    <Gift className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Exchanges</p>
                    <p className="text-2xl font-bold">{exchanges.length}</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-700 rounded-full">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Participants</p>
                    <p className="text-2xl font-bold">{totalParticipants}</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-700 rounded-full">
                    <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Cycles</p>
                    <p className="text-2xl font-bold">{activeExchanges}</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Create New */}
        <div className="lg:col-span-1">
          <Card className="border shadow-md bg-white sticky top-24">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg text-slate-800">Create New Exchange</CardTitle>
              <CardDescription>Start a new departmental exchange</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Event Title</label>
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="e.g. Marketing Dept Secret Santa"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Target Date</label>
                    <input 
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Budget Cap</label>
                    <input 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="$50"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Manage Exchanges</h2>
            {exchanges.map((exchange) => (
              <Card key={exchange.id} className="overflow-hidden border hover:border-primary/50 transition-all">
                 <div className="flex flex-col sm:flex-row">
                    <div className={`w-full sm:w-2 ${exchange.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-display text-lg font-bold text-slate-900">{exchange.title}</h3>
                                <p className="text-sm text-slate-500 flex gap-4 mt-1">
                                    <span>Date: {exchange.date}</span>
                                    <span>Budget: {exchange.budget}</span>
                                </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                                exchange.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {exchange.status}
                            </span>
                        </div>

                        <div className="bg-slate-50 rounded-md p-4 mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Participants</span>
                                <span className="font-medium">{exchange.participants.length}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all" 
                                    style={{ width: `${Math.min(100, (exchange.participants.length / 10) * 100)}%` }} 
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                             {exchange.status === 'active' && (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => {
                                        if(confirm('Are you sure you want to reset? All matches will be lost.')) {
                                            resetDraw(exchange.id);
                                        }
                                    }}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" /> Reset Matches
                                </Button>
                             )}
                             <Link href={`/exchange/${exchange.id}`}>
                                <Button variant="default" size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                                    Manage Details <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                             </Link>
                        </div>
                    </div>
                 </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
