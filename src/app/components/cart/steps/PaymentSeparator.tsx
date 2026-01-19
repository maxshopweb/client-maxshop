"use client";

export function PaymentSeparator() {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-card text-foreground/60">O</span>
      </div>
    </div>
  );
}

