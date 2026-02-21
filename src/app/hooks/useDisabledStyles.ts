import { useState } from "react";

export function useDisabledStyles(initialDisabled: boolean = true) {
  const [isDisabled, setIsDisabled] = useState(initialDisabled);

  const fieldContainerStyles = `flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all ${
    isDisabled
      ? "bg-muted/30 border-border/30 cursor-default"
      : "bg-background border-border/60"
  }`;

  const labelStyles = `block text-xs font-medium mb-1.5 tracking-wide uppercase transition-colors ${
    isDisabled ? "text-foreground/35" : "text-foreground/50"
  }`;

  const textStyles = `text-sm transition-colors ${
    isDisabled ? "text-foreground/50" : "text-foreground"
  }`;

  const iconStyles = `w-3.5 h-3.5 shrink-0 transition-colors ${
    isDisabled ? "text-foreground/25" : "text-foreground/40"
  }`;

  const getIconStyles = (customStyles?: string) => {
    return `${iconStyles} ${customStyles || ""}`;
  };

  const getTextStyles = (customStyles?: string) => {
    return `${textStyles} ${customStyles || ""}`;
  };

  return {
    isDisabled,
    setIsDisabled,
    fieldContainerStyles,
    labelStyles,
    textStyles,
    iconStyles,
    getIconStyles,
    getTextStyles,
  };
}

