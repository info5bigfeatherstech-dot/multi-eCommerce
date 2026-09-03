"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Router Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-accent-light text-accent flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-poppins font-bold text-primary">
          Something went wrong!
        </h2>
        <p className="text-sm font-inter text-slate-500">
          An unexpected error occurred while loading this section. Please try again.
        </p>
        <Button
          onClick={() => reset()}
          variant="coral"
          className="w-full gap-2 font-poppins font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </Button>
      </div>
    </div>
  );
}
