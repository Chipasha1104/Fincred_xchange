import { useState } from "react";
import { useExchange } from "@/lib/exchange-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, UserPlus, Gift, FileText } from "lucide-react";
import avatarImage from "@assets/generated_images/festive_user_avatar_placeholder.png";

export function ParticipantList({ exchangeId }: { exchangeId: string }) {
  const { getExchange, addParticipant, removeParticipant } = useExchange();
  const exchange = getExchange(exchangeId);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState("");

  if (!exchange) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    addParticipant(exchangeId, name, email, suggestions);
    setName("");
    setEmail("");
    setSuggestions("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="font-display text-lg font-bold mb-4 text-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Add Colleague
        </h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input 
                placeholder="e.g. John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-50"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Work Email</label>
                <Input 
                type="email" 
                placeholder="john.doe@fincred.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50"
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Suggestions & Preferences (from Form)</label>
            <Textarea 
              placeholder="Paste preferences from Google Sheet here (e.g. 'Likes coffee, allergic to nuts')"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              className="bg-slate-50 min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">Copy/paste the "Suggestions" column for this person directly from the sheet.</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                Add Participant
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {exchange.participants.map((p) => (
          <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-all gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                <img src={avatarImage} alt={p.name} className="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-500">{p.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
               {p.suggestions && (
                   <div className="hidden sm:block max-w-[200px] text-xs text-slate-500 truncate bg-slate-50 px-2 py-1 rounded border">
                       <FileText className="w-3 h-3 inline mr-1" /> {p.suggestions}
                   </div>
               )}
               
               {p.wishlist.length > 0 && (
                 <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                   <Gift className="w-3 h-3" /> {p.wishlist.length} wishes
                 </span>
               )}
               
               {exchange.status === 'draft' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeParticipant(exchangeId, p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
               )}
            </div>
          </div>
        ))}
        
        {exchange.participants.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed">
            <p>No participants yet. Add colleagues above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
