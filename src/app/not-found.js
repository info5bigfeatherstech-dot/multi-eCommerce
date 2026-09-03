import React from "react";
import Button from "@/components/ui/Button";
import { Store, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-primary text-accent flex items-center justify-center mx-auto shadow-md">
          <Store className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <span className="text-4xl font-poppins font-black text-primary">404</span>
          <h2 className="text-xl font-poppins font-bold text-slate-800">
            Page Not Found
          </h2>
        </div>
        <p className="text-sm font-inter text-slate-500">
          The page or product category you are looking for does not exist or has been moved.
        </p>
        <a href="/" className="block">
          <Button variant="coral" className="w-full gap-2 font-poppins font-semibold">
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
