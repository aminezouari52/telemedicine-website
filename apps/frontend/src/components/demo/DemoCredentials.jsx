"use client";

// Demo-only: shows the seeded demo logins on the auth pages. Renders nothing
// unless NEXT_PUBLIC_DEMO_MODE=true. To remove the demo entirely, delete this
// file and its import/usage in components/layout/AuthLayout.jsx.

// HOOKS
import { useEffect, useRef, useState } from "react";

// STYLE
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ASSETS
import { Check, CircleAlert, Copy } from "lucide-react";

// NEXT_PUBLIC_* values are inlined at build time, so they must be read with
// literal `process.env.NEXT_PUBLIC_…` expressions. They must match the
// backend's DEMO_* values used by `pnpm -F=backend seed:logins`.
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const DEMO_ACCOUNTS = [
  { label: "Doctor", value: process.env.NEXT_PUBLIC_DEMO_DOCTOR_EMAIL },
  { label: "Patient", value: process.env.NEXT_PUBLIC_DEMO_PATIENT_EMAIL },
].filter((account) => account.value);
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

const COPIED_FEEDBACK_MS = 1500;

const CopyButton = ({ value, label }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => setCopied(false),
        COPIED_FEEDBACK_MS,
      );
    } catch (err) {
      console.log("Failed to copy:", err);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7 shrink-0 text-gray-500 hover:text-primary-700"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};

const CredentialRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 rounded-md bg-gray-50 py-1 pl-3 pr-1 text-sm">
    <div className="min-w-0">
      <span className="font-bold">{label}: </span>
      <span className="break-all">{value}</span>
    </div>
    <CopyButton value={value} label={label.toLowerCase()} />
  </div>
);

export default function DemoCredentials() {
  if (!DEMO_MODE || !DEMO_PASSWORD || DEMO_ACCOUNTS.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="rounded-full bg-primary-50 text-primary-700 shadow-sm hover:bg-primary-100"
          aria-label="Show demo credentials"
        >
          <CircleAlert />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[calc(100vw-2rem)] max-w-[380px]"
      >
        <div className="space-y-2">
          <h4 className="font-semibold mb-2">
            For testing purposes you can login with these credentials
          </h4>
          {DEMO_ACCOUNTS.map((account) => (
            <CredentialRow key={account.label} {...account} />
          ))}
          <div className="pt-2 border-t">
            <CredentialRow label="Password" value={DEMO_PASSWORD} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
