import { useState } from "react";

export function useDisabledStyles(initialDisabled: boolean = true) {
  const [isDisabled, setIsDisabled] = useState(initialDisabled);

  const fieldContainerStyles = `flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-outline-subtle bg-muted/20 cursor-default transition-all ${
    isDisabled
      ? "ring-0"
      : "bg-background"
  }`;

  const labelStyles = `block text-xs font-medium mb-1.5 tracking-wide uppercase transition-colors ${
    isDisabled ? "text-foreground/45" : "text-foreground/60"
  }`;

  const readOnlyHint = "Solo lectura";

  const textStyles = `text-sm transition-colors ${
    isDisabled ? "text-foreground/70" : "text-foreground"
  }`;

  const iconStyles = `w-3.5 h-3.5 shrink-0 transition-colors ${
    isDisabled ? "text-foreground/40" : "text-foreground/50"
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
    readOnlyHint,
    getIconStyles,
    getTextStyles,
  };
}

