"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

/**
 * Component to handle server-side or client-side errors.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="p-10 rounded-2xl border border-red-200 bg-red-50 dark:bg-gray-800/50 shadow-2xl max-w-md w-full text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We&apos;re experiencing technical difficulties and cannot process your request at this time. Please try again later.
        </p>
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              reset();
            }}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-150"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}