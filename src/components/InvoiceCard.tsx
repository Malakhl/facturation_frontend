import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InvoiceCardProps {
  title: string;
  description: string;
  icon: string;
  variant: "primary" | "success" | "warning";
  onClick: () => void;
}

const variantStyles = {
  primary: "bg-gradient-primary shadow-glow border-primary/20 hover:shadow-[0_0_50px_hsl(217_91%_60%/0.25)]",
  success: "bg-gradient-success shadow-[0_0_40px_hsl(142_76%_36%/0.15)] border-success/20 hover:shadow-[0_0_50px_hsl(142_76%_36%/0.25)]",
  warning: "bg-gradient-warning shadow-[0_0_40px_hsl(43_96%_56%/0.15)] border-warning/20 hover:shadow-[0_0_50px_hsl(43_96%_56%/0.25)]",
};

export function InvoiceCard({ title, description, icon, variant, onClick }: InvoiceCardProps) {
  return (
    <Card
      className={cn(
        "p-8 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2",
        "border-2 backdrop-blur-sm relative overflow-hidden group",
        variantStyles[variant]
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative z-10 text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
          <img 
            src={icon} 
            alt={title}
            className="w-16 h-16 object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-white/80 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="pt-4">
          <div className="inline-flex items-center text-white/90 text-sm font-medium">
            <span>Choisir ce type</span>
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
}