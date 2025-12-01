import { Link, useLocation } from "wouter";
import { useExchange } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, ArrowRight, Plus, Gift } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/festive_winter_holiday_hero_background.png";

export default function Home() {
  const { exchanges, createExchange } = useExchange();
  const [, setLocation] = useLocation();
  
  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createExchange(title, date || 'TBD', budget || '$20');
    // In a real app we'd navigate to the new ID, but here we just refresh/stay
    // Since we don't get the ID back easily in this mock, let's just clear form
    setTitle("");
    setDate("");
    setBudget("");
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full overflow-hidden flex items-center justify-center text-center px-4 mb-12">
        <div className="absolute inset-0 z-0">
           <img src={heroImage} alt="Holiday Background" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-background/90 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl text-white font-bold drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            The Magic of Giving
          </h1>
          <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Organize your Secret Santa, White Elephant, or Holiday Gift Exchange in minutes. 
            Free, fun, and festive.
          </p>
          <Button 
            size="lg" 
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            onClick={() => document.getElementById('create-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start an Exchange
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1" id="create-section">
          <Card className="border-none shadow-xl bg-white overflow-hidden sticky top-24">
            <div className="h-2 bg-secondary w-full" />
            <CardHeader>
              <CardTitle className="font-display text-2xl text-primary">Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Event Name</label>
                  <input 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Family Secret Santa"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <input 
                      type="date"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Budget</label>
                    <input 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="$50"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-lg mt-4">
                  <Plus className="w-5 h-5 mr-2" /> Create Exchange
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: List of Exchanges */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display text-primary">Your Exchanges</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {exchanges.map((exchange) => (
              <Link key={exchange.id} href={`/exchange/${exchange.id}`}>
                <a className="group block h-full">
                  <Card className="h-full border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-1 h-full ${exchange.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="bg-primary/5 p-3 rounded-full group-hover:bg-primary/10 transition-colors">
                          <Gift className="w-6 h-6 text-primary" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                          exchange.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {exchange.status}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors mb-1 line-clamp-1">
                          {exchange.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exchange.date}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {exchange.budget}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t flex justify-between items-center">
                         <div className="flex -space-x-2">
                            {exchange.participants.slice(0, 3).map((p, i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {p.name.charAt(0)}
                              </div>
                            ))}
                            {exchange.participants.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-bold text-muted-foreground">
                                +{exchange.participants.length - 3}
                              </div>
                            )}
                         </div>
                         <span className="text-primary font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                           View <ArrowRight className="w-4 h-4 ml-1" />
                         </span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
