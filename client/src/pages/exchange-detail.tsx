import { useParams, Link } from "wouter";
import { useExchange, Participant } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantList } from "@/components/participant-list";
import { Calendar, DollarSign, Shuffle, ArrowLeft, Gift, CheckCircle2, Plus, FileText, Info, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

export default function ExchangeDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { getExchange, drawNames, currentUser, setCurrentUser, addToWishlist } = useExchange();
  const exchange = getExchange(id || "");
  const [activeTab, setActiveTab] = useState("participants");

  if (!exchange) {
    return <div className="p-8 text-center">Exchange not found <Link href="/"><a className="text-primary underline">Go Home</a></Link></div>;
  }

  const handleDraw = () => {
    if (exchange.participants.length < 2) {
      alert("You need at least 2 participants!");
      return;
    }
    drawNames(exchange.id);
    setActiveTab("match");
  };

  // Find who the current mock user is matched with
  const myMatch = currentUser && exchange.participants.find(p => p.id === currentUser.id)?.assignedToId 
    ? exchange.participants.find(p => p.id === exchange.participants.find(me => me.id === currentUser.id)?.assignedToId)
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/admin">
        <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Admin
        </a>
      </Link>

      {/* Header Card - Corporate Style */}
      <div className="bg-white border rounded-xl p-8 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                 exchange.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
               }`}>
                 {exchange.status === 'draft' ? 'Planning Phase' : 'Active Exchange'}
               </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">{exchange.title}</h1>
            <div className="flex flex-wrap gap-6 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{exchange.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">K</span>
                <span>Budget: {exchange.budget}</span>
              </div>
            </div>
          </div>

          {exchange.status === 'draft' ? (
            <Button 
              size="lg" 
              onClick={handleDraw}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Shuffle className="w-5 h-5 mr-2" /> Randomize & Assign
            </Button>
          ) : (
             <div className="flex flex-col gap-2 items-end">
                <div className="bg-green-50 rounded-lg p-2 px-4 border border-green-100 text-center">
                    <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Assignments Complete
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                        toast({
                            title: "Emails Sent",
                            description: `Notifications sent to ${exchange.participants.length} participants.`,
                        })
                    }}
                    className="text-primary border-primary/20 hover:bg-primary/5"
                >
                    <Mail className="w-4 h-4 mr-2" /> Send Notifications
                </Button>
             </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white border p-1 rounded-lg w-full md:w-auto">
          <TabsTrigger value="participants" className="flex-1 md:flex-none data-[state=active]:bg-slate-100 data-[state=active]:text-primary">Participants & Data</TabsTrigger>
          {exchange.status === 'active' && (
             <TabsTrigger value="match" className="flex-1 md:flex-none data-[state=active]:bg-slate-100 data-[state=active]:text-primary">My Match (Simulation)</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="participants" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ParticipantList exchangeId={exchange.id} />
            </div>
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-blue-50 border-blue-100">
                 <CardHeader>
                   <CardTitle className="font-display text-lg text-blue-900 flex items-center gap-2">
                       <Info className="w-5 h-5" /> Guidelines
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 text-sm text-blue-800">
                    <p>1. Ensure all suggestions from the Google Sheet are pasted correctly for each participant.</p>
                    <p>2. The matching algorithm is random and ensures no self-matches.</p>
                    <p>3. Budget cap is strict at <strong>{exchange.budget}</strong>.</p>
                 </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="match" className="animate-in zoom-in-95 duration-500">
           <div className="max-w-4xl mx-auto space-y-8 py-8">
              {!currentUser ? (
                <Card className="border-dashed border-2 bg-slate-50/50">
                  <CardContent className="pt-12 pb-12 text-center">
                    <h3 className="font-display text-2xl mb-4 text-slate-800">Employee Simulation</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">Select an employee profile to view what they would see in their portal.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {exchange.participants.map(p => (
                        <Button 
                          key={p.id} 
                          variant="outline" 
                          onClick={() => setCurrentUser(p)}
                          className="hover:bg-primary hover:text-white bg-white"
                        >
                          {p.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                   <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {currentUser.name.charAt(0)}
                          </div>
                          <div>
                              <p className="text-sm text-muted-foreground">Logged in as</p>
                              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
                          </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentUser(null)}>Switch User</Button>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-8">
                       {/* Match Card */}
                       <Card className="bg-gradient-to-br from-primary to-blue-900 text-white border-none shadow-xl overflow-hidden relative">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                          
                          <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-blue-200 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Gift className="w-4 h-4" /> Your Assignment
                                </h3>
                                
                                <div className="mb-8">
                                    <h2 className="text-4xl font-display font-bold text-white drop-shadow-sm mb-2">
                                        {myMatch?.name || "Loading..."}
                                    </h2>
                                    <p className="text-blue-200">{myMatch?.email}</p>
                                </div>
                            </div>

                            {myMatch && (
                                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10 mt-auto">
                                    <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-blue-100">
                                        <FileText className="w-4 h-4" /> Suggestions & Preferences
                                    </h4>
                                    <div className="text-sm text-white/90 leading-relaxed italic">
                                        "{myMatch.suggestions || "No specific preferences listed."}"
                                    </div>
                                </div>
                            )}
                          </CardContent>
                       </Card>

                       {/* Wishlist & Details Card */}
                       <div className="space-y-6">
                           {myMatch && (
                               <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Their Wishlist</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {myMatch.wishlist.length > 0 ? (
                                            <ul className="space-y-3">
                                                {myMatch.wishlist.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border">
                                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> 
                                                        <span className="text-slate-700">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">They haven't added specific items yet. Use the suggestions!</p>
                                        )}
                                    </CardContent>
                               </Card>
                           )}

                           <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Your Wishlist</CardTitle>
                              </CardHeader>
                              <CardContent>
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
                                      <Input name="wish" placeholder="Add specific item..." className="bg-slate-50" />
                                      <Button type="submit" size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
                                   </form>
                                   
                                   <div className="space-y-2">
                                      {currentUser.wishlist.map((w, i) => (
                                         <div key={i} className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded border">
                                            <Gift className="w-3 h-3 text-primary" /> {w}
                                         </div>
                                      ))}
                                   </div>
                                </div>
                              </CardContent>
                           </Card>
                       </div>
                   </div>
                </div>
              )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
