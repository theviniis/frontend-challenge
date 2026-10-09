import Minus from '@/assets/nft-detail/minus.svg?react';
import Plus from '@/assets/nft-detail/plus.svg?react';
import { cn } from '@/lib/utils';

export function QuantityStepper({
  value,
  max,
  disabled,
  onChange,
  compact = false,
}: {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  const buttonClass = cn(
    'bg-primary text-ink border-ink flex items-center justify-center rounded-full border disabled:opacity-40',
    compact ? 'h-7.5 w-5' : 'h-12.5 w-8.25'
  );
  return (
    <div
      role="group"
      aria-label="Selecionar quantidade"
      className="flex items-center gap-3"
    >
      <button
        type="button"
        className={buttonClass}
        aria-label="Diminuir quantidade"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus className={compact ? 'size-4' : 'size-6'} />
      </button>
      <output
        aria-label="Quantidade"
        className={compact ? 'text-lg font-medium' : 'text-title'}
      >
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        aria-label="Aumentar quantidade"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className={compact ? 'size-4' : 'size-6'} />
      </button>
    </div>
  );
}
