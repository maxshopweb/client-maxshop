"use client";

import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}

export function DialogContent({
  className = "",
  children,
  showClose = true,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { showClose?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={`fixed left-1/2 top-1/2 z-[101] grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-card bg-card p-6 shadow-xl duration-200 ${className}`}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-md p-1 text-text/60 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-principal focus:ring-offset-2"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

export function DialogHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col gap-1.5 text-center sm:text-left ${className}`} {...props} />;
}

export function DialogTitle({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={`text-lg font-semibold leading-none text-text ${className}`} {...props} />
  );
}

export function DialogDescription({
  className = "",
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={`text-sm text-text/70 ${className}`} {...props} />
  );
}
