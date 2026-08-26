import React from 'react';

// Neobrutalism Button (from neobrutalism.dev)
export interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'neutral' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className = '', variant = 'neutral', size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-[#FFD028] text-black hover:bg-[#FFE066]',
      accent: 'bg-[#A3E635] text-black hover:bg-[#BEF264]',
      secondary: 'bg-[#38BDF8] text-black hover:bg-[#7DD3FC]',
      destructive: 'bg-[#FF6B6B] text-black hover:bg-[#FFA8A8]',
      neutral: 'bg-white text-black hover:bg-slate-100',
      outline: 'bg-transparent text-black hover:bg-white',
    };

    const sizeStyles = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3.5 py-1.5 text-xs sm:text-sm',
      lg: 'px-5 py-2.5 text-sm sm:text-base font-bold',
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-bold tracking-tight border-2 border-black rounded-none shadow-[3px_3px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
NeoButton.displayName = 'NeoButton';

// Neobrutalism Badge
export interface NeoBadgeProps {
  variant?: 'yellow' | 'green' | 'blue' | 'pink' | 'white' | 'black';
  children: React.ReactNode;
  className?: string;
}

export function NeoBadge({ variant = 'yellow', children, className = '' }: NeoBadgeProps) {
  const variantStyles = {
    yellow: 'bg-[#FFD028] text-black',
    green: 'bg-[#A3E635] text-black',
    blue: 'bg-[#38BDF8] text-black',
    pink: 'bg-[#FF6B6B] text-black',
    white: 'bg-white text-black',
    black: 'bg-black text-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_#000] ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Neobrutalism Input
export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixLabel?: string;
}

export const NeoInput = React.forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className = '', prefixLabel, ...props }, ref) => {
    return (
      <div className="flex items-center border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000] focus-within:shadow-[4px_4px_0px_0px_#000] transition-all">
        {prefixLabel && (
          <span className="px-2.5 py-1.5 bg-[#FFD028] font-black text-black border-r-2 border-black text-xs uppercase">
            {prefixLabel}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full px-2.5 py-1.5 bg-transparent font-bold text-black focus:outline-none text-xs sm:text-sm placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
          {...props}
        />

      </div>
    );
  }
);
NeoInput.displayName = 'NeoInput';

// Neobrutalism Card
export function NeoCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] p-4 ${className}`}
    >
      {children}
    </div>
  );
}
