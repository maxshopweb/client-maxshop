import { useState } from "react";

export function useDisabledStyles(initialDisabled: boolean = true) {
  const [isDisabled, setIsDisabled] = useState(initialDisabled);

  // Estilos dinámicos basados en el estado de deshabilitado
  const fieldContainerStyles = `flex items-center gap-2 p-3 rounded-lg border transition-all ${
    isDisabled
      ? "bg-muted/50 border-input/50 opacity-60 cursor-not-allowed"
      : "bg-background border-input"
  }`;

  const labelStyles = `block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${
    isDisabled ? "text-foreground/50" : "text-foreground/70"
  }`;

  const textStyles = `text-sm sm:text-base transition-colors ${
    isDisabled ? "text-foreground/50" : "text-foreground"
  }`;

  const iconStyles = `w-4 h-4 flex-shrink-0 transition-colors ${
    isDisabled ? "text-foreground/20" : "text-foreground/40"
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

