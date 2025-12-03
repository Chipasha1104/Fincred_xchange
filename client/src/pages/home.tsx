import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/corporate_blue_and_white_abstract_hero.png";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center text-center px-4 mb-12">
        <div className="absolute inset-0 z-0">
           <img src={heroImage} alt="Fincred Corporate Background" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl text-white font-display font-bold drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Connect. Engage. Celebrate.
          </h1>
          <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            The official employee engagement and gift exchange portal for Fincred Finance.
            Building a stronger culture, one gift at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-slate-100 font-bold text-lg px-12 py-6 rounded-md shadow-lg hover:shadow-xl transition-all"
                onClick={() => setLocation('/login')}
                data-testid="button-employee-login"
            >
                Employee Portal Login
            </Button>
          </div>
          
          <div className="pt-8">
              <Link href="/admin-login" className="text-white/50 hover:text-white text-sm underline decoration-dashed underline-offset-4 transition-colors" data-testid="link-admin-login">
                  Admin Access
              </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:border-primary/50 transition-colors text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Secure & Private</h3>
                <p className="text-slate-500 leading-relaxed">
                    Internal data protection ensures employee details and preferences remain confidential within the organization.
                </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:border-primary/50 transition-colors text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Smart Matching</h3>
                <p className="text-slate-500 leading-relaxed">
                    Our algorithm ensures fair distribution and prevents self-matching, making administration effortless.
                </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:border-primary/50 transition-colors text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Preference Tracking</h3>
                <p className="text-slate-500 leading-relaxed">
                    Seamlessly integrate Google Form data to ensure every gift is thoughtful and appreciated.
                </p>
            </div>
         </div>
      </div>
    </div>
  );
}
