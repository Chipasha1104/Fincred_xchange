import { useState } from "react";
import { useExchange } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus, Gift } from "lucide-react";
import avatarImage from "@assets/generated_images/festive_user_avatar_placeholder.png";

export function ParticipantList({ exchangeId }: { exchangeId: string }) {
  const { getExchange, addParticipant, removeParticipant } = useExchange();
  const exchange = getExchange(exchangeId);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!exchange) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addParticipant(exchangeId, name, email);
    setName("");
    setEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <h3 className="font-display text-xl mb-4 text-primary">Add Participants</h3>
        <form onSubmit={handleAdd} className="flex gap-3 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <Input 
              placeholder="Santa Claus" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input 
              type="email" 
              placeholder="santa@northpole.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white">
            <UserPlus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>
      </div>

      <div className="space-y-3">
        {exchange.participants.map((p) => (
          <div key={p.id} className="group flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border-2 border-background shadow-sm">
                <img src={avatarImage} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               {p.wishlist.length > 0 && (
                 <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full flex items-center gap-1">
                   <Gift className="w-3 h-3" /> {p.wishlist.length} wishes
                 </span>
               )}
               {exchange.status === 'draft' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeParticipant(exchangeId, p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
               )}
            </div>
          </div>
        ))}
        
        {exchange.participants.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
            <p>No participants yet. Add some friends!</p>
          </div>
        )}
      </div>
    </div>
  );
}
