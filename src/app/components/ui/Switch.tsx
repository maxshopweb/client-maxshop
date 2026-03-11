'use client';

import * as RadixSwitch from '@radix-ui/react-switch';

const switchRootClass =
  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-gray-300 bg-gray-200 transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-(--principal) focus:ring-offset-2 data-[state=checked]:bg-(--principal) data-[state=checked]:border-(--principal) disabled:cursor-not-allowed disabled:opacity-50';

const switchThumbClass =
  'pointer-events-none block h-5 w-5 rounded-full border-2 border-gray-300 bg-white shadow-md ring-0 transition-[transform] duration-200 ease-out translate-x-0.5 data-[state=checked]:translate-x-5 data-[state=checked]:border-white/80';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  'aria-label': ariaLabel,
}: SwitchProps) {
  return (
    <RadixSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={switchRootClass}
    >
      <RadixSwitch.Thumb className={switchThumbClass} />
    </RadixSwitch.Root>
  );
}
