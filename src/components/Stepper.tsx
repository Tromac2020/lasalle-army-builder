interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export default function Stepper({ value, min, max, onChange, disabled }: StepperProps) {
  return (
    <div className="inline-flex items-center border border-stone-400 rounded overflow-hidden bg-white">
      <button
        type="button"
        className="w-7 h-7 text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-white"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span className="w-8 text-center font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        className="w-7 h-7 text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-white"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
