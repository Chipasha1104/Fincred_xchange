import { useParams, Link } from "wouter";
import { useExchange, Participant } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantList } from "@/components/participant-list";
import { Calendar, DollarSign, Shuffle, ArrowLeft, Gift, CheckCircle2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function ExchangeDetail() {
  const { id } = useParams();
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/">
        <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Exchanges
        </a>
      </Link>

      {/* Header Card */}
      <div className="bg-primary text-primary-foreground rounded-3xl p-8 mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                 exchange.status === 'active' ? 'bg-green-400/20 text-green-100 border border-green-400/30' : 'bg-white/10 text-white/70 border border-white/10'
               }`}>
                 {exchange.status === 'draft' ? 'Planning Phase' : 'Active Exchange'}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{exchange.title}</h1>
            <div className="flex flex-wrap gap-6 text-primary-foreground/80 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 opacity-70" />
                <span>{exchange.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 opacity-70" />
                <span>Budget: {exchange.budget}</span>
              </div>
            </div>
          </div>

          {exchange.status === 'draft' ? (
            <Button 
              size="lg" 
              onClick={handleDraw}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg hover:shadow-secondary/50 transition-all hover:scale-105 border-2 border-white/10"
            >
              <Shuffle className="w-5 h-5 mr-2" /> Draw Names
            </Button>
          ) : (
             <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <p className="text-sm font-medium opacity-80 text-center">Names have been drawn!</p>
                <p className="text-center font-bold text-accent mt-1">Check your match below</p>
             </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="participants" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">Participants</TabsTrigger>
          {exchange.status === 'active' && (
             <TabsTrigger value="match" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary">My Match</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="participants" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ParticipantList exchangeId={exchange.id} />
            </div>
            <div className="md:col-span-1 space-y-6">
              <Card className="bg-secondary/5 border-secondary/10">
                 <CardHeader>
                   <CardTitle className="font-display text-lg text-secondary">Exchange Rules</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>1. Stick to the budget of <strong>{exchange.budget}</strong>.</p>
                    <p>2. Gifts should be wrapped anonymously.</p>
                    <p>3. Have fun and be festive!</p>
                 </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="match" className="animate-in zoom-in-95 duration-500">
           <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
              {!currentUser ? (
                <Card className="border-dashed border-2">
                  <CardContent className="pt-6">
                    <h3 className="font-display text-2xl mb-4">Who are you?</h3>
                    <p className="text-muted-foreground mb-6">Select your name to see who you are gifting to.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {exchange.participants.map(p => (
                        <Button 
                          key={p.id} 
                          variant="outline" 
                          onClick={() => setCurrentUser(p)}
                          className="hover:bg-primary hover:text-white"
                        >
                          {p.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                   <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-muted-foreground">Hello, {currentUser.name}!</h2>
                      <Button variant="ghost" size="sm" onClick={() => setCurrentUser(null)}>Not you?</Button>
                   </div>
                   
                   <Card className="bg-gradient-to-br from-primary to-[#10301a] text-white border-none shadow-2xl overflow-hidden">
                      <CardContent className="p-12 relative">
                        {/* Decorative elements */}
                        <Gift className="absolute top-8 right-8 w-24 h-24 text-white/5 rotate-12" />
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                        <h3 className="text-lg font-medium text-white/70 uppercase tracking-widest mb-6">You are gifting to</h3>
                        
                        <div className="relative inline-block">
                           <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl" />
                           <h2 className="relative text-5xl md:text-6xl font-display font-bold text-accent drop-shadow-sm">
                              {myMatch?.name || "Loading..."}
                           </h2>
                        </div>

                        {myMatch && myMatch.wishlist.length > 0 && (
                          <div className="mt-12 bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                             <h4 className="font-bold text-lg mb-4 flex items-center justify-center gap-2">
                               <Gift className="w-4 h-4" /> Their Wishlist
                             </h4>
                             <ul className="text-left inline-block space-y-2">
                                {myMatch.wishlist.map((item, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-accent" /> {item}
                                  </li>
                                ))}
                             </ul>
                          </div>
                        )}
                      </CardContent>
                   </Card>

                   {/* User's own wishlist */}
                   <Card className="text-left">
                      <CardHeader>
                        <CardTitle className="font-display text-xl text-primary">Your Wishlist</CardTitle>
                        <CardDescription>Help your Secret Santa know what you'd like!</CardDescription>
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
                              <Input name="wish" placeholder="I love coffee beans, fun socks..." className="bg-background" />
                              <Button type="submit" size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
                           </form>
                           
                           <div className="space-y-2">
                              {currentUser.wishlist.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/30 rounded-lg">No wishes added yet.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {currentUser.wishlist.map((w, i) => (
                                     <li key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-muted">
                                        <Gift className="w-4 h-4 text-primary" /> 
                                        <span className="text-sm font-medium">{w}</span>
                                     </li>
                                  ))}
                                </ul>
                              )}
                           </div>
                        </div>
                      </CardContent>
                   </Card>
                </div>
              )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
