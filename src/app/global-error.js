"use client";

import React from "react";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-coral">Application Error</h2>
          <p className="text-sm text-slate-300">
            A critical error occurred in the root application layout.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-coral hover:bg-coral-hover text-white font-semibold rounded-xl transition-all"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
