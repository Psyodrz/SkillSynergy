import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group relative">
      <div
        className={`p-6 rounded-2xl border transition-all duration-300 h-full ${
          gradient
            ? 'bg-mint-100/80 dark:bg-charcoal-800/80 backdrop-blur-xl border-teal-200 dark:border-charcoal-700 hover:border-teal-500/50'
            : 'bg-mint-100 dark:bg-charcoal-800 border-teal-200 dark:border-charcoal-700 hover:border-teal-500/30 hover:shadow-premium-emerald hover:shadow-teal-500/5'
        }`}
      >
        <div className="mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              gradient ? 'gradient-emerald' : 'bg-mint-200 dark:bg-charcoal-700'
            }`}
          >
            <Icon className={`h-6 w-6 ${gradient ? 'text-white' : 'text-teal-900 dark:text-white'}`} />
          </div>
        </div>
        <h3 className="mb-2 font-semibold text-navy-900 dark:text-white">{title}</h3>
        <p className="text-navy-600 dark:text-warm-400 leading-relaxed">{description}</p>
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-400/0 group-hover:from-emerald-500/15 group-hover:to-teal-400/15 transition-all duration-300 pointer-events-none shadow-emerald-glow group-hover:shadow-emerald-glow" />
      </div>
    </div>
  );
}
