"use client";

export function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="w-full py-6 animate-pulse"
        style={{ backgroundColor: "var(--secundario)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="h-8 w-64 bg-white/20 rounded" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-xl p-6 md:p-8 animate-pulse"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-foreground/10" />
            </div>
            <div className="h-6 bg-foreground/10 rounded w-3/4 mx-auto mb-4" />
            <div className="space-y-2 mb-8">
              <div className="h-4 bg-foreground/10 rounded w-full" />
              <div className="h-4 bg-foreground/10 rounded w-5/6" />
              <div className="h-4 bg-foreground/10 rounded w-4/6" />
            </div>
            <div className="h-12 bg-foreground/10 rounded w-full max-w-xs mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
