import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, User, Gift, FileText, HelpCircle } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-4xl font-display font-bold text-slate-900 flex items-center gap-3">
                <HelpCircle className="w-10 h-10 text-primary" /> User Guide
            </h1>
            <p className="text-xl text-slate-500 mt-2">How to use the Fincred Gift Exchange Portal</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
            Print Guide
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Admin Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
                <div className="p-2 bg-blue-100 rounded-lg text-primary">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">For Admins: Organizing an Event</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">1. Create Exchange</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600 text-sm space-y-2">
                        <p>Go to the <strong>Admin Dashboard</strong>.</p>
                        <p>Enter a Title, Date, and confirm the Budget (Default: <strong>K300</strong>).</p>
                        <p>Click "Create Event".</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">2. Add Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600 text-sm space-y-2">
                        <p>Open the event details.</p>
                        <p>Enter Name and Email for each colleague.</p>
                        <p><strong>Crucial:</strong> Paste text from the Google Sheet into the <em>"Suggestions"</em> field.</p>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2 bg-slate-50 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">3. The Draw</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-600">
                        <p>Once all participants are added, click <strong>Randomize & Assign</strong>.</p>
                        <p>The system ensures no one draws themselves. Matches are locked in immediately.</p>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* Participant Section */}
        <section className="space-y-6 pt-8">
            <div className="flex items-center gap-3 pb-2 border-b">
                <div className="p-2 bg-green-100 rounded-lg text-green-700">
                    <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">For Participants: Buying a Gift</h2>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                    <div>
                        <h3 className="font-bold text-lg">Login to the Portal</h3>
                        <p className="text-slate-600">Access the link provided by the admin. In this portal, find your name in the list and select it to "log in".</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                    <div>
                        <h3 className="font-bold text-lg">View Your Assignment</h3>
                        <p className="text-slate-600">You will see a large blue card. The name displayed is the person you are buying for.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                    <div>
                        <h3 className="font-bold text-lg">Check Preferences</h3>
                        <p className="text-slate-600">On your assignment card, look for the <strong>"Suggestions & Preferences"</strong> section. This contains the hints from the Google Sheet.</p>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
