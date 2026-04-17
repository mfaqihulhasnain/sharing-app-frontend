"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors
      theme="light"
      closeButton
      toastOptions={{
        classNames: {
          toast: "!rounded-2xl !border !border-line !bg-card !text-foreground !shadow-xl",
          title: "!text-sm !font-semibold !text-foreground",
          description: "!text-sm !text-muted",
        },
      }}
    />
  );
}
