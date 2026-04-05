import { ShieldCheck, Check, Zap, Cpu, Bell, Lock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProModal({ isOpen, onClose }: ProModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card p-0 max-w-lg border-border/50 overflow-hidden rounded-4xl">
        <div className="p-8 text-center bg-primary/10 border-b border-primary/20 relative">
          <div className="absolute top-4 right-4 text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full animate-pulse">
            SPECIAL OFFER
          </div>
          <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-lg shadow-primary/10">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tight text-white mb-2">BULLSIGHT PRO</DialogTitle>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Unlock advanced AI trading signals and institutional-grade tools.
          </p>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary/50 transition-colors absolute top-4 right-4">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <FeatureItem 
              icon={<Zap className="h-4 w-4 text-primary" />} 
              title="Real-time AI Signals" 
              desc="Instant buy/sell alerts based on 50+ indicators." 
            />
            <FeatureItem 
              icon={<Cpu className="h-4 w-4 text-primary" />} 
              title="Advanced Sentiment Analysis" 
              desc="Track market mood from 1000+ news sources." 
            />
            <FeatureItem 
              icon={<Bell className="h-4 w-4 text-primary" />} 
              title="Unlimited Price Alerts" 
              desc="Set as many alerts as you need with 0 latency." 
            />
            <FeatureItem 
              icon={<Lock className="h-4 w-4 text-primary" />} 
              title="Institutional Data Access" 
              desc="View dark pool orders and whale movements." 
            />
          </div>

          <div className="bg-secondary/30 p-6 rounded-2xl border border-border/50 text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Plan</p>
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="text-4xl font-black text-white">$49</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="text-[10px] text-primary font-bold">7-day free trial included</p>
          </div>

          <button className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2">
            START FREE TRIAL
            <ShieldCheck className="h-5 w-5 opacity-50" />
          </button>
          
          <p className="text-[10px] text-center text-muted-foreground">
            Secure payment via Stripe. Cancel anytime with one click.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-white leading-none mb-1">{title}</p>
        <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
      </div>
    </div>
  );
}
